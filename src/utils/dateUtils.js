import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parse,
  isValid 
} from 'date-fns';

/**
 * Get the start and end dates for a calendar month view
 * This includes days from previous/next month to fill the grid
 */
export const getCalendarBounds = (date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  return { calendarStart, calendarEnd, monthStart, monthEnd };
};

/**
 * Generate array of dates for a calendar month view
 */
export const getCalendarDates = (date) => {
  const { calendarStart, calendarEnd } = getCalendarBounds(date);
  const dates = [];
  let currentDate = calendarStart;
  
  while (currentDate <= calendarEnd) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
};

/**
 * Get calendar weeks (array of arrays, each sub-array contains 7 dates)
 */
export const getCalendarWeeks = (date) => {
  const dates = getCalendarDates(date);
  const weeks = [];
  
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }
  
  return weeks;
};

/**
 * Format date for display
 */
export const formatDate = (date, formatString = 'dd/MM/yyyy') => {
  return format(date, formatString);
};

/**
 * Parse date string in DD/MM/YYYY format
 */
export const parseDateString = (dateString) => {
  try {
    const parsed = parse(dateString, 'dd/MM/yyyy', new Date());
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * Check if two dates are the same day
 */
export const isSameDayUtil = (date1, date2) => {
  return isSameDay(date1, date2);
};

/**
 * Check if date is in the current month
 */
export const isCurrentMonth = (date, currentMonth) => {
  return isSameMonth(date, currentMonth);
};

/**
 * Get next month
 */
export const getNextMonth = (date) => {
  return addMonths(date, 1);
};

/**
 * Get previous month
 */
export const getPreviousMonth = (date) => {
  return subMonths(date, 1);
};

/**
 * Get current date
 */
export const getCurrentDate = () => {
  return new Date();
};

/**
 * Get month name and year for display
 */
export const getMonthYearDisplay = (date) => {
  return format(date, 'MMMM yyyy');
};

/**
 * Get day of week names
 */
export const getDayNames = () => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

/**
 * Get month names
 */
export const getMonthNames = () => {
  return [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
};