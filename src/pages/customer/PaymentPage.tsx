import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Smartphone,
  Building,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Loader2,
  Hotel as HotelIcon,
  ChevronLeft
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

export function PaymentPage() {
  const navigate = useNavigate();
  const { draft, priceBreakdown, createBooking } = useBooking();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'Pay at Hotel'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [bookingError, setBookingError] = useState('');

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    if (!isAuthenticated) {
      setBookingError('Sign in or create an account before confirming your reservation.');
      openAuthModal();
      return;
    }
    setIsProcessing(true);
    setProcessingStatus('Checking availability and confirming reservation...');
    try {
      const confirmedBooking = await createBooking(paymentMethod);
      navigate(`/confirmation/${confirmedBooking.id}`);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Could not create your reservation.');
    } finally {
      setIsProcessing(false);
    }
  };

  const hotel = draft.hotel;
  const room = draft.room;

  if (!hotel || !room) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center shadow-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-4">No active booking draft found.</p>
          <Link to="/hotels" className="px-6 py-2.5 bg-[#1E252B] text-white rounded-xl text-xs font-bold">
            Return to Hotels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      
      {/* Progress Header */}
      <div className="bg-white border-b border-[#EAE6DF] sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            to="/checkout"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Guest Details</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Secure reservation</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A880]">
            Step 2 of 2: Confirm reservation
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Complete Your Reservation
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Booking total:{' '}
            <strong className="text-base text-gray-900 font-bold">
              ₹{priceBreakdown.grandTotal.toLocaleString('en-IN')}
            </strong>{' '}
            for {draft.nights} Nights at {hotel.name}
          </p>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold uppercase tracking-wider text-[11px] text-amber-800">Payment Gateway Demonstration Mode</p>
            <p className="text-gray-600 leading-relaxed">
              Live commercial payment gateways (Razorpay / Stripe) are currently operating in test sandbox mode. <strong>No real money will be charged</strong> and no real credit card or debit card numbers will be collected. You can safely simulate your reservation confirmation below.
            </p>
          </div>
        </div>

        {/* Payment Methods Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE6DF] shadow-sm">
          
          {/* Method Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 p-1.5 bg-[#FAF9F6] rounded-2xl border border-gray-200">
            {[
              { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
              { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard },
              { id: 'Net Banking', label: 'Net Banking', icon: Building },
              { id: 'Pay at Hotel', label: 'Pay at Hotel', icon: HotelIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = paymentMethod === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setPaymentMethod(tab.id as any)}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1E252B] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-[#C5A880]' : 'text-gray-500'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handlePayNow} className="space-y-6">
            
            {/* Online methods remain pending until a payment provider is configured. */}
            {paymentMethod === 'UPI' && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
                UPI payments are not enabled yet. You can confirm the reservation now, but no payment will be collected and its payment status will remain pending.
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
                Card payments are not enabled yet. Do not enter card details here. You can confirm the reservation now; payment will remain pending.
              </div>
            )}

            {paymentMethod === 'Net Banking' && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
                Net banking is not enabled yet. You can confirm the reservation now, but no payment will be collected and its payment status will remain pending.
              </div>
            )}

            {/* 4. Pay at Hotel Tab */}
            {paymentMethod === 'Pay at Hotel' && (
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-2 animate-in fade-in duration-150">
                <h4 className="font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No Advance Payment Required Today</span>
                </h4>
                <p className="text-xs leading-relaxed text-amber-800">
                  Your reservation will be confirmed now. Pay ₹{priceBreakdown.grandTotal.toLocaleString('en-IN')} at the hotel front desk during check-in; payment is not collected online.
                </p>
              </div>
            )}

            {/* Summary Price Callout */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">Booking total</span>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{priceBreakdown.grandTotal.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Hidden Fees</span>
              </div>
            </div>

            {bookingError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{bookingError}</p>}

            {/* Submit Payment CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#1E252B] text-white rounded-2xl font-bold text-xs tracking-wider uppercase hover:bg-[#2D3748] transition-all shadow-xl shadow-[#1E252B]/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" />
                  <span>{processingStatus || 'Processing Securely...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'Pay at Hotel' ? 'CONFIRM & PAY AT HOTEL' : 'CONFIRM RESERVATION - PAYMENT PENDING'}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#C5A880]" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
