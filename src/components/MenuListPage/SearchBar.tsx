import searchIcon from "../../resources/search-icon.svg";
import styles from "./SearchBar.module.css";

export default function SearchBar({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) {
  return (
    <div className={styles["search-bar"]}>
      <label>이름 검색:</label>
      <div className={styles["input-container"]}>
        <input
          placeholder="검색어 입력"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <img src={searchIcon} alt="" />
      </div>
    </div>
  );
}
