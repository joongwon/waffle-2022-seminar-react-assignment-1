import searchIcon from "../../resources/search-icon.svg";
import styles from "./SearchBar.module.css";
import { useCallback, useId, useRef } from "react";
import { useSyncedState } from "../../lib/hooks";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

function useThrottle() {
  const task = useRef<(() => void) | null>(null);
  return useCallback((f: () => void, period: number) => {
    if (!task.current) {
      setTimeout(() => {
        task.current?.();
        task.current = null;
      }, period);
    }
    task.current = f;
  }, []);
}

export default function SearchBar({ search, setSearch }: SearchBarProps) {
  const id = useId();
  const [input, setInput] = useSyncedState(search);
  const throttle = useThrottle();
  return (
    <div className={styles["search-bar"]}>
      <label htmlFor={id}>이름 검색:</label>
      <div className={styles["input-container"]}>
        <input
          id={id}
          placeholder="검색어 입력"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            throttle(() => setSearch(e.target.value), 500);
          }}
        />
        <img src={searchIcon} alt="" />
      </div>
    </div>
  );
}
