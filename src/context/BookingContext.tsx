import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hotel, RoomType, RatePlan, AddOn, Booking, GuestDetails, Coupon, Review } from '../types';
import { INITIAL_REVIEWS, COUPONS_LIST } from '../data/mockData';
import { apiRequest } from '../lib/api';
import { useAuth } from './AuthContext';

interface BookingDraft {
  hotel: Hotel | null;
  room: RoomType | null;
  ratePlan: RatePlan | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomsCount: number;
  adultsCount: number;
  childrenCount: number;
  selectedAddOns: { addOn: AddOn; quantity: number }[];
  guestDetails: GuestDetails;
  appliedCoupon: Coupon | null;
}

interface PriceBreakdown {
  roomTotal: number;
  addOnsTotal: number;
  subTotal: number;
  taxesAndFees: number;
  serviceFee: number;
  discount: number;
  grandTotal: number;
}

interface BookingContextType {
  draft: BookingDraft;
  updateDraft: (updates: Partial<BookingDraft>) => void;
  resetDraft: () => void;
  selectHotelAndRoom: (hotel: Hotel, room: RoomType, ratePlan?: RatePlan) => void;
  toggleAddOn: (addOn: AddOn, quantity?: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  priceBreakdown: PriceBreakdown;
  bookings: Booking[];
  createBooking: (paymentMethod: Booking['paymentMethod']) => Promise<Booking>;
  getBookingById: (id: string) => Booking | undefined;
  modifyBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
  cancelBooking: (id: string, reason: string) => Promise<void>;
  checkInGuest: (id: string) => Promise<void>;
  checkOutGuest: (id: string) => Promise<void>;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  getHotelReviews: (hotelId: string) => Review[];
}

const defaultGuestDetails: GuestDetails = {
  title: 'Mr.',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  nationality: 'Indian',
  specialRequests: [],
  otherRequests: ''
};

function dateAfter(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

const defaultDraft: BookingDraft = {
  hotel: null,
  room: null,
  ratePlan: null,
  checkIn: dateAfter(1),
  checkOut: dateAfter(4),
  nights: 3,
  roomsCount: 1,
  adultsCount: 2,
  childrenCount: 0,
  selectedAddOns: [],
  guestDetails: defaultGuestDetails,
  appliedCoupon: null
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft>(() => {
    try {
      const saved = localStorage.getItem('stayaura_booking_draft');
      if (!saved) return defaultDraft;
      const parsed = JSON.parse(saved) as BookingDraft;
      if (parsed.checkIn < dateAfter(-1) || parsed.checkOut <= parsed.checkIn) {
        return { ...parsed, checkIn: defaultDraft.checkIn, checkOut: defaultDraft.checkOut, nights: defaultDraft.nights };
      }
      return parsed;
    } catch {
      return defaultDraft;
    }
  });

  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('stayaura_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  useEffect(() => {
    localStorage.setItem('stayaura_booking_draft', JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setBookings([]);
      return;
    }
    apiRequest<Booking[]>('/bookings')
      .then((result) => { if (!cancelled) setBookings(result); })
      .catch(() => { if (!cancelled) setBookings([]); });
    return () => { cancelled = true; };
  }, [user?.id]);

  useEffect(() => {
    localStorage.setItem('stayaura_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const updateDraft = (updates: Partial<BookingDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  const resetDraft = () => {
    setDraft(defaultDraft);
  };

  const selectHotelAndRoom = (hotel: Hotel, room: RoomType, ratePlan?: RatePlan) => {
    const plan = ratePlan || room.ratePlans[0];
    setDraft((prev) => ({
      ...prev,
      hotel,
      room,
      ratePlan: plan
    }));
  };

  const toggleAddOn = (addOn: AddOn, quantity?: number) => {
    setDraft((prev) => {
      const existing = prev.selectedAddOns.find((item) => item.addOn.id === addOn.id);
      let newAddOns = [...prev.selectedAddOns];
      if (quantity === 0) {
        newAddOns = newAddOns.filter((item) => item.addOn.id !== addOn.id);
      } else if (existing) {
        if (quantity !== undefined) {
          newAddOns = newAddOns.map((item) =>
            item.addOn.id === addOn.id ? { ...item, quantity } : item
          );
        } else {
          newAddOns = newAddOns.filter((item) => item.addOn.id !== addOn.id);
        }
      } else {
        newAddOns.push({ addOn, quantity: quantity || 1 });
      }
      return { ...prev, selectedAddOns: newAddOns };
    });
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = COUPONS_LIST.find((c) => c.code === cleanCode && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    // Check minimum booking value
    const minVal = found.minBookingValue || found.minSpend || 0;
    const baseRoom = (draft.ratePlan?.pricePerNight || draft.room?.basePrice || 4999) * draft.nights * draft.roomsCount;
    if (baseRoom < minVal) {
      return {
        success: false,
        message: `This coupon requires a minimum booking value of ₹${minVal.toLocaleString('en-IN')}.`
      };
    }

    setDraft((prev) => ({ ...prev, appliedCoupon: found }));
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setDraft((prev) => ({ ...prev, appliedCoupon: null }));
  };

  // Price Calculation
  const priceBreakdown = React.useMemo<PriceBreakdown>(() => {
    const pricePerNight = draft.ratePlan?.pricePerNight || draft.room?.basePrice || 4999;
    const roomTotal = pricePerNight * (draft.nights || 1) * (draft.roomsCount || 1);

    let addOnsTotal = 0;
    draft.selectedAddOns.forEach(({ addOn, quantity }) => {
      if (addOn.priceType === 'per_night') {
        addOnsTotal += addOn.price * quantity * (draft.nights || 1);
      } else if (addOn.priceType === 'per_guest') {
        addOnsTotal += addOn.price * quantity * (draft.adultsCount + draft.childrenCount);
      } else {
        addOnsTotal += addOn.price * quantity;
      }
    });

    const subTotal = roomTotal + addOnsTotal;

    let discount = 0;
    if (draft.appliedCoupon) {
      const discVal = draft.appliedCoupon.discountValue || draft.appliedCoupon.discountPercent || 0;
      if (draft.appliedCoupon.discountType === 'fixed') {
        discount = discVal;
      } else {
        discount = Math.round((subTotal * discVal) / 100);
        if (draft.appliedCoupon.maxDiscount && discount > draft.appliedCoupon.maxDiscount) {
          discount = draft.appliedCoupon.maxDiscount;
        }
      }
    }

    // Taxes: 18% GST on room and services
    const taxesAndFees = Math.round((subTotal - discount) * 0.18);
    const serviceFee = 300;
    const grandTotal = Math.max(0, subTotal - discount + taxesAndFees + serviceFee);

    return {
      roomTotal,
      addOnsTotal,
      subTotal,
      taxesAndFees,
      serviceFee,
      discount,
      grandTotal
    };
  }, [draft]);

  const createBooking = async (paymentMethod: Booking['paymentMethod']): Promise<Booking> => {
    if (!draft.hotel || !draft.room) throw new Error('Select a hotel and room before booking.');
    const result = await apiRequest<{ booking: Booking }>('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        hotelId: draft.hotel.id,
        roomId: draft.room.id,
        ratePlanId: (draft.ratePlan || draft.room.ratePlans[0]).id,
        checkIn: draft.checkIn,
        checkOut: draft.checkOut,
        roomsCount: draft.roomsCount,
        adultsCount: draft.adultsCount,
        childrenCount: draft.childrenCount,
        guestDetails: draft.guestDetails,
        selectedAddOns: draft.selectedAddOns.map(({ addOn, quantity }) => ({ addOnId: addOn.id, quantity })),
        couponCode: draft.appliedCoupon?.code,
        paymentMethod
      })
    });
    setBookings((previous) => [result.booking, ...previous]);
    return result.booking;
  };

  const getBookingById = (id: string) => {
    return bookings.find((b) => b.id.toUpperCase() === id.toUpperCase());
  };

  const modifyBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      const result = await apiRequest<{ booking: Booking }>(`/bookings/${encodeURIComponent(id)}`, {
        method: 'PATCH', body: JSON.stringify({ action: 'modify', checkIn: updates.checkIn, checkOut: updates.checkOut })
      });
      setBookings((previous) => previous.map((booking) => booking.id === id ? result.booking : booking));
    } catch (error) {
      console.error('modifyBooking error:', error);
      throw error;
    }
  };

  const cancelBooking = async (id: string, reason: string) => {
    try {
      const result = await apiRequest<{ booking: Booking }>(`/bookings/${encodeURIComponent(id)}`, {
        method: 'PATCH', body: JSON.stringify({ action: 'cancel', reason })
      });
      setBookings((previous) => previous.map((booking) => booking.id === id ? result.booking : booking));
    } catch (error) {
      console.error('cancelBooking error:', error);
      throw error;
    }
  };

  const checkInGuest = async (id: string) => {
    try {
      const result = await apiRequest<{ booking: Booking }>(`/bookings/${encodeURIComponent(id)}`, {
        method: 'PATCH', body: JSON.stringify({ action: 'check-in' })
      });
      setBookings((previous) => previous.map((booking) => booking.id === id ? result.booking : booking));
    } catch (error) {
      console.error('checkInGuest error:', error);
      throw error;
    }
  };

  const checkOutGuest = async (id: string) => {
    try {
      const result = await apiRequest<{ booking: Booking }>(`/bookings/${encodeURIComponent(id)}`, {
        method: 'PATCH', body: JSON.stringify({ action: 'check-out' })
      });
      setBookings((previous) => previous.map((booking) => booking.id === id ? result.booking : booking));
    } catch (error) {
      console.error('checkOutGuest error:', error);
      throw error;
    }
  };

  useEffect(() => {
    apiRequest<Review[]>('/reviews')
      .then((res) => {
        if (res && res.length > 0) setReviews(res);
      })
      .catch(() => {});
  }, []);

  const addReview = async (newRev: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    try {
      const res = await apiRequest<{ review: Review }>('/reviews', {
        method: 'POST',
        body: JSON.stringify(newRev)
      });
      setReviews((prev) => [res.review, ...prev]);
    } catch {
      const rev: Review = {
        ...newRev,
        id: `rev-${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        helpfulCount: 0
      };
      setReviews((prev) => [rev, ...prev]);
    }
  };

  const getHotelReviews = (hotelId: string) => {
    return reviews.filter((r) => r.hotelId === hotelId);
  };

  return (
    <BookingContext.Provider
      value={{
        draft,
        updateDraft,
        resetDraft,
        selectHotelAndRoom,
        toggleAddOn,
        applyCoupon,
        removeCoupon,
        priceBreakdown,
        bookings,
        createBooking,
        getBookingById,
        modifyBooking,
        cancelBooking,
        checkInGuest,
        checkOutGuest,
        reviews,
        addReview,
        getHotelReviews
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
