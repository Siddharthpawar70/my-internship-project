import React, { useState } from 'react';
import { Briefcase, Building, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Send } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export function CorporateStaysPage() {
  const { groupQuotes } = useAdmin();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    destination: 'Pune',
    roomsNeeded: 15,
    dates: '2026-10-15 to 2026-10-18',
    budgetPerNight: 8000,
    requirements: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#1E252B] via-[#2A343D] to-[#1E252B] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#C5A880] text-xs font-semibold uppercase tracking-wider mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            <span>StayAura Business & Enterprise Hospitality</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
            Corporate Stays & Executive Retreats
          </h1>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto mt-3 leading-relaxed">
            Consolidated invoicing, dedicated account executives, GST tax compliance, and negotiated contracted rates across 15+ Indian commercial hubs.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Value Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-[#EAE6DF] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">Centralized Billing</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Consolidated monthly GST invoices with corporate credit lines and automated expense exports.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#EAE6DF] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-3">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">Custom Group Rates</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Volume-based tier discounts for business travel, quarterly conferences, and board meetings.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#EAE6DF] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-stone-700" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">Dedicated Concierge</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              24/7 account manager handling airport luxury pickups, meeting room tech setups, and VIP suites.
            </p>
          </div>
        </div>

        {/* Corporate RFP Form Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAE6DF] shadow-sm">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900">
                Corporate Request Received!
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you, <strong>{formData.contactName}</strong>. Our enterprise account executive will reach out to <strong>{formData.email}</strong> within 3 business hours with a formal proposal.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 px-6 py-2.5 bg-[#1E252B] text-white text-xs font-bold rounded-xl"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A880]">
                  Request Custom Quote
                </span>
                <h3 className="font-display text-2xl font-bold text-gray-900 mt-1">
                  Enquire About Corporate Contract Rates
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Company / Organization Name</label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Infosys Ltd / Tata Consultancy"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Authorized Contact Name</label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="e.g. Vikram Singhania"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Official Work Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="vikram@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98000 00000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Primary Destination</label>
                    <select
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    >
                      <option value="Pune">Pune (Koregaon / Hinjewadi)</option>
                      <option value="Mumbai">Mumbai (BKC / Nariman Point)</option>
                      <option value="Bengaluru">Bengaluru (Whitefield / Indiranagar)</option>
                      <option value="Goa">Goa (Retreats)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Rooms Needed</label>
                    <input
                      type="number"
                      min={5}
                      max={200}
                      value={formData.roomsNeeded}
                      onChange={(e) => setFormData({ ...formData, roomsNeeded: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Approx Budget / Night</label>
                    <input
                      type="number"
                      step={500}
                      value={formData.budgetPerNight}
                      onChange={(e) => setFormData({ ...formData, budgetPerNight: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Additional Requirements / Dates</label>
                  <textarea
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Conference hall setup for 50 attendees, projector, gala dinner, airport group shuttles..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1E252B] text-white rounded-2xl text-xs font-bold hover:bg-[#2D3748] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>SUBMIT CORPORATE PROPOSAL REQUEST</span>
                  <Send className="w-4 h-4 text-[#C5A880]" />
                </button>
              </form>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
