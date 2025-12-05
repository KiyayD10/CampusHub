import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 400) {
  const [val, setVal] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setVal(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return val;
}
