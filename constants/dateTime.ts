// src/constants/dateTime.ts
import moment from 'moment';

// Default date/time formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_24_FORMAT = 'HH:mm';         // 24-hour format
export const TIME_12_FORMAT = 'hh:mm A';       // 12-hour format with AM/PM
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const YEAR_FORMAT = 'YYYY';

// Helper functions
export const getCurrentDate = () => moment().format(DATE_FORMAT);
export const getCurrentTime24 = () => moment().format(TIME_24_FORMAT);
export const getCurrentTime12 = () => moment().format(TIME_12_FORMAT);
export const getCurrentDateTime = () => moment().format(DATE_TIME_FORMAT);
export const getCurrentYear = () => moment().format(YEAR_FORMAT);

// Format a given date
export const formatDate = (date: string | Date, format: string = DATE_FORMAT) =>
  moment(date).format(format);

// Format a given time (12-hour or 24-hour)
export const formatTime = (
  time: string | Date,
  format: string = TIME_12_FORMAT
) => moment(time).format(format);

// Check if a date is before today
export const isPastDate = (date: string | Date) => moment(date).isBefore(moment());

// Difference between dates in days
export const diffInDays = (startDate: string | Date, endDate: string | Date) =>
  moment(endDate).diff(moment(startDate), 'days');
