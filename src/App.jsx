import React from 'react';
import Header from './components/UI/Header.jsx';
import Calendar from './components/Calendar/Calendar.jsx';
import JournalEntryModal from './components/JournalEntry/JournalEntryModal.jsx';
import { useCalendarData } from './hooks/useCalendarData.js';

function App() {
  const {
    // Calendar data
    containerRef,
    calendarData,
    currentVisibleMonth,
    isScrolling,
    registerMonthRef,
    loading,
    
    // Selection and modal
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
    goToToday,
    goToCurrentMonth
  } = useCalendarData();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header
        currentVisibleMonth={currentVisibleMonth}
        isScrolling={isScrolling}
        onGoToToday={goToToday}
        onGoToCurrentMonth={goToCurrentMonth}
      />
      
      {/* Main Calendar */}
      <Calendar
        containerRef={containerRef}
        calendarData={calendarData}
        currentVisibleMonth={currentVisibleMonth}
        isScrolling={isScrolling}
        registerMonthRef={registerMonthRef}
        onDateSelect={handleDateSelect}
        onEntrySelect={handleEntrySelect}
        loading={loading}
      />
      
      {/* Journal Entry Modal */}
      <JournalEntryModal
        entry={selectedEntry}
        isOpen={isModalOpen}
        onClose={closeModal}
        onNext={navigateToNextEntry}
        onPrevious={navigateToPreviousEntry}
        canNavigateNext={canNavigateNext}
        canNavigatePrevious={canNavigatePrevious}
      />
    </div>
  );
}

export default App;
