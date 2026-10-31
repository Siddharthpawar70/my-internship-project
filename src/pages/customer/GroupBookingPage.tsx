import React, { useState } from 'react';
import { Users, HeartHandshake, Sparkles, CheckCircle2, Send, Calendar, ShieldCheck } from 'lucide-react';

export function GroupBookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    eventType: 'Destination Wedding',
    plannerName: '',
    email: '',
    phone: '',
    destination: 'Udaipur',
    estimatedGuests: 80,
    dates: '2026-11-20 to 2026-11-23',
    specialNotes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2A231C] to-[#1E252B] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#C5A880] text-xs font-semibold uppercase tracking-wider mb-4">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>StayAura Celebrations & Group Gatherings</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
            Destination Weddings & Group Celebrations
          </h1>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto mt-3 leading-relaxed">
            Reserve full hotel wings or exclusive palace buyouts for majestic weddings, milestone anniversaries, and grand family reunions.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Form Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAE6DF] shadow-sm">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900">
                Celebration Enquiry Received!
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you, <strong>{formData.plannerName}</strong>. Our dedicated wedding & group curator will connect with you via <strong>{formData.phone}</strong> to discuss palace availability and curated banquet menus.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 px-6 py-2.5 bg-[#1E252B] text-white text-xs font-bold rounded-xl"
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A880]">
                  Bespoke Group Concierge
                </span>
                <h3 className="font-display text-2xl font-bold text-gray-900 mt-1">
                  Tell Us About Your Celebration
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Occasion / Event Type</label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    >
                      <option value="Destination Wedding">Destination Wedding</option>
                      <option value="Milestone Birthday / Anniversary">Milestone Birthday / Anniversary</option>
                      <option value="Family Reunion">Family Reunion</option>
                      <option value="Wellness & Yoga Retreat">Wellness & Yoga Retreat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Host / Planner Name</label>
                    <input
                      type="text"
                      required
                      value={formData.plannerName}
                      onChange={(e) => setFormData({ ...formData, plannerName: e.target.value })}
                      placeholder="e.g. Ananya Roy"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ananya@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 99000 00000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target Destination</label>
                    <select
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    >
                      <option value="Udaipur">Udaipur (Lakes & Palaces)</option>
                      <option value="Jaipur">Jaipur (Heritage Haveli)</option>
                      <option value="Goa">Goa (Beachfront Villas)</option>
                      <option value="Pune">Pune & Lonavala (Hills)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Number of Guests</label>
                    <input
                      type="number"
                      min={10}
                      max={500}
                      value={formData.estimatedGuests}
                      onChange={(e) => setFormData({ ...formData, estimatedGuests: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target Dates</label>
                    <input
                      type="text"
                      value={formData.dates}
                      onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                      placeholder="e.g. Nov 2026 / 3 nights"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Catering & Special Requests</label>
                  <textarea
                    rows={3}
                    value={formData.specialNotes}
                    onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                    placeholder="Require pure vegetarian or Jain kitchen, pool party setup, Sangeet banquet lawn, fireworks permissions..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1E252B] text-white rounded-2xl text-xs font-bold hover:bg-[#2D3748] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>CONNECT WITH GROUP EVENT CURATOR</span>
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
