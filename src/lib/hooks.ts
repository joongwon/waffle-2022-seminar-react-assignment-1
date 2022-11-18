import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

export function useMySearchParams(key: string) {
  const [searchParams, setParams] = useSearchParams();
  const search = searchParams.get(key);
  const setSearch = useCallback(
    (newValue: string | null) => {
      setParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (newValue) newParams.set(key, newValue);
        else newParams.delete(key);
        return newParams;
      });
    },
    [key, setParams]
  );
  return [search, setSearch] as const;
}
