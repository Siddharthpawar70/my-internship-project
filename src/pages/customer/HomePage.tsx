import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Compass,
  Award,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Heart,
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { SearchBox } from '../../components/customer/SearchBox';
import { DESTINATIONS, INITIAL_HOTELS } from '../../data/mockData';
import { HotelCard } from '../../components/customer/HotelCard';
import { useAuth } from '../../context/AuthContext';

export function HomePage() {
  const { user, openAuthModal } = useAuth();
  const featuredHotels = INITIAL_HOTELS.filter((h) => h.featured).slice(0, 4);

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Luxury Background Image with subtle zoom */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Indian Resort"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-[#FAF9F6]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center w-full">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[#FAF9F6] text-xs font-semibold uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Curated Boutique & 5-Star Sanctuaries Across India</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-md">
            Where Luxury Meets <span className="italic font-normal font-serif text-[#C5A880]">Serenity.</span>
          </h1>

          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-sm font-normal">
            Immerse yourself in handpicked palaces, coastal retreats, and business suites crafted for the discerning traveler.
          </p>

          {/* Search Box Component */}
          <div className="w-full max-w-4xl mx-auto shadow-2xl">
            <SearchBox variant="hero" />
          </div>

          {/* Quick Destination Pills under search */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-white">
            <span className="text-white/70 font-medium">Trending Now:</span>
            {['Pune', 'Mumbai', 'Goa', 'Udaipur', 'Jaipur', 'Manali'].map((city) => (
              <Link
                key={city}
                to={`/hotels?destination=${city}`}
                className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-xs text-white font-medium transition-colors border border-white/20 flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-[#C5A880]" />
                {city}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Popular Indian Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#C5A880] uppercase">
              Explore By Region
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 mt-1">
              Top Indian Destinations
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              From the bustling promenades of Mumbai to the tranquil backwaters and regal palaces.
            </p>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#9F835E] hover:text-[#1E252B] mt-3 sm:mt-0"
          >
            <span>View All 20+ Cities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {DESTINATIONS.slice(0, 8).map((dest) => (
            <Link
              key={dest.name}
              to={`/hotels?destination=${dest.name}`}
              className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-3.5 left-3.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {dest.state}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-display text-xl font-bold">{dest.name}</h3>
                <p className="text-xs text-white/80 mt-0.5">{dest.hotelCount} Verified Stays</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Stays */}
      <section className="bg-[#FAF6F0] py-20 border-y border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#C5A880] uppercase">
                Hand-Inspected Excellence
              </span>
              <h2 className="font-display text-3xl font-bold text-gray-900 mt-1">
                Featured Stays & Luxury Resorts
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Unrivaled architecture, legendary hospitality, and signature private amenities.
              </p>
            </div>
            <Link
              to="/hotels"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1E252B] text-white hover:bg-[#2D3748] text-xs font-bold transition-colors mt-4 sm:mt-0 shadow-sm"
            >
              <span>Explore All Hotels</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} layout="grid" />
            ))}
          </div>
        </div>
      </section>

      {/* Distinctive Stay Collections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-[#C5A880] uppercase">
            Curated Collections
          </span>
          <h2 className="font-display text-3xl font-bold text-gray-900 mt-1">
            Choose Your Atmosphere
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Tailor your booking experience to your exact vacation archetype.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-white border border-[#EAE6DF] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-[#C5A880]" />
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
              Royal Heritage Palaces
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              Historic havelis, marble courtyards, regal dining, and centuries of royal Indian traditions preserved in luxury.
            </p>
            <Link
              to="/hotels?type=Heritage+Palace"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9F835E] hover:text-[#1E252B]"
            >
              <span>Browse 4 Palaces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#EAE6DF] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center mb-6">
              <Compass className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
              Beachfront & Hill Resorts
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              Private infinity pools, sunset beach cabanas, Ayurvedic spa therapies, and crisp mountain breeze chalets.
            </p>
            <Link
              to="/hotels?type=Resort"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9F835E] hover:text-[#1E252B]"
            >
              <span>Browse 6 Resorts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#EAE6DF] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center mb-6">
              <Award className="w-6 h-6 text-stone-700" />
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
              Executive Tech Suites
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              Ergonomic workstations, high-speed Wi-Fi 6, club lounge privileges, and prime central business district access.
            </p>
            <Link
              to="/hotels?type=Business+Hotel"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9F835E] hover:text-[#1E252B]"
            >
              <span>Browse 5 Business Stays</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* StayAura Loyalty Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-12">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#1E252B] via-[#2A343D] to-[#1E252B] p-8 sm:p-14 text-white overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#C5A880] text-[#1E252B]">
              StayAura Club Membership
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-bold mt-4 leading-tight">
              Unlock 15% Off Stays & Complimentary Room Upgrades
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
              Earn 5 points for every ₹100 spent. Enjoy guaranteed late check-out, welcome high tea, and zero cancellation penalty on flexible dates.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {user ? (
                <Link
                  to="/profile"
                  className="px-6 py-3 rounded-2xl bg-[#C5A880] text-[#1E252B] text-xs font-bold hover:bg-[#D5B890] transition-colors shadow-md"
                >
                  View My Loyalty Status ({user.loyaltyTier})
                </Link>
              ) : (
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-6 py-3 rounded-2xl bg-[#C5A880] text-[#1E252B] text-xs font-bold hover:bg-[#D5B890] transition-colors shadow-md cursor-pointer"
                >
                  Join Free & Earn 500 Welcome Points
                </button>
              )}
              <Link
                to="/hotels"
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                Browse Member Rates
              </Link>
            </div>
          </div>

          {/* Decorative watermarks */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Sparkles className="w-96 h-96 text-white" />
          </div>
        </div>
      </section>

    </div>
  );
}
