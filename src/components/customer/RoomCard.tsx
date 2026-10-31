import React, { useState } from 'react';
import { Users, Maximize2, Bed, Check, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { RoomType, RatePlan, Hotel } from '../../types';
import { useSearch } from '../../context/SearchContext';

interface RoomCardProps {
  room: RoomType;
  hotel: Hotel;
  onSelect: (room: RoomType, ratePlan: RatePlan) => void;
  isSelected?: boolean;
}

export function RoomCard({ room, hotel, onSelect, isSelected }: RoomCardProps) {
  const { adults, children: childrenCount, nightsCount, checkIn } = useSearch();
  const [selectedPlanId, setSelectedPlanId] = useState<string>(room.ratePlans[0]?.id || '');
  const [showPlans, setShowPlans] = useState(true);

  const totalGuests = adults + childrenCount;
  const isOccupancyExceeded = adults > room.maxAdults || totalGuests > room.maxOccupancy;

  // Inventory on date simulation
  const availableInventory = room.inventoryByDate?.[checkIn] ?? room.availableCount;
  const isLowInventory = availableInventory <= 4;

  const currentPlan = room.ratePlans.find((p) => p.id === selectedPlanId) || room.ratePlans[0];

  return (
    <div
      className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 ${
        isSelected
          ? 'border-[#C5A880] ring-2 ring-[#C5A880]/30 shadow-lg'
          : 'border-gray-200 hover:border-gray-300 shadow-sm'
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Room Image */}
        <div className="lg:col-span-4 relative h-60 lg:h-auto overflow-hidden">
          <img
            src={room.images[0]}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1E252B]/85 text-white backdrop-blur-xs">
              {room.type}
            </span>
          </div>

          {isLowInventory && (
            <div className="absolute bottom-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
              <span>Only {availableInventory} rooms left!</span>
            </div>
          )}
        </div>

        {/* Room Details & Specs */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h3 className="font-display text-xl font-bold text-gray-900">
                {room.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1 font-medium">
                  <Maximize2 className="w-3.5 h-3.5 text-[#C5A880]" />
                  {room.sizeSqFt} sq.ft.
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Bed className="w-3.5 h-3.5 text-[#C5A880]" />
                  {room.bedType}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Users className="w-3.5 h-3.5 text-[#C5A880]" />
                  Max {room.maxOccupancy} Guests
                </span>
              </div>
            </div>

            {/* Occupancy Warning */}
            {isOccupancyExceeded && (
              <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Occupancy Limit Exceeded</p>
                  <p className="text-[11px] mt-0.5">
                    This room accommodates max {room.maxAdults} Adults + {room.maxChildren} Children (Total: {room.maxOccupancy}). You selected {adults} Adults and {childrenCount} Children. Consider booking multiple rooms.
                  </p>
                </div>
              </div>
            )}

            {/* Room Amenities Pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {room.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] text-gray-700 text-xs font-medium border border-[#EAE6DF]"
                >
                  ✓ {amenity}
                </span>
              ))}
            </div>

            {/* Rate Plans Section */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Available Rate Plans ({room.ratePlans.length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {room.ratePlans.map((plan) => {
                  const isPlanSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isPlanSelected
                          ? 'border-[#1E252B] bg-[#FAF9F6] ring-1 ring-[#1E252B]'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`rate-plan-${room.id}`}
                            checked={isPlanSelected}
                            onChange={() => setSelectedPlanId(plan.id)}
                            className="text-[#1E252B] focus:ring-[#C5A880] cursor-pointer"
                          />
                          <span className="font-bold text-xs text-gray-900">{plan.name}</span>
                        </div>
                        <span className="font-bold text-sm text-gray-900">
                          ₹{plan.pricePerNight.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-500 line-clamp-1 mb-2">
                        {plan.description}
                      </p>

                      <div className="space-y-1 text-[11px] text-gray-600">
                        {plan.benefits.slice(0, 2).map((benefit, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-emerald-800">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 text-[10px] text-stone-500 font-medium">
                        {plan.cancellationPolicy}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{currentPlan?.pricePerNight.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-500">/ night</span>
                {room.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{room.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400">
                + ₹{Math.round(currentPlan?.pricePerNight * 0.18).toLocaleString('en-IN')} taxes & fees per night
              </p>
            </div>

            <button
              onClick={() => onSelect(room, currentPlan)}
              disabled={isOccupancyExceeded}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isOccupancyExceeded
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-[#1E252B] text-white hover:bg-[#2D3748] active:scale-95'
              }`}
            >
              <span>{isOccupancyExceeded ? 'Cannot Accommodate' : 'SELECT THIS ROOM'}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
