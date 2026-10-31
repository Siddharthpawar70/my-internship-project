import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, Mail, MapPin, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1E252B] text-[#FAF9F6] pt-16 pb-12 border-t border-[#2D3748]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[#323D47]">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#28323B] text-[#C5A880]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Curated Luxury Stays</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Hand-inspected 5-star properties, heritage palaces and seaside villas across premier Indian destinations.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#28323B] text-[#C5A880]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Guaranteed Best Rates</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Transparent dynamic pricing with zero hidden fees and direct hotel benefits.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#28323B] text-[#C5A880]">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">24/7 Travel Concierge</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Dedicated personal travel specialists to tailor your transfers, dining and room allocations.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 border-b border-[#323D47]">
          
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2D3748] to-[#3B4758] flex items-center justify-center text-[#C5A880]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  Stay<span className="text-[#C5A880]">Aura</span>
                </span>
                <p className="text-[9px] tracking-widest text-gray-400 uppercase font-medium">
                  Find your perfect stay
                </p>
              </div>
            </Link>
            <p className="text-xs text-gray-400 mt-4 leading-relaxed max-w-sm">
              StayAura is India premier boutique hotel and luxury resort reservation portal. Elevating hospitality through verified authentic stays, immersive local experiences, and bespoke comfort.
            </p>
            <div className="mt-5 space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880]" />
                <span>+91 20 6688 9900 (Toll-Free 24x7)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A880]" />
                <span>concierge@stayaura.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880]" />
                <span>Koregaon Park & BKC, Mumbai / Pune, India</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#C5A880] mb-4">Top Destinations</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/hotels?destination=Pune" className="hover:text-white transition-colors">Hotels in Pune</Link></li>
              <li><Link to="/hotels?destination=Mumbai" className="hover:text-white transition-colors">Hotels in Mumbai</Link></li>
              <li><Link to="/hotels?destination=Goa" className="hover:text-white transition-colors">Villas in Goa</Link></li>
              <li><Link to="/hotels?destination=Udaipur" className="hover:text-white transition-colors">Palaces in Udaipur</Link></li>
              <li><Link to="/hotels?destination=Jaipur" className="hover:text-white transition-colors">Havelis in Jaipur</Link></li>
              <li><Link to="/hotels?destination=Bengaluru" className="hover:text-white transition-colors">Suites in Bengaluru</Link></li>
              <li><Link to="/hotels?destination=Manali" className="hover:text-white transition-colors">Chalets in Manali</Link></li>
              <li><Link to="/hotels?destination=Lonavala" className="hover:text-white transition-colors">Resorts in Lonavala</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#C5A880] mb-4">Stay Categories</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/hotels?type=Luxury+Hotel" className="hover:text-white transition-colors">Luxury 5-Star Hotels</Link></li>
              <li><Link to="/hotels?type=Resort" className="hover:text-white transition-colors">Beach & Hill Resorts</Link></li>
              <li><Link to="/hotels?type=Heritage+Palace" className="hover:text-white transition-colors">Royal Heritage Palaces</Link></li>
              <li><Link to="/hotels?type=Boutique+Hotel" className="hover:text-white transition-colors">Design Boutique Hotels</Link></li>
              <li><Link to="/hotels?type=Business+Hotel" className="hover:text-white transition-colors">Executive Tech Suites</Link></li>
              <li><Link to="/group-booking" className="hover:text-white transition-colors">Destination Weddings</Link></li>
              <li><Link to="/corporate" className="hover:text-white transition-colors">Corporate Retreats</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#C5A880] mb-4">Management & Help</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/admin" className="text-[#C5A880] font-semibold hover:underline">Hotelier Admin Portal</Link></li>
              <li><Link to="/trips" className="hover:text-white transition-colors">Manage My Booking</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">StayAura Loyalty Club</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
              <li><span className="cursor-pointer hover:text-white">Cancellation Policies</span></li>
              <li><span className="cursor-pointer hover:text-white">Privacy & Terms</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 StayAura Hospitality Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span className="text-gray-400">INR (₹) Indian Rupee</span>
            <span>•</span>
            <span className="text-gray-400">English (India)</span>
            <span>•</span>
            <Link to="/admin" className="text-[#C5A880] hover:underline">Admin Console</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
