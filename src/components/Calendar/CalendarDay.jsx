import React from 'react';
import { isCurrentMonth, isSameDayUtil, getCurrentDate } from '../../utils/dateUtils.js';
import JournalEntryCard from '../JournalEntry/JournalEntryCard.jsx';

const CalendarDay = ({ 
  date, 
  entries = [], 
  hasEntries = false, 
  currentMonth, 
  onDateSelect, 
  onEntrySelect 
}) => {
  const isToday = isSameDayUtil(date, getCurrentDate());
  const isInCurrentMonth = isCurrentMonth(date, currentMonth);
  const dayNumber = date.getDate();
  
  const handleDateClick = () => {
    onDateSelect(date);
  };
  
  const handleEntryClick = (e, entry) => {
    e.stopPropagation();
    onEntrySelect(entry);
  };
  
  return (
    <div
      className={`
        relative min-h-20 p-1 border border-gray-200 cursor-pointer
        transition-colors duration-150
        ${isInCurrentMonth 
          ? 'bg-white hover:bg-gray-50' 
          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
        }
        ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}
      `}
      onClick={handleDateClick}
    >
      {/* Day number */}
      <div className="flex items-center justify-between mb-1">
        <span
          className={`
            text-sm font-medium
            ${isToday 
              ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs'
              : isInCurrentMonth 
                ? 'text-gray-900' 
                : 'text-gray-400'
            }
          `}
        >
          {dayNumber}
        </span>
        
        {/* Entry count indicator */}
        {hasEntries && (
          <span className="text-xs text-blue-600 font-medium">
            {entries.length}
          </span>
        )}
      </div>
      
      {/* Journal entries */}
      {hasEntries && (
        <div className="space-y-1">
          {entries.slice(0, 3).map((entry, index) => (
            <div
              key={entry.id}
              onClick={(e) => handleEntryClick(e, entry)}
              className="flex items-center space-x-1"
            >
              <JournalEntryCard 
                entry={entry} 
                onClick={() => onEntrySelect(entry)}
                size="xs"
              />
              <span className="text-xs text-gray-600 truncate flex-1">
                {entry.categories[0]}
              </span>
            </div>
          ))}
          
          {/* Show more indicator */}
          {entries.length > 3 && (
            <div className="text-xs text-blue-600 font-medium">
              +{entries.length - 3} more
            </div>
          )}
        </div>
      )}
      
      {/* Empty state hint */}
      {!hasEntries && isInCurrentMonth && (
        <div className="text-xs text-gray-300 mt-2">
          Click to add entry
        </div>
      )}
    </div>
  );
};

export default CalendarDay;