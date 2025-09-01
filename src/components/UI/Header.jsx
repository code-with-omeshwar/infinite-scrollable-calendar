import React from 'react';
import { getMonthYearDisplay } from '../../utils/dateUtils.js';

const Header = ({ 
  currentVisibleMonth, 
  isScrolling, 
  onGoToToday, 
  onGoToCurrentMonth 
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Month and Year Display */}
          <div className="flex items-center space-x-4">
            <h1 className={`text-2xl font-bold text-gray-900 transition-opacity duration-200 ${
              isScrolling ? 'opacity-50' : 'opacity-100'
            }`}>
              {getMonthYearDisplay(currentVisibleMonth)}
            </h1>
            {isScrolling && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Scrolling...
              </div>
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onGoToToday}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Today
            </button>
            <button
              onClick={onGoToCurrentMonth}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              September 2025
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;