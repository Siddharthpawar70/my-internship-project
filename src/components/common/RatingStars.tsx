import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number; // e.g. 4.8 or 5
  maxStars?: number;
  showScore?: boolean;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RatingStars({
  rating,
  maxStars = 5,
  showScore = true,
  reviewCount,
  size = 'md'
}: RatingStarsProps) {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const scoreTextSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center text-amber-500">
        {[...Array(maxStars)].map((_, i) => (
          <Star
            key={i}
            className={`${iconSize} ${
              i < Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : i < rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      {showScore && (
        <span className={`font-bold text-gray-900 ${scoreTextSize}`}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-500 font-normal">
          ({reviewCount.toLocaleString('en-IN')} reviews)
        </span>
      )}
    </div>
  );
}
