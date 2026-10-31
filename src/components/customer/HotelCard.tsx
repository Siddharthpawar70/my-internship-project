import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Coffee, Wifi, ShieldCheck, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { Hotel } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useSearch } from '../../context/SearchContext';
import { RatingStars } from '../common/RatingStars';

interface HotelCardProps {
  hotel: Hotel;
  layout?: 'grid' | 'list';
}

export function HotelCard({ hotel, layout = 'grid' }: HotelCardProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { nightsCount, rooms } = useSearch();
  const navigate = useNavigate();

  const isFav = isWishlisted(hotel.id);
  const totalStayPrice = hotel.pricePerNight * nightsCount * rooms;

  return (
    <div
      className={`group bg-white rounded-3xl overflow-hidden border border-[#EAE6DF] hover:border-[#C5A880]/50 hover:shadow-xl transition-all duration-300 flex flex-col ${
        layout === 'list' ? 'md:flex-row' : ''
      }`}
    >
      {/* Image Container */}
      <div
        className={`relative overflow-hidden ${
          layout === 'list' ? 'md:w-80 md:shrink-0 h-64 md:h-auto' : 'h-64'
        }`}
      >
        <img
          src={hotel.heroImage}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
          {hotel.featured && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#C5A880] text-[#1E252B] shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-xs text-gray-800 shadow-sm">
            {hotel.type}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(hotel.id);
          }}
          className="absolute top-3.5 right-3.5 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 backdrop-blur-xs transition-colors shadow-md z-10 cursor-pointer"
          title={isFav ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Rating overlay bottom left */}
        <div className="absolute bottom-3.5 left-3.5 text-white z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-[#1E252B]/90 backdrop-blur-xs text-xs font-bold text-[#FAF9F6] border border-white/20">
              {hotel.guestRating.toFixed(1)} ★
            </span>
            <span className="text-xs text-white/90 font-medium drop-shadow-sm">
              {hotel.guestRating >= 4.8 ? 'Exceptional' : hotel.guestRating >= 4.5 ? 'Superb' : 'Very Good'}
            </span>
            <span className="text-[11px] text-white/70">
              ({hotel.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Location */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <RatingStars rating={hotel.starRating} maxStars={hotel.starRating} showScore={false} size="sm" />
                <span className="text-[11px] text-gray-500 font-medium ml-1">
                  {hotel.starRating}-Star Property
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-[#9F835E] transition-colors line-clamp-1">
                {hotel.name}
              </h3>
            </div>
          </div>

          {/* Location info */}
          <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
            <span className="truncate">{hotel.city}, {hotel.state} • {hotel.distanceFromCenter}</span>
          </p>

          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {hotel.tagline}
          </p>

          {/* Key Inclusions & Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.freeBreakfast && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                <Coffee className="w-3 h-3 text-emerald-600" /> Breakfast Included
              </span>
            )}
            {hotel.freeWifi && (
              <span className="inline-flex items-center gap-1 text-[11px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md font-medium">
                <Wifi className="w-3 h-3 text-blue-600" /> Free Wi-Fi
              </span>
            )}
            {hotel.freeCancellation && (
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                <ShieldCheck className="w-3 h-3 text-stone-600" /> Free Cancellation
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-gray-900">
                ₹{hotel.pricePerNight.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-gray-500">/ night</span>
              {hotel.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{hotel.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400">
              Total ₹{totalStayPrice.toLocaleString('en-IN')} ({nightsCount} night{nightsCount > 1 ? 's' : ''}, {rooms} room{rooms > 1 ? 's' : ''})
            </p>
          </div>

          <Link
            to={`/hotel/${hotel.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1E252B] text-white hover:bg-[#2D3748] text-xs font-bold transition-all shadow-sm group/btn"
          >
            <span>VIEW ROOMS</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C5A880] group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
