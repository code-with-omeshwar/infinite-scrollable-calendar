import React from 'react';
import CalendarDay from './CalendarDay.jsx';
import { getDayNames } from '../../utils/dateUtils.js';

const CalendarMonth = ({ 
  month, 
  isVisible = true, 
  onDateSelect, 
  onEntrySelect, 
  registerRef 
}) => {
  const dayNames = getDayNames();
  
  return (
    <div 
      ref={registerRef}
      className={`
        calendar-month mb-8 last:mb-0
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-50'}
      `}
      data-month-id={month.id}
    >
      {/* Month header */}
      <div className="sticky top-16 z-10 bg-white border-b border-gray-200 pb-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          {month.display}
        </h2>
        
        {/* Day names header */}
        <div className="grid grid-cols-7 gap-0">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200"
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="space-y-0">
        {month.weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-0">
            {week.map((dayData, dayIndex) => (
              <CalendarDay
                key={`${month.id}-${weekIndex}-${dayIndex}`}
                date={dayData.date}
                entries={dayData.entries}
                hasEntries={dayData.hasEntries}
                currentMonth={month.date}
                onDateSelect={onDateSelect}
                onEntrySelect={onEntrySelect}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Visual separator */}
      <div className="mt-8 border-b border-gray-100"></div>
    </div>
  );
};

export default CalendarMonth;