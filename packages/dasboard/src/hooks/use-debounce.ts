import { useState, useEffect } from 'react';

/**
 * A custom React hook that debounces a value.
 *
 * @param value The value to debounce (e.g., a search term from an input).
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced value, which only updates after the specified delay has passed without the original value changing.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      // Set a timer to update the debounced value after the delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // This is the cleanup function that will be called
      // if the `value` or `delay` changes before the timer finishes.
      // It cancels the previous timer, preventing the old value from being set.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}