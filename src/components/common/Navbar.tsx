import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Heart,
  Bell,
  User,
  Menu,
  X,
  Briefcase,
  Luggage,
  Sparkles,
  ChevronDown,
  LogOut,
  Settings,
  Hotel as HotelIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotifications } from '../../context/NotificationContext';
import { useBooking } from '../../context/BookingContext';

export function Navbar() {
  const { user, logout, openAuthModal } = useAuth();
  const { wishlistIds } = useWishlist();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { bookings } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeBookingsCount = bookings.filter(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In').length;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EAE6DF] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#1E252B] to-[#2D3748] flex items-center justify-center text-[#C5A880] shadow-md group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display text-2xl font-bold tracking-tight text-[#1E252B] flex items-center gap-1.5">
                Stay<span className="text-[#C5A880]">Aura</span>
              </span>
              <p className="text-[10px] tracking-widest text-[#718096] uppercase font-medium -mt-1">
                Find your perfect stay
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-[#1E252B] bg-[#EAE6DF]/60 font-semibold' : 'text-[#4A5568] hover:text-[#1E252B] hover:bg-[#F2EFE9]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/hotels"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/hotels') ? 'text-[#1E252B] bg-[#EAE6DF]/60 font-semibold' : 'text-[#4A5568] hover:text-[#1E252B] hover:bg-[#F2EFE9]'
              }`}
            >
              Hotels & Resorts
            </Link>
            <Link
              to="/destinations"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/destinations') ? 'text-[#1E252B] bg-[#EAE6DF]/60 font-semibold' : 'text-[#4A5568] hover:text-[#1E252B] hover:bg-[#F2EFE9]'
              }`}
            >
              Destinations
            </Link>
            <Link
              to="/corporate"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/corporate') ? 'text-[#1E252B] bg-[#EAE6DF]/60 font-semibold' : 'text-[#4A5568] hover:text-[#1E252B] hover:bg-[#F2EFE9]'
              }`}
            >
              Corporate
            </Link>
            <Link
              to="/group-booking"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/group-booking') ? 'text-[#1E252B] bg-[#EAE6DF]/60 font-semibold' : 'text-[#4A5568] hover:text-[#1E252B] hover:bg-[#F2EFE9]'
              }`}
            >
              Group Booking
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="hidden sm:flex items-center space-x-3">

            {/* My Trips */}
            <Link
              to="/trips"
              className="relative p-2.5 rounded-full text-[#4A5568] hover:text-[#1E252B] hover:bg-[#F2EFE9] transition-colors"
              title="My Trips & Bookings"
            >
              <Luggage className="w-5 h-5" />
              {activeBookingsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C5A880] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeBookingsCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full text-[#4A5568] hover:text-[#1E252B] hover:bg-[#F2EFE9] transition-colors"
              title="Saved Hotels"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#E53E3E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2.5 rounded-full text-[#4A5568] hover:text-[#1E252B] hover:bg-[#F2EFE9] transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#DD6B20] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-2">
                    <span className="font-semibold text-gray-900 text-sm">Notifications</span>
                    <span className="text-xs text-[#C5A880] font-medium">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-gray-500 py-4 text-center">No notifications yet</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            if (n.link) navigate(n.link);
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                            n.read ? 'bg-gray-50 text-gray-600' : 'bg-[#FAF6F0] text-gray-900 font-medium'
                          } hover:bg-gray-100`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold">{n.title}</span>
                            <span className="text-[10px] text-gray-400">{n.timestamp}</span>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-full border border-[#D5CEC5] hover:border-[#1E252B] transition-colors bg-white shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C5A880] to-[#E9D8B4] text-[#1E252B] font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-gray-900 leading-tight">{user.name.split(' ')[0]}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF5EB] text-[#977341] font-bold uppercase tracking-wider">
                      {user.loyaltyTier}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      <div className="mt-2 flex items-center justify-between bg-amber-50 rounded-lg p-2 text-xs">
                        <span className="text-amber-800 font-medium">StayAura Rewards</span>
                        <span className="font-bold text-amber-900">{user.loyaltyPoints} pts</span>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span>My Profile & Loyalty</span>
                    </Link>
                    <Link
                      to="/trips"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Luggage className="w-4 h-4 text-gray-500" />
                      <span>My Bookings ({bookings.length})</span>
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#977341] hover:bg-[#FAF5EB] transition-colors font-semibold"
                    >
                      <HotelIcon className="w-4 h-4 text-[#C5A880]" />
                      <span>Admin Console</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1E252B] text-white hover:bg-[#2D3748] transition-colors shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              to="/trips"
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 relative"
            >
              <Luggage className="w-5 h-5" />
              {activeBookingsCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#C5A880] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {activeBookingsCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-gray-50 text-xs font-medium text-gray-800 hover:bg-gray-100 text-center"
            >
              Home
            </Link>
            <Link
              to="/hotels"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-gray-50 text-xs font-medium text-gray-800 hover:bg-gray-100 text-center"
            >
              Hotels & Resorts
            </Link>
            <Link
              to="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-gray-50 text-xs font-medium text-gray-800 hover:bg-gray-100 text-center"
            >
              Destinations
            </Link>
            <Link
              to="/trips"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-gray-50 text-xs font-medium text-gray-800 hover:bg-gray-100 text-center"
            >
              My Trips ({bookings.length})
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-gray-50 text-xs font-medium text-gray-800 hover:bg-gray-100 text-center"
            >
              Wishlist ({wishlistIds.length})
            </Link>
            <Link
              to="/corporate"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-gray-50 text-xs font-medium text-gray-800 hover:bg-gray-100 text-center"
            >
              Corporate Stays
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 text-xs">
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-[10px] text-[#C5A880] font-semibold">{user.loyaltyTier} Tier • {user.loyaltyPoints} Pts</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-red-600 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full py-3 rounded-xl bg-[#C5A880] text-[#1E252B] font-bold text-xs"
              >
                Sign In / Join StayAura
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
