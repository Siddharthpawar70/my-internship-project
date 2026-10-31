import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Plus,
  Check,
  ChevronLeft,
  Lock,
  Mail,
  Phone,
  User,
  Eye,
  EyeOff,
  Clock,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { AVAILABLE_ADD_ONS } from '../../data/mockData';
import { AddOnCard } from '../../components/customer/AddOnCard';
import { PriceBreakdown } from '../../components/customer/PriceBreakdown';
import { AddOn } from '../../types';

const SPECIAL_REQUEST_OPTIONS = [
  'Quiet room on high floor',
  'Large King-size bed',
  'Early check-in (subject to availability)',
  'Late check-out request',
  'Extra feather pillows',
  'Airport transfer driver contact requested',
  'Non-smoking floor'
];

export function BookingCheckoutPage() {
  const navigate = useNavigate();
  const { draft, updateDraft, toggleAddOn } = useBooking();
  const { user, isAuthenticated, login, register, logout } = useAuth();

  // If user navigated directly without draft hotel, provide fallback to first hotel
  const hotel = draft.hotel;
  const room = draft.room;
  const ratePlan = draft.ratePlan || room?.ratePlans[0];

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Inline auth state for unauthenticated users in booking
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAcceptTerms, setRegAcceptTerms] = useState(false);

  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authInlineError, setAuthInlineError] = useState('');
  const [pendingApproval, setPendingApproval] = useState(false);

  // Auto-fill guest details from authenticated user profile
  useEffect(() => {
    if (user) {
      const parts = (user.name || '').trim().split(' ');
      const fName = parts[0] || '';
      const lName = parts.slice(1).join(' ') || '';
      updateDraft({
        guestDetails: {
          ...draft.guestDetails,
          firstName: draft.guestDetails.firstName || fName,
          lastName: draft.guestDetails.lastName || lName,
          email: draft.guestDetails.email || user.email || '',
          phone: draft.guestDetails.phone || user.phone || ''
        }
      });
    }
  }, [user]);

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthInlineError('');
    setAuthSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy.auth;
        return copy;
      });
    } catch (err) {
      setAuthInlineError(err instanceof Error ? err.message : 'Invalid email or password.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleInlineRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthInlineError('');
    if (regPassword !== regConfirmPassword) {
      setAuthInlineError('Passwords do not match.');
      return;
    }
    if (!regAcceptTerms) {
      setAuthInlineError('Please accept the Terms & Conditions.');
      return;
    }
    setAuthSubmitting(true);
    const fullName = [regFirstName, regLastName].filter(Boolean).join(' ') || 'Guest';
    try {
      await register(fullName, regEmail, regPassword, regPhone);
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy.auth;
        return copy;
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'PENDING_APPROVAL') {
        setPendingApproval(true);
        setAuthInlineError('');
      } else {
        setAuthInlineError(err instanceof Error ? err.message : 'Could not create account.');
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGuestChange = (field: string, val: any) => {
    updateDraft({
      guestDetails: {
        ...draft.guestDetails,
        [field]: val
      }
    });
  };

  const toggleSpecialRequest = (req: string) => {
    const current = draft.guestDetails.specialRequests || [];
    const updated = current.includes(req)
      ? current.filter((r) => r !== req)
      : [...current, req];
    handleGuestChange('specialRequests', updated);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!isAuthenticated) {
      errors.auth = 'You must log in or register to complete your reservation. Guest booking without an account is not allowed.';
      setFormErrors(errors);
      const el = document.getElementById('booking-auth-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    if (!draft.guestDetails.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!draft.guestDetails.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!draft.guestDetails.email.trim() || !draft.guestDetails.email.includes('@')) {
      errors.email = 'Valid email is required';
    }
    if (!draft.guestDetails.phone.trim() || draft.guestDetails.phone.length < 8) {
      errors.phone = 'Valid phone number is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    navigate('/payment');
  };

  // If somehow draft is missing, show notice
  if (!hotel || !room) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center shadow-lg border border-gray-200">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C5A880] mx-auto flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900">No Room Selected</h2>
          <p className="text-xs text-gray-500 mt-2 mb-6">
            Please choose a luxury hotel and room category before proceeding to checkout.
          </p>
          <Link
            to="/hotels"
            className="px-6 py-3 rounded-2xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] transition-colors inline-block"
          >
            Browse Hotels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      
      {/* Checkout Progress Bar */}
      <div className="bg-white border-b border-[#EAE6DF] sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            <Link
              to={`/hotel/${hotel.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Room Selection</span>
            </Link>

            <div className="flex items-center gap-6 text-xs font-semibold">
              <span className="text-gray-900 font-bold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1E252B] text-white text-[10px] flex items-center justify-center">1</span>
                Guest & Add-ons
              </span>
              <span className="text-gray-300">→</span>
              <span className="text-gray-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-[10px] flex items-center justify-center">2</span>
                Payment
              </span>
              <span className="text-gray-300">→</span>
              <span className="text-gray-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-[10px] flex items-center justify-center">3</span>
                Confirmed Voucher
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Guest Form & Add-ons (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Hotel Summary Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <img
                src={hotel.heroImage}
                alt={hotel.name}
                className="w-full sm:w-36 h-28 rounded-2xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#C5A880] text-[#1E252B]">
                  {hotel.type}
                </span>
                <h2 className="font-display text-xl font-bold text-gray-900 mt-1">
                  {hotel.name}
                </h2>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{hotel.city}, {hotel.state}</span>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700">
                  <span className="px-2.5 py-1 rounded-lg bg-gray-100">
                    Room: <strong>{room.name}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-gray-100">
                    Plan: <strong>{ratePlan?.name}</strong>
                  </span>
                  <span className="text-emerald-700">
                    ✓ {draft.nights} Night{draft.nights > 1 ? 's' : ''} ({draft.checkIn} to {draft.checkOut})
                  </span>
                </div>
              </div>
            </div>

            {/* Step 1: Authentication or Guest Information */}
            {!isAuthenticated ? (
              <section id="booking-auth-section" className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#C5A880]/60 shadow-lg">
                <div className="flex items-center gap-3 pb-5 border-b border-gray-100 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-[#C5A880]/20 text-[#977341] flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#1E252B] text-white font-bold text-xs flex items-center justify-center">
                        1
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                        Login or Register Required
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-gray-900 mt-1">
                      Account Required to Book Hotel
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Without logging in or registering, you cannot book a hotel. Please log in or create an account below to complete your reservation.
                    </p>
                  </div>
                </div>

                {/* Error Banner */}
                {formErrors.auth && (
                  <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formErrors.auth}</span>
                  </div>
                )}
                {authInlineError && (
                  <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authInlineError}</span>
                  </div>
                )}

                {pendingApproval ? (
                  <div className="space-y-4 text-center py-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                      <Clock className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Registration Awaiting Approval</h4>
                      <p className="mt-1 text-xs text-gray-600 max-w-md mx-auto">
                        Your account has been created successfully! An administrator will review and approve your account shortly. Once approved, you can log in to complete your booking.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPendingApproval(false);
                        setAuthTab('login');
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] transition"
                    >
                      Go to Sign In
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Tabs for Login vs Register */}
                    <div className="flex rounded-2xl bg-[#FAF9F6] border border-gray-200 p-1.5 mb-6">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('login');
                          setAuthInlineError('');
                        }}
                        className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          authTab === 'login'
                            ? 'bg-[#1E252B] text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <LogIn className="w-4 h-4 text-[#C5A880]" />
                        <span>Sign In (Existing Member)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('register');
                          setAuthInlineError('');
                        }}
                        className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          authTab === 'register'
                            ? 'bg-[#1E252B] text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <UserPlus className="w-4 h-4 text-[#C5A880]" />
                        <span>Register (New Member)</span>
                      </button>
                    </div>

                    {/* Login Form */}
                    {authTab === 'login' && (
                      <form onSubmit={handleInlineLogin} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                            <input
                              type="email"
                              required
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              placeholder="name@example.com"
                              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                            <input
                              type={showLoginPassword ? 'text' : 'password'}
                              required
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              placeholder="Your password"
                              className="w-full px-10 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowLoginPassword(!showLoginPassword)}
                              className="absolute right-3 top-2.5 text-gray-400"
                            >
                              {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={authSubmitting}
                          className="w-full py-3.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {authSubmitting ? (
                            <span>Signing In...</span>
                          ) : (
                            <>
                              <span>SIGN IN & CONTINUE BOOKING</span>
                              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                            </>
                          )}
                        </button>

                        <p className="text-center text-xs text-gray-500 pt-1">
                          Don't have an account yet?{' '}
                          <button
                            type="button"
                            onClick={() => {
                              setAuthTab('register');
                              setAuthInlineError('');
                            }}
                            className="font-bold text-[#977341] hover:underline"
                          >
                            Register here
                          </button>
                        </p>
                      </form>
                    )}

                    {/* Register Form */}
                    {authTab === 'register' && (
                      <form onSubmit={handleInlineRegister} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={regFirstName}
                              onChange={(e) => setRegFirstName(e.target.value)}
                              placeholder="e.g. Rahul"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={regLastName}
                              onChange={(e) => setRegLastName(e.target.value)}
                              placeholder="e.g. Mehta"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                              <input
                                type="email"
                                required
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Mobile Phone <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                              <input
                                type="tel"
                                required
                                value={regPhone}
                                onChange={(e) => setRegPhone(e.target.value)}
                                placeholder="+91 98200 12345"
                                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Password (8+ chars) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                              <input
                                type={showRegPassword ? 'text' : 'password'}
                                required
                                minLength={8}
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                                placeholder="Min 8 characters"
                                className="w-full px-10 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                              />
                              <button
                                type="button"
                                onClick={() => setShowRegPassword(!showRegPassword)}
                                className="absolute right-3 top-2.5 text-gray-400"
                              >
                                {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="password"
                              required
                              value={regConfirmPassword}
                              onChange={(e) => setRegConfirmPassword(e.target.value)}
                              placeholder="Re-enter password"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                            />
                          </div>
                        </div>

                        <label className="flex items-center gap-2 text-xs text-gray-600">
                          <input
                            type="checkbox"
                            checked={regAcceptTerms}
                            onChange={(e) => setRegAcceptTerms(e.target.checked)}
                            className="rounded accent-[#977341] w-4 h-4"
                          />
                          <span>I agree to the Terms & Conditions and Privacy Policy</span>
                        </label>

                        <button
                          type="submit"
                          disabled={authSubmitting || !regAcceptTerms}
                          className="w-full py-3.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {authSubmitting ? (
                            <span>Creating Account...</span>
                          ) : (
                            <>
                              <span>CREATE ACCOUNT & CONTINUE BOOKING</span>
                              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                            </>
                          )}
                        </button>

                        <p className="text-center text-xs text-gray-500 pt-1">
                          Already have an account?{' '}
                          <button
                            type="button"
                            onClick={() => {
                              setAuthTab('login');
                              setAuthInlineError('');
                            }}
                            className="font-bold text-[#977341] hover:underline"
                          >
                            Sign in here
                          </button>
                        </p>
                      </form>
                    )}
                  </>
                )}
              </section>
            ) : (
              /* Step 1: Guest Information (When Authenticated) */
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE6DF] shadow-xs">
                <div className="flex items-center gap-3 pb-5 border-b border-gray-100 mb-6">
                  <span className="w-7 h-7 rounded-xl bg-[#1E252B] text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-gray-900">
                      Primary Guest Information
                    </h3>
                    <p className="text-xs text-gray-500">
                      Reservation confirmation and luxury check-in voucher will be sent to these details.
                    </p>
                  </div>
                </div>

                {/* Verified Member Status Pill */}
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-900">
                        Signed in as {user?.name}
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        {user?.email} • Member account verified
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-xs font-bold text-emerald-800 hover:underline self-start sm:self-auto cursor-pointer"
                  >
                    Switch Account
                  </button>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-3 sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                      <select
                        value={draft.guestDetails.title}
                        onChange={(e) => handleGuestChange('title', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                      >
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Dr.">Dr.</option>
                      </select>
                    </div>

                    <div className="col-span-9 sm:col-span-5">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={draft.guestDetails.firstName}
                        onChange={(e) => handleGuestChange('firstName', e.target.value)}
                        placeholder="e.g. Rahul"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880] ${
                          formErrors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {formErrors.firstName && (
                        <p className="text-[10px] text-red-500 mt-1">{formErrors.firstName}</p>
                      )}
                    </div>

                    <div className="col-span-12 sm:col-span-5">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={draft.guestDetails.lastName}
                        onChange={(e) => handleGuestChange('lastName', e.target.value)}
                        placeholder="e.g. Mehta"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880] ${
                          formErrors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {formErrors.lastName && (
                        <p className="text-[10px] text-red-500 mt-1">{formErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={draft.guestDetails.email}
                        onChange={(e) => handleGuestChange('email', e.target.value)}
                        placeholder="rahul.mehta@example.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880] ${
                          formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-[10px] text-red-500 mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Mobile Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={draft.guestDetails.phone}
                        onChange={(e) => handleGuestChange('phone', e.target.value)}
                        placeholder="+91 98200 12345"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880] ${
                          formErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-[10px] text-red-500 mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="pt-4 border-t border-gray-100">
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SPECIAL_REQUEST_OPTIONS.map((req) => {
                        const isChecked = draft.guestDetails.specialRequests?.includes(req);
                        return (
                          <label
                            key={req}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                              isChecked
                                ? 'border-[#1E252B] bg-[#FAF9F6] text-gray-900 font-semibold'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSpecialRequest(req)}
                              className="rounded border-gray-300 text-[#1E252B] focus:ring-[#C5A880] w-4 h-4"
                            />
                            <span>{req}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Step 2: Bespoke Add-ons */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE6DF] shadow-xs">
              <div className="flex items-center gap-3 pb-5 border-b border-gray-100 mb-6">
                <span className="w-7 h-7 rounded-xl bg-[#1E252B] text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900">
                    Enhance Your Stay with Signature Add-ons
                  </h3>
                  <p className="text-xs text-gray-500">
                    Optional bespoke luxuries and concierge arrangements.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_ADD_ONS.map((addOn: AddOn) => {
                  const selectedItem = draft.selectedAddOns.find((item) => item.addOn.id === addOn.id);
                  const isSelected = !!selectedItem;
                  return (
                    <AddOnCard
                      key={addOn.id}
                      addOn={addOn}
                      isSelected={isSelected}
                      quantity={selectedItem?.quantity || 1}
                      onToggle={toggleAddOn}
                    />
                  );
                })}
              </div>
            </section>

          </div>

          {/* Right Column: Price Breakdown & CTA (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="sticky top-28 space-y-6">
              <PriceBreakdown />

              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full py-4 bg-[#1E252B] text-white rounded-2xl font-bold text-xs tracking-wider uppercase hover:bg-[#2D3748] transition-all shadow-xl shadow-[#1E252B]/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{isAuthenticated ? 'PROCEED TO PAYMENT' : 'LOG IN OR REGISTER TO PROCEED'}</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EAE6DF] text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>StayAura Booking Guarantee</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Your reservation is held instantly with the property. Free cancellation applies up to 48 hours prior to check-in.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
