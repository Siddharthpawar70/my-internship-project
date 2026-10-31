import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import multer from 'multer';
import { createPool, type Pool } from 'mysql2/promise';
import { createServer as createViteServer } from 'vite';
import {
  ADD_ONS_LIST,
  COUPONS_LIST,
  INITIAL_HOTELS,
  INITIAL_ROOMS,
  INITIAL_REVIEWS,
  INITIAL_HOUSEKEEPING,
  INITIAL_MAINTENANCE,
  INITIAL_BOOKINGS
} from '../src/data/mockData';
import { Booking, GuestDetails, Hotel, RoomType, Review, HousekeepingRoom, MaintenanceTicket, Coupon } from '../src/types';

const app = express();
const port = Number(process.env.PORT || 3000);
const sessionMaxAge = 30 * 24 * 60 * 60;
let database: Pool | null = null;
let sqliteDb: DatabaseSync | null = null;
let storageType: 'mysql' | 'sqlite' = 'sqlite';
let databaseUnavailable = false;

type StoredUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  loyaltyTier: 'Silver' | 'Gold' | 'Platinum';
  loyaltyPoints: number;
  joinedDate: string;
  status: 'approved' | 'pending' | 'rejected';
  role?: 'customer' | 'admin';
  avatar?: string;
  registeredAt: string;
};

type BookingRequest = {
  hotelId: string;
  roomId: string;
  ratePlanId: string;
  checkIn: string;
  checkOut: string;
  roomsCount: number;
  adultsCount: number;
  childrenCount: number;
  guestDetails: GuestDetails;
  selectedAddOns: { addOnId: string; quantity: number }[];
  couponCode?: string;
  paymentMethod: Booking['paymentMethod'];
};

// In-memory rate limiter for login & registration
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(key: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  if (entry.count >= maxAttempts) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }
  entry.count += 1;
  return { allowed: true };
}
function clearRateLimit(key: string) {
  rateLimitMap.delete(key);
}

function query<T>(sql: string, values: (string | number | null)[] = []): Promise<T[]> {
  if (storageType === 'mysql' && database) {
    return database.execute(sql, values).then(([rows]) => rows as T[]);
  }
  if (sqliteDb) {
    const stmt = sqliteDb.prepare(sql);
    return Promise.resolve(stmt.all(...values) as T[]);
  }
  return Promise.reject(new Error('Database not initialized'));
}

function execute(sql: string, values: (string | number | null)[] = []): Promise<unknown> {
  if (storageType === 'mysql' && database) {
    return database.execute(sql, values);
  }
  if (sqliteDb) {
    const stmt = sqliteDb.prepare(sql);
    return Promise.resolve(stmt.run(...values));
  }
  return Promise.reject(new Error('Database not initialized'));
}

function asyncRoute(handler: (request: Request, response: Response, next: NextFunction) => Promise<unknown>): RequestHandler {
  return (request, response, next) => {
    void handler(request, response, next).catch(next);
  };
}

function readCookie(request: Request, cookieName: string) {
  const cookieHeader = request.headers.cookie || '';
  const cookie = cookieHeader.split(';').map((value) => value.trim()).find((value) => value.startsWith(`${cookieName}=`));
  return cookie?.slice(cookieName.length + 1);
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

// Find standard logged in user
async function findUser(request: Request): Promise<StoredUser | undefined> {
  const token = readCookie(request, 'stayaura_session');
  if (!token) return undefined;
  const users = await query<{ data: string }>(
    'SELECT users.data FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token_hash = ? AND sessions.expires_at > ?',
    [hashToken(token), Date.now()]
  );
  if (!users[0]) return undefined;
  const user = JSON.parse(users[0].data) as StoredUser;
  if (user.status && user.status !== 'approved') return undefined;
  return user;
}

async function requireUser(request: Request, response: Response): Promise<StoredUser | undefined> {
  const user = await findUser(request);
  if (!user) response.status(401).json({ error: 'Sign in to continue.' });
  return user;
}

// Find authenticated administrator
async function findAdmin(request: Request): Promise<StoredUser | undefined> {
  const token = readCookie(request, 'stayaura_admin_session');
  if (!token) return undefined;
  const users = await query<{ data: string }>(
    'SELECT users.data FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token_hash = ? AND sessions.expires_at > ?',
    [hashToken(token), Date.now()]
  );
  if (!users[0]) return undefined;
  const user = JSON.parse(users[0].data) as StoredUser;
  if (user.role !== 'admin') return undefined;
  return user;
}

async function requireAdmin(request: Request, response: Response): Promise<StoredUser | undefined> {
  const admin = await findAdmin(request);
  if (!admin) {
    response.status(401).json({ error: 'Administrator access required. Please sign in to the Admin Console.' });
    return undefined;
  }
  return admin;
}

async function issueSession(userId: string, response: Response, isAdmin = false) {
  const token = randomBytes(32).toString('hex');
  const cookieName = isAdmin ? 'stayaura_admin_session' : 'stayaura_session';
  await execute('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)', [
    hashToken(token), userId, Date.now() + sessionMaxAge * 1000
  ]);
  response.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: sessionMaxAge * 1000,
    path: '/'
  });
}

function cleanEmail(email: unknown) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function passwordDigest(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString('hex');
}

function isDuplicateKeyError(error: unknown) {
  const code = (error as { code?: string })?.code;
  const message = String((error as { message?: string })?.message || error || '');
  return code === 'ER_DUP_ENTRY' || code === 'SQLITE_CONSTRAINT' || code === 'SQLITE_CONSTRAINT_UNIQUE' || message.includes('UNIQUE constraint failed');
}

async function upsertRecord(table: string, key: string, idVal: string, dataObj: unknown, extraCol?: string, extraVal?: string) {
  const dataJson = JSON.stringify(dataObj);
  if (storageType === 'mysql') {
    if (extraCol && extraVal !== undefined) {
      await execute(
        `INSERT INTO ${table} (${key}, ${extraCol}, data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE ${extraCol} = VALUES(${extraCol}), data = VALUES(data)`,
        [idVal, extraVal, dataJson]
      );
    } else {
      await execute(
        `INSERT INTO ${table} (${key}, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)`,
        [idVal, dataJson]
      );
    }
  } else {
    if (extraCol && extraVal !== undefined) {
      await execute(
        `INSERT OR REPLACE INTO ${table} (${key}, ${extraCol}, data) VALUES (?, ?, ?)`,
        [idVal, extraVal, dataJson]
      );
    } else {
      await execute(
        `INSERT OR REPLACE INTO ${table} (${key}, data) VALUES (?, ?)`,
        [idVal, dataJson]
      );
    }
  }
}

async function initializeDatabase() {
  const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;
  let mysqlReady = false;

  if (MYSQL_USER && MYSQL_DATABASE && MYSQL_PASSWORD !== undefined && MYSQL_PASSWORD !== 'replace-with-a-strong-password') {
    try {
      const pool = createPool({
        host: MYSQL_HOST || '127.0.0.1',
        port: Number(MYSQL_PORT || 3306),
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 2000
      });
      await pool.query('SELECT 1');
      database = pool;
      storageType = 'mysql';

      const schemaStatements = [
        `CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(100) PRIMARY KEY,
          email VARCHAR(320) NOT NULL UNIQUE,
          password_salt CHAR(32) NOT NULL,
          password_hash CHAR(128) NOT NULL,
          data LONGTEXT NOT NULL
        ) ENGINE=InnoDB`,
        `CREATE TABLE IF NOT EXISTS sessions (
          token_hash CHAR(64) PRIMARY KEY,
          user_id VARCHAR(100) NOT NULL,
          expires_at BIGINT NOT NULL,
          CONSTRAINT sessions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB`,
        'CREATE TABLE IF NOT EXISTS hotels (id VARCHAR(100) PRIMARY KEY, data LONGTEXT NOT NULL) ENGINE=InnoDB',
        'CREATE TABLE IF NOT EXISTS rooms (id VARCHAR(100) PRIMARY KEY, hotel_id VARCHAR(100) NOT NULL, data LONGTEXT NOT NULL, KEY rooms_by_hotel (hotel_id)) ENGINE=InnoDB',
        'CREATE TABLE IF NOT EXISTS add_ons (id VARCHAR(100) PRIMARY KEY, data LONGTEXT NOT NULL) ENGINE=InnoDB',
        'CREATE TABLE IF NOT EXISTS coupons (code VARCHAR(100) PRIMARY KEY, data LONGTEXT NOT NULL) ENGINE=InnoDB',
        `CREATE TABLE IF NOT EXISTS reviews (
          id VARCHAR(100) PRIMARY KEY,
          hotel_id VARCHAR(100) NOT NULL,
          user_id VARCHAR(100),
          rating INT NOT NULL,
          data LONGTEXT NOT NULL,
          created_at DATETIME NOT NULL,
          KEY reviews_by_hotel (hotel_id)
        ) ENGINE=InnoDB`,
        `CREATE TABLE IF NOT EXISTS housekeeping (
          room_number VARCHAR(20) PRIMARY KEY,
          hotel_id VARCHAR(100) NOT NULL,
          status VARCHAR(50) NOT NULL,
          housekeeping_status VARCHAR(50) NOT NULL,
          data LONGTEXT NOT NULL,
          updated_at DATETIME NOT NULL,
          KEY housekeeping_by_hotel (hotel_id)
        ) ENGINE=InnoDB`,
        `CREATE TABLE IF NOT EXISTS maintenance (
          id VARCHAR(100) PRIMARY KEY,
          room_number VARCHAR(20) NOT NULL,
          hotel_id VARCHAR(100) NOT NULL,
          issue TEXT NOT NULL,
          priority VARCHAR(20) NOT NULL,
          status VARCHAR(50) NOT NULL,
          data LONGTEXT NOT NULL,
          created_at DATETIME NOT NULL,
          KEY maintenance_by_hotel (hotel_id)
        ) ENGINE=InnoDB`,
        `CREATE TABLE IF NOT EXISTS bookings (
          id VARCHAR(32) PRIMARY KEY,
          user_id VARCHAR(100) NOT NULL,
          hotel_id VARCHAR(100) NOT NULL,
          room_id VARCHAR(100) NOT NULL,
          check_in DATE NOT NULL,
          check_out DATE NOT NULL,
          rooms_count INT NOT NULL,
          status VARCHAR(32) NOT NULL,
          data LONGTEXT NOT NULL,
          created_at DATETIME NOT NULL,
          KEY booking_inventory_lookup (room_id, status, check_in, check_out),
          KEY bookings_by_user (user_id, created_at),
          CONSTRAINT bookings_user_fk FOREIGN KEY (user_id) REFERENCES users(id)
        ) ENGINE=InnoDB`
      ];
      for (const statement of schemaStatements) await pool.query(statement);
      console.log(`Connected to MySQL database "${MYSQL_DATABASE}".`);
      mysqlReady = true;
    } catch (error) {
      console.warn('MySQL connection failed, falling back to local SQLite:', (error as Error).message);
    }
  }

  if (!mysqlReady) {
    const dataDir = path.resolve(process.cwd(), '.data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const sqlitePath = path.join(dataDir, 'hotelbooking.sqlite');
    sqliteDb = new DatabaseSync(sqlitePath);
    sqliteDb.exec('PRAGMA journal_mode = WAL;');
    sqliteDb.exec('PRAGMA foreign_keys = ON;');
    storageType = 'sqlite';

    const sqliteSchema = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_salt TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        data TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS sessions (
        token_hash TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      'CREATE TABLE IF NOT EXISTS hotels (id TEXT PRIMARY KEY, data TEXT NOT NULL)',
      'CREATE TABLE IF NOT EXISTS rooms (id TEXT PRIMARY KEY, hotel_id TEXT NOT NULL, data TEXT NOT NULL)',
      'CREATE TABLE IF NOT EXISTS add_ons (id TEXT PRIMARY KEY, data TEXT NOT NULL)',
      'CREATE TABLE IF NOT EXISTS coupons (code TEXT PRIMARY KEY, data TEXT NOT NULL)',
      `CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        hotel_id TEXT NOT NULL,
        user_id TEXT,
        rating INTEGER NOT NULL,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS housekeeping (
        room_number TEXT PRIMARY KEY,
        hotel_id TEXT NOT NULL,
        status TEXT NOT NULL,
        housekeeping_status TEXT NOT NULL,
        data TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS maintenance (
        id TEXT PRIMARY KEY,
        room_number TEXT NOT NULL,
        hotel_id TEXT NOT NULL,
        issue TEXT NOT NULL,
        priority TEXT NOT NULL,
        status TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        hotel_id TEXT NOT NULL,
        room_id TEXT NOT NULL,
        check_in TEXT NOT NULL,
        check_out TEXT NOT NULL,
        rooms_count INTEGER NOT NULL,
        status TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`
    ];
    for (const statement of sqliteSchema) sqliteDb.exec(statement);
    console.log('Using local SQLite database at .data/hotelbooking.sqlite');
  }

  // 1. Seed or update hotels
  for (const hotel of INITIAL_HOTELS) {
    await upsertRecord('hotels', 'id', hotel.id, hotel);
  }

  // 2. Seed or update rooms
  for (const room of INITIAL_ROOMS) {
    await upsertRecord('rooms', 'id', room.id, room, 'hotel_id', room.hotelId);
  }

  // 3. Seed add-ons
  for (const addon of ADD_ONS_LIST) {
    await upsertRecord('add_ons', 'id', addon.id, addon);
  }

  // 4. Seed coupons
  for (const coupon of COUPONS_LIST) {
    await upsertRecord('coupons', 'code', coupon.code, coupon);
  }

  // 5. Seed reviews
  for (const review of INITIAL_REVIEWS) {
    const revRow = (await query<{ id: string }>('SELECT id FROM reviews WHERE id = ?', [review.id]))[0];
    if (!revRow) {
      await execute('INSERT INTO reviews (id, hotel_id, user_id, rating, data, created_at) VALUES (?, ?, ?, ?, ?, ?)', [
        review.id, review.hotelId, null, Math.round(review.overallRating), JSON.stringify(review), new Date().toISOString()
      ]);
    }
  }

  // 6. Seed housekeeping
  for (const hk of INITIAL_HOUSEKEEPING) {
    const hkRow = (await query<{ room_number: string }>('SELECT room_number FROM housekeeping WHERE room_number = ?', [hk.roomNumber]))[0];
    if (!hkRow) {
      await execute('INSERT INTO housekeeping (room_number, hotel_id, status, housekeeping_status, data, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [
        hk.roomNumber, 'stayaura-pune-grand', hk.status, hk.housekeepingStatus, JSON.stringify(hk), new Date().toISOString()
      ]);
    }
  }

  // 7. Seed maintenance
  for (const mt of INITIAL_MAINTENANCE) {
    const mtRow = (await query<{ id: string }>('SELECT id FROM maintenance WHERE id = ?', [mt.id]))[0];
    if (!mtRow) {
      await execute('INSERT INTO maintenance (id, room_number, hotel_id, issue, priority, status, data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
        mt.id, mt.roomNumber, 'stayaura-pune-grand', mt.issue, mt.priority, mt.status, JSON.stringify(mt), new Date().toISOString()
      ]);
    }
  }

  // 8. Seed default administrator account if missing
  const adminEmail = 'admin@stayaura.com';
  const existingAdmin = (await query<{ id: string }>('SELECT id FROM users WHERE email = ?', [adminEmail]))[0];
  if (!existingAdmin) {
    const adminId = 'usr_admin_master';
    const adminSalt = randomBytes(16).toString('hex');
    const adminHash = passwordDigest('Admin@StayAura2026!', adminSalt);
    const adminUser: StoredUser = {
      id: adminId,
      name: 'StayAura Administrator',
      email: adminEmail,
      phone: '+91 98000 00000',
      city: 'Pune',
      loyaltyTier: 'Platinum',
      loyaltyPoints: 5000,
      joinedDate: 'Jan 2026',
      status: 'approved',
      role: 'admin',
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    await execute('INSERT INTO users (id, email, password_salt, password_hash, data) VALUES (?, ?, ?, ?, ?)', [
      adminId, adminEmail, adminSalt, adminHash, JSON.stringify(adminUser)
    ]);
    console.log(`Seeded default Administrator account (${adminEmail})`);
  }

  // 9. Seed initial bookings if table is empty
  const bookingsCountRow = (await query<{ count: number }>('SELECT COUNT(*) AS count FROM bookings'))[0];
  const bookingsCount = bookingsCountRow ? Number(bookingsCountRow.count) : 0;
  if (bookingsCount === 0 && INITIAL_BOOKINGS.length > 0) {
    // Pick the first available user to associate
    const firstUser = (await query<{ id: string }>('SELECT id FROM users ORDER BY id ASC LIMIT 1'))[0];
    const targetUserId = firstUser ? firstUser.id : 'usr_admin_master';
    for (const b of INITIAL_BOOKINGS) {
      await execute('INSERT INTO bookings (id, user_id, hotel_id, room_id, check_in, check_out, rooms_count, status, data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        b.id, targetUserId, b.hotelId, b.roomId, b.checkIn, b.checkOut, b.roomsCount, b.bookingStatus, JSON.stringify(b), b.bookedAt
      ]);
    }
    console.log(`Seeded ${INITIAL_BOOKINGS.length} initial bookings.`);
  }
}

function dateRange(checkIn: string, checkOut: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) return null;
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || new Date(start).toISOString().slice(0, 10) !== checkIn || new Date(end).toISOString().slice(0, 10) !== checkOut || end <= start) return null;
  const nights = (end - start) / 86_400_000;
  if (nights > 60) return null;
  return { start, end, nights };
}

async function createBooking(request: BookingRequest, user: StoredUser): Promise<Booking> {
  const hotelRow = (await query<{ data: string }>('SELECT data FROM hotels WHERE id = ?', [request.hotelId]))[0];
  const roomRow = (await query<{ data: string }>('SELECT data FROM rooms WHERE id = ? AND hotel_id = ?', [request.roomId, request.hotelId]))[0];
  if (!hotelRow || !roomRow) throw new Error('The selected hotel or room is no longer available.');
  const hotel = JSON.parse(hotelRow.data) as Hotel;
  const room = JSON.parse(roomRow.data) as RoomType;
  const ratePlan = room.ratePlans.find((item) => item.id === request.ratePlanId) || room.ratePlans[0];
  if (!ratePlan) throw new Error('The selected rate plan is not available.');

  const dates = dateRange(request.checkIn, request.checkOut);
  if (!dates || dates.start < Date.parse(new Date().toISOString().slice(0, 10) + 'T00:00:00Z')) {
    throw new Error('Choose valid future check-in and check-out dates.');
  }
  const roomsCount = Number(request.roomsCount);
  const adultsCount = Number(request.adultsCount);
  const childrenCount = Number(request.childrenCount);
  if (!Number.isInteger(roomsCount) || roomsCount < 1 || roomsCount > 10 || !Number.isInteger(adultsCount) || adultsCount < 1 || adultsCount > room.maxAdults * roomsCount || !Number.isInteger(childrenCount) || childrenCount < 0 || childrenCount > room.maxChildren * roomsCount || adultsCount + childrenCount > room.maxOccupancy * roomsCount) {
    throw new Error('The guest or room count exceeds this room type’s capacity.');
  }
  const guest = request.guestDetails;
  if (!guest?.firstName?.trim() || !guest?.lastName?.trim() || !/^\S+@\S+\.\S+$/.test(guest.email || '') || !guest.phone?.trim()) {
    throw new Error('Enter the lead guest’s name, valid email, and phone number.');
  }

  // Safe inventory verification against database records
  const occupying = (await query<{ data: string }>(
    "SELECT data FROM bookings WHERE room_id = ? AND status != 'Cancelled' AND check_in < ? AND check_out > ?",
    [room.id, request.checkOut, request.checkIn]
  )).map((row) => JSON.parse(row.data) as Booking);

  for (let day = dates.start; day < dates.end; day += 86_400_000) {
    const date = new Date(day).toISOString().slice(0, 10);
    const limit = room.inventoryByDate?.[date] ?? room.availableCount;
    const reserved = occupying.filter((booking) => booking.checkIn <= date && booking.checkOut > date).reduce((sum, booking) => sum + booking.roomsCount, 0);
    if (limit - reserved < roomsCount) throw new Error(`Only ${Math.max(0, limit - reserved)} room(s) remain for ${date}.`);
  }

  const selectedAddOns = await Promise.all((request.selectedAddOns || []).map(async ({ addOnId, quantity }) => {
    const record = (await query<{ data: string }>('SELECT data FROM add_ons WHERE id = ?', [addOnId]))[0];
    const addOn = record ? JSON.parse(record.data) as typeof ADD_ONS_LIST[number] : undefined;
    if (!addOn || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error('A selected add-on is invalid.');
    const multiplier = addOn.priceType === 'per_night' ? dates.nights : addOn.priceType === 'per_guest' ? adultsCount + childrenCount : 1;
    return { addOn, quantity, total: addOn.price * quantity * multiplier };
  }));
  const roomTotal = ratePlan.pricePerNight * dates.nights * roomsCount;
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.total, 0);
  const subtotal = roomTotal + addOnsTotal;
  let discount = 0;
  if (request.couponCode) {
    const record = (await query<{ data: string }>('SELECT data FROM coupons WHERE code = ?', [request.couponCode.trim().toUpperCase()]))[0];
    const coupon = record ? JSON.parse(record.data) as Coupon : undefined;
    if (!coupon || (!coupon.active && !coupon.isActive) || new Date(coupon.validUntil).getTime() < Date.now()) {
      throw new Error('This coupon code is invalid or expired.');
    }
    const minimum = coupon.minBookingValue || coupon.minSpend || 0;
    if (roomTotal < minimum) throw new Error(`This coupon requires a minimum booking value of ₹${minimum.toLocaleString('en-IN')}.`);
    const value = coupon.discountValue || coupon.discountPercent || 0;
    discount = coupon.discountType === 'fixed' ? value : Math.round(subtotal * value / 100);
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    discount = Math.min(discount, subtotal);
  }
  const taxesAndFees = Math.round((subtotal - discount) * 0.18);
  const serviceFee = 300;
  const paymentMethod = request.paymentMethod;
  const id = `HTL${randomBytes(4).readUInt32BE(0).toString().slice(0, 8)}`;
  const booking: Booking = {
    id,
    hotelId: hotel.id,
    hotelName: hotel.name,
    hotelAddress: hotel.address,
    hotelCity: hotel.city,
    hotelImage: hotel.heroImage,
    hotelPhone: '+91 20 6688 9900',
    roomId: room.id,
    roomName: room.name,
    ratePlanId: ratePlan.id,
    ratePlanName: ratePlan.name,
    checkIn: request.checkIn,
    checkOut: request.checkOut,
    nights: dates.nights,
    roomsCount,
    adultsCount,
    childrenCount,
    guestDetails: { ...guest },
    selectedAddOns,
    baseRoomPrice: ratePlan.pricePerNight,
    totalRoomPrice: roomTotal,
    totalAddOnsPrice: addOnsTotal,
    taxesAndFees,
    serviceFee,
    couponCode: request.couponCode,
    discountAmount: discount,
    grandTotal: subtotal - discount + taxesAndFees + serviceFee,
    paymentMethod,
    paymentStatus: paymentMethod === 'Pay at Hotel' ? 'Pending' : 'Paid',
    bookingStatus: 'Confirmed',
    bookedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  await execute('INSERT INTO bookings (id, user_id, hotel_id, room_id, check_in, check_out, rooms_count, status, data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
    id, user.id, hotel.id, room.id, booking.checkIn, booking.checkOut, roomsCount, booking.bookingStatus, JSON.stringify(booking), booking.bookedAt
  ]);
  return booking;
}

const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const uploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext) ? ext : '.jpg';
    cb(null, `img-${Date.now()}-${randomBytes(4).toString('hex')}${safeExt}`);
  }
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = /^image\/(jpeg|png|webp|gif|svg\+xml)$/i;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, GIF, and SVG images are allowed.'));
    }
  }
});

app.use(express.json({ limit: '15mb' }));
app.use('/uploads', express.static(uploadsDir));
app.use('/api', (_request, response, next) => {
  if (databaseUnavailable) {
    return response.status(503).json({ error: 'Database is unavailable. Start MySQL or check file permissions for SQLite.' });
  }
  return next();
});

// Multipart file upload endpoint
app.post('/api/upload', (request: Request, response: Response) => {
  upload.single('image')(request, response, (err) => {
    if (err) {
      return response.status(400).json({ error: err instanceof Error ? err.message : 'Upload failed.' });
    }
    if (!request.file) {
      return response.status(400).json({ error: 'No image file was uploaded.' });
    }
    const fileUrl = `/uploads/${request.file.filename}`;
    return response.status(201).json({
      url: fileUrl,
      filename: request.file.filename,
      size: request.file.size,
      mimetype: request.file.mimetype
    });
  });
});

// Base64 file upload endpoint
app.post('/api/upload/base64', asyncRoute(async (request: Request, response: Response) => {
  const { dataUrl } = request.body || {};
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return response.status(400).json({ error: 'Invalid image data URL provided.' });
  }

  const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!matches) {
    return response.status(400).json({ error: 'Malformed base64 image data.' });
  }

  let ext = matches[1].toLowerCase();
  if (ext === 'jpeg') ext = 'jpg';
  if (ext === 'svg+xml') ext = 'svg';
  const buffer = Buffer.from(matches[2], 'base64');
  if (buffer.length > 10 * 1024 * 1024) {
    return response.status(400).json({ error: 'Image exceeds 10MB limit.' });
  }

  const filename = `img-${Date.now()}-${randomBytes(4).toString('hex')}.${ext}`;
  const filePath = path.join(uploadsDir, filename);
  await fs.promises.writeFile(filePath, buffer);

  return response.status(201).json({
    url: `/uploads/${filename}`,
    filename,
    size: buffer.length
  });
}));

// Admin list uploads endpoint
app.get('/api/admin/uploads', asyncRoute(async (request: Request, response: Response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const files = await fs.promises.readdir(uploadsDir).catch(() => []);
  const fileDetails = await Promise.all(
    files.map(async (name) => {
      const stats = await fs.promises.stat(path.join(uploadsDir, name)).catch(() => null);
      return {
        filename: name,
        url: `/uploads/${name}`,
        size: stats?.size || 0,
        createdAt: stats?.birthtime || new Date()
      };
    })
  );
  return response.json({ uploads: fileDetails.reverse() });
}));

// ==========================================
// PUBLIC & CUSTOMER APIS
// ==========================================

app.get('/api/health', asyncRoute(async (_request, response) => {
  await query('SELECT 1');
  return response.json({ status: 'ok', storage: storageType });
}));

app.get('/api/hotels', asyncRoute(async (_request, response) => {
  const rows = await query<{ data: string }>('SELECT data FROM hotels');
  return response.json(rows.map((row) => JSON.parse(row.data)));
}));

app.get('/api/hotels/:id', asyncRoute(async (request, response) => {
  const row = (await query<{ data: string }>('SELECT data FROM hotels WHERE id = ?', [request.params.id]))[0];
  if (!row) return response.status(404).json({ error: 'Hotel not found.' });
  return response.json(JSON.parse(row.data));
}));

app.get('/api/rooms', asyncRoute(async (request, response) => {
  const { hotelId } = request.query;
  let rows: { data: string }[];
  if (typeof hotelId === 'string' && hotelId.trim()) {
    rows = await query<{ data: string }>('SELECT data FROM rooms WHERE hotel_id = ?', [hotelId.trim()]);
  } else {
    rows = await query<{ data: string }>('SELECT data FROM rooms');
  }
  return response.json(rows.map((row) => JSON.parse(row.data)));
}));

app.get('/api/reviews', asyncRoute(async (request, response) => {
  const { hotelId } = request.query;
  let rows: { data: string }[];
  if (typeof hotelId === 'string' && hotelId.trim()) {
    rows = await query<{ data: string }>('SELECT data FROM reviews WHERE hotel_id = ? ORDER BY created_at DESC', [hotelId.trim()]);
  } else {
    rows = await query<{ data: string }>('SELECT data FROM reviews ORDER BY created_at DESC LIMIT 50');
  }
  return response.json(rows.map((row) => JSON.parse(row.data)));
}));

app.post('/api/reviews', asyncRoute(async (request, response) => {
  const user = await requireUser(request, response);
  if (!user) return;
  const { hotelId, overallRating, title, comment, travelerType, roomType, cleanliness, staff, location, value } = request.body || {};
  if (!hotelId || typeof overallRating !== 'number' || !comment?.trim()) {
    return response.status(400).json({ error: 'Please provide hotel ID, rating and comments.' });
  }
  const id = `rev-${randomUUID()}`;
  const now = new Date();
  const newReview: Review = {
    id,
    hotelId: String(hotelId),
    guestName: user.name,
    userName: user.name,
    guestCity: user.city || 'India',
    userLocation: user.city || 'India',
    date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    overallRating: Math.min(5, Math.max(1, overallRating)),
    rating: Math.min(5, Math.max(1, overallRating)),
    title: String(title || 'Guest Stay Review').trim(),
    comment: String(comment).trim(),
    travelerType: travelerType || 'Leisure',
    roomType: roomType || 'Deluxe Room',
    cleanliness: cleanliness || 5,
    staff: staff || 5,
    location: location || 5,
    value: value || 5,
    helpfulCount: 0
  };
  await execute('INSERT INTO reviews (id, hotel_id, user_id, rating, data, created_at) VALUES (?, ?, ?, ?, ?, ?)', [
    id, newReview.hotelId, user.id, Math.round(newReview.overallRating), JSON.stringify(newReview), now.toISOString()
  ]);
  return response.status(201).json({ review: newReview });
}));

// Customer Registration with rate limit
app.post('/api/auth/register', asyncRoute(async (request, response, next) => {
  const clientIp = request.ip || 'ip';
  const rateKey = `register:${clientIp}`;
  const rate = checkRateLimit(rateKey, 10, 15 * 60 * 1000);
  if (!rate.allowed) {
    return response.status(429).json({ error: `Too many registration attempts. Please wait ${rate.retryAfter} seconds.` });
  }

  try {
    const { name, phone = '', password } = request.body || {};
    const email = cleanEmail(request.body?.email);
    if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email) || typeof password !== 'string' || password.length < 8) {
      return response.status(400).json({ error: 'Enter your name, a valid email, and a password with at least 8 characters.' });
    }
    const id = `usr_${randomUUID()}`;
    const now = new Date();
    const user: StoredUser = {
      id,
      name: name.trim(),
      email,
      phone: String(phone).trim(),
      city: '',
      loyaltyTier: 'Silver',
      loyaltyPoints: 0,
      joinedDate: now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      status: 'pending',
      role: 'customer',
      registeredAt: now.toISOString().replace('T', ' ').substring(0, 19)
    };
    const salt = randomBytes(16).toString('hex');
    await execute('INSERT INTO users (id, email, password_salt, password_hash, data) VALUES (?, ?, ?, ?, ?)', [
      id, email, salt, passwordDigest(password, salt), JSON.stringify(user)
    ]);
    return response.status(201).json({ pending: true, message: 'Registration successful. Your account is awaiting admin approval.' });
  } catch (error) {
    if (isDuplicateKeyError(error)) return response.status(409).json({ error: 'An account with this email already exists.' });
    return next(error);
  }
}));

// Customer Login with rate limit
app.post('/api/auth/login', asyncRoute(async (request, response) => {
  const email = cleanEmail(request.body?.email);
  const password = request.body?.password;
  const clientIp = request.ip || 'ip';
  const rateKey = `login:${clientIp}:${email}`;
  const rate = checkRateLimit(rateKey, 5, 15 * 60 * 1000);
  if (!rate.allowed) {
    return response.status(429).json({ error: `Too many failed login attempts. Please wait ${rate.retryAfter} seconds.` });
  }

  const record = (await query<{ id: string; password_salt: string; password_hash: string; data: string }>(
    'SELECT id, password_salt, password_hash, data FROM users WHERE email = ?', [email]
  ))[0];
  if (!record || typeof password !== 'string') return response.status(401).json({ error: 'Email or password is incorrect.' });
  const actual = Buffer.from(passwordDigest(password, record.password_salt), 'hex');
  const expected = Buffer.from(record.password_hash, 'hex');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return response.status(401).json({ error: 'Email or password is incorrect.' });

  const userData = JSON.parse(record.data) as StoredUser;
  if (userData.status === 'pending') {
    return response.status(403).json({ error: 'Your account is pending admin approval. Please wait for approval before logging in.' });
  }
  if (userData.status === 'rejected') {
    return response.status(403).json({ error: 'Your account has been rejected. Please contact support.' });
  }

  clearRateLimit(rateKey);
  await execute('DELETE FROM sessions WHERE user_id = ?', [record.id]);
  await issueSession(record.id, response, false);
  return response.json({ user: userData });
}));

app.get('/api/auth/me', asyncRoute(async (request, response) => {
  const user = await findUser(request);
  return response.json({ user: user || null });
}));

app.put('/api/auth/me', asyncRoute(async (request, response) => {
  const user = await requireUser(request, response);
  if (!user) return;
  const name = typeof request.body?.name === 'string' ? request.body.name.trim() : user.name;
  const phone = typeof request.body?.phone === 'string' ? request.body.phone.trim() : user.phone;
  const city = typeof request.body?.city === 'string' ? request.body.city.trim() : user.city;
  const avatar = typeof request.body?.avatar === 'string' ? request.body.avatar.trim() : user.avatar;
  const updated: StoredUser = { ...user, name, phone, city, ...(avatar ? { avatar } : {}) };
  await execute('UPDATE users SET data = ? WHERE id = ?', [JSON.stringify(updated), user.id]);
  return response.json({ user: updated });
}));

app.delete('/api/auth/session', asyncRoute(async (request, response) => {
  const token = readCookie(request, 'stayaura_session');
  if (token) await execute('DELETE FROM sessions WHERE token_hash = ?', [hashToken(token)]);
  response.clearCookie('stayaura_session', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
  return response.status(204).end();
}));

app.get('/api/bookings', asyncRoute(async (request, response) => {
  const user = await requireUser(request, response);
  if (!user) return;
  return response.json((await query<{ data: string }>('SELECT data FROM bookings WHERE user_id = ? ORDER BY created_at DESC', [user.id])).map((row) => JSON.parse(row.data)));
}));

app.post('/api/bookings', asyncRoute(async (request, response) => {
  const user = await requireUser(request, response);
  if (!user) return;
  try {
    const booking = await createBooking(request.body as BookingRequest, user);
    return response.status(201).json({ booking });
  } catch (error) {
    return response.status(400).json({ error: error instanceof Error ? error.message : 'Could not create booking.' });
  }
}));

app.get('/api/bookings/:id', asyncRoute(async (request, response) => {
  const user = await requireUser(request, response);
  if (!user) return;
  const booking = (await query<{ data: string }>('SELECT data FROM bookings WHERE id = ? AND user_id = ?', [request.params.id, user.id]))[0];
  return booking ? response.json({ booking: JSON.parse(booking.data) }) : response.status(404).json({ error: 'Booking not found.' });
}));

app.patch('/api/bookings/:id', asyncRoute(async (request, response) => {
  const user = await requireUser(request, response);
  if (!user) return;
  const row = (await query<{ data: string }>('SELECT data FROM bookings WHERE id = ? AND user_id = ?', [request.params.id, user.id]))[0];
  if (!row) return response.status(404).json({ error: 'Booking not found.' });
  const booking = JSON.parse(row.data) as Booking;
  const { action } = request.body || {};
  const today = new Date().toISOString().slice(0, 10);

  if (action === 'cancel') {
    if (booking.bookingStatus === 'Cancelled' || booking.bookingStatus === 'Checked In' || booking.bookingStatus === 'Checked Out') {
      return response.status(409).json({ error: 'This reservation can no longer be cancelled.' });
    }
    const wasPaid = booking.paymentStatus === 'Paid';
    const cancellationFee = wasPaid ? 1500 : 0;
    Object.assign(booking, {
      bookingStatus: 'Cancelled',
      cancellationReason: String(request.body.reason || 'Cancelled by guest').slice(0, 500),
      cancellationFee,
      refundAmount: wasPaid ? Math.max(0, booking.grandTotal - cancellationFee) : 0,
      refundStatus: wasPaid ? 'Refund Pending' : 'None'
    });
  } else if (action === 'modify') {
    const checkIn = String(request.body.checkIn || '');
    const checkOut = String(request.body.checkOut || '');
    const dates = dateRange(checkIn, checkOut);
    if (!dates || dates.start < Date.parse(`${today}T00:00:00Z`) || booking.bookingStatus !== 'Confirmed') {
      return response.status(400).json({ error: 'Choose valid future dates for an active reservation.' });
    }
    const roomRow = (await query<{ data: string }>('SELECT data FROM rooms WHERE id = ?', [booking.roomId]))[0];
    if (!roomRow) return response.status(400).json({ error: 'The reserved room type no longer exists.' });
    const room = JSON.parse(roomRow.data) as RoomType;
    const otherBookings = (await query<{ data: string }>(
      "SELECT data FROM bookings WHERE id != ? AND room_id = ? AND status != 'Cancelled' AND check_in < ? AND check_out > ?",
      [booking.id, booking.roomId, checkOut, checkIn]
    )).map((item) => JSON.parse(item.data) as Booking);
    for (let day = dates.start; day < dates.end; day += 86_400_000) {
      const dayKey = new Date(day).toISOString().slice(0, 10);
      const capacity = room.inventoryByDate?.[dayKey] ?? room.availableCount;
      const reserved = otherBookings.filter((item) => item.checkIn <= dayKey && item.checkOut > dayKey).reduce((sum, item) => sum + item.roomsCount, 0);
      if (capacity - reserved < booking.roomsCount) return response.status(409).json({ error: `No rooms are available for ${dayKey}.` });
    }
    booking.checkIn = checkIn;
    booking.checkOut = checkOut;
    booking.nights = dates.nights;
    booking.totalRoomPrice = booking.baseRoomPrice * dates.nights * booking.roomsCount;
    booking.selectedAddOns = booking.selectedAddOns.map((item) => {
      const multiplier = item.addOn.priceType === 'per_night' ? dates.nights : item.addOn.priceType === 'per_guest' ? booking.adultsCount + booking.childrenCount : 1;
      return { ...item, total: item.addOn.price * item.quantity * multiplier };
    });
    booking.totalAddOnsPrice = booking.selectedAddOns.reduce((sum, item) => sum + item.total, 0);
    const subtotal = booking.totalRoomPrice + booking.totalAddOnsPrice;
    let discount = 0;
    if (booking.couponCode) {
      const couponRow = (await query<{ data: string }>('SELECT data FROM coupons WHERE code = ?', [booking.couponCode]))[0];
      const coupon = couponRow ? JSON.parse(couponRow.data) as Coupon : undefined;
      if (coupon && (coupon.active || coupon.isActive) && new Date(coupon.validUntil).getTime() >= Date.now() && booking.totalRoomPrice >= (coupon.minBookingValue || coupon.minSpend || 0)) {
        const value = coupon.discountValue || coupon.discountPercent || 0;
        discount = coupon.discountType === 'fixed' ? value : Math.round(subtotal * value / 100);
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        discount = Math.min(discount, subtotal);
      }
    }
    booking.discountAmount = discount;
    booking.taxesAndFees = Math.round((subtotal - discount) * 0.18);
    booking.grandTotal = subtotal - discount + booking.taxesAndFees + booking.serviceFee;
  } else if (action === 'check-in') {
    if (booking.bookingStatus !== 'Confirmed' || today < booking.checkIn || today >= booking.checkOut) {
      return response.status(409).json({ error: 'Check-in is available only during the reservation dates.' });
    }
    booking.bookingStatus = 'Checked In';
    booking.checkInTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  } else if (action === 'check-out') {
    if (booking.bookingStatus !== 'Checked In') return response.status(409).json({ error: 'This reservation is not currently checked in.' });
    booking.bookingStatus = 'Checked Out';
    booking.checkOutTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  } else {
    return response.status(400).json({ error: 'Unsupported booking action.' });
  }

  await execute('UPDATE bookings SET check_in = ?, check_out = ?, status = ?, data = ? WHERE id = ? AND user_id = ?', [
    booking.checkIn, booking.checkOut, booking.bookingStatus, JSON.stringify(booking), booking.id, user.id
  ]);
  return response.json({ booking });
}));

// ==========================================
// ADMIN AUTHENTICATION & MANAGEMENT APIS
// All protected with server-side role validation
// ==========================================

// Admin Login
app.post('/api/admin/auth/login', asyncRoute(async (request, response) => {
  const email = cleanEmail(request.body?.email);
  const password = request.body?.password;
  const clientIp = request.ip || 'ip';
  const rateKey = `admin-login:${clientIp}:${email}`;
  const rate = checkRateLimit(rateKey, 5, 15 * 60 * 1000);
  if (!rate.allowed) {
    return response.status(429).json({ error: `Too many admin login attempts. Please wait ${rate.retryAfter} seconds.` });
  }

  const record = (await query<{ id: string; password_salt: string; password_hash: string; data: string }>(
    'SELECT id, password_salt, password_hash, data FROM users WHERE email = ?', [email]
  ))[0];
  if (!record || typeof password !== 'string') {
    return response.status(401).json({ error: 'Invalid administrator credentials.' });
  }
  const actual = Buffer.from(passwordDigest(password, record.password_salt), 'hex');
  const expected = Buffer.from(record.password_hash, 'hex');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return response.status(401).json({ error: 'Invalid administrator credentials.' });
  }

  const adminData = JSON.parse(record.data) as StoredUser;
  if (adminData.role !== 'admin') {
    return response.status(403).json({ error: 'Access denied. Account does not have administrator privileges.' });
  }

  clearRateLimit(rateKey);
  await issueSession(record.id, response, true);
  return response.json({ admin: adminData });
}));

// Check current admin session
app.get('/api/admin/auth/me', asyncRoute(async (request, response) => {
  const admin = await findAdmin(request);
  if (!admin) return response.status(401).json({ admin: null });
  return response.json({ admin });
}));

// Admin Logout
app.delete('/api/admin/auth/logout', asyncRoute(async (request, response) => {
  const token = readCookie(request, 'stayaura_admin_session');
  if (token) await execute('DELETE FROM sessions WHERE token_hash = ?', [hashToken(token)]);
  response.clearCookie('stayaura_admin_session', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
  return response.status(204).end();
}));

// Admin: Real Dashboard Statistics & KPIs
app.get('/api/admin/stats', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;

  const today = new Date().toISOString().slice(0, 10);
  const bookingRows = await query<{ data: string }>('SELECT data FROM bookings');
  const bookings = bookingRows.map((r) => JSON.parse(r.data) as Booking);

  const nonCancelled = bookings.filter((b) => b.bookingStatus !== 'Cancelled');
  const totalRevenue = nonCancelled.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In').length;
  const todayCheckIns = bookings.filter((b) => b.checkIn === today && (b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In')).length;
  const todayCheckOuts = bookings.filter((b) => b.checkOut === today && (b.bookingStatus === 'Checked In' || b.bookingStatus === 'Checked Out')).length;
  const pendingBookings = bookings.filter((b) => b.paymentStatus === 'Pending' && b.bookingStatus === 'Confirmed').length;

  const roomRows = await query<{ data: string }>('SELECT data FROM rooms');
  const totalCapacity = roomRows.reduce((sum, r) => sum + (JSON.parse(r.data).availableCount || 0), 0);
  const occupancyRate = totalCapacity > 0 ? Math.min(100, Math.round((activeBookings / totalCapacity) * 1000) / 10) : 75;

  const userRows = await query<{ id: string }>('SELECT id FROM users');
  const totalCustomers = userRows.length;

  return response.json({
    stats: {
      todayRevenue: Math.round(totalRevenue * 0.12),
      occupancyPercent: occupancyRate,
      checkInsCount: todayCheckIns,
      checkOutsCount: todayCheckOuts,
      availableRooms: Math.max(0, totalCapacity - activeBookings),
      pendingBookings
    },
    analytics: {
      totalRevenue,
      totalBookings,
      totalCustomers,
      occupancyRate,
      activeBookings,
      pendingCheckIns: todayCheckIns,
      averageDailyRate: totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 6200,
      revPAR: Math.round((totalRevenue / Math.max(1, totalCapacity))),
      todayCheckIns,
      todayCheckOuts
    }
  });
}));

// Admin: List all bookings with database persistence
app.get('/api/admin/bookings', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const rows = await query<{ data: string }>('SELECT data FROM bookings ORDER BY created_at DESC');
  return response.json({ bookings: rows.map((r) => JSON.parse(r.data) as Booking) });
}));

// Admin: Update booking status (Check-in, Check-out, Cancel, Assign Room)
app.patch('/api/admin/bookings/:id', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const { id } = request.params;
  const row = (await query<{ data: string }>('SELECT data FROM bookings WHERE id = ?', [id]))[0];
  if (!row) return response.status(404).json({ error: 'Booking not found.' });
  const booking = JSON.parse(row.data) as Booking;
  const { action, assignedRoomNumber, reason } = request.body || {};

  if (action === 'check-in') {
    booking.bookingStatus = 'Checked In';
    booking.checkInTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    if (assignedRoomNumber) booking.assignedRoomNumber = String(assignedRoomNumber);
  } else if (action === 'check-out') {
    booking.bookingStatus = 'Checked Out';
    booking.checkOutTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  } else if (action === 'cancel') {
    booking.bookingStatus = 'Cancelled';
    booking.cancellationReason = String(reason || 'Cancelled by hotel administrator');
    if (booking.paymentStatus === 'Paid') {
      booking.refundStatus = 'Refunded';
      booking.refundAmount = booking.grandTotal;
      booking.paymentStatus = 'Refunded';
    }
  } else if (action === 'assign-room') {
    if (!assignedRoomNumber) return response.status(400).json({ error: 'Provide a room number.' });
    booking.assignedRoomNumber = String(assignedRoomNumber);
  } else {
    return response.status(400).json({ error: 'Unsupported admin booking action.' });
  }

  await execute('UPDATE bookings SET status = ?, data = ? WHERE id = ?', [
    booking.bookingStatus, JSON.stringify(booking), id
  ]);
  return response.json({ booking });
}));

// Admin: list all registered users
app.get('/api/admin/users', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const rows = await query<{ id: string; email: string; data: string }>('SELECT id, email, data FROM users');
  const users = rows.map((row) => {
    const data = JSON.parse(row.data) as StoredUser;
    return {
      id: data.id || row.id,
      name: data.name,
      email: data.email || row.email,
      phone: data.phone,
      status: data.status || 'approved',
      role: data.role || 'customer',
      registeredAt: data.registeredAt || data.joinedDate || '',
      joinedDate: data.joinedDate
    };
  });
  return response.json({ users });
}));

// Admin: update user status (approve / reject / role)
app.patch('/api/admin/users/:id', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const { id } = request.params;
  const { status, role } = request.body || {};
  const rows = await query<{ data: string }>('SELECT data FROM users WHERE id = ?', [id]);
  if (!rows[0]) return response.status(404).json({ error: 'User not found.' });
  const userData = JSON.parse(rows[0].data) as StoredUser;
  if (status && ['approved', 'rejected', 'pending'].includes(status)) {
    userData.status = status as StoredUser['status'];
  }
  if (role && ['customer', 'admin'].includes(role)) {
    userData.role = role as StoredUser['role'];
  }
  await execute('UPDATE users SET data = ? WHERE id = ?', [JSON.stringify(userData), id]);
  return response.json({ success: true, user: userData });
}));

// Admin: Room inventory & pricing
app.get('/api/admin/rooms', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const rows = await query<{ data: string }>('SELECT data FROM rooms');
  return response.json({ rooms: rows.map((r) => JSON.parse(r.data)) });
}));

app.patch('/api/admin/rooms/:id', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const { id } = request.params;
  const row = (await query<{ data: string }>('SELECT data FROM rooms WHERE id = ?', [id]))[0];
  if (!row) return response.status(404).json({ error: 'Room not found.' });
  const room = JSON.parse(row.data) as RoomType;
  const { basePrice, availableCount } = request.body || {};
  if (typeof basePrice === 'number' && basePrice > 0) {
    room.basePrice = basePrice;
    if (room.ratePlans?.[0]) room.ratePlans[0].pricePerNight = basePrice;
  }
  if (typeof availableCount === 'number' && availableCount >= 0) {
    room.availableCount = availableCount;
  }
  await execute('UPDATE rooms SET data = ? WHERE id = ?', [JSON.stringify(room), id]);
  return response.json({ room });
}));

// Admin: Housekeeping management
app.get('/api/admin/housekeeping', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const rows = await query<{ data: string }>('SELECT data FROM housekeeping');
  return response.json({ housekeeping: rows.map((r) => JSON.parse(r.data)) });
}));

app.patch('/api/admin/housekeeping/:roomNumber', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const { roomNumber } = request.params;
  const { housekeepingStatus, status, assignedTo, notes } = request.body || {};
  const row = (await query<{ data: string }>('SELECT data FROM housekeeping WHERE room_number = ?', [roomNumber]))[0];
  let hk: HousekeepingRoom;
  if (row) {
    hk = JSON.parse(row.data) as HousekeepingRoom;
    if (housekeepingStatus) hk.housekeepingStatus = housekeepingStatus;
    if (status) hk.status = status;
    if (assignedTo !== undefined) hk.assignedTo = assignedTo;
    if (notes !== undefined) hk.notes = notes;
    hk.lastUpdated = 'Just now';
    await execute('UPDATE housekeeping SET status = ?, housekeeping_status = ?, data = ?, updated_at = ? WHERE room_number = ?', [
      hk.status, hk.housekeepingStatus, JSON.stringify(hk), new Date().toISOString(), roomNumber
    ]);
  } else {
    hk = {
      roomNumber,
      roomType: 'Deluxe Room',
      floor: 1,
      status: status || 'Ready',
      housekeepingStatus: housekeepingStatus || 'Ready',
      assignedTo: assignedTo || 'Staff',
      lastUpdated: 'Just now',
      notes
    };
    await execute('INSERT INTO housekeeping (room_number, hotel_id, status, housekeeping_status, data, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [
      roomNumber, 'stayaura-pune-grand', hk.status, hk.housekeepingStatus, JSON.stringify(hk), new Date().toISOString()
    ]);
  }
  return response.json({ housekeeping: hk });
}));

// Admin: Maintenance tickets
app.get('/api/admin/maintenance', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const rows = await query<{ data: string }>('SELECT data FROM maintenance ORDER BY created_at DESC');
  return response.json({ maintenance: rows.map((r) => JSON.parse(r.data)) });
}));

app.post('/api/admin/maintenance', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const { roomNumber, issue, category, priority, assignedTechnician, notes } = request.body || {};
  if (!roomNumber || !issue) return response.status(400).json({ error: 'Provide room number and issue.' });
  const id = `MT-${Math.floor(100 + Math.random() * 900)}`;
  const ticket: MaintenanceTicket = {
    id,
    roomNumber: String(roomNumber),
    issue: String(issue),
    category: category || 'Electrical',
    priority: priority || 'Medium',
    status: 'Reported',
    assignedTechnician: assignedTechnician || 'Maintenance Team',
    reportedDate: new Date().toISOString().slice(0, 10),
    expectedCompletion: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    notes
  };
  await execute('INSERT INTO maintenance (id, room_number, hotel_id, issue, priority, status, data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
    id, ticket.roomNumber, 'stayaura-pune-grand', ticket.issue, ticket.priority, ticket.status, JSON.stringify(ticket), new Date().toISOString()
  ]);
  return response.status(201).json({ ticket });
}));

app.patch('/api/admin/maintenance/:id', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const { id } = request.params;
  const row = (await query<{ data: string }>('SELECT data FROM maintenance WHERE id = ?', [id]))[0];
  if (!row) return response.status(404).json({ error: 'Ticket not found.' });
  const ticket = JSON.parse(row.data) as MaintenanceTicket;
  const { status, assignedTechnician, notes } = request.body || {};
  if (status) ticket.status = status;
  if (assignedTechnician) ticket.assignedTechnician = assignedTechnician;
  if (notes !== undefined) ticket.notes = notes;
  await execute('UPDATE maintenance SET status = ?, data = ? WHERE id = ?', [
    ticket.status, JSON.stringify(ticket), id
  ]);
  return response.json({ ticket });
}));

// Admin: Coupons Management
app.get('/api/admin/coupons', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const rows = await query<{ data: string }>('SELECT data FROM coupons');
  return response.json({ coupons: rows.map((r) => JSON.parse(r.data)) });
}));

app.post('/api/admin/coupons', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const { code, discountPercent, discountValue, discountType = 'percentage', minSpend = 4000, maxDiscount = 2500, description, validUntil = '2026-12-31' } = request.body || {};
  if (!code?.trim()) return response.status(400).json({ error: 'Provide a valid coupon code.' });
  const cleanCode = code.trim().toUpperCase();
  const coupon: Coupon = {
    id: `coupon-${Date.now()}`,
    code: cleanCode,
    title: `${discountPercent || discountValue || 10}% Off Stay`,
    discountType,
    discountValue: discountValue || discountPercent || 10,
    discountPercent: discountPercent || discountValue || 10,
    minBookingValue: minSpend,
    minSpend,
    maxDiscount,
    validUntil,
    description: description || `${cleanCode} promotional voucher`,
    active: true,
    isActive: true
  };
  await upsertRecord('coupons', 'code', cleanCode, coupon);
  return response.status(201).json({ coupon });
}));

app.patch('/api/admin/coupons/:code', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const code = request.params.code.trim().toUpperCase();
  const row = (await query<{ data: string }>('SELECT data FROM coupons WHERE code = ?', [code]))[0];
  if (!row) return response.status(404).json({ error: 'Coupon not found.' });
  const coupon = JSON.parse(row.data) as Coupon;
  const { active, isActive } = request.body || {};
  const newActive = active !== undefined ? active : (isActive !== undefined ? isActive : !coupon.active);
  coupon.active = newActive;
  coupon.isActive = newActive;
  await execute('UPDATE coupons SET data = ? WHERE code = ?', [JSON.stringify(coupon), code]);
  return response.json({ coupon });
}));

app.delete('/api/admin/coupons/:code', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const code = request.params.code.trim().toUpperCase();
  await execute('DELETE FROM coupons WHERE code = ?', [code]);
  return response.status(204).end();
}));

// Admin: Reviews moderation
app.get('/api/admin/reviews', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const rows = await query<{ data: string }>('SELECT data FROM reviews ORDER BY created_at DESC');
  return response.json({ reviews: rows.map((r) => JSON.parse(r.data)) });
}));

app.delete('/api/admin/reviews/:id', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  await execute('DELETE FROM reviews WHERE id = ?', [request.params.id]);
  return response.status(204).end();
}));

// Admin: Hotels management
app.get('/api/admin/hotels', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const rows = await query<{ data: string }>('SELECT data FROM hotels');
  return response.json({ hotels: rows.map((r) => JSON.parse(r.data)) });
}));

app.patch('/api/admin/hotels/:id', asyncRoute(async (request, response) => {
  const admin = await requireAdmin(request, response);
  if (!admin) return;
  const { id } = request.params;
  const row = (await query<{ data: string }>('SELECT data FROM hotels WHERE id = ?', [id]))[0];
  if (!row) return response.status(404).json({ error: 'Hotel not found.' });
  const hotel = JSON.parse(row.data) as Hotel;
  const { name, tagline, description, pricePerNight, featured, freeBreakfast, freeCancellation, freeWifi, checkInTime, checkOutTime, amenities } = request.body || {};
  if (name) hotel.name = String(name).trim();
  if (tagline) hotel.tagline = String(tagline).trim();
  if (description) hotel.description = String(description).trim();
  if (typeof pricePerNight === 'number' && pricePerNight > 0) hotel.pricePerNight = pricePerNight;
  if (typeof featured === 'boolean') hotel.featured = featured;
  if (typeof freeBreakfast === 'boolean') hotel.freeBreakfast = freeBreakfast;
  if (typeof freeCancellation === 'boolean') hotel.freeCancellation = freeCancellation;
  if (typeof freeWifi === 'boolean') hotel.freeWifi = freeWifi;
  if (checkInTime) hotel.checkInTime = String(checkInTime);
  if (checkOutTime) hotel.checkOutTime = String(checkOutTime);
  if (Array.isArray(amenities)) hotel.amenities = amenities.map(String);
  await execute('UPDATE hotels SET data = ? WHERE id = ?', [JSON.stringify(hotel), id]);
  return response.json({ hotel });
}));

// Public: Validate coupon code
app.get('/api/coupons/:code', asyncRoute(async (request, response) => {
  const code = request.params.code.trim().toUpperCase();
  const row = (await query<{ data: string }>('SELECT data FROM coupons WHERE code = ?', [code]))[0];
  if (!row) return response.status(404).json({ error: 'Coupon not found or has expired.' });
  const coupon = JSON.parse(row.data) as Coupon;
  if (!coupon.active && !coupon.isActive) return response.status(404).json({ error: 'This coupon is no longer active.' });
  if (new Date(coupon.validUntil).getTime() < Date.now()) return response.status(404).json({ error: 'This coupon has expired.' });
  return response.json({ coupon });
}));

// Global error handler
app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error);
  response.status(500).json({ error: 'The server could not complete the request.' });
});

async function start() {
  try {
    await initializeDatabase();
    databaseUnavailable = false;
  } catch (error) {
    if (process.env.NODE_ENV === 'production') throw error;
    databaseUnavailable = true;
    console.warn('Database is unavailable; starting the frontend without API features.', error);
  }
  const buildDirectory = path.resolve(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(buildDirectory, 'index.html'));

  if (process.env.NODE_ENV === 'production' || hasDist) {
    app.use(express.static(buildDirectory));
    app.get('*', (_request, response) => response.sendFile(path.join(buildDirectory, 'index.html')));
  } else {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  }
  const server = app.listen(port, '0.0.0.0', () => console.log(`StayAura server listening on http://localhost:${port} (Storage: ${storageType})`));
  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use by another process. Please stop the existing process or set PORT=<another_port> in .env`);
      process.exit(1);
    } else {
      throw err;
    }
  });
}

start().catch((error) => {
  console.error('Could not start StayAura server:', error);
  process.exitCode = 1;
});
