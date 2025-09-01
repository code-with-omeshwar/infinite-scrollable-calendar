import { useState, useEffect, useMemo } from 'react';
import { parseDateString, isSameDayUtil } from '../utils/dateUtils.js';
import journalEntriesData from '../data/journalEntries.json';

/**
 * Hook to manage journal entries
 */
export const useJournalEntries = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Parse and process journal entries
    const processedEntries = journalEntriesData.map((entry, index) => ({
      ...entry,
      id: `entry-${index}`,
      parsedDate: parseDateString(entry.date)
    })).filter(entry => entry.parsedDate !== null); // Filter out invalid dates
    
    setJournalEntries(processedEntries);
    setLoading(false);
  }, []);
  
  // Create a map of dates to entries for quick lookup
  const entriesByDate = useMemo(() => {
    const dateMap = new Map();
    
    journalEntries.forEach(entry => {
      const dateKey = entry.parsedDate.toDateString();
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey).push(entry);
    });
    
    return dateMap;
  }, [journalEntries]);
  
  /**
   * Get journal entries for a specific date
   */
  const getEntriesForDate = (date) => {
    const dateKey = date.toDateString();
    return entriesByDate.get(dateKey) || [];
  };
  
  /**
   * Check if a date has journal entries
   */
  const hasEntriesForDate = (date) => {
    return getEntriesForDate(date).length > 0;
  };
  
  /**
   * Get all entries in a date range
   */
  const getEntriesInRange = (startDate, endDate) => {
    return journalEntries.filter(entry => 
      entry.parsedDate >= startDate && entry.parsedDate <= endDate
    );
  };
  
  /**
   * Get entry by ID
   */
  const getEntryById = (id) => {
    return journalEntries.find(entry => entry.id === id);
  };
  
  /**
   * Get entries by category
   */
  const getEntriesByCategory = (category) => {
    return journalEntries.filter(entry => 
      entry.categories.includes(category)
    );
  };
  
  /**
   * Get all unique categories
   */
  const getAllCategories = () => {
    const categories = new Set();
    journalEntries.forEach(entry => {
      entry.categories.forEach(category => categories.add(category));
    });
    return Array.from(categories);
  };
  
  /**
   * Get entries sorted by rating
   */
  const getEntriesByRating = (minRating = 0) => {
    return journalEntries
      .filter(entry => entry.rating >= minRating)
      .sort((a, b) => b.rating - a.rating);
  };
  
  return {
    journalEntries,
    loading,
    entriesByDate,
    getEntriesForDate,
    hasEntriesForDate,
    getEntriesInRange,
    getEntryById,
    getEntriesByCategory,
    getAllCategories,
    getEntriesByRating
  };
};