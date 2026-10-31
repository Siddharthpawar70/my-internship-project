import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, Search, MapPin } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { HotelCard } from '../../components/customer/HotelCard';

export function WishlistPage() {
  const { wishlistHotels, clearWishlist, wishlistIds } = useWishlist();

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* Top Banner */}
      <div className="bg-white border-b border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
              Personal Collection
            </span>
            <h1 className="font-display text-3xl font-bold text-gray-900 mt-1">
              Saved Hotels & Wishlist
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Your shortlisted luxury sanctuaries, heritage palaces, and private retreats.
            </p>
          </div>

          {wishlistIds.length > 0 && (
            <button
              onClick={clearWishlist}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Wishlist</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {wishlistHotels.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-xs max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Explore our hand-inspected luxury hotels and tap the heart icon to save your dream getaways.
            </p>
            <Link
              to="/hotels"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse Luxury Stays</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} layout="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
