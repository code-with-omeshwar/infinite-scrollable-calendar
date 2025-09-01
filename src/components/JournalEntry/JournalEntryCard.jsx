import React, { useState } from 'react';
import StarRating from '../UI/StarRating.jsx';

const JournalEntryCard = ({ entry, onClick, size = 'sm' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const getFirstCategory = () => {
    return entry.categories && entry.categories.length > 0 
      ? entry.categories[0] 
      : 'Entry';
  };
  
  return (
    <div
      onClick={() => onClick(entry)}
      className={`
        ${sizeClasses[size]} 
        relative cursor-pointer group 
        rounded-full overflow-hidden 
        border-2 border-white shadow-sm
        hover:shadow-md hover:scale-110 
        transition-all duration-200 
        bg-gradient-to-br from-blue-400 to-purple-500
      `}
      title={`${getFirstCategory()} - ${entry.rating}/5 stars`}
    >
      {/* Background image */}
      {!imageError && (
        <img
          src={entry.imgUrl}
          alt={getFirstCategory()}
          className={`
            w-full h-full object-cover
            transition-opacity duration-300
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      )}
      
      {/* Fallback icon when image fails to load */}
      {imageError && (
        <div className="w-full h-full flex items-center justify-center text-white">
          <svg 
            className="w-1/2 h-1/2" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      {/* Overlay with rating */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <StarRating rating={entry.rating} size="xs" />
        </div>
      </div>
      
      {/* Rating indicator dot */}
      <div className="absolute top-0.5 right-0.5">
        <div 
          className={`
            w-2 h-2 rounded-full
            ${entry.rating >= 4.5 ? 'bg-green-400' : 
              entry.rating >= 3.5 ? 'bg-yellow-400' : 'bg-red-400'}
          `}
        />
      </div>
    </div>
  );
};

export default JournalEntryCard;