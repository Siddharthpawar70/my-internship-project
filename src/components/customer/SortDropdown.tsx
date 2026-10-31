import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';

export function SortDropdown() {
  const { sortBy, setSortBy } = useSearch();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 font-medium hidden sm:inline">Sort by:</span>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort hotels by"
          className="appearance-none pl-8 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-800 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C5A880] cursor-pointer shadow-xs"
        >
          <option value="recommended">Recommended & Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Guest Rating: Highest First</option>
          <option value="star">Star Rating: 5 to 1</option>
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
