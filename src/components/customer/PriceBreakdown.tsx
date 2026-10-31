import React, { useState } from 'react';
import { Tag, Sparkles, X, CheckCircle, ShieldAlert } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export function PriceBreakdown() {
  const { draft, priceBreakdown, applyCoupon, removeCoupon } = useBooking();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const loyaltyPointsEarned = Math.round(priceBreakdown.roomTotal * 0.05);

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-sm space-y-4">
      <h3 className="font-display text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
        Fare Summary
      </h3>

      {/* Line Items */}
      <div className="space-y-2.5 text-xs">
        {/* Room Price */}
        <div className="flex items-center justify-between text-gray-700">
          <span>
            Room Charges ({draft.nights} night{draft.nights > 1 ? 's' : ''} × {draft.roomsCount} room{draft.roomsCount > 1 ? 's' : ''})
          </span>
          <span className="font-semibold text-gray-900">
            ₹{priceBreakdown.roomTotal.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Selected Add-ons */}
        {draft.selectedAddOns.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold uppercase text-gray-400">Add-ons</span>
            {draft.selectedAddOns.map(({ addOn, quantity }) => (
              <div key={addOn.id} className="flex items-center justify-between text-gray-600 pl-2">
                <span>{addOn.name} (x{quantity})</span>
                <span className="font-semibold text-gray-800">
                  ₹{(
                    addOn.priceType === 'per_night'
                      ? addOn.price * quantity * draft.nights
                      : addOn.price * quantity
                  ).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Taxes & GST */}
        <div className="flex items-center justify-between text-gray-700 pt-1">
          <span>Hotel Goods & Services Tax (18% GST)</span>
          <span className="font-semibold text-gray-900">
            ₹{priceBreakdown.taxesAndFees.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Service Fee */}
        <div className="flex items-center justify-between text-gray-700">
          <span>StayAura Concierge & Platform Fee</span>
          <span className="font-semibold text-gray-900">
            ₹{priceBreakdown.serviceFee.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Coupon Discount */}
        {draft.appliedCoupon && (
          <div className="flex items-center justify-between text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Coupon Discount ({draft.appliedCoupon.code})</span>
            </div>
            <span>- ₹{priceBreakdown.discount.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      {/* Coupon Application Form */}
      <div className="pt-2 border-t border-gray-100">
        {draft.appliedCoupon ? (
          <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl text-xs">
            <span className="text-gray-700 font-semibold">
              Applied: <strong className="text-emerald-700">{draft.appliedCoupon.code}</strong>
            </span>
            <button
              onClick={() => {
                removeCoupon();
                setCouponFeedback(null);
                setCouponInput('');
              }}
              className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter promo code (e.g. HOTEL500)"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs uppercase font-semibold focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1E252B] text-white rounded-xl text-xs font-bold hover:bg-[#2D3748] transition-colors cursor-pointer"
            >
              Apply
            </button>
          </form>
        )}

        {couponFeedback && (
          <p
            className={`text-[11px] mt-1.5 font-medium ${
              couponFeedback.success ? 'text-emerald-700' : 'text-red-600'
            }`}
          >
            {couponFeedback.message}
          </p>
        )}

        {/* Promo hint tags */}
        {!draft.appliedCoupon && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => {
                setCouponInput('HOTEL500');
                applyCoupon('HOTEL500');
              }}
              className="px-2 py-0.5 rounded-md bg-[#FAF5EB] border border-[#E9D8B4] text-[10px] font-bold text-[#977341] hover:bg-[#F3EAD5]"
            >
              🏷️ HOTEL500 (₹500 off)
            </button>
            <button
              type="button"
              onClick={() => {
                setCouponInput('LUXURY15');
                applyCoupon('LUXURY15');
              }}
              className="px-2 py-0.5 rounded-md bg-[#FAF5EB] border border-[#E9D8B4] text-[10px] font-bold text-[#977341] hover:bg-[#F3EAD5]"
            >
              🏷️ LUXURY15 (15% off)
            </button>
          </div>
        )}
      </div>

      {/* Grand Total */}
      <div className="pt-3 border-t-2 border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Total Amount</span>
          <span className="text-[10px] text-gray-400">Includes all applicable GST & fees</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">
            ₹{priceBreakdown.grandTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Rewards callout */}
      <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-900 font-medium">
          You will earn <strong className="font-bold">{loyaltyPointsEarned} StayAura Points</strong> on this stay!
        </p>
      </div>

    </div>
  );
}
