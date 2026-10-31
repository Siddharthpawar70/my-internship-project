import React, { useState } from 'react';
import { X, Star, Sparkles } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  hotelName: string;
}

export function ReviewModal({ isOpen, onClose, hotelId, hotelName }: ReviewModalProps) {
  const { addReview } = useBooking();
  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [service, setService] = useState(5);
  const [amenities, setAmenities] = useState(5);
  const [value, setValue] = useState(5);
  const [roomType, setRoomType] = useState('Deluxe King Suite');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [guestType, setGuestType] = useState('Couples');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) return;

    addReview({
      hotelId,
      guestName: user?.name || 'Verified Guest',
      userName: user?.name || 'Verified Guest',
      guestCity: user?.city || 'Mumbai, India',
      userLocation: user?.city || 'Mumbai, India',
      overallRating: rating,
      rating,
      title,
      comment,
      travelerType: guestType,
      roomType,
      cleanliness,
      staff: service,
      location: 5,
      value
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#C5A880]">
            Verified Guest Experience
          </span>
          <h3 className="font-display text-2xl font-bold text-gray-900 mt-1">
            Write a Review for {hotelName}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Help other travelers by sharing details of your hospitality, room comfort, and dining experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Overall Rating Stars */}
          <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#EAE6DF] text-center">
            <label className="block text-xs font-bold text-gray-700 mb-2">Overall Experience Rating</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-[#C5A880] mt-1.5">
              {rating === 5 ? 'Exceptional 5/5' : rating === 4 ? 'Very Good 4/5' : 'Average 3/5'}
            </p>
          </div>

          {/* Sub Ratings */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Cleanliness ({cleanliness}/5)</label>
              <input
                type="range"
                min={1}
                max={5}
                value={cleanliness}
                onChange={(e) => setCleanliness(Number(e.target.value))}
                className="w-full accent-[#1E252B]"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Service & Staff ({service}/5)</label>
              <input
                type="range"
                min={1}
                max={5}
                value={service}
                onChange={(e) => setService(Number(e.target.value))}
                className="w-full accent-[#1E252B]"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Amenities & Pool ({amenities}/5)</label>
              <input
                type="range"
                min={1}
                max={5}
                value={amenities}
                onChange={(e) => setAmenities(Number(e.target.value))}
                className="w-full accent-[#1E252B]"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Value for Money ({value}/5)</label>
              <input
                type="range"
                min={1}
                max={5}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full accent-[#1E252B]"
              />
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Review Headline</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unforgettable anniversary stay with royal hospitality!"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
            />
          </div>

          {/* Detailed Comment */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Feedback</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about the breakfast buffet, pool cleanliness, room view, and staff attentiveness..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
            />
          </div>

          {/* Traveler Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Who did you travel with?</label>
              <select
                value={guestType}
                onChange={(e) => setGuestType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
              >
                <option value="Couples">Couples Romantic Getaway</option>
                <option value="Family">Family Vacation</option>
                <option value="Solo Traveler">Solo Exploration</option>
                <option value="Business">Business Trip</option>
                <option value="Friends">Friends Reunion</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Room Category Stayed In</label>
              <input
                type="text"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#1E252B] text-white rounded-2xl text-xs font-bold hover:bg-[#2D3748] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>SUBMIT VERIFIED REVIEW</span>
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
          </button>
        </form>
      </div>
    </div>
  );
}
