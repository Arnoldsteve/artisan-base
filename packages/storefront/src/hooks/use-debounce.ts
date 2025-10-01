import { useState, useEffect } from 'react';

/**
 * A custom React hook that debounces a value.
 *
 * @param value The value to debounce (e.g., a search term from an input).
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced value, which only updates after the specified delay has passed without the original value changing.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay]
  );

  return debouncedValue;
}