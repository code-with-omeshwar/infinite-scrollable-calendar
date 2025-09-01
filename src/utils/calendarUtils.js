import { addMonths, subMonths } from 'date-fns';
import { getCalendarWeeks, getMonthYearDisplay } from './dateUtils.js';

/**
 * Generate calendar data for multiple months around a center month
 */
export const generateCalendarData = (centerMonth, bufferMonths = 6) => {
  const months = [];
  
  // Generate months before center
  for (let i = bufferMonths; i > 0; i--) {
    const month = subMonths(centerMonth, i);
    months.push({
      date: month,
      weeks: getCalendarWeeks(month),
      id: `month-${month.getFullYear()}-${month.getMonth()}`,
      display: getMonthYearDisplay(month)
    });
  }
  
  // Add center month
  months.push({
    date: centerMonth,
    weeks: getCalendarWeeks(centerMonth),
    id: `month-${centerMonth.getFullYear()}-${centerMonth.getMonth()}`,
    display: getMonthYearDisplay(centerMonth)
  });
  
  // Generate months after center
  for (let i = 1; i <= bufferMonths; i++) {
    const month = addMonths(centerMonth, i);
    months.push({
      date: month,
      weeks: getCalendarWeeks(month),
      id: `month-${month.getFullYear()}-${month.getMonth()}`,
      display: getMonthYearDisplay(month)
    });
  }
  
  return months;
};

/**
 * Calculate which month is most visible in the viewport
 */
export const getMostVisibleMonth = (monthElements, containerElement) => {
  if (!monthElements || monthElements.length === 0 || !containerElement) {
    return null;
  }
  
  const containerRect = containerElement.getBoundingClientRect();
  let maxVisibleArea = 0;
  let mostVisibleMonth = null;
  
  monthElements.forEach((element, index) => {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    
    // Calculate intersection area
    const intersectionTop = Math.max(rect.top, containerRect.top);
    const intersectionBottom = Math.min(rect.bottom, containerRect.bottom);
    const intersectionHeight = Math.max(0, intersectionBottom - intersectionTop);
    
    const visibleArea = intersectionHeight * rect.width;
    
    if (visibleArea > maxVisibleArea) {
      maxVisibleArea = visibleArea;
      mostVisibleMonth = { index, element, rect };
    }
  });
  
  return mostVisibleMonth;
};

/**
 * Debounce function for scroll events
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for frequent updates
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if an element is intersecting with viewport
 */
export const isElementIntersecting = (element, threshold = 0.1) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  return (
    rect.bottom >= windowHeight * threshold &&
    rect.top <= windowHeight * (1 - threshold)
  );
};

/**
 * Generate month range for virtualization
 */
export const getMonthRange = (startMonth, count) => {
  const months = [];
  let currentMonth = new Date(startMonth);
  
  for (let i = 0; i < count; i++) {
    months.push(new Date(currentMonth));
    currentMonth = addMonths(currentMonth, 1);
  }
  
  return months;
};