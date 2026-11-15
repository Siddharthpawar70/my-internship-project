import { createHmac, timingSafeEqual, randomBytes, randomUUID } from 'node:crypto';
import { Booking } from '../src/types';

export interface YoupiConfig {
  apiUrl: string;
  checkoutUrl: string;
  merchantId: string;
  webhookSecret: string;
  returnUrl: string;
}

export function getYoupiConfig(): YoupiConfig {
  return {
    apiUrl: (process.env.YOUPI_PG_API_URL || 'http://localhost:6100').replace(/\/+$/, ''),
    checkoutUrl: (process.env.YOUPI_PG_CHECKOUT_URL || 'http://localhost:7000').replace(/\/+$/, ''),
    merchantId: (process.env.YOUPI_PG_MERCHANT_ID || '00000000-0000-0000-0000-000000000001').trim(),
    webhookSecret: (process.env.YOUPI_PG_WEBHOOK_SECRET || 'youpi-webhook-secret-stayaura-2026').trim(),
    returnUrl: (process.env.YOUPI_PG_RETURN_URL || 'http://localhost:3000/confirmation').replace(/\/+$/, '')
  };
}

export interface CreatePaymentSessionParams {
  bookingId: string;
  amount: number; // in INR rupees
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  hotelName: string;
  roomName: string;
  returnUrl?: string;
  attemptNumber?: number;
}

export interface YoupiPaymentSessionResult {
  paymentId: string;
  orderId: string;
  amount: string;
  amountPaise: string;
  currency: string;
  status: string;
  checkoutUrl: string;
}

/**
 * Creates a unique payment session with YOUPI PG V2 for an existing booking.
 * Note: Amount is strictly verified on server side from the booking record.
 */
export async function createYoupiPaymentSession(
  params: CreatePaymentSessionParams
): Promise<YoupiPaymentSessionResult> {
  const config = getYoupiConfig();
  const attempt = params.attemptNumber && params.attemptNumber > 1 ? `-R${params.attemptNumber}` : '';
  const orderId = `HTL-${params.bookingId}${attempt}`;
  const returnUrl = params.returnUrl || `${config.returnUrl}/${params.bookingId}`;

  const payload = {
    orderId,
    amount: params.amount.toFixed(2),
    currency: 'INR',
    returnUrl,
    customer: {
      phoneNumber: params.guestPhone.replace(/\D/g, '').slice(-10),
      fullName: params.guestName
    },
    metadata: {
      bookingId: params.bookingId,
      hotelName: params.hotelName,
      roomName: params.roomName,
      guestEmail: params.guestEmail
    }
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Merchant-Id': config.merchantId,
    'X-Merchant-Key': config.webhookSecret
  };

  let response: globalThis.Response;
  try {
    response = await fetch(`${config.apiUrl}/api/v1/payments`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Cannot connect to YOUPI PG at ${config.apiUrl}. Please ensure the YOUPI PG service is running. Details: ${errorMsg}`
    );
  }

  const responseText = await response.text();
  let result: any;
  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error(`YOUPI PG returned non-JSON response [HTTP ${response.status}]: ${responseText}`);
  }

  if (!response.ok) {
    throw new Error(
      result?.error || result?.message || `Payment creation failed [HTTP ${response.status}]`
    );
  }

  return {
    paymentId: result.paymentId,
    orderId: result.orderId,
    amount: result.amount,
    amountPaise: String(result.amountPaise),
    currency: result.currency || 'INR',
    status: result.status,
    checkoutUrl: result.checkoutUrl
  };
}

/**
 * Queries payment session details from YOUPI PG V2 by paymentId.
 */
export async function queryYoupiPayment(paymentId: string): Promise<any> {
  const config = getYoupiConfig();
  const res = await fetch(`${config.apiUrl}/api/v1/payments/${paymentId}`, {
    headers: {
      'X-Merchant-Key': config.webhookSecret
    }
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to query payment [HTTP ${res.status}]: ${errText}`);
  }

  return await res.json();
}

/**
 * Cryptographically verifies an incoming HMAC-SHA256 signature from YOUPI PG V2.
 * Supports both standard X-Gateway-Signature and timestamped X-Gateway-Signature-V2.
 * Uses constant-time comparison (crypto.timingSafeEqual) to prevent timing attacks.
 */
export function verifyYoupiWebhookSignature(
  rawBody: string,
  signatureHeader?: string | null,
  timestampHeader?: string | number | null,
  v2SignatureHeader?: string | null
): { valid: boolean; reason?: string } {
  const config = getYoupiConfig();
  const secret = config.webhookSecret;
  if (!secret) {
    return { valid: false, reason: 'Merchant webhook secret not configured' };
  }

  // 1. Check timestamp freshness if provided (tolerance window: 2 hours, matching YOUPI PG SDK)
  if (timestampHeader != null) {
    const tsNum = Number(timestampHeader);
    const toleranceMs = 2 * 60 * 60 * 1000;
    if (!Number.isFinite(tsNum) || Math.abs(Date.now() - tsNum) > toleranceMs) {
      return { valid: false, reason: 'Timestamp outside acceptable window' };
    }
  }

  // 2. Validate standard signature (sha256=<hex>)
  if (signatureHeader && signatureHeader.startsWith('sha256=')) {
    const actualHex = signatureHeader.replace('sha256=', '').trim();
    const expectedHex = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');

    try {
      const actualBuf = Buffer.from(actualHex, 'hex');
      const expectedBuf = Buffer.from(expectedHex, 'hex');
      if (actualBuf.length === expectedBuf.length && timingSafeEqual(actualBuf, expectedBuf)) {
        return { valid: true };
      }
    } catch {
      // Invalid hex format
    }
  }

  // 3. Validate timestamped V2 signature if present
  if (v2SignatureHeader && v2SignatureHeader.startsWith('sha256=') && timestampHeader != null) {
    const actualHex = v2SignatureHeader.replace('sha256=', '').trim();
    const timestampedData = `${timestampHeader}.${rawBody}`;
    const expectedHex = createHmac('sha256', secret).update(timestampedData, 'utf8').digest('hex');

    try {
      const actualBuf = Buffer.from(actualHex, 'hex');
      const expectedBuf = Buffer.from(expectedHex, 'hex');
      if (actualBuf.length === expectedBuf.length && timingSafeEqual(actualBuf, expectedBuf)) {
        return { valid: true };
      }
    } catch {}
  }

  return { valid: false, reason: 'Signature mismatch' };
}

export interface ProcessWebhookResult {
  statusCode: number;
  success: boolean;
  message: string;
  bookingId?: string;
  paymentStatus?: string;
  settlementStatus?: string;
  duplicate?: boolean;
}

function normalizeSettlementStatus(status: string): NonNullable<Booking['settlementStatus']> {
  const upper = (status || '').toUpperCase();
  if (upper === 'RECONCILED') return 'RECONCILED';
  if (upper === 'NOT_RECONCILED') return 'NOT_RECONCILED';
  if (upper === 'MANUAL_REVIEW') return 'MANUAL_REVIEW';
  if (upper === 'NOT_BANK_SETTLEMENT') return 'NOT_BANK_SETTLEMENT';
  if (upper === 'NOT_APPLICABLE') return 'NOT_APPLICABLE';
  if (upper === 'FAILED') return 'FAILED';
  if (upper === 'EXPIRED') return 'EXPIRED';
  if (upper === 'CANCELLED') return 'CANCELLED';
  return 'UNSETTLED';
}

/**
 * Authoritatively processes an incoming YOUPI PG webhook payload according to the strict verification rules:
 * - OBSERVED_SUCCESS: Bank alert matched. It is NOT reconciled settlement. Must NOT mark booking as Paid.
 * - RECONCILED: Downloaded bank statement line matched. Verified settlement confirmation.
 * - MANUAL_REVIEW: Payment requires manual review.
 * - FAILED / EXPIRED / CANCELLED: Payment unsuccessful.
 * - SUCCESS: Counter or COD payment; must not be treated as UPI bank settlement.
 */
export async function processYoupiWebhookEvent(
  rawBody: string,
  headers: Record<string, string | string[] | undefined>,
  queryFn: <T>(sql: string, values?: (string | number | null)[]) => Promise<T[]>,
  executeFn: (sql: string, values?: (string | number | null)[]) => Promise<unknown>
): Promise<ProcessWebhookResult> {
  const getHeader = (name: string): string | undefined => {
    const val = headers[name.toLowerCase()] || headers[name];
    if (Array.isArray(val)) return val[0];
    return typeof val === 'string' ? val : undefined;
  };

  const signature = getHeader('x-gateway-signature');
  const v2Signature = getHeader('x-gateway-signature-v2');
  const timestamp = getHeader('x-gateway-timestamp');
  const deliveryIdHeader = getHeader('x-gateway-delivery-id');

  // Verify signature
  const verification = verifyYoupiWebhookSignature(rawBody, signature, timestamp, v2Signature);
  if (!verification.valid) {
    return {
      statusCode: 401,
      success: false,
      message: `Invalid webhook signature: ${verification.reason || 'Verification failed'}`
    };
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return {
      statusCode: 400,
      success: false,
      message: 'Malformed JSON payload'
    };
  }

  const deliveryId = String(deliveryIdHeader || payload.deliveryId || randomUUID());

  // Duplicate webhook protection using deliveryId
  const existingDelivery = await queryFn<{ delivery_id: string }>(
    'SELECT delivery_id FROM processed_webhooks WHERE delivery_id = ?',
    [deliveryId]
  );
  if (existingDelivery.length > 0) {
    return {
      statusCode: 200,
      success: true,
      message: 'Duplicate webhook event already processed',
      duplicate: true
    };
  }

  const event = String(payload.event || '').toUpperCase();
  const paymentId = String(payload.paymentId || '');
  const orderId = String(payload.orderId || '');
  const method = String(payload.method || 'UPI').toUpperCase();
  const settlementState = String(payload.settlementState || '').toUpperCase();
  const utr = payload.utr ? String(payload.utr) : null;
  const completedAt = payload.completedAt ? String(payload.completedAt) : new Date().toISOString();
  const receivedAmount = Number(payload.amount || (payload.amountPaise ? Number(payload.amountPaise) / 100 : 0));

  // Determine booking ID from metadata or order ID format (e.g. HTL-HTL12345678-R1)
  let bookingId = '';
  if (payload.metadata?.bookingId) {
    bookingId = String(payload.metadata.bookingId);
  } else if (orderId.startsWith('HTL-')) {
    // Strip prefix 'HTL-' and any attempt suffix '-R1'
    const withoutPrefix = orderId.substring(4);
    bookingId = withoutPrefix.split('-')[0];
  } else {
    bookingId = orderId.split('-')[0];
  }

  const bookingRows = await queryFn<{ id: string; data: string }>(
    'SELECT id, data FROM bookings WHERE id = ?',
    [bookingId]
  );
  if (bookingRows.length === 0) {
    // Record webhook delivery to prevent reprocessing orphaned deliveries
    await executeFn(
      'INSERT INTO processed_webhooks (delivery_id, event_type, payment_id, processed_at) VALUES (?, ?, ?, ?)',
      [deliveryId, event, paymentId, new Date().toISOString()]
    );
    return {
      statusCode: 404,
      success: false,
      message: `Booking not found for order ${orderId}`
    };
  }

  const booking = JSON.parse(bookingRows[0].data) as Booking;
  const now = new Date().toISOString();

  // Payment Status Determination based on YOUPI PG contract rules:
  let newPaymentStatus: Booking['paymentStatus'] = booking.paymentStatus;
  let newSettlementStatus: NonNullable<Booking['settlementStatus']> = booking.settlementStatus || 'UNSETTLED';
  let isAmountValid = true;

  // Verify amount match (prevent underpayment / tampering)
  const bookingTotal = Number(booking.grandTotal);
  if (receivedAmount > 0 && Math.abs(bookingTotal - receivedAmount) > 0.05) {
    isAmountValid = false;
  }

  switch (event) {
    case 'RECONCILED': {
      // ONLY accept RECONCILED with UPI method and settlementState === 'RECONCILED' as verified payment confirmation
      if (method === 'UPI' && settlementState === 'RECONCILED') {
        if (!isAmountValid) {
          newPaymentStatus = 'Pending';
          newSettlementStatus = 'MANUAL_REVIEW';
          booking.cancellationReason = `Amount mismatch: expected ₹${bookingTotal}, received ₹${receivedAmount}`;
        } else {
          newPaymentStatus = 'Paid';
          newSettlementStatus = 'RECONCILED';
          booking.paymentCompletedAt = completedAt;
          if (utr) booking.utr = utr;
        }
      } else {
        newSettlementStatus = normalizeSettlementStatus(settlementState || 'NOT_RECONCILED');
      }
      break;
    }

    case 'OBSERVED_SUCCESS': {
      // Bank alert matched. It is NOT reconciled settlement! DO NOT mark as Paid.
      newPaymentStatus = 'Pending';
      newSettlementStatus = 'NOT_RECONCILED';
      if (utr) booking.utr = utr;
      break;
    }

    case 'MANUAL_REVIEW': {
      newPaymentStatus = 'Pending';
      newSettlementStatus = 'MANUAL_REVIEW';
      break;
    }

    case 'SUCCESS': {
      // SUCCESS must not be treated as UPI bank settlement (represents COD or counter payments)
      if (method === 'UPI') {
        // Not accepted as UPI bank settlement
        newPaymentStatus = 'Pending';
        newSettlementStatus = 'NOT_RECONCILED';
      } else {
        newPaymentStatus = 'Paid';
        newSettlementStatus = 'NOT_BANK_SETTLEMENT';
        booking.paymentCompletedAt = completedAt;
      }
      break;
    }

    case 'FAILED': {
      newPaymentStatus = 'Failed';
      newSettlementStatus = 'FAILED';
      break;
    }

    case 'EXPIRED': {
      newPaymentStatus = 'Expired';
      newSettlementStatus = 'EXPIRED';
      break;
    }

    case 'CANCELLED': {
      newPaymentStatus = 'Cancelled';
      newSettlementStatus = 'CANCELLED';
      break;
    }

    default:
      newSettlementStatus = normalizeSettlementStatus(settlementState || 'UNSETTLED');
      break;
  }

  // Update booking entity
  booking.paymentStatus = newPaymentStatus;
  booking.settlementStatus = newSettlementStatus;
  booking.gatewayPaymentId = paymentId || booking.gatewayPaymentId;
  booking.gatewayOrderId = orderId || booking.gatewayOrderId;
  booking.webhookDeliveryId = deliveryId;
  booking.paymentMetadata = {
    ...(booking.paymentMetadata || {}),
    lastWebhookEvent: event,
    lastWebhookTimestamp: now,
    settlementState,
    method
  };

  // Update booking in DB
  await executeFn(
    'UPDATE bookings SET data = ? WHERE id = ?',
    [JSON.stringify(booking), bookingId]
  );

  // Record payment attempt in payments table
  const paymentAttemptId = `pay_${randomUUID()}`;
  await executeFn(
    `INSERT INTO payments (
      id, booking_id, gateway_payment_id, gateway_order_id, payment_method,
      amount, currency, payment_status, settlement_status, utr,
      webhook_delivery_id, created_at, completed_at, metadata, raw_payload
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      paymentAttemptId,
      bookingId,
      paymentId || null,
      orderId,
      method,
      receivedAmount || bookingTotal,
      payload.currency || 'INR',
      newPaymentStatus,
      newSettlementStatus,
      utr || null,
      deliveryId,
      now,
      completedAt || null,
      JSON.stringify(payload.metadata || {}),
      rawBody
    ]
  );

  // Record delivery ID in processed_webhooks
  await executeFn(
    'INSERT INTO processed_webhooks (delivery_id, event_type, payment_id, processed_at) VALUES (?, ?, ?, ?)',
    [deliveryId, event, paymentId, now]
  );

  return {
    statusCode: 200,
    success: true,
    message: `Processed event ${event} for booking ${bookingId}`,
    bookingId,
    paymentStatus: newPaymentStatus,
    settlementStatus: newSettlementStatus
  };
}
