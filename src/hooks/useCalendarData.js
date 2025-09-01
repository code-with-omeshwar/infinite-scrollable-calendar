import { useState, useEffect, useMemo } from 'react';
import { getCurrentDate } from '../utils/dateUtils.js';
import { useInfiniteScroll } from './useInfiniteScroll.js';
import { useJournalEntries } from './useJournalEntries.js';

/**
 * Main hook that combines calendar data with journal entries
 */
export const useCalendarData = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Initialize with current date set to September 2025 as per requirements
  const initialDate = useMemo(() => new Date(2025, 8, 1), []); // September 2025
  
  // Use infinite scroll functionality
  const {
    containerRef,
    calendarData,
    currentVisibleMonth,
    isScrolling,
    scrollToMonth,
    registerMonthRef
  } = useInfiniteScroll(initialDate);
  
  // Use journal entries functionality
  const {
    journalEntries,
    loading: entriesLoading,
    getEntriesForDate,
    hasEntriesForDate,
    getEntryById,
    getAllCategories
  } = useJournalEntries();
  
  // Combine calendar data with journal entries
  const enrichedCalendarData = useMemo(() => {
    if (entriesLoading) return calendarData;
    
    return calendarData.map(month => ({
      ...month,
      weeks: month.weeks.map(week =>
        week.map(date => ({
          date,
          entries: getEntriesForDate(date),
          hasEntries: hasEntriesForDate(date)
        }))
      )
    }));
  }, [calendarData, entriesLoading, getEntriesForDate, hasEntriesForDate]);
  
  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const entries = getEntriesForDate(date);
    if (entries.length > 0) {
      setSelectedEntry(entries[0]); // Select first entry
      setIsModalOpen(true);
    }
  };
  
  // Handle entry selection
  const handleEntrySelect = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
  };
  
  // Navigate to next entry
  const navigateToNextEntry = () => {
    if (!selectedEntry || !selectedDate) return;
    
    const dateEntries = getEntriesForDate(selectedDate);
    const currentIndex = dateEntries.findIndex(entry => entry.id === selectedEntry.id);
    
    if (currentIndex < dateEntries.length - 1) {
      setSelectedEntry(dateEntries[currentIndex + 1]);
    }
  };
  
  // Navigate to previous entry
  const navigateToPreviousEntry = () => {
    if (!selectedEntry || !selectedDate) return;
    
    const dateEntries = getEntriesForDate(selectedDate);
    const currentIndex = dateEntries.findIndex(entry => entry.id === selectedEntry.id);
    
    if (currentIndex > 0) {
      setSelectedEntry(dateEntries[currentIndex - 1]);
    }
  };
  
  // Check if navigation is available
  const canNavigateNext = () => {
    if (!selectedEntry || !selectedDate) return false;
    
    const dateEntries = getEntriesForDate(selectedDate);
    const currentIndex = dateEntries.findIndex(entry => entry.id === selectedEntry.id);
    
    return currentIndex < dateEntries.length - 1;
  };
  
  const canNavigatePrevious = () => {
    if (!selectedEntry || !selectedDate) return false;
    
    const dateEntries = getEntriesForDate(selectedDate);
    const currentIndex = dateEntries.findIndex(entry => entry.id === selectedEntry.id);
    
    return currentIndex > 0;
  };
  
  // Go to today
  const goToToday = () => {
    const today = getCurrentDate();
    scrollToMonth(today);
  };
  
  // Go to current month (September 2025)
  const goToCurrentMonth = () => {
    scrollToMonth(initialDate);
  };
  
  return {
    // Calendar data
    containerRef,
    calendarData: enrichedCalendarData,
    currentVisibleMonth,
    isScrolling,
    registerMonthRef,
    
    // Journal entries
    journalEntries,
    loading: entriesLoading,
    getAllCategories,
    
    // Selection and modal
    selectedDate,
    selectedEntry,
    isModalOpen,
    handleDateSelect,
    handleEntrySelect,
    closeModal,
    
    // Navigation
    navigateToNextEntry,
    navigateToPreviousEntry,
    canNavigateNext,
    canNavigatePrevious,
    scrollToMonth,
    goToToday,
    goToCurrentMonth,
    
    // Utilities
    getEntriesForDate,
    hasEntriesForDate,
    getEntryById
  };
};