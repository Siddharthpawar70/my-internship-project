import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Hotel } from '../types';
import { INITIAL_HOTELS } from '../data/mockData';
import { apiRequest } from '../lib/api';

interface WishlistContextType {
  wishlistIds: string[];
  wishlist: string[];
  wishlistHotels: Hotel[];
  toggleWishlist: (hotelId: string) => void;
  isWishlisted: (hotelId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function getStorageKey(userId?: string) {
  return userId ? `stayaura_wishlist_${userId}` : 'stayaura_wishlist_guest';
}

export function WishlistProvider({ children, userId }: { children: React.ReactNode; userId?: string }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey(userId));
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [availableHotels, setAvailableHotels] = useState<Hotel[]>(INITIAL_HOTELS);

  useEffect(() => {
    apiRequest<Hotel[]>('/hotels')
      .then((data) => {
        if (data && data.length > 0) setAvailableHotels(data);
      })
      .catch(() => {});
  }, []);

  // Reload wishlist when user changes (login/logout)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getStorageKey(userId));
      setWishlistIds(saved ? JSON.parse(saved) : []);
    } catch {
      setWishlistIds([]);
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(wishlistIds));
  }, [wishlistIds, userId]);

  const toggleWishlist = (hotelId: string) => {
    setWishlistIds((prev) =>
      prev.includes(hotelId) ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]
    );
  };

  const isWishlisted = (hotelId: string) => wishlistIds.includes(hotelId);

  const clearWishlist = () => {
    setWishlistIds([]);
  };

  const wishlistHotels = useMemo(() => {
    return availableHotels.filter((hotel) => wishlistIds.includes(hotel.id));
  }, [availableHotels, wishlistIds]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlist: wishlistIds,
        wishlistHotels,
        toggleWishlist,
        isWishlisted,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    return {
      wishlistIds: [],
      wishlist: [],
      wishlistHotels: [],
      toggleWishlist: () => {},
      isWishlisted: () => false,
      clearWishlist: () => {}
    };
  }
  return context;
}
