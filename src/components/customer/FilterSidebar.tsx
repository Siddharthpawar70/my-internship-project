import React from 'react';
import { Filter, X, RotateCcw, Check, Star } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';

interface FilterSidebarProps {
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

const HOTEL_TYPES = ['Luxury Hotel', 'Resort', 'Boutique Hotel', 'Heritage Palace', 'Business Hotel'];
const POPULAR_AMENITIES = ['Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Valet Parking', 'Airport Transfer'];
const STAR_RATINGS = [5, 4, 3];

export function FilterSidebar({ isOpenOnMobile, onCloseMobile }: FilterSidebarProps) {
  const { filters, setFilters, resetFilters, filteredHotels } = useSearch();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setFilters((prev) => ({ ...prev, priceRange: [prev.priceRange[0], val] }));
  };

  const toggleStarRating = (star: number) => {
    setFilters((prev) => {
      const exists = prev.starRatings.includes(star);
      return {
        ...prev,
        starRatings: exists ? prev.starRatings.filter((s) => s !== star) : [...prev.starRatings, star]
      };
    });
  };

  const toggleHotelType = (type: string) => {
    setFilters((prev) => {
      const exists = prev.hotelTypes.includes(type);
      return {
        ...prev,
        hotelTypes: exists ? prev.hotelTypes.filter((t) => t !== type) : [...prev.hotelTypes, type]
      };
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity]
      };
    });
  };

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#C5A880]" />
          <h3 className="font-bold text-sm text-gray-900">Filters</h3>
          <span className="text-[11px] text-gray-400 font-medium">
            ({filteredHotels.length} stays)
          </span>
        </div>
        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-1 text-xs text-[#9F835E] hover:text-[#1E252B] font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Max Budget Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-gray-900 mb-2">
          <span>Max Price per Night</span>
          <span className="text-[#C5A880]">₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min={2500}
          max={20000}
          step={500}
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
          className="w-full accent-[#1E252B] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹2,500</span>
          <span>₹20,000+</span>
        </div>
      </div>

      {/* Inclusions */}
      <div className="space-y-2.5 pt-2 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-900 block mb-1">Key Inclusions</label>
        
        <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-gray-900">
          <input
            type="checkbox"
            checked={filters.breakfastIncluded}
            onChange={(e) => setFilters((p) => ({ ...p, breakfastIncluded: e.target.checked }))}
            className="rounded border-gray-300 text-[#1E252B] focus:ring-[#C5A880] w-4 h-4"
          />
          <span>Breakfast Included</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-gray-900">
          <input
            type="checkbox"
            checked={filters.freeCancellation}
            onChange={(e) => setFilters((p) => ({ ...p, freeCancellation: e.target.checked }))}
            className="rounded border-gray-300 text-[#1E252B] focus:ring-[#C5A880] w-4 h-4"
          />
          <span>Free Cancellation</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-gray-900">
          <input
            type="checkbox"
            checked={filters.freeWifi}
            onChange={(e) => setFilters((p) => ({ ...p, freeWifi: e.target.checked }))}
            className="rounded border-gray-300 text-[#1E252B] focus:ring-[#C5A880] w-4 h-4"
          />
          <span>Free High-Speed Wi-Fi</span>
        </label>
      </div>

      {/* Star Rating */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-900 block mb-1">Property Star Rating</label>
        <div className="flex gap-2">
          {STAR_RATINGS.map((star) => {
            const isChecked = filters.starRatings.includes(star);
            return (
              <button
                type="button"
                key={star}
                onClick={() => toggleStarRating(star)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                  isChecked
                    ? 'bg-[#1E252B] text-white border-[#1E252B]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                <span>{star}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Guest Rating */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-900 block mb-1">Guest Score</label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: '4.8+ Exceptional', val: 4.8 },
            { label: '4.5+ Superb', val: 4.5 },
            { label: '4.0+ Very Good', val: 4.0 },
            { label: 'Any Rating', val: 0 }
          ].map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={() => setFilters((p) => ({ ...p, minGuestRating: item.val }))}
              className={`p-2 rounded-xl border text-left font-medium transition-colors ${
                filters.minGuestRating === item.val
                  ? 'border-[#C5A880] bg-[#FAF5EB] text-[#1E252B] font-bold'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hotel Type */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-900 block mb-1">Property Type</label>
        <div className="space-y-1.5">
          {HOTEL_TYPES.map((type) => {
            const isChecked = filters.hotelTypes.includes(type);
            return (
              <label key={type} className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-gray-900">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleHotelType(type)}
                  className="rounded border-gray-300 text-[#1E252B] focus:ring-[#C5A880] w-4 h-4"
                />
                <span>{type}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-900 block mb-1">Facilities & Amenities</label>
        <div className="space-y-1.5">
          {POPULAR_AMENITIES.map((amenity) => {
            const isChecked = filters.amenities.includes(amenity);
            return (
              <label key={amenity} className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-gray-900">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleAmenity(amenity)}
                  className="rounded border-gray-300 text-[#1E252B] focus:ring-[#C5A880] w-4 h-4"
                />
                <span>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-sm sticky top-28 h-fit">
        {content}
      </aside>

      {/* Mobile Drawer Modal */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full overflow-y-auto p-6 shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="font-bold text-base text-gray-900">Filter Hotels</h2>
              <button
                onClick={onCloseMobile}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
            <div className="pt-6 border-t border-gray-100 mt-6 sticky bottom-0 bg-white">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 rounded-2xl bg-[#1E252B] text-white font-bold text-xs shadow-md"
              >
                Apply Filters ({filteredHotels.length} Stays)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
