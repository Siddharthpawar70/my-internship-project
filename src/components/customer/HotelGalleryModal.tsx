import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { GalleryImage } from '../../types';

interface HotelGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  hotelName: string;
}

export function HotelGalleryModal({ isOpen, onClose, images, hotelName }: HotelGalleryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  if (!isOpen) return null;

  const categories: string[] = ['All', ...Array.from(new Set(images.map((img) => img.category || 'General')))];

  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter((img) => (img.category || 'General') === selectedCategory);

  const activeImage = filteredImages[currentIndex] || filteredImages[0] || images[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] flex flex-col justify-between">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
          <div>
            <h3 className="font-display text-lg font-bold text-white">{hotelName}</h3>
            <p className="text-xs text-gray-400">
              Photo {currentIndex + 1} of {filteredImages.length} • {activeImage?.category}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Category tabs */}
            <div className="hidden md:flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentIndex(0);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#C5A880] text-[#1E252B]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Photo Preview */}
        <div className="relative flex-1 my-4 flex items-center justify-center overflow-hidden rounded-2xl bg-black">
          <img
            src={activeImage?.url}
            alt={activeImage?.caption}
            className="max-h-full max-w-full object-contain rounded-xl select-none"
          />

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Caption */}
          {activeImage?.caption && (
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-xs text-xs text-white">
                {activeImage.caption}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Thumbnails Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 px-1">
          {filteredImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(idx)}
              className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === idx
                  ? 'border-[#C5A880] scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
