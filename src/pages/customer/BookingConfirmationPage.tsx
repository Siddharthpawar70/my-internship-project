import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Printer,
  Calendar,
  MapPin,
  Sparkles,
  Luggage,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Share2,
  Clock,
  UserCheck
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Booking } from '../../types';
import { apiRequest } from '../../lib/api';

export function BookingConfirmationPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { getBookingById, checkInGuest } = useBooking();
  const [isCheckedInDirectly, setIsCheckedInDirectly] = useState(false);
  const [remoteBooking, setRemoteBooking] = useState<Booking | null>(null);
  const [loadError, setLoadError] = useState('');
  const booking = getBookingById(bookingId || '') || remoteBooking;

  useEffect(() => {
    let cancelled = false;
    if (!bookingId || getBookingById(bookingId)) return;
    apiRequest<{ booking: Booking }>(`/bookings/${encodeURIComponent(bookingId)}`)
      .then(({ booking: savedBooking }) => { if (!cancelled) setRemoteBooking(savedBooking); })
      .catch((error) => { if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Reservation not found.'); });
    return () => { cancelled = true; };
  }, [bookingId]);

  useEffect(() => {
    if (!booking) return;
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
    }
  }, [booking?.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleSimulateCheckIn = () => {
    if (bookingId) {
      checkInGuest(bookingId);
      setIsCheckedInDirectly(true);
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="font-display text-xl font-bold text-gray-900">{loadError ? 'Reservation unavailable' : 'Loading reservation...'}</h1>
          {loadError && <p className="mt-2 text-sm text-gray-600">{loadError}</p>}
          <Link to="/trips" className="mt-5 inline-block rounded-lg bg-[#1E252B] px-4 py-2 text-sm font-bold text-white">View My Trips</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      
      {/* Top Banner (hidden on print) */}
      <div className="print:hidden bg-white border-b border-[#EAE6DF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link to="/trips" className="hover:text-gray-900">My Trips</Link>
            <span>/</span>
            <span className="font-semibold text-gray-900">Voucher {booking.id}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-gray-600" />
              <span>Print Luxury Voucher</span>
            </button>
            <Link
              to="/trips"
              className="px-4 py-2 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Luggage className="w-4 h-4 text-[#C5A880]" />
              <span>Go to My Trips</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Success Header Box */}
        <div className="print:hidden bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-8 h-8 text-emerald-300" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  Reservation confirmed
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-bold mt-1">
                  Reservation Confirmed!
                </h1>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Booking Reference ID:{' '}
                  <strong className="text-white font-mono tracking-wider">{booking.id}</strong>
                </p>
              </div>
            </div>

            <div className="text-right self-start sm:self-auto">
              <span className="text-[11px] text-emerald-200 block">Status</span>
              <span className="inline-block px-3 py-1 rounded-full bg-white text-emerald-900 font-bold text-xs shadow-xs mt-0.5">
                {isCheckedInDirectly ? 'Checked In' : booking.bookingStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Printable Official Voucher Document */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAE6DF] shadow-md print:shadow-none print:border-none print:p-0">
          
          {/* Voucher Header with StayAura Logo */}
          <div className="flex items-start justify-between pb-8 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1E252B] flex items-center justify-center text-[#C5A880]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-display text-xl font-bold tracking-tight text-gray-900">
                  Stay<span className="text-[#C5A880]">Aura</span>
                </span>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                Official Hotel Reservation Voucher
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-mono font-bold text-gray-900">
                REF: #{booking.id}
              </p>
              <p className="text-[11px] text-gray-500">
                Booked on: {booking.bookedAt || '2026-09-22'}
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                {booking.paymentStatus === 'Paid' ? 'PAID IN FULL' : 'PAYMENT PENDING'}
              </span>
            </div>
          </div>

          {/* Hotel & Guest Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-gray-200">
            
            {/* Hotel Info */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C5A880] mb-2">
                Property Details
              </h3>
              <h4 className="font-display text-lg font-bold text-gray-900">
                {booking.hotelName}
              </h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {booking.hotelAddress}, {booking.hotelCity}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Concierge Contact: {booking.hotelPhone || '+91 20 6688 9900'}
              </p>
              <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                <p className="font-semibold text-gray-800">
                  Room Category: {booking.roomName}
                </p>
                <p className="text-gray-500 text-[11px]">
                  Plan: {booking.ratePlanName}
                </p>
                {booking.assignedRoomNumber && (
                  <p className="text-emerald-700 font-bold text-[11px] mt-1">
                    Pre-assigned Room: Suite #{booking.assignedRoomNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Guest & Schedule Info */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C5A880] mb-2">
                Guest & Stay Schedule
              </h3>
              <p className="text-sm font-bold text-gray-900">
                {booking.guestDetails?.title} {booking.guestDetails?.firstName} {booking.guestDetails?.lastName}
              </p>
              <p className="text-xs text-gray-600">
                {booking.guestDetails?.email} • {booking.guestDetails?.phone}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs bg-[#FAF9F6] p-3.5 rounded-xl border border-gray-200">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Check-in</span>
                  <span className="font-bold text-gray-900">{booking.checkIn}</span>
                  <span className="text-[10px] text-gray-500 block">from 14:00</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Check-out</span>
                  <span className="font-bold text-gray-900">{booking.checkOut}</span>
                  <span className="text-[10px] text-gray-500 block">until 11:00</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 mt-2">
                Duration: {booking.nights} Night{booking.nights > 1 ? 's' : ''} • {booking.adultsCount + booking.childrenCount} Guests, {booking.roomsCount} Room
              </p>
            </div>

          </div>

          {/* QR Code & Mobile Check-in Pass */}
          <div className="py-8 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-white border-2 border-gray-900 rounded-2xl shadow-sm shrink-0">
                <QrCode className="w-16 h-16 text-gray-900" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Express Mobile Check-In Pass</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed max-w-sm">
                  Show this QR code at the StayAura Priority Concierge Desk for keyless check-in and immediate room escort.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 font-mono text-gray-700">
                    PASS-CODE: {booking.id}-EXP
                  </span>
                </div>
              </div>
            </div>

            {/* Simulate Check-in Action button */}
            <div className="print:hidden">
              <button
                type="button"
                onClick={handleSimulateCheckIn}
                className="px-4 py-2.5 bg-[#FAF5EB] hover:bg-[#F3EAD5] text-[#977341] border border-[#E9D8B4] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <UserCheck className="w-4 h-4" />
                <span>Simulate Express Check-in</span>
              </button>
            </div>
          </div>

          {/* Fare Summary Breakdown */}
          <div className="py-6 border-b border-gray-200 space-y-2 text-xs">
            <h4 className="font-bold text-gray-900 mb-2">Payment Breakdown</h4>
            <div className="flex justify-between text-gray-600">
              <span>Room Total ({booking.nights} nights × {booking.roomsCount} room)</span>
              <span>₹{booking.totalRoomPrice.toLocaleString('en-IN')}</span>
            </div>
            {booking.totalAddOnsPrice > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Selected Bespoke Add-ons</span>
                <span>₹{booking.totalAddOnsPrice.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>GST & State Taxes (18%)</span>
              <span>₹{booking.taxesAndFees.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Concierge Service Fee</span>
              <span>₹{booking.serviceFee.toLocaleString('en-IN')}</span>
            </div>
            {booking.discountAmount && booking.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon Promo Discount ({booking.couponCode})</span>
                <span>- ₹{booking.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-gray-900 pt-3 border-t border-gray-200">
              <span>Booking total · {booking.paymentStatus}</span>
              <span className="text-base">₹{booking.grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Important Hotel Check-in Instructions */}
          <div className="pt-6 text-xs text-gray-500 leading-relaxed space-y-1.5">
            <p className="font-bold text-gray-700">Important Check-In Instructions:</p>
            <p>• Please present a valid government-issued photo ID (Aadhaar Card, Passport, or Driving License) for all guests upon arrival.</p>
            <p>• Free cancellation is honored up to 48 hours prior to official check-in time.</p>
            <p>• For early check-in or airport transport assistance, contact the hotel concierge directly at {booking.hotelPhone || '+91 20 6688 9900'}.</p>
          </div>

        </div>

        {/* Post-booking Navigation Actions */}
        <div className="print:hidden mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/trips"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#1E252B] text-white font-bold text-xs hover:bg-[#2D3748] transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <span>VIEW IN MY TRIPS</span>
            <Luggage className="w-4 h-4 text-[#C5A880]" />
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white border border-gray-300 text-gray-800 font-bold text-xs hover:bg-gray-50 transition-colors shadow-xs text-center"
          >
            Book Another Stay
          </Link>
        </div>

      </div>

    </div>
  );
}
