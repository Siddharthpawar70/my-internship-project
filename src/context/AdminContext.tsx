import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Hotel, RoomType, HousekeepingRoom, MaintenanceTicket, Coupon, GroupQuoteRequest, Booking, Review, AdminSettings } from '../types';
import { INITIAL_HOTELS, INITIAL_ROOMS, INITIAL_HOUSEKEEPING, INITIAL_MAINTENANCE, COUPONS_LIST, INITIAL_GROUP_QUOTES, INITIAL_BOOKINGS } from '../data/mockData';
import { apiRequest } from '../lib/api';
import { UserProfile } from './AuthContext';
import { getStoredUsers, saveStoredUsers } from '../lib/userStore';

export interface AdminStats {
  todayRevenue: number;
  occupancyPercent: number;
  checkInsCount: number;
  checkOutsCount: number;
  availableRooms: number;
  pendingBookings: number;
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalBookings: number;
  totalCustomers: number;
  occupancyRate: number;
  activeBookings: number;
  pendingCheckIns: number;
  averageDailyRate: number;
  revPAR: number;
  todayCheckIns: number;
  todayCheckOuts: number;
}

export interface AdminRoomItem {
  roomId: string;
  hotelId: string;
  hotelName: string;
  roomName: string;
  totalRooms: number;
  availableRooms: number;
  pricePerNight: number;
  isAvailable: boolean;
}

export interface AdminMaintenanceItem {
  id: string;
  roomNumber: string;
  hotelName: string;
  status: 'Clean & Ready' | 'Cleaning in Progress' | 'Maintenance Required';
  notes: string;
  lastCleaned: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  role?: string;
  registeredAt: string;
  joinedDate?: string;
  lastLogin?: string;
}

interface AdminContextType {
  // Admin Authentication
  adminUser: UserProfile | null;
  isAdminAuthenticated: boolean;
  isAdminLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;

  // Hotels & Rooms
  hotels: Hotel[];
  updateHotel: (id: string, updates: Partial<Hotel>) => Promise<void> | void;
  rooms: RoomType[];
  updateRoom: (id: string, updates: Partial<RoomType>) => void;
  updateInventory: (roomId: string, date: string, count: number) => void;
  roomInventory: AdminRoomItem[];
  toggleRoomAvailability: (roomId: string) => void;
  updateRoomPrice: (roomId: string, newPrice: number) => void;

  // Bookings (Real Database)
  adminBookings: Booking[];
  adminCheckIn: (bookingId: string, assignedRoom?: string) => Promise<void>;
  adminCheckOut: (bookingId: string) => Promise<void>;
  adminCancelBooking: (bookingId: string, reason?: string) => Promise<void>;
  adminAssignRoom: (bookingId: string, roomNumber: string) => Promise<void>;

  // Users Management
  registeredUsers: AdminUser[];
  usersLoading: boolean;
  updateUserStatus: (userId: string, status: string) => Promise<void>;
  updateUserRole: (userId: string, role: string) => Promise<void>;

  // Housekeeping & Maintenance
  housekeeping: HousekeepingRoom[];
  updateHousekeepingStatus: (roomNumber: string, status: HousekeepingRoom['housekeepingStatus']) => void;
  maintenanceTickets: MaintenanceTicket[];
  addMaintenanceTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'reportedDate'>) => void;
  updateMaintenanceStatus: (id: string, status: AdminMaintenanceItem['status'] | MaintenanceTicket['status']) => void;
  maintenanceList: AdminMaintenanceItem[];

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;
  toggleCoupon: (codeOrId: string) => void;

  // Reviews Moderation
  adminReviews: Review[];
  deleteReview: (reviewId: string) => Promise<void>;

  // Group Quotes & Analytics
  groupQuotes: GroupQuoteRequest[];
  updateQuoteStatus: (id: string, status: GroupQuoteRequest['status']) => void;
  stats: AdminStats;
  analytics: AdminAnalytics;
  refreshData: () => Promise<void>;

  // System Settings
  adminSettings: AdminSettings;
  settingsLoading: boolean;
  updateAdminSettings: (updates: Partial<AdminSettings>) => Promise<void>;
}

const defaultStats: AdminStats = {
  todayRevenue: 124500,
  occupancyPercent: 82,
  checkInsCount: 14,
  checkOutsCount: 9,
  availableRooms: 36,
  pendingBookings: 5
};

const defaultAnalytics: AdminAnalytics = {
  totalRevenue: 2845000,
  totalBookings: 148,
  totalCustomers: 124,
  occupancyRate: 82,
  activeBookings: 19,
  pendingCheckIns: 14,
  averageDailyRate: 18500,
  revPAR: 15170,
  todayCheckIns: 14,
  todayCheckOuts: 9
};

const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user_1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98201 12345',
    status: 'approved',
    role: 'customer',
    registeredAt: '2026-02-15',
    joinedDate: '2026-02-15'
  },
  {
    id: 'user_2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 98302 23456',
    status: 'approved',
    role: 'customer',
    registeredAt: '2026-03-01',
    joinedDate: '2026-03-01'
  },
  {
    id: 'user_3',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    phone: '+91 98403 34567',
    status: 'pending',
    role: 'customer',
    registeredAt: '2026-03-10',
    joinedDate: '2026-03-10'
  },
  {
    id: 'user_4',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@example.com',
    phone: '+91 98504 45678',
    status: 'approved',
    role: 'customer',
    registeredAt: '2026-03-12',
    joinedDate: '2026-03-12'
  }
];

const initialAdminMaintenance: AdminMaintenanceItem[] = [
  { id: 'm-1', roomNumber: '304', hotelName: 'The Grand Aurum & Spa', status: 'Clean & Ready', notes: 'Deep cleaned, fresh linens and minibar restocked.', lastCleaned: '10 mins ago' },
  { id: 'm-2', roomNumber: '412', hotelName: 'The Marine Sovereign Mumbai', status: 'Cleaning in Progress', notes: 'Turn-down service and balcony glass scrubbing.', lastCleaned: 'In progress' },
  { id: 'm-3', roomNumber: '208', hotelName: 'Aura Azura Coastal Sanctuary', status: 'Maintenance Required', notes: 'Air conditioner filter check & sensor calibration.', lastCleaned: 'Yesterday' },
  { id: 'm-4', roomNumber: '501', hotelName: 'Palacio de Aura Lake Palace', status: 'Clean & Ready', notes: 'Executive suite sanitized and inspected by head housekeeper.', lastCleaned: '1 hour ago' },
  { id: 'm-5', roomNumber: '102', hotelName: 'Aura Pinecrest Alpine Chalet', status: 'Cleaning in Progress', notes: 'Post-checkout sanitation & bathroom marble polishing.', lastCleaned: '25 mins ago' }
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<UserProfile | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  const [hotels, setHotels] = useState<Hotel[]>(INITIAL_HOTELS);
  const [rooms, setRooms] = useState<RoomType[]>(INITIAL_ROOMS);
  const [adminBookings, setAdminBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [registeredUsers, setRegisteredUsers] = useState<AdminUser[]>(getStoredUsers);
  const [usersLoading, setUsersLoading] = useState(false);
  const [adminReviews, setAdminReviews] = useState<Review[]>([]);

  // Cross-tab & local storage synchronization for registered users
  useEffect(() => {
    const handleSync = () => {
      setRegisteredUsers(getStoredUsers());
    };
    window.addEventListener('stayaura_users_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('stayaura_users_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const [housekeeping, setHousekeeping] = useState<HousekeepingRoom[]>(INITIAL_HOUSEKEEPING);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(INITIAL_MAINTENANCE);
  const [maintenanceList, setMaintenanceList] = useState<AdminMaintenanceItem[]>(initialAdminMaintenance);
  const [coupons, setCoupons] = useState<Coupon[]>(COUPONS_LIST);
  const [groupQuotes, setGroupQuotes] = useState<GroupQuoteRequest[]>(INITIAL_GROUP_QUOTES);

  const [stats, setStats] = useState<AdminStats>(defaultStats);
  const [analytics, setAnalytics] = useState<AdminAnalytics>(defaultAnalytics);

  const [roomAvailabilityOverrides, setRoomAvailabilityOverrides] = useState<Record<string, boolean>>({});
  const [roomPriceOverrides, setRoomPriceOverrides] = useState<Record<string, number>>({});

  const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
    hotelName: 'StayAura Hotel',
    tagline: 'Where Luxury Meets Comfort',
    supportEmail: 'support@stayaura.com',
    supportPhone: '+91 98765 43210',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411001',
    currency: 'INR',
    currencySymbol: '₹',
    timezone: 'Asia/Kolkata',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cancellationWindowHours: 24,
    gstRatePercent: 18,
    serviceChargePercent: 0,
    autoApproveBookings: true,
    enableUpiPayment: true,
    enablePayAtHotel: true,
    enableCardPayment: false,
    youpiMerchantId: '00000000-0000-0000-0000-000000000001',
    youpiApiUrl: 'http://localhost:6100',
    youpiCheckoutUrl: 'http://localhost:7000',
    youpiWebhookSecret: '',
    allowGuestReviews: true,
    adminNotificationEmail: 'admin@stayaura.com'
  };
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Verify admin session on mount
  useEffect(() => {
    apiRequest<{ admin: UserProfile | null }>('/admin/auth/me')
      .then(({ admin }) => {
        setAdminUser(admin);
      })
      .catch(() => {
        try {
          const saved = sessionStorage.getItem('stayaura_admin_demo');
          if (saved) {
            setAdminUser(JSON.parse(saved));
          } else {
            setAdminUser(null);
          }
        } catch {
          setAdminUser(null);
        }
      })
      .finally(() => setIsAdminLoading(false));
  }, []);

  const refreshData = useCallback(async () => {
    if (!adminUser) return;
    try {
      // 1. Fetch real stats and analytics
      const statsRes = await apiRequest<{ stats: AdminStats; analytics: AdminAnalytics }>('/admin/stats').catch(() => null);
      if (statsRes) {
        setStats(statsRes.stats);
        setAnalytics(statsRes.analytics);
      }

      // 2. Fetch real bookings from DB
      const bookingsRes = await apiRequest<{ bookings: Booking[] }>('/admin/bookings').catch(() => null);
      if (bookingsRes?.bookings) {
        setAdminBookings(bookingsRes.bookings);
      }

      // 3. Fetch real users from DB (or sync with client registry)
      setUsersLoading(true);
      try {
        const usersRes = await apiRequest<{ users: AdminUser[] }>('/admin/users');
        if (usersRes?.users && usersRes.users.length > 0) {
          setRegisteredUsers(usersRes.users);
          saveStoredUsers(usersRes.users);
        } else {
          setRegisteredUsers(getStoredUsers());
        }
      } catch {
        // When backend endpoint is unavailable (e.g. static hosting on Vercel), load stored users
        setRegisteredUsers(getStoredUsers());
      } finally {
        setUsersLoading(false);
      }

      // 4. Fetch real rooms from DB
      const roomsRes = await apiRequest<{ rooms: RoomType[] }>('/admin/rooms').catch(() => null);
      if (roomsRes?.rooms && roomsRes.rooms.length > 0) {
        setRooms(roomsRes.rooms);
      }

      // Fetch real hotels from DB
      const hotelsRes = await apiRequest<{ hotels: Hotel[] }>('/admin/hotels').catch(() => null);
      if (hotelsRes?.hotels && hotelsRes.hotels.length > 0) {
        setHotels(hotelsRes.hotels);
      }

      // 5. Fetch housekeeping
      const hkRes = await apiRequest<{ housekeeping: HousekeepingRoom[] }>('/admin/housekeeping').catch(() => null);
      if (hkRes?.housekeeping && hkRes.housekeeping.length > 0) {
        setHousekeeping(hkRes.housekeeping);
      }

      // 6. Fetch maintenance
      const mtRes = await apiRequest<{ maintenance: MaintenanceTicket[] }>('/admin/maintenance').catch(() => null);
      if (mtRes?.maintenance && mtRes.maintenance.length > 0) {
        setMaintenanceTickets(mtRes.maintenance);
      }

      // 7. Fetch coupons
      const cpnRes = await apiRequest<{ coupons: Coupon[] }>('/admin/coupons').catch(() => null);
      if (cpnRes?.coupons && cpnRes.coupons.length > 0) {
        setCoupons(cpnRes.coupons);
      }

      // 8. Fetch reviews
      const revRes = await apiRequest<{ reviews: Review[] }>('/admin/reviews').catch(() => null);
      if (revRes?.reviews) {
        setAdminReviews(revRes.reviews);
      }

      // 9. Fetch settings
      const settingsRes = await apiRequest<{ settings: AdminSettings }>('/admin/settings').catch(() => null);
      if (settingsRes?.settings) {
        setAdminSettings(settingsRes.settings);
      }
    } catch (e) {
      console.warn('Could not refresh admin data', e);
    }
  }, [adminUser]);

  useEffect(() => {
    if (adminUser) {
      refreshData();
    }
  }, [adminUser, refreshData]);

  const adminLogin = async (email: string, password: string) => {
    try {
      const res = await apiRequest<{ admin: UserProfile }>('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setAdminUser(res.admin);
      await refreshData();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err || '');
      const isEndpointUnavailable =
        errMsg.includes('405') ||
        errMsg.includes('404') ||
        errMsg.includes('Failed to fetch') ||
        errMsg.includes('NetworkError') ||
        errMsg.includes('Load failed');

      // Seamless fallback for static hosting/previews without a running backend
      if (isEndpointUnavailable) {
        const cleanEmail = email.trim().toLowerCase();
        if (cleanEmail === 'admin@stayaura.com' && password === 'Admin@StayAura2026!') {
          const fallbackAdmin: UserProfile = {
            id: 'admin_master',
            name: 'StayAura Operations Admin',
            email: 'admin@stayaura.com',
            phone: '+91 98765 43210',
            city: 'Mumbai',
            loyaltyTier: 'Platinum',
            loyaltyPoints: 100000,
            joinedDate: '2026-01-01',
            status: 'approved',
            role: 'admin'
          };
          setAdminUser(fallbackAdmin);
          try {
            sessionStorage.setItem('stayaura_admin_demo', JSON.stringify(fallbackAdmin));
          } catch {}
          await refreshData();
          return;
        } else {
          throw new Error('Invalid administrator credentials.');
        }
      }
      throw err;
    }
  };

  const adminLogout = async () => {
    try {
      sessionStorage.removeItem('stayaura_admin_demo');
    } catch {}
    await apiRequest<void>('/admin/auth/logout', { method: 'DELETE' }).catch(() => {});
    setAdminUser(null);
    setAdminBookings(INITIAL_BOOKINGS);
    setRegisteredUsers(getStoredUsers());
    setAdminReviews([]);
    setCoupons(COUPONS_LIST);
    setStats(defaultStats);
    setAnalytics(defaultAnalytics);
    setHousekeeping(INITIAL_HOUSEKEEPING);
    setMaintenanceTickets(INITIAL_MAINTENANCE);
  };

  const adminCheckIn = async (bookingId: string, assignedRoom?: string) => {
    try {
      const res = await apiRequest<{ booking: Booking }>(`/admin/bookings/${encodeURIComponent(bookingId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'check-in', assignedRoomNumber: assignedRoom })
      });
      setAdminBookings((prev) => prev.map((b) => b.id === bookingId ? res.booking : b));
      await refreshData();
    } catch {
      setAdminBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, bookingStatus: 'Checked In', assignedRoomNumber: assignedRoom || b.assignedRoomNumber || '101' }
            : b
        )
      );
    }
  };

  const adminCheckOut = async (bookingId: string) => {
    try {
      const res = await apiRequest<{ booking: Booking }>(`/admin/bookings/${encodeURIComponent(bookingId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'check-out' })
      });
      setAdminBookings((prev) => prev.map((b) => b.id === bookingId ? res.booking : b));
      await refreshData();
    } catch {
      setAdminBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, bookingStatus: 'Checked Out' }
            : b
        )
      );
    }
  };

  const adminCancelBooking = async (bookingId: string, reason?: string) => {
    try {
      const res = await apiRequest<{ booking: Booking }>(`/admin/bookings/${encodeURIComponent(bookingId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'cancel', reason })
      });
      setAdminBookings((prev) => prev.map((b) => b.id === bookingId ? res.booking : b));
      await refreshData();
    } catch {
      setAdminBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, bookingStatus: 'Cancelled', cancellationReason: reason }
            : b
        )
      );
    }
  };

  const adminAssignRoom = async (bookingId: string, roomNumber: string) => {
    try {
      const res = await apiRequest<{ booking: Booking }>(`/admin/bookings/${encodeURIComponent(bookingId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'assign-room', assignedRoomNumber: roomNumber })
      });
      setAdminBookings((prev) => prev.map((b) => b.id === bookingId ? res.booking : b));
    } catch {
      setAdminBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, assignedRoomNumber: roomNumber }
            : b
        )
      );
    }
  };

  const updateUserStatus = async (userId: string, status: string) => {
    setRegisteredUsers((prev) => {
      const updated = prev.map((u) => u.id === userId ? { ...u, status } : u);
      saveStoredUsers(updated);
      return updated;
    });
    await apiRequest<{ success: boolean }>(`/admin/users/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }).catch(() => {});
  };

  const updateUserRole = async (userId: string, role: string) => {
    setRegisteredUsers((prev) => {
      const updated = prev.map((u) => u.id === userId ? { ...u, role } : u);
      saveStoredUsers(updated);
      return updated;
    });
    await apiRequest<{ success: boolean }>(`/admin/users/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    }).catch(() => {});
  };

  const updateHotel = async (id: string, updates: Partial<Hotel>) => {
    setHotels((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
    if (adminUser) {
      await apiRequest<{ hotel: Hotel }>(`/admin/hotels/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      }).catch(() => {});
    }
  };

  const updateRoom = async (id: string, updates: Partial<RoomType>) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    if (adminUser) {
      await apiRequest<{ room: RoomType }>(`/admin/rooms/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      }).catch(() => {});
    }
  };

  const updateInventory = (roomId: string, date: string, count: number) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const inv = { ...(r.inventoryByDate || {}), [date]: count };
          return { ...r, inventoryByDate: inv };
        }
        return r;
      })
    );
  };

  const toggleRoomAvailability = (roomId: string) => {
    setRoomAvailabilityOverrides((prev) => {
      const current = prev[roomId] !== undefined ? prev[roomId] : true;
      return { ...prev, [roomId]: !current };
    });
  };

  const updateRoomPrice = async (roomId: string, newPrice: number) => {
    setRoomPriceOverrides((prev) => ({ ...prev, [roomId]: newPrice }));
    await updateRoom(roomId, { basePrice: newPrice });
  };

  const roomInventory: AdminRoomItem[] = rooms.map((r) => {
    const hotel = hotels.find((h) => h.id === r.hotelId);
    const isAvail = roomAvailabilityOverrides[r.id] !== undefined ? roomAvailabilityOverrides[r.id] : r.availableCount > 0;
    const price = roomPriceOverrides[r.id] !== undefined ? roomPriceOverrides[r.id] : r.basePrice;
    return {
      roomId: r.id,
      hotelId: r.hotelId,
      hotelName: hotel?.name || 'StayAura Hotel',
      roomName: r.name,
      totalRooms: r.availableCount,
      availableRooms: isAvail ? r.availableCount : 0,
      pricePerNight: price,
      isAvailable: isAvail
    };
  });

  const updateHousekeepingStatus = async (roomNumber: string, status: HousekeepingRoom['housekeepingStatus']) => {
    setHousekeeping((prev) =>
      prev.map((item) => {
        if (item.roomNumber === roomNumber) {
          let generalStatus: HousekeepingRoom['status'] = item.status;
          if (status === 'Ready') generalStatus = 'Ready';
          if (status === 'Dirty') generalStatus = 'Dirty';
          if (status === 'Cleaning') generalStatus = 'Cleaning';
          return { ...item, housekeepingStatus: status, status: generalStatus, lastUpdated: 'Just now' };
        }
        return item;
      })
    );
    if (adminUser) {
      await apiRequest(`/admin/housekeeping/${encodeURIComponent(roomNumber)}`, {
        method: 'PATCH',
        body: JSON.stringify({ housekeepingStatus: status })
      }).catch(() => {});
    }
  };

  const addMaintenanceTicket = async (ticket: Omit<MaintenanceTicket, 'id' | 'reportedDate'>) => {
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `MT-${Math.floor(100 + Math.random() * 900)}`,
      reportedDate: new Date().toISOString().split('T')[0]
    };
    setMaintenanceTickets((prev) => [newTicket, ...prev]);
    if (adminUser) {
      await apiRequest('/admin/maintenance', {
        method: 'POST',
        body: JSON.stringify(ticket)
      }).catch(() => {});
    }
  };

  const updateMaintenanceStatus = async (id: string, status: AdminMaintenanceItem['status'] | MaintenanceTicket['status']) => {
    setMaintenanceList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: status as AdminMaintenanceItem['status'], lastCleaned: 'Just now' } : m))
    );
    setMaintenanceTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: status as MaintenanceTicket['status'] } : t))
    );
    if (adminUser) {
      await apiRequest(`/admin/maintenance/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }).catch(() => {});
    }
  };

  const addCoupon = async (coupon: Coupon) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: coupon.id || `coupon-${Date.now()}`,
      active: coupon.active !== undefined ? coupon.active : (coupon.isActive !== undefined ? coupon.isActive : true),
      isActive: coupon.isActive !== undefined ? coupon.isActive : (coupon.active !== undefined ? coupon.active : true),
      discountValue: coupon.discountValue || coupon.discountPercent || 10,
      discountPercent: coupon.discountPercent || coupon.discountValue || 10,
      minBookingValue: coupon.minBookingValue || coupon.minSpend || 4000,
      minSpend: coupon.minSpend || coupon.minBookingValue || 4000,
      maxDiscount: coupon.maxDiscount || 2500
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    if (adminUser) {
      await apiRequest('/admin/coupons', {
        method: 'POST',
        body: JSON.stringify(newCoupon)
      }).catch(() => {});
    }
  };

  const deleteCoupon = async (codeOrId: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== codeOrId && c.code !== codeOrId));
    if (adminUser) {
      await apiRequest(`/admin/coupons/${encodeURIComponent(codeOrId)}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const toggleCouponActive = async (codeOrId: string) => {
    const target = coupons.find((c) => c.id === codeOrId || c.code === codeOrId);
    const nextState = target ? !(target.active ?? target.isActive) : true;
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === codeOrId || c.code === codeOrId) {
          return { ...c, active: nextState, isActive: nextState };
        }
        return c;
      })
    );
    if (adminUser && target) {
      await apiRequest(`/admin/coupons/${encodeURIComponent(target.code)}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: nextState })
      }).catch(() => {});
    }
  };

  const toggleCoupon = (codeOrId: string) => {
    toggleCouponActive(codeOrId);
  };

  const deleteReview = async (reviewId: string) => {
    setAdminReviews((prev) => prev.filter((r) => r.id !== reviewId));
    if (adminUser) {
      await apiRequest(`/admin/reviews/${encodeURIComponent(reviewId)}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const updateQuoteStatus = (id: string, status: GroupQuoteRequest['status']) => {
    setGroupQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
  };

  const updateAdminSettings = async (updates: Partial<AdminSettings>) => {
    const optimistic = { ...adminSettings, ...updates };
    setAdminSettings(optimistic);
    setSettingsLoading(true);
    try {
      const res = await apiRequest<{ settings: AdminSettings }>('/admin/settings', {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      if (res?.settings) setAdminSettings(res.settings);
    } catch {
      // keep optimistic update on error
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        isAdminAuthenticated: !!adminUser,
        isAdminLoading,
        adminLogin,
        adminLogout,
        hotels,
        updateHotel,
        rooms,
        updateRoom,
        updateInventory,
        roomInventory,
        toggleRoomAvailability,
        updateRoomPrice,
        adminBookings,
        adminCheckIn,
        adminCheckOut,
        adminCancelBooking,
        adminAssignRoom,
        registeredUsers,
        usersLoading,
        updateUserStatus,
        updateUserRole,
        housekeeping,
        updateHousekeepingStatus,
        maintenanceTickets,
        addMaintenanceTicket,
        updateMaintenanceStatus,
        maintenanceList,
        coupons,
        addCoupon,
        deleteCoupon,
        toggleCouponActive,
        toggleCoupon,
        adminReviews,
        deleteReview,
        groupQuotes,
        updateQuoteStatus,
        stats,
        analytics,
        refreshData,
        adminSettings,
        settingsLoading,
        updateAdminSettings
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
