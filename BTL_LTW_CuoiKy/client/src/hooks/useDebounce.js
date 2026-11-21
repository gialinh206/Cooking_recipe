import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t); // cleanup timer
  }, [value, delay]);
  return debounced;
};
