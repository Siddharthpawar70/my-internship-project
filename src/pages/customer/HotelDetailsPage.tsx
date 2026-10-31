import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  Sparkles,
  Heart,
  Share2,
  Coffee,
  Wifi,
  ShieldCheck,
  Clock,
  Info,
  ChevronRight,
  Phone,
  Calendar,
  Users,
  CheckCircle2,
  Building,
  Utensils,
  Car,
  Image as ImageIcon
} from 'lucide-react';
import { INITIAL_HOTELS, INITIAL_ROOMS } from '../../data/mockData';
import { useBooking } from '../../context/BookingContext';
import { useSearch } from '../../context/SearchContext';
import { useWishlist } from '../../context/WishlistContext';
import { RatingStars } from '../../components/common/RatingStars';
import { RoomCard } from '../../components/customer/RoomCard';
import { HotelGalleryModal } from '../../components/customer/HotelGalleryModal';
import { ReviewModal } from '../../components/customer/ReviewModal';
import { RoomType, RatePlan, GalleryImage } from '../../types';
import { useAuth } from '../../context/AuthContext';

export function HotelDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectHotelAndRoom, updateDraft, getHotelReviews } = useBooking();
  const { nightsCount, checkIn, checkOut, adults, children: childrenCount, rooms: roomsCount } = useSearch();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewCategory, setSelectedReviewCategory] = useState<string>('All');
  const [shareCopied, setShareCopied] = useState(false);

  // Find hotel
  const hotel = INITIAL_HOTELS.find((h) => h.id === id) || INITIAL_HOTELS[0];
  const hotelRooms = INITIAL_ROOMS.filter((r) => r.hotelId === hotel.id);
  const reviews = getHotelReviews(hotel.id);
  const isFav = isWishlisted(hotel.id);

  const galleryImages: GalleryImage[] = (hotel.galleryImages && hotel.galleryImages.length > 0)
    ? hotel.galleryImages
    : (hotel.images && hotel.images.length > 0 ? hotel.images : [hotel.heroImage]).map((url, i) => ({
        id: `img-${i}`,
        url,
        caption: `${hotel.name} - View ${i + 1}`,
        category: i === 0 ? 'Exterior' : i === 1 ? 'Rooms' : i === 2 ? 'Dining' : 'Amenities'
      }));

  const handleSelectRoom = (room: RoomType, ratePlan: RatePlan) => {
    selectHotelAndRoom(hotel, room, ratePlan);
    updateDraft({
      checkIn,
      checkOut,
      nights: nightsCount,
      roomsCount,
      adultsCount: adults,
      childrenCount
    });
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const filteredReviews = selectedReviewCategory === 'All'
    ? reviews
    : reviews.filter((r) => (r.travelerType || 'Couples').toLowerCase().includes(selectedReviewCategory.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      
      {/* Top Breadcrumb & Actions */}
      <div className="bg-white border-b border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <nav className="flex items-center gap-1.5 text-gray-500 truncate">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/hotels?destination=${hotel.city}`} className="hover:text-gray-900">{hotel.city}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-semibold truncate">{hotel.name}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareCopied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={() => toggleWishlist(hotel.id)}
              className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                isFav
                  ? 'border-red-200 bg-red-50 text-red-600'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500' : ''}`} />
              <span>{isFav ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#C5A880] text-[#1E252B]">
                {hotel.type}
              </span>
              <RatingStars rating={hotel.starRating} maxStars={hotel.starRating} showScore={false} size="sm" />
              <span className="text-xs text-gray-500 font-medium">
                {hotel.starRating}-Star Certified Property
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-bold text-gray-900">
              {hotel.name}
            </h1>

            <p className="flex items-center gap-1.5 text-xs text-gray-600 mt-2">
              <MapPin className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>{hotel.address}, {hotel.city}, {hotel.state} — {hotel.distanceFromCenter}</span>
            </p>
          </div>

          {/* Guest Rating & Price Summary Pill */}
          <div className="flex items-center gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-xs self-start md:self-auto">
            <div className="text-right">
              <p className="text-[11px] text-gray-500">Starting from</p>
              <p className="text-xl font-bold text-gray-900">
                ₹{hotel.pricePerNight.toLocaleString('en-IN')}{' '}
                <span className="text-xs text-gray-400 font-normal">/ night</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#1E252B] text-white flex flex-col items-center justify-center">
              <span className="font-bold text-sm leading-none">{hotel.guestRating.toFixed(1)}</span>
              <span className="text-[8px] text-[#C5A880] uppercase tracking-wider mt-0.5">Score</span>
            </div>
          </div>
        </div>

        {/* Gallery Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[380px] sm:h-[460px] rounded-3xl overflow-hidden mb-10 relative">
          {/* Main Large Image */}
          <div
            onClick={() => setGalleryOpen(true)}
            className="md:col-span-2 h-full relative cursor-pointer group overflow-hidden"
          >
            <img
              src={hotel.heroImage}
              alt={hotel.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Right 2x2 Grid */}
          <div className="hidden md:grid col-span-2 grid-cols-2 gap-3 h-full">
            {galleryImages.slice(0, 4).map((img, i) => (
              <div
                key={img.id}
                onClick={() => setGalleryOpen(true)}
                className="relative h-full cursor-pointer group overflow-hidden"
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white">
                  {img.category}
                </span>
              </div>
            ))}
          </div>

          {/* View All Photos Button */}
          <button
            onClick={() => setGalleryOpen(true)}
            className="absolute bottom-4 right-4 px-4 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-gray-900 text-xs font-bold backdrop-blur-md transition-all shadow-lg flex items-center gap-2 border border-white/50 cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-[#C5A880]" />
            <span>View All {galleryImages.length} Photos</span>
          </button>
        </div>

        {/* Sticky Search Specifier Banner */}
        <div className="bg-[#FAF5EB] border border-[#E9D8B4] rounded-2xl p-4 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#977341]" />
            <div>
              <p className="text-xs font-bold text-gray-900">
                Your Stay Dates: {checkIn} to {checkOut} ({nightsCount} night{nightsCount > 1 ? 's' : ''})
              </p>
              <p className="text-[11px] text-gray-600">
                {adults + childrenCount} Guests ({adults} Adults, {childrenCount} Children) • {roomsCount} Room{roomsCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <Link
            to="/hotels"
            className="px-4 py-2 rounded-xl bg-white border border-[#D5CEC5] text-xs font-bold text-gray-800 hover:bg-gray-50 self-start sm:self-auto"
          >
            Change Dates
          </Link>
        </div>

        {/* Content Layout: Details Left, Summary Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-12">
            
            {/* Overview & Highlights */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE6DF] shadow-xs">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                Property Overview
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {hotel.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gray-50 text-gray-700">
                    <Clock className="w-4 h-4 text-[#C5A880]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Check-in</p>
                    <p className="text-xs font-bold text-gray-900">{hotel.checkInTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gray-50 text-gray-700">
                    <Clock className="w-4 h-4 text-[#C5A880]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Check-out</p>
                    <p className="text-xs font-bold text-gray-900">{hotel.checkOutTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gray-50 text-gray-700">
                    <Coffee className="w-4 h-4 text-[#C5A880]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Breakfast</p>
                    <p className="text-xs font-bold text-gray-900">{hotel.freeBreakfast ? 'Included' : 'Available'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gray-50 text-gray-700">
                    <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Cancellation</p>
                    <p className="text-xs font-bold text-gray-900">{hotel.freeCancellation ? 'Free 48h' : 'Standard'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Room Availability Section */}
            <section id="rooms" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#C5A880] tracking-widest uppercase">
                    Select Your Room
                  </span>
                  <h2 className="font-display text-2xl font-bold text-gray-900 mt-0.5">
                    Available Room Types ({hotelRooms.length})
                  </h2>
                </div>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Instant Confirmation Guaranteed
                </span>
              </div>

              <div className="space-y-6">
                {hotelRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    hotel={hotel}
                    onSelect={handleSelectRoom}
                  />
                ))}
              </div>
            </section>

            {/* Full Amenities Grid */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE6DF] shadow-xs">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-6">
                Property Amenities & Services
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                {hotel.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2.5 text-xs text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Hotel Policies */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE6DF] shadow-xs">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                Hotel Policies & House Rules
              </h2>
              <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Check-in and Check-out</h4>
                  <p>Check-in time starts at {hotel.checkInTime}. Check-out is until {hotel.checkOutTime}. Early check-in or late check-out is subject to availability and can be requested during booking.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Cancellation Policy</h4>
                  <p>{hotel.cancellationPolicy}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Children & Extra Beds</h4>
                  <p>Children of all ages are welcome. Children aged 6 and under stay free of charge when using existing bedding. Cribs are available upon request free of charge.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Government ID Requirement</h4>
                  <p>In accordance with local regulations, all Indian residents must present a valid Government photo ID (Aadhaar, Passport, Voter ID, or Driving License). PAN Card is not accepted as valid address proof.</p>
                </div>
              </div>
            </section>

            {/* Verified Reviews Section */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE6DF] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <h2 className="font-display text-xl font-bold text-gray-900">
                    Verified Guest Reviews
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold text-gray-900">{hotel.guestRating.toFixed(1)}</span>
                    <RatingStars rating={hotel.guestRating} showScore={false} />
                    <span className="text-xs text-gray-500">
                      Based on {hotel.reviewCount} verified guest stays
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] transition-colors self-start sm:self-auto cursor-pointer"
                >
                  Write a Review
                </button>
              </div>

              {/* Category filter tabs */}
              <div className="flex items-center gap-2 overflow-x-auto py-4">
                {['All', 'Couples', 'Family', 'Solo', 'Business'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedReviewCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedReviewCategory === cat
                        ? 'bg-[#1E252B] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Reviews List */}
              <div className="space-y-4 pt-2">
                {filteredReviews.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 text-center">
                    No reviews in this category yet. Be the first to share your experience!
                  </p>
                ) : (
                  filteredReviews.map((rev) => (
                    <div key={rev.id} className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF]">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-xs text-gray-900">{rev.guestName || rev.userName}</span>
                            <span className="text-[10px] text-gray-400">• {rev.guestCity || rev.userLocation || 'India'}</span>
                            <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-semibold text-gray-600">
                              {rev.travelerType || 'Verified Stay'}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-gray-900">{rev.title || 'Wonderful Experience'}</h4>
                        </div>
                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-xs text-gray-900">{(rev.overallRating || rev.rating || 5).toFixed(1)}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed mb-3">
                        {rev.comment}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-200/60">
                        <span>Stayed in {rev.roomType} • {rev.date}</span>
                        <span>Verified Booking ✓</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

          </div>

          {/* Right Sidebar: Location map, Quick Booking Widget */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Reservation Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-md sticky top-28">
              <span className="text-[10px] font-bold tracking-widest text-[#C5A880] uppercase">
                Best Rate Guarantee
              </span>
              <div className="mt-1 flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{hotel.pricePerNight.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-500">/ night</span>
                {hotel.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{hotel.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div className="space-y-3 bg-[#FAF9F6] p-4 rounded-2xl border border-gray-200 text-xs mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Check-in</span>
                  <span className="font-bold text-gray-900">{checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Check-out</span>
                  <span className="font-bold text-gray-900">{checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Guests</span>
                  <span className="font-bold text-gray-900">{adults + childrenCount} Guests, {roomsCount} Room</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-500">Estimated Total ({nightsCount} nts)</span>
                  <span className="font-bold text-gray-900">
                    ₹{(hotel.pricePerNight * nightsCount * roomsCount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <a
                href="#rooms"
                className="w-full py-3.5 bg-[#1E252B] text-white rounded-2xl text-xs font-bold hover:bg-[#2D3748] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>CHOOSE YOUR ROOM</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              </a>

              <p className="text-[11px] text-gray-400 text-center mt-3">
                Zero booking fees • Free cancellation on selected rates
              </p>
            </div>

            {/* Location & Neighborhood card */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-xs">
              <h3 className="font-display text-base font-bold text-gray-900 mb-3">
                Location & Surroundings
              </h3>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                {hotel.address}, {hotel.city}, {hotel.state}. Convenient access to corporate hubs, dining enclaves, and transport terminals.
              </p>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span>Pune / Mumbai International Airport</span>
                  <span className="font-bold text-gray-900">7.5 km</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span>City Center & Koregaon Park Promenade</span>
                  <span className="font-bold text-gray-900">{hotel.distanceFromCenter}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span>Central Railway Station</span>
                  <span className="font-bold text-gray-900">4.2 km</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Gallery Modal */}
      <HotelGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={galleryImages}
        hotelName={hotel.name}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        hotelId={hotel.id}
        hotelName={hotel.name}
      />

    </div>
  );
}
