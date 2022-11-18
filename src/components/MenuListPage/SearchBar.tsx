import searchIcon from "../../resources/search-icon.svg";
import styles from "./SearchBar.module.css";
import { useEffect, useId, useRef, useState } from "react";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function SearchBar({ search, setSearch }: SearchBarProps) {
  const id = useId();
  const [input, setInput] = useState(search);
  useEffect(() => {
    setInput(search);
  }, [search]);
  const timeOutTask = useRef<(() => void) | null>(null);
  return (
    <div className={styles["search-bar"]}>
      <label htmlFor={id}>이름 검색:</label>
      <div className={styles["input-container"]}>
        <input
          id={id}
          placeholder="검색어 입력"
          value={input}
          onChange={(e) => {
            console.log(timeOutTask.current);
            setInput(e.target.value);
            if (!timeOutTask.current)
              setTimeout(() => {
                if (timeOutTask.current) {
                  timeOutTask.current();
                  timeOutTask.current = null;
                }
              }, 500);
            timeOutTask.current = () => setSearch(e.target.value);
          }}
        />
        <img src={searchIcon} alt="" />
      </div>
    </div>
  );
}
