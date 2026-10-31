import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, ChevronDown, Plus, Minus, X } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import { DESTINATIONS } from '../../data/mockData';

interface SearchBoxProps {
  variant?: 'hero' | 'compact';
}

export function SearchBox({ variant = 'hero' }: SearchBoxProps) {
  const {
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
    nightsCount
  } = useSearch();

  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const guestRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
        setGuestDropdownOpen(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setDestDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/hotels');
  };

  const isHero = variant === 'hero';

  return (
    <div
      className={`w-full ${
        isHero
          ? 'bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/40'
          : 'bg-white rounded-2xl p-3 shadow-md border border-gray-200'
      }`}
    >
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Destination Input */}
        <div className={`relative ${isHero ? 'md:col-span-4' : 'md:col-span-4'}`} ref={destRef}>
          <label className="block text-[11px] font-bold tracking-wider uppercase text-gray-500 mb-1 ml-1">
            Destination
          </label>
          <div
            onClick={() => setDestDropdownOpen(true)}
            className="flex items-center gap-3 px-3.5 py-3 rounded-2xl border border-gray-200 hover:border-[#C5A880] focus-within:border-[#C5A880] bg-[#FAF9F6]/80 cursor-pointer transition-colors"
          >
            <MapPin className="w-5 h-5 text-[#C5A880] shrink-0" />
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setDestDropdownOpen(true);
              }}
              onFocus={() => setDestDropdownOpen(true)}
              placeholder="Pune, Mumbai, Goa, Udaipur..."
              className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none placeholder-gray-400"
            />
            {destination && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDestination('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Destination Suggestions Dropdown */}
          {destDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in duration-150 max-h-72 overflow-y-auto">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-2">
                Popular Indian Destinations
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {DESTINATIONS.map((d) => (
                  <button
                    type="button"
                    key={d.name}
                    onClick={() => {
                      setDestination(d.name);
                      setDestDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#FAF6F0] text-left transition-colors"
                  >
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900">{d.name}</p>
                      <p className="text-[10px] text-gray-500">{d.hotelCount} Stays</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Check-In / Check-Out Dates */}
        <div className={`grid grid-cols-2 gap-2 ${isHero ? 'md:col-span-4' : 'md:col-span-4'}`}>
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-gray-500 mb-1 ml-1">
              Check-in
            </label>
            <div className="flex items-center gap-2 px-3 py-3 rounded-2xl border border-gray-200 hover:border-[#C5A880] focus-within:border-[#C5A880] bg-[#FAF9F6]/80 transition-colors">
              <Calendar className="w-4 h-4 text-[#C5A880] shrink-0" />
              <input
                type="date"
                value={checkIn}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => {
                  const val = e.target.value;
                  setCheckIn(val);
                  if (checkOut <= val) {
                    const nextDay = new Date(val);
                    nextDay.setDate(nextDay.getDate() + 1);
                    setCheckOut(nextDay.toISOString().slice(0, 10));
                  }
                }}
                className="w-full bg-transparent text-xs font-semibold text-gray-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-gray-500 mb-1 ml-1 flex items-center justify-between">
              <span>Check-out</span>
              <span className="text-[10px] text-[#C5A880] font-normal lowercase">({nightsCount} nts)</span>
            </label>
            <div className="flex items-center gap-2 px-3 py-3 rounded-2xl border border-gray-200 hover:border-[#C5A880] focus-within:border-[#C5A880] bg-[#FAF9F6]/80 transition-colors">
              <Calendar className="w-4 h-4 text-[#C5A880] shrink-0" />
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-gray-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Guests & Room Selector */}
        <div className={`relative ${isHero ? 'md:col-span-2' : 'md:col-span-2'}`} ref={guestRef}>
          <label className="block text-[11px] font-bold tracking-wider uppercase text-gray-500 mb-1 ml-1">
            Guests & Rooms
          </label>
          <button
            type="button"
            onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-3 rounded-2xl border border-gray-200 hover:border-[#C5A880] bg-[#FAF9F6]/80 text-left transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <Users className="w-4 h-4 text-[#C5A880] shrink-0" />
              <div className="truncate">
                <p className="text-xs font-semibold text-gray-900 truncate">
                  {adults + childrenCount} Guests
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  {rooms} Room{rooms > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
          </button>

          {/* Guest Count Dropdown */}
          {guestDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in duration-150 space-y-4">
              
              {/* Rooms */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">Rooms</p>
                  <p className="text-[10px] text-gray-500">Max 8 rooms</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={rooms <= 1}
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold">{rooms}</span>
                  <button
                    type="button"
                    disabled={rooms >= 8}
                    onClick={() => setRooms(rooms + 1)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">Adults</p>
                  <p className="text-[10px] text-gray-500">Age 13+</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={adults <= 1}
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold">{adults}</span>
                  <button
                    type="button"
                    disabled={adults >= 16}
                    onClick={() => setAdults(adults + 1)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">Children</p>
                  <p className="text-[10px] text-gray-500">Ages 0 - 12</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={childrenCount <= 0}
                    onClick={() => setChildren(Math.max(0, childrenCount - 1))}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold">{childrenCount}</span>
                  <button
                    type="button"
                    disabled={childrenCount >= 10}
                    onClick={() => setChildren(childrenCount + 1)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setGuestDropdownOpen(false)}
                  className="w-full py-2 bg-[#1E252B] text-white rounded-xl text-xs font-bold hover:bg-[#2D3748] transition-colors"
                >
                  Done
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Primary Search Button */}
        <div className={`mt-2 md:mt-0 ${isHero ? 'md:col-span-2' : 'md:col-span-2'}`}>
          <label className="hidden md:block text-[11px] font-bold opacity-0 mb-1">
            Search
          </label>
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#1E252B] text-[#FAF9F6] font-bold text-sm tracking-wide hover:bg-[#2D3748] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1E252B]/15 group cursor-pointer"
          >
            <Search className="w-4 h-4 text-[#C5A880] group-hover:scale-110 transition-transform" />
            <span>SEARCH HOTELS</span>
          </button>
        </div>

      </form>
    </div>
  );
}
