import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Hotel, RoomType, HousekeepingRoom, MaintenanceTicket, Coupon, GroupQuoteRequest, Booking, Review } from '../types';
import { INITIAL_HOTELS, INITIAL_ROOMS, INITIAL_HOUSEKEEPING, INITIAL_MAINTENANCE, COUPONS_LIST, INITIAL_GROUP_QUOTES } from '../data/mockData';
import { apiRequest } from '../lib/api';
import { UserProfile } from './AuthContext';

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
}

const defaultStats: AdminStats = {
  todayRevenue: 0,
  occupancyPercent: 0,
  checkInsCount: 0,
  checkOutsCount: 0,
  availableRooms: 0,
  pendingBookings: 0
};

const defaultAnalytics: AdminAnalytics = {
  totalRevenue: 0,
  totalBookings: 0,
  totalCustomers: 0,
  occupancyRate: 0,
  activeBookings: 0,
  pendingCheckIns: 0,
  averageDailyRate: 0,
  revPAR: 0,
  todayCheckIns: 0,
  todayCheckOuts: 0
};

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
  const [adminBookings, setAdminBookings] = useState<Booking[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [adminReviews, setAdminReviews] = useState<Review[]>([]);

  const [housekeeping, setHousekeeping] = useState<HousekeepingRoom[]>(INITIAL_HOUSEKEEPING);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(INITIAL_MAINTENANCE);
  const [maintenanceList, setMaintenanceList] = useState<AdminMaintenanceItem[]>(initialAdminMaintenance);
  const [coupons, setCoupons] = useState<Coupon[]>(COUPONS_LIST);
  const [groupQuotes, setGroupQuotes] = useState<GroupQuoteRequest[]>(INITIAL_GROUP_QUOTES);

  const [stats, setStats] = useState<AdminStats>(defaultStats);
  const [analytics, setAnalytics] = useState<AdminAnalytics>(defaultAnalytics);

  const [roomAvailabilityOverrides, setRoomAvailabilityOverrides] = useState<Record<string, boolean>>({});
  const [roomPriceOverrides, setRoomPriceOverrides] = useState<Record<string, number>>({});

  // Verify admin session on mount
  useEffect(() => {
    apiRequest<{ admin: UserProfile | null }>('/admin/auth/me')
      .then(({ admin }) => {
        setAdminUser(admin);
      })
      .catch(() => setAdminUser(null))
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

      // 3. Fetch real users from DB
      setUsersLoading(true);
      const usersRes = await apiRequest<{ users: AdminUser[] }>('/admin/users').catch(() => null);
      if (usersRes?.users) {
        setRegisteredUsers(usersRes.users);
      }
      setUsersLoading(false);

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
    const res = await apiRequest<{ admin: UserProfile }>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setAdminUser(res.admin);
    await refreshData();
  };

  const adminLogout = async () => {
    await apiRequest<void>('/admin/auth/logout', { method: 'DELETE' }).catch(() => {});
    setAdminUser(null);
    setAdminBookings([]);
    setRegisteredUsers([]);
    setAdminReviews([]);
    setCoupons(COUPONS_LIST);
    setStats(defaultStats);
    setAnalytics(defaultAnalytics);
    setHousekeeping(INITIAL_HOUSEKEEPING);
    setMaintenanceTickets(INITIAL_MAINTENANCE);
  };

  const adminCheckIn = async (bookingId: string, assignedRoom?: string) => {
    const res = await apiRequest<{ booking: Booking }>(`/admin/bookings/${encodeURIComponent(bookingId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'check-in', assignedRoomNumber: assignedRoom })
    });
    setAdminBookings((prev) => prev.map((b) => b.id === bookingId ? res.booking : b));
    await refreshData();
  };

  const adminCheckOut = async (bookingId: string) => {
    const res = await apiRequest<{ booking: Booking }>(`/admin/bookings/${encodeURIComponent(bookingId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'check-out' })
    });
    setAdminBookings((prev) => prev.map((b) => b.id === bookingId ? res.booking : b));
    await refreshData();
  };

  const adminCancelBooking = async (bookingId: string, reason?: string) => {
    const res = await apiRequest<{ booking: Booking }>(`/admin/bookings/${encodeURIComponent(bookingId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'cancel', reason })
    });
    setAdminBookings((prev) => prev.map((b) => b.id === bookingId ? res.booking : b));
    await refreshData();
  };

  const adminAssignRoom = async (bookingId: string, roomNumber: string) => {
    const res = await apiRequest<{ booking: Booking }>(`/admin/bookings/${encodeURIComponent(bookingId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'assign-room', assignedRoomNumber: roomNumber })
    });
    setAdminBookings((prev) => prev.map((b) => b.id === bookingId ? res.booking : b));
  };

  const updateUserStatus = async (userId: string, status: string) => {
    await apiRequest<{ success: boolean }>(`/admin/users/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    setRegisteredUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status } : u));
  };

  const updateUserRole = async (userId: string, role: string) => {
    await apiRequest<{ success: boolean }>(`/admin/users/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
    setRegisteredUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
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
        refreshData
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
