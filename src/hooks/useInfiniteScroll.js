import { useState, useEffect, useRef, useCallback } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { generateCalendarData, getMostVisibleMonth, throttle } from '../utils/calendarUtils.js';

/**
 * Hook for infinite scroll calendar functionality
 */
export const useInfiniteScroll = (initialDate = new Date(), bufferMonths = 6) => {
  const [centerMonth, setCenterMonth] = useState(initialDate);
  const [calendarData, setCalendarData] = useState([]);
  const [currentVisibleMonth, setCurrentVisibleMonth] = useState(initialDate);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const containerRef = useRef(null);
  const monthRefs = useRef([]);
  const intersectionObserver = useRef(null);
  const scrollTimeout = useRef(null);
  
  // Initialize calendar data
  useEffect(() => {
    const data = generateCalendarData(centerMonth, bufferMonths);
    setCalendarData(data);
  }, [centerMonth, bufferMonths]);
  
  // Set up intersection observer for loading more months
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const monthIndex = parseInt(entry.target.dataset.monthIndex);
            const totalMonths = calendarData.length;
            
            // Load more months if we're near the edges
            if (monthIndex <= 2) {
              // Near the beginning, load more past months
              setCenterMonth(prev => subMonths(prev, bufferMonths));
            } else if (monthIndex >= totalMonths - 3) {
              // Near the end, load more future months
              setCenterMonth(prev => addMonths(prev, bufferMonths));
            }
          }
        });
      },
      {
        root: containerRef.current,
        rootMargin: '200px',
        threshold: 0.1
      }
    );
    
    intersectionObserver.current = observer;
    
    return () => {
      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect();
      }
    };
  }, [calendarData, bufferMonths]);
  
  // Set up observers for month elements
  useEffect(() => {
    if (!intersectionObserver.current) return;
    
    monthRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.dataset.monthIndex = index;
        intersectionObserver.current.observe(ref);
      }
    });
    
    return () => {
      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect();
      }
    };
  }, [calendarData]);
  
  // Track which month is most visible for header updates
  const updateVisibleMonth = useCallback(
    throttle(() => {
      if (!containerRef.current || monthRefs.current.length === 0) return;
      
      const mostVisible = getMostVisibleMonth(monthRefs.current, containerRef.current);
      if (mostVisible && calendarData[mostVisible.index]) {
        setCurrentVisibleMonth(calendarData[mostVisible.index].date);
      }
    }, 100),
    [calendarData]
  );
  
  // Handle scroll events
  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    updateVisibleMonth();
    
    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    // Set scroll to false after scrolling stops
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [updateVisibleMonth]);
  
  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll]);
  
  // Function to scroll to a specific month
  const scrollToMonth = useCallback((targetDate) => {
    const targetIndex = calendarData.findIndex(month => 
      month.date.getFullYear() === targetDate.getFullYear() &&
      month.date.getMonth() === targetDate.getMonth()
    );
    
    if (targetIndex !== -1 && monthRefs.current[targetIndex]) {
      monthRefs.current[targetIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [calendarData]);
  
  // Function to register month ref
  const registerMonthRef = useCallback((index, element) => {
    monthRefs.current[index] = element;
  }, []);
  
  return {
    containerRef,
    calendarData,
    currentVisibleMonth,
    isScrolling,
    scrollToMonth,
    registerMonthRef
  };
};