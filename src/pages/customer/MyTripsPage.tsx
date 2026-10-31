import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Luggage,
  Calendar,
  MapPin,
  Printer,
  XCircle,
  Edit3,
  UserCheck,
  UserMinus,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useNotifications } from '../../context/NotificationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Booking } from '../../types';
import { ReviewModal } from '../../components/customer/ReviewModal';

export function MyTripsPage() {
  const { bookings, cancelBooking, checkInGuest, checkOutGuest, modifyBooking } = useBooking();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  // Modal states
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of travel plans');
  const [modifyModalBooking, setModifyModalBooking] = useState<Booking | null>(null);
  const [newCheckIn, setNewCheckIn] = useState('');
  const [newCheckOut, setNewCheckOut] = useState('');
  const [reviewModalData, setReviewModalData] = useState<{ hotelId: string; hotelName: string } | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const upcomingBookings = bookings.filter(
    (b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In'
  );
  const completedBookings = bookings.filter((b) => b.bookingStatus === 'Checked Out');
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === 'Cancelled');

  const displayedBookings =
    activeTab === 'upcoming'
      ? upcomingBookings
      : activeTab === 'completed'
      ? completedBookings
      : cancelledBookings;

  const handleConfirmCancel = async () => {
    if (cancelModalBooking) {
      setModalLoading(true);
      setModalError(null);
      try {
        await cancelBooking(cancelModalBooking.id, cancelReason);
        addNotification('Reservation Cancelled', `Booking #${cancelModalBooking.id} has been cancelled successfully.`, 'cancellation');
        setCancelModalBooking(null);
      } catch (err) {
        setModalError(err instanceof Error ? err.message : 'Could not cancel booking.');
      } finally {
        setModalLoading(false);
      }
    }
  };

  const handleConfirmModify = async () => {
    if (modifyModalBooking && newCheckIn && newCheckOut) {
      setModalLoading(true);
      setModalError(null);
      try {
        await modifyBooking(modifyModalBooking.id, {
          checkIn: newCheckIn,
          checkOut: newCheckOut
        });
        addNotification('Dates Modified', `Dates for booking #${modifyModalBooking.id} updated successfully.`, 'booking');
        setModifyModalBooking(null);
      } catch (err) {
        setModalError(err instanceof Error ? err.message : 'Could not modify dates.');
      } finally {
        setModalLoading(false);
      }
    }
  };

  const handleCheckIn = async (id: string) => {
    try {
      await checkInGuest(id);
      addNotification('Check-in Complete', `You have successfully checked in for booking #${id}.`, 'booking');
    } catch (err) {
      addNotification('Check-in Notice', err instanceof Error ? err.message : 'Could not check in.', 'booking');
    }
  };

  const handleCheckOut = async (id: string) => {
    try {
      await checkOutGuest(id);
      addNotification('Check-out Complete', `You have successfully checked out of booking #${id}.`, 'booking');
    } catch (err) {
      addNotification('Check-out Notice', err instanceof Error ? err.message : 'Could not check out.', 'booking');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                Customer Itinerary Hub
              </span>
              <h1 className="font-display text-3xl font-bold text-gray-900 mt-1">
                My Trips & Reservations
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Manage your reservations, view vouchers, request date modifications, or perform express mobile check-in.
              </p>
            </div>

            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] transition-colors self-start sm:self-auto shadow-sm"
            >
              <span>Book New Stay</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-3 mt-8 border-b border-gray-100">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'border-[#1E252B] text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>Active & Upcoming</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-800 font-bold">
                {upcomingBookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'completed'
                  ? 'border-[#1E252B] text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>Past & Completed</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-600 font-bold">
                {completedBookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cancelled')}
              className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'cancelled'
                  ? 'border-[#1E252B] text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>Cancelled & Refunded</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-50 text-red-700 font-bold">
                {cancelledBookings.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {displayedBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-xs max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C5A880] mx-auto flex items-center justify-center mb-4">
              <Luggage className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900">
              No {activeTab} bookings
            </h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming luxury stays scheduled. Ready to escape?"
                : `You don't have any ${activeTab} reservations in your StayAura history.`}
            </p>
            <Link
              to="/hotels"
              className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] transition-colors"
            >
              Browse Hotels
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE6DF] shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
                  
                  {/* Hotel Info & Image */}
                  <div className="flex items-start gap-4">
                    <img
                      src={b.hotelImage}
                      alt={b.hotelName}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-gray-500">
                          #{b.id}
                        </span>
                        <StatusBadge status={b.bookingStatus} size="sm" />
                        {b.assignedRoomNumber && (
                          <span className="text-[11px] font-bold text-[#977341] bg-[#FAF5EB] px-2 py-0.5 rounded-md">
                            Room #{b.assignedRoomNumber}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-xl font-bold text-gray-900">
                        {b.hotelName}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>{b.hotelAddress}, {b.hotelCity}</span>
                      </p>
                      <div className="mt-2 text-xs text-gray-700">
                        <span>{b.roomName}</span> • <span className="text-gray-500">{b.ratePlanName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dates & Price summary */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 self-start lg:self-auto">
                    <div className="bg-[#FAF9F6] p-3.5 rounded-2xl border border-gray-200 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <Calendar className="w-4 h-4 text-[#C5A880]" />
                        <span>{b.checkIn} → {b.checkOut}</span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {b.nights} Nights • {b.adultsCount} Adults, {b.roomsCount} Room
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">Total Amount</span>
                      <span className="text-xl font-bold text-gray-900">
                        ₹{b.grandTotal.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-emerald-700 block font-semibold">
                        {b.paymentStatus === 'Paid' ? 'Paid via ' + b.paymentMethod : 'Pay at Hotel'}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Strip */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 text-gray-500">
                    <span>Booked for: <strong className="text-gray-800">{b.guestDetails?.firstName} {b.guestDetails?.lastName}</strong></span>
                    {b.refundStatus && (
                      <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                        {b.refundStatus}: ₹{b.refundAmount?.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    
                    {/* View Voucher Link */}
                    <Link
                      to={`/confirmation/${b.id}`}
                      className="px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-gray-500" />
                      <span>View Voucher</span>
                    </Link>

                    {/* Simulate Check-In (if Confirmed) */}
                    {b.bookingStatus === 'Confirmed' && (
                      <button
                        type="button"
                        onClick={() => handleCheckIn(b.id)}
                        className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Simulate Check-in</span>
                      </button>
                    )}

                    {/* Simulate Check-Out (if Checked In) */}
                    {b.bookingStatus === 'Checked In' && (
                      <button
                        type="button"
                        onClick={() => handleCheckOut(b.id)}
                        className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                        <span>Simulate Check-out</span>
                      </button>
                    )}

                    {/* Modify Dates (if Confirmed) */}
                    {b.bookingStatus === 'Confirmed' && (
                      <button
                        type="button"
                        onClick={() => {
                          setModifyModalBooking(b);
                          setNewCheckIn(b.checkIn);
                          setNewCheckOut(b.checkOut);
                        }}
                        className="px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                        <span>Modify Dates</span>
                      </button>
                    )}

                    {/* Cancel Booking (if Confirmed) */}
                    {b.bookingStatus === 'Confirmed' && (
                      <button
                        type="button"
                        onClick={() => setCancelModalBooking(b)}
                        className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}

                    {/* Write Review (if Checked Out) */}
                    {b.bookingStatus === 'Checked Out' && (
                      <button
                        type="button"
                        onClick={() => setReviewModalData({ hotelId: b.hotelId, hotelName: b.hotelName })}
                        className="px-3.5 py-2 rounded-xl bg-[#FAF5EB] text-[#977341] hover:bg-[#F3EAD5] font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>Write Review</span>
                      </button>
                    )}

                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Cancel Booking Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-display text-xl font-bold text-gray-900">
              Cancel Reservation?
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Booking Ref: <strong>#{cancelModalBooking.id}</strong> at {cancelModalBooking.hotelName}
            </p>

            {/* Refund policy calculation simulation */}
            <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span>Original Paid:</span>
                <span className="font-bold">₹{cancelModalBooking.grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Cancellation Fee:</span>
                <span>₹1,500</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700 pt-2 border-t border-gray-200">
                <span>Refund Amount:</span>
                <span>₹{Math.max(0, cancelModalBooking.grandTotal - 1500).toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-gray-400 pt-1">
                Refund will be credited back to your original payment method within 2-4 business days.
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">Cancellation Reason</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              >
                <option value="Change of travel plans">Change of travel plans</option>
                <option value="Found a better price">Found a better price</option>
                <option value="Medical or personal emergency">Medical or personal emergency</option>
                <option value="Trip postponed">Trip postponed</option>
              </select>
            </div>

            {modalError && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {modalError}
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                disabled={modalLoading}
                onClick={() => { setCancelModalBooking(null); setModalError(null); }}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={modalLoading}
                onClick={handleConfirmCancel}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-md cursor-pointer disabled:opacity-50"
              >
                {modalLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modify Dates Modal */}
      {modifyModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
              Modify Stay Dates
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Update check-in and check-out dates for {modifyModalBooking.hotelName}.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">New Check-In Date</label>
                <input
                  type="date"
                  value={newCheckIn}
                  onChange={(e) => setNewCheckIn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">New Check-Out Date</label>
                <input
                  type="date"
                  value={newCheckOut}
                  min={newCheckIn}
                  onChange={(e) => setNewCheckOut(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
                />
              </div>
            </div>

            {modalError && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {modalError}
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                disabled={modalLoading}
                onClick={() => { setModifyModalBooking(null); setModalError(null); }}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={modalLoading}
                onClick={handleConfirmModify}
                className="flex-1 py-3 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] cursor-pointer disabled:opacity-50"
              >
                {modalLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalData && (
        <ReviewModal
          isOpen={!!reviewModalData}
          onClose={() => setReviewModalData(null)}
          hotelId={reviewModalData.hotelId}
          hotelName={reviewModalData.hotelName}
        />
      )}

    </div>
  );
}
