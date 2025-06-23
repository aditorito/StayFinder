import React, { useState, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { checkInAtom, checkOutAtom } from '../store/atoms/Booking';

const AvailabilityDatePicker = ({ availability = [], onDateChange }) => {
  const [checkIn, setCheckIn] = useRecoilState(checkInAtom);
  const [checkOut, setCheckOut] = useRecoilState(checkOutAtom);

  // Convert availability periods to date ranges and find available periods
  const { availableDates, availablePeriods, minDate, maxDate } = useMemo(() => {
    if (!availability || availability.length === 0) {
      return { availableDates: new Set(), availablePeriods: [], minDate: '', maxDate: '' };
    }

    const dates = new Set();
    const periods = [];
    let min = null;
    let max = null;

    availability.forEach(period => {
      const fromDate = new Date(period.from);
      const toDate = new Date(period.to);
      
      // Store period info
      periods.push({
        from: fromDate.toISOString().split('T')[0],
        to: toDate.toISOString().split('T')[0],
        fromDate,
        toDate
      });
      
      // Update min and max dates
      if (!min || fromDate < min) min = fromDate;
      if (!max || toDate > max) max = toDate;

      // Add all dates in the range to the set
      const currentDate = new Date(fromDate);
      while (currentDate <= toDate) {
        dates.add(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return {
      availableDates: dates,
      availablePeriods: periods,
      minDate: min ? min.toISOString().split('T')[0] : '',
      maxDate: max ? max.toISOString().split('T')[0] : ''
    };
  }, [availability]);

  // Check if a date is available
  const isDateAvailable = (dateString) => {
    return availableDates.has(dateString);
  };

  // Find which period a date belongs to
  const findPeriodForDate = (dateString) => {
    return availablePeriods.find(period => 
      dateString >= period.from && dateString <= period.to
    );
  };

  // Check if checkout date is valid for the selected checkin
  const isValidCheckoutForCheckin = (checkinDate, checkoutDate) => {
    if (!checkinDate || !checkoutDate) return false;
    
    const checkinPeriod = findPeriodForDate(checkinDate);
    const checkoutPeriod = findPeriodForDate(checkoutDate);
    
    // Both dates must be in the same availability period
    return checkinPeriod && checkoutPeriod && 
           checkinPeriod.from === checkoutPeriod.from && 
           checkinPeriod.to === checkoutPeriod.to;
  };

  // Get max checkout date based on checkin period
  const getMaxCheckOutDate = () => {
    if (!checkIn) return maxDate;
    
    const checkinPeriod = findPeriodForDate(checkIn);
    return checkinPeriod ? checkinPeriod.to : maxDate;
  };

  // Handle check-in date change
  const handleCheckInChange = (e) => {
    const selectedDate = e.target.value;
    
    // Only allow if date is available
    if (!isDateAvailable(selectedDate)) {
      return;
    }
    
    setCheckIn(selectedDate);
    
    // Clear checkout if it's not valid for the new checkin period
    if (checkOut && !isValidCheckoutForCheckin(selectedDate, checkOut)) {
      setCheckOut('');
    }
    
    // Call parent callback
    if (onDateChange) {
      onDateChange({ 
        checkIn: selectedDate, 
        checkOut: checkOut && isValidCheckoutForCheckin(selectedDate, checkOut) ? checkOut : '' 
      });
    }
  };

  // Handle check-out date change
  const handleCheckOutChange = (e) => {
    const selectedDate = e.target.value;
    
    // Only allow if date is available and in same period as checkin
    if (!isDateAvailable(selectedDate) || !isValidCheckoutForCheckin(checkIn, selectedDate)) {
      return;
    }
    
    setCheckOut(selectedDate);
    
    // Call parent callback
    if (onDateChange) {
      onDateChange({ checkIn, checkOut: selectedDate });
    }
  };

  // Get the minimum checkout date (day after checkin)
  const getMinCheckOutDate = () => {
    if (!checkIn) return minDate;
    const nextDay = new Date(checkIn);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={handleCheckInChange}
            min={minDate}
            max={maxDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            style={{
              colorScheme: 'light'
            }}
          />
          {checkIn && !isDateAvailable(checkIn) && (
            <p className="text-sm text-red-600 mt-1">This date is not available for check-in</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={handleCheckOutChange}
            min={getMinCheckOutDate()}
            max={getMaxCheckOutDate()}
            disabled={!checkIn}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{
              colorScheme: 'light'
            }}
          />
          {checkOut && (!isDateAvailable(checkOut) || !isValidCheckoutForCheckin(checkIn, checkOut)) && (
            <p className="text-sm text-red-600 mt-1">
              {!isDateAvailable(checkOut) 
                ? "This date is not available for check-out" 
                : "Check-out must be within the same availability period as check-in"
              }
            </p>
          )}
        </div>
      </div>
      
      {/* Available periods display */}
      <div className="bg-green-50 p-3 rounded-lg">
        <h4 className="text-sm font-medium text-green-800 mb-2">Available Periods:</h4>
        <div className="space-y-1">
          {availablePeriods.map((period, index) => (
            <div key={index} className="text-sm text-green-700">
              Period {index + 1}: {period.from} to {period.to}
            </div>
          ))}
        </div>
        <p className="text-xs text-green-600 mt-2">
          ⚠️ You can only book dates within a single availability period
        </p>
      </div>
      
      {/* Display selected dates */}
      {(checkIn || checkOut) && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Selected Dates:</h4>
          <p className="text-sm text-gray-600">
            Check-in: {checkIn || 'Not selected'} | Check-out: {checkOut || 'Not selected'}
          </p>
        </div>
      )}
    </div>
  );
};

// Example usage component
export const App = ({availability = []}) => {
  console.log(availability);
  

  const handleDateChange = (dates) => {
    console.log('Selected dates:', dates);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Hotel Booking</h1>
      <AvailabilityDatePicker 
        availability={availability}
        onDateChange={handleDateChange}
      />
    </div>
  );
};
