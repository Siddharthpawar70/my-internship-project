import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Award, Sparkles, Shield, Luggage, Check, Edit2, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { uploadImage } from '../../lib/api';
import { Link } from 'react-router-dom';

export function UserProfilePage() {
  const { user, updateProfile } = useAuth();
  const { bookings } = useBooking();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Rahul Mehta');
  const [phone, setPhone] = useState(user?.phone || '+91 98200 12345');
  const [city, setCity] = useState(user?.city || 'Pune, Maharashtra');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    setAvatarError(null);
    try {
      const res = await uploadImage(file);
      await updateProfile({ avatar: res.url });
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Could not upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, city });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
        <p className="text-sm text-gray-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      
      {/* Header */}
      <div className="bg-white border-b border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
            StayAura Member Account
          </span>
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-1">
            My Profile & Loyalty Club
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Card & Edit (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE6DF] shadow-xs">
              <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-[#C5A880]/30"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#C5A880] to-[#E9D8B4] text-[#1E252B] font-display text-2xl font-bold flex items-center justify-center shadow-md">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <label
                      title="Upload profile photo"
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1E252B] text-[#C5A880] flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition-transform"
                    >
                      {isUploadingAvatar ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Camera className="w-3 h-3" />
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleAvatarChange}
                        disabled={isUploadingAvatar}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-gray-900">{user.name}</h2>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF5EB] text-[#977341]">
                      {user.loyaltyTier} Tier Elite
                    </span>
                    {avatarError && <p className="text-[10px] text-red-600 mt-0.5">{avatarError}</p>}
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Home City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748]"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4 text-[#C5A880]" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4 text-[#C5A880]" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-4 h-4 text-[#C5A880]" />
                    <span>{user.city}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Luggage className="w-4 h-4 text-[#C5A880]" />
                    <span>{bookings.length} Completed & Active Stays</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-gray-900 mb-2">Member Services</h3>
              <Link
                to="/trips"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs text-gray-800 font-semibold"
              >
                <span>View All My Bookings ({bookings.length})</span>
                <Luggage className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs text-gray-800 font-semibold"
              >
                <span>Saved Wishlist Stays</span>
                <Sparkles className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                to="/admin"
                className="flex items-center justify-between p-3 rounded-xl bg-[#1E252B] hover:bg-[#2D3748] text-xs text-white font-semibold transition-colors"
              >
                <span>Open Hotel Admin Portal</span>
                <Shield className="w-4 h-4 text-[#C5A880]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Loyalty Club Tier, Rewards & Privileges (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Loyalty Tier Showcase */}
            <div className="rounded-3xl bg-gradient-to-tr from-[#1E252B] via-[#2A343D] to-[#1E252B] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C5A880]">
                    StayAura Club Privileges
                  </span>
                  <Award className="w-6 h-6 text-[#C5A880]" />
                </div>

                <div className="mt-4 mb-6">
                  <h3 className="font-display text-3xl font-bold">
                    {user.loyaltyTier} Elite Member
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">
                    Points Balance:{' '}
                    <strong className="text-xl text-[#C5A880] font-bold">
                      {user.loyaltyPoints.toLocaleString('en-IN')} Pts
                    </strong>{' '}
                    (Worth ₹{(user.loyaltyPoints * 0.25).toLocaleString('en-IN')})
                  </p>
                </div>

                {/* Progress bar to next tier */}
                <div className="space-y-1.5 mb-6">
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>Current: {user.loyaltyPoints} Pts</span>
                    <span>Next Tier (Platinum VIP): 10,000 Pts</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full bg-[#C5A880] rounded-full transition-all"
                      style={{ width: `${(user.loyaltyPoints / 10000) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C5A880]" />
                    <span>Guaranteed 2 PM Late Check-out</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C5A880]" />
                    <span>Free Room Upgrade (upon arrival)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C5A880]" />
                    <span>15% Off Spa Therapies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C5A880]" />
                    <span>Dedicated Priority Concierge</span>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Earn & Redeem Points */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE6DF] shadow-xs space-y-4">
              <h3 className="font-display text-lg font-bold text-gray-900">
                How StayAura Rewards Work
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200">
                  <p className="font-bold text-gray-900 mb-1">1. Book Any Stay</p>
                  <p className="text-gray-500 leading-relaxed">
                    Earn 5 points for every ₹100 spent across all verified boutique hotels & resorts.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200">
                  <p className="font-bold text-gray-900 mb-1">2. Fast Redemptions</p>
                  <p className="text-gray-500 leading-relaxed">
                    Use points for instant discounts, dining credits, or room upgrades during checkout.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200">
                  <p className="font-bold text-gray-900 mb-1">3. Tier Escalation</p>
                  <p className="text-gray-500 leading-relaxed">
                    Silver → Gold (2,500 pts) → Platinum VIP (10,000 pts) for complimentary airport transfers.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
