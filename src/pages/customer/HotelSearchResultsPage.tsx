import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Map, Filter, RotateCcw, Search, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import { HotelCard } from '../../components/customer/HotelCard';
import { FilterSidebar } from '../../components/customer/FilterSidebar';
import { SortDropdown } from '../../components/customer/SortDropdown';
import { MapView } from '../../components/customer/MapView';
import { SearchBox } from '../../components/customer/SearchBox';

export function HotelSearchResultsPage() {
  const [searchParams] = useSearchParams();
  const {
    destination,
    setDestination,
    filteredHotels,
    viewMode,
    setViewMode,
    resetFilters,
    nightsCount,
    adults,
    children: childrenCount,
    rooms,
    checkIn,
    checkOut,
    setFilters
  } = useSearch();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showSearchEditor, setShowSearchEditor] = useState(false);

  // Sync destination or type from URL if provided
  useEffect(() => {
    const destParam = searchParams.get('destination');
    if (destParam && destParam !== destination) {
      setDestination(destParam);
    }
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setFilters((prev) => ({
        ...prev,
        hotelTypes: [typeParam]
      }));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20">
      
      {/* Search Header Strip */}
      <div className="bg-white border-b border-[#EAE6DF] sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Summary details */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FAF5EB] text-[#977341]">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-1.5">
                  <span>{destination ? `Stays in ${destination}` : 'All Luxury Properties'}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold">
                    {filteredHotels.length} found
                  </span>
                </h1>
                <p className="text-xs text-gray-500">
                  {checkIn} — {checkOut} ({nightsCount} night{nightsCount > 1 ? 's' : ''}) • {adults + childrenCount} Guest{adults + childrenCount > 1 ? 's' : ''}, {rooms} Room{rooms > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => setShowSearchEditor(!showSearchEditor)}
                className="px-3.5 py-2 rounded-xl border border-gray-200 hover:border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                {showSearchEditor ? 'Close Search' : 'Modify Dates / Guests'}
              </button>

              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E252B] text-white text-xs font-semibold shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>

          </div>

          {/* Search Editor Drawer */}
          {showSearchEditor && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in duration-200">
              <SearchBox variant="compact" />
            </div>
          )}

        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Sub-header Controls: Results count, View mode switcher, Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Showing {filteredHotels.length} Verified Luxury Hotel{filteredHotels.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Map View"
              >
                <Map className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <SortDropdown />
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="flex items-start gap-8">
          
          {/* Filter Sidebar (Desktop) */}
          <FilterSidebar
            isOpenOnMobile={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
          />

          {/* Results Area */}
          <main className="flex-1 min-w-0">
            {filteredHotels.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C5A880] mx-auto flex items-center justify-center mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900">
                  No Hotels Match Your Current Filters
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-2 leading-relaxed">
                  Try adjusting your maximum price range, clearing specific amenities, or searching for nearby cities like Pune, Mumbai, or Goa.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2.5 bg-[#1E252B] text-white rounded-xl text-xs font-bold hover:bg-[#2D3748] transition-colors inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : viewMode === 'map' ? (
              <div className="space-y-4">
                <MapView hotels={filteredHotels} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {filteredHotels.slice(0, 4).map((h) => (
                    <HotelCard key={h.id} hotel={h} layout="grid" />
                  ))}
                </div>
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-6">
                {filteredHotels.map((h) => (
                  <HotelCard key={h.id} hotel={h} layout="list" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.map((h) => (
                  <HotelCard key={h.id} hotel={h} layout="grid" />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

    </div>
  );
}
