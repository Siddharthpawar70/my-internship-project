import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Hotel } from '../types';
import { INITIAL_HOTELS } from '../data/mockData';
import { apiRequest } from '../lib/api';

export interface SearchFilters {
  priceRange: [number, number];
  starRatings: number[];
  minGuestRating: number;
  hotelTypes: string[];
  roomTypes: string[];
  breakfastIncluded: boolean;
  freeCancellation: boolean;
  freeWifi: boolean;
  amenities: string[];
  propertyFacilities: string[];
  paymentOptions: string[];
}

interface SearchContextType {
  destination: string;
  setDestination: (dest: string) => void;
  checkIn: string;
  setCheckIn: (date: string) => void;
  checkOut: string;
  setCheckOut: (date: string) => void;
  adults: number;
  setAdults: (val: number) => void;
  children: number;
  setChildren: (val: number) => void;
  rooms: number;
  setRooms: (val: number) => void;
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  resetFilters: () => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  viewMode: 'grid' | 'list' | 'map';
  setViewMode: (mode: 'grid' | 'list' | 'map') => void;
  filteredHotels: Hotel[];
  allHotels: Hotel[];
  hotelsLoading: boolean;
  nightsCount: number;
}

const defaultFilters: SearchFilters = {
  priceRange: [2000, 25000],
  starRatings: [],
  minGuestRating: 0,
  hotelTypes: [],
  roomTypes: [],
  breakfastIncluded: false,
  freeCancellation: false,
  freeWifi: false,
  amenities: [],
  propertyFacilities: [],
  paymentOptions: []
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

function dateAfter(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [destination, setDestination] = useState<string>('');
  const [checkIn, setCheckIn] = useState<string>(() => dateAfter(1));
  const [checkOut, setCheckOut] = useState<string>(() => dateAfter(4));
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildren] = useState<number>(0);
  const [rooms, setRooms] = useState<number>(1);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');

  // Hotels loaded from the API, seeded with static data as immediate fallback
  const [allHotels, setAllHotels] = useState<Hotel[]>(INITIAL_HOTELS);
  const [hotelsLoading, setHotelsLoading] = useState(false);

  useEffect(() => {
    setHotelsLoading(true);
    apiRequest<Hotel[]>('/hotels')
      .then((hotels) => {
        if (hotels && hotels.length > 0) setAllHotels(hotels);
      })
      .catch(() => { /* keep using INITIAL_HOTELS fallback */ })
      .finally(() => setHotelsLoading(false));
  }, []);

  const nightsCount = useMemo(() => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  }, [checkIn, checkOut]);

  const resetFilters = () => setFilters(defaultFilters);

  const filteredHotels = useMemo(() => {
    let result = allHotels.filter((hotel) => {
      // Destination filter
      if (destination.trim()) {
        const query = destination.toLowerCase().trim();
        const matchesCity = hotel.city.toLowerCase().includes(query);
        const matchesState = hotel.state.toLowerCase().includes(query);
        const matchesName = hotel.name.toLowerCase().includes(query);
        const matchesAddress = hotel.address.toLowerCase().includes(query);
        if (!matchesCity && !matchesState && !matchesName && !matchesAddress) {
          return false;
        }
      }

      // Price filter
      if (hotel.pricePerNight < filters.priceRange[0] || hotel.pricePerNight > filters.priceRange[1]) {
        return false;
      }

      // Star rating
      if (filters.starRatings.length > 0 && !filters.starRatings.includes(hotel.starRating)) {
        return false;
      }

      // Guest rating
      if (filters.minGuestRating > 0 && hotel.guestRating < filters.minGuestRating) {
        return false;
      }

      // Hotel Type
      if (filters.hotelTypes.length > 0 && !filters.hotelTypes.includes(hotel.type)) {
        return false;
      }

      // Breakfast
      if (filters.breakfastIncluded && !hotel.freeBreakfast) {
        return false;
      }

      // Free cancellation
      if (filters.freeCancellation && !hotel.freeCancellation) {
        return false;
      }

      // Free wifi
      if (filters.freeWifi && !hotel.freeWifi) {
        return false;
      }

      // Amenities match all checked
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((a) => hotel.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.pricePerNight - b.pricePerNight;
        case 'price_desc':
          return b.pricePerNight - a.pricePerNight;
        case 'rating':
          return b.guestRating - a.guestRating;
        case 'star':
          return b.starRating - a.starRating;
        case 'recommended':
        default:
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.guestRating - a.guestRating;
      }
    });

    return result;
  }, [allHotels, destination, filters, sortBy]);

  return (
    <SearchContext.Provider
      value={{
        destination,
        setDestination,
        checkIn,
        setCheckIn,
        checkOut,
        setCheckOut,
        adults,
        setAdults,
        children: childrenCount,
        setChildren,
        rooms,
        setRooms,
        filters,
        setFilters,
        resetFilters,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        filteredHotels,
        allHotels,
        hotelsLoading,
        nightsCount
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
