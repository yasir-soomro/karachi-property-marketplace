import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  initialRating?: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
  className?: string;
}

export function StarRating({
  initialRating = 0,
  maxRating = 5,
  onRate,
  readOnly = false,
  size = 18,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (!readOnly) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!readOnly) setHoverRating(0);
  };

  const handleClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!readOnly && onRate) {
      onRate(index);
    }
  };

  return (
    <div 
      className={cn("flex items-center gap-1", className)}
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(maxRating)].map((_, i) => {
        const ratingValue = i + 1;
        const isFilled = ratingValue <= (hoverRating || initialRating);
        
        return (
          <button
            key={i}
            type="button"
            className={cn(
              "transition-colors bg-transparent border-0 p-0",
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-110",
              isFilled ? "text-yellow-500" : "text-muted-foreground/30"
            )}
            onMouseEnter={() => handleMouseEnter(ratingValue)}
            onClick={(e) => handleClick(ratingValue, e)}
            disabled={readOnly}
            aria-label={`Rate ${ratingValue} stars out of ${maxRating}`}
          >
            <Star 
              width={size} 
              height={size} 
              className={isFilled ? "fill-current" : ""} 
            />
          </button>
        );
      })}
    </div>
  );
}
