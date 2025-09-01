import React, { useCallback } from 'react';
import CalendarMonth from './CalendarMonth.jsx';

const Calendar = ({ 
  containerRef,
  calendarData,
  currentVisibleMonth,
  isScrolling,
  registerMonthRef,
  onDateSelect,
  onEntrySelect,
  loading = false
}) => {
  
  const handleMonthRef = useCallback((index) => (element) => {
    registerMonthRef(index, element);
  }, [registerMonthRef]);
  
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading calendar...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className={`
        flex-1 overflow-y-auto overflow-x-hidden
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
        ${isScrolling ? 'scroll-smooth' : ''}
      `}
      style={{
        scrollBehavior: 'smooth'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Loading indicator during scroll */}
        {isScrolling && (
          <div className="fixed top-20 right-4 z-40 bg-white shadow-lg rounded-lg p-3 border">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Scrolling...</span>
            </div>
          </div>
        )}
        
        {/* Calendar months */}
        <div className="space-y-0">
          {calendarData.map((month, index) => {
            const isCurrentlyVisible = month.date.getFullYear() === currentVisibleMonth.getFullYear() &&
                                     month.date.getMonth() === currentVisibleMonth.getMonth();
            
            return (
              <CalendarMonth
                key={month.id}
                month={month}
                isVisible={isCurrentlyVisible || !isScrolling}
                onDateSelect={onDateSelect}
                onEntrySelect={onEntrySelect}
                registerRef={handleMonthRef(index)}
              />
            );
          })}
        </div>
        
        {/* Infinite scroll buffer */}
        <div className="h-96"></div>
      </div>
    </div>
  );
};

export default Calendar;