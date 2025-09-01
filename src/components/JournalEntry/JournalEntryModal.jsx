import React, { useState, useEffect, useRef } from 'react';
import StarRating from '../UI/StarRating.jsx';
import { formatDate } from '../../utils/dateUtils.js';

const JournalEntryModal = ({ 
  entry, 
  isOpen, 
  onClose, 
  onNext, 
  onPrevious, 
  canNavigateNext, 
  canNavigatePrevious 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const modalRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
      setImageError(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (canNavigatePrevious) onPrevious();
          break;
        case 'ArrowRight':
          if (canNavigateNext) onNext();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious, canNavigateNext, canNavigatePrevious]);
  
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Minimum swipe distance
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left - next entry
        if (canNavigateNext) onNext();
      } else {
        // Swiped right - previous entry
        if (canNavigatePrevious) onPrevious();
      }
    }
    
    setTouchStart(null);
  };
  
  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };
  
  if (!isOpen || !entry) return null;
  
  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative w-full max-w-2xl max-h-full bg-white rounded-lg shadow-xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Navigation buttons */}
        {canNavigatePrevious && (
          <button
            onClick={onPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {canNavigateNext && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        
        {/* Content */}
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Image section */}
          <div className="flex-1 bg-gray-100 relative min-h-64 md:min-h-96">
            {!imageError ? (
              <img
                src={entry.imgUrl}
                alt="Journal entry"
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          
          {/* Details section */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Date and Rating */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {formatDate(entry.parsedDate, 'EEEE, MMMM dd, yyyy')}
                </div>
                <StarRating rating={entry.rating} size="md" showValue />
              </div>
              
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {entry.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-900 leading-relaxed">
                  {entry.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Swipe indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 text-xs text-gray-400">
          {canNavigatePrevious && <span>← Previous</span>}
          {canNavigatePrevious && canNavigateNext && <span>•</span>}
          {canNavigateNext && <span>Next →</span>}
          {(canNavigatePrevious || canNavigateNext) && (
            <span className="ml-2">(Swipe or use arrow keys)</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalEntryModal;