import searchIcon from "../resources/search-icon.svg";

export default function SearchBar({ search, setSearch }) {
  return (
    <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
      <label>이름 검색:</label>
      <div className="input-container">
        <input
          placeholder="검색어 입력"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <img src={searchIcon} alt="" />
      </div>
    </form>
  );
}
