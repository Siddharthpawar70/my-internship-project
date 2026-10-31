import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { DESTINATIONS } from '../../data/mockData';

export function DestinationsPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
            India Inspiring Landscapes
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mt-2">
            Explore Handpicked Destinations
          </h1>
          <p className="text-sm text-gray-500 max-w-xl mx-auto mt-2 leading-relaxed">
            From regal palace corridors in Rajasthan to lush Western Ghats and coastal Goa, discover luxury tailored to every Indian horizon.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.name}
              to={`/hotels?destination=${dest.name}`}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="relative z-10 text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/20 uppercase tracking-wider">
                  {dest.state}
                </span>
                <h3 className="font-display text-2xl font-bold mt-2">{dest.name}</h3>
                <p className="text-xs text-white/80 mt-1 line-clamp-2 leading-relaxed">
                  {dest.tagline}
                </p>

                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-semibold">
                  <span>{dest.hotelCount} Verified Stays</span>
                  <span className="text-[#C5A880] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
