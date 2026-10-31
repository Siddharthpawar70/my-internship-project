import React, { useState } from 'react';
import { Plus, Minus, MapPin, Navigation, Compass, Layers, X, ArrowRight, Star } from 'lucide-react';
import { Hotel } from '../../types';
import { Link } from 'react-router-dom';

interface MapViewProps {
  hotels: Hotel[];
  selectedHotelId?: string;
  onSelectHotel?: (hotel: Hotel) => void;
}

export function MapView({ hotels, selectedHotelId, onSelectHotel }: MapViewProps) {
  const [zoom, setZoom] = useState(13);
  const [activeHotel, setActiveHotel] = useState<Hotel | null>(() => {
    return hotels.find((h) => h.id === selectedHotelId) || hotels[0] || null;
  });

  return (
    <div className="relative w-full h-[650px] bg-[#E8ECEF] rounded-3xl overflow-hidden border border-[#D0D7DE] shadow-inner select-none">
      
      {/* Map Graphic Canvas Simulation */}
      <div className="absolute inset-0 bg-[#E5E9EC] overflow-hidden">
        {/* Subtle grid lines & river curves for realistic luxury map look */}
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#CBD5E1" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Simulated River / Waterway */}
          <path
            d="M -100 350 Q 200 450, 450 300 T 900 400 T 1400 250"
            fill="none"
            stroke="#BFDBFE"
            strokeWidth="50"
            strokeLinecap="round"
          />
          {/* Main roads */}
          <path d="M 100 -50 L 500 700" stroke="#FFFFFF" strokeWidth="8" />
          <path d="M -50 200 L 1200 260" stroke="#FFFFFF" strokeWidth="8" />
          <path d="M 300 -50 Q 600 300, 950 650" stroke="#FDE68A" strokeWidth="6" />
        </svg>

        {/* City Neighborhood Mock Labels */}
        <div className="absolute top-12 left-16 text-gray-400 font-bold text-xs uppercase tracking-widest pointer-events-none">
          North Promenade
        </div>
        <div className="absolute bottom-20 left-24 text-gray-400 font-bold text-xs uppercase tracking-widest pointer-events-none">
          Heritage Old City
        </div>
        <div className="absolute top-28 right-24 text-gray-400 font-bold text-xs uppercase tracking-widest pointer-events-none">
          Diplomatic Enclave
        </div>
        <div className="absolute bottom-16 right-36 text-gray-400 font-bold text-xs uppercase tracking-widest pointer-events-none">
          Lakefront & Marina
        </div>

        {/* Map Markers for each Hotel */}
        {hotels.map((hotel, index) => {
          // Compute pseudo coordinates on container
          // Deterministic positions based on index
          const positions = [
            { top: '35%', left: '42%' },
            { top: '24%', left: '60%' },
            { top: '55%', left: '30%' },
            { top: '65%', left: '65%' },
            { top: '45%', left: '75%' },
            { top: '20%', left: '25%' },
            { top: '70%', left: '40%' },
            { top: '30%', left: '85%' },
            { top: '80%', left: '20%' },
            { top: '50%', left: '50%' }
          ];
          const pos = positions[index % positions.length];
          const isSelected = activeHotel?.id === hotel.id;

          return (
            <div
              key={hotel.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform duration-200 hover:scale-110"
              onClick={() => {
                setActiveHotel(hotel);
                if (onSelectHotel) onSelectHotel(hotel);
              }}
            >
              {/* Hotel Price Bubble Pin */}
              <div
                className={`relative px-3 py-1.5 rounded-full shadow-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-[#1E252B] text-white scale-110 ring-4 ring-[#C5A880]/50 z-30'
                    : 'bg-white text-gray-900 border border-gray-200 hover:border-[#C5A880]'
                }`}
              >
                <span className={isSelected ? 'text-[#C5A880]' : 'text-gray-500'}>
                  ₹{(hotel.pricePerNight / 1000).toFixed(1)}k
                </span>
                <span className="text-[10px] opacity-75">★{hotel.guestRating.toFixed(1)}</span>
                
                {/* Pointer tip */}
                <div
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${
                    isSelected ? 'bg-[#1E252B]' : 'bg-white border-b border-r border-gray-200'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Control Buttons */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-1.5 bg-white/95 rounded-2xl p-1.5 shadow-lg border border-gray-200">
        <button
          onClick={() => setZoom((z) => Math.min(18, z + 1))}
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(8, z - 1))}
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="border-t border-gray-200 my-0.5" />
        <button
          className="p-2 text-[#C5A880] hover:bg-gray-100 rounded-xl transition-colors"
          title="Recenter Map"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Watermark badge */}
      <div className="absolute bottom-4 left-4 z-30 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-semibold text-gray-600 border border-gray-200 shadow-xs flex items-center gap-1.5">
        <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
        <span>StayAura Interactive Map • Zoom {zoom}x</span>
      </div>

      {/* Selected Hotel Floating Card */}
      {activeHotel && (
        <div className="absolute bottom-6 right-6 z-30 w-80 sm:w-96 bg-white rounded-3xl p-4 shadow-2xl border border-gray-200 animate-in fade-in slide-in-from-bottom-3">
          <button
            onClick={() => setActiveHotel(null)}
            className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-700 bg-white/80 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex gap-3.5">
            <img
              src={activeHotel.heroImage}
              alt={activeHotel.name}
              className="w-24 h-24 rounded-2xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[10px] font-bold text-[#C5A880] uppercase tracking-wider">
                  {activeHotel.type}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-bold text-gray-700 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {activeHotel.guestRating.toFixed(1)}
                </span>
              </div>
              <h4 className="font-bold text-sm text-gray-900 truncate">
                {activeHotel.name}
              </h4>
              <p className="text-[11px] text-gray-500 truncate mt-0.5">
                {activeHotel.city} • {activeHotel.distanceFromCenter}
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-bold text-sm text-gray-900">
                  ₹{activeHotel.pricePerNight.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-gray-400">/ night</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-emerald-700 font-medium">
              {activeHotel.freeBreakfast ? '✓ Breakfast Included' : '✓ Instant Confirmation'}
            </span>
            <Link
              to={`/hotel/${activeHotel.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3 text-[#C5A880]" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
