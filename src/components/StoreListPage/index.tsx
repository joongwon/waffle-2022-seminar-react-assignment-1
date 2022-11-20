import { Link } from "react-router-dom";
import { useApiData, useApiOwnerList } from "../../lib/api";
import { useMySearchParams } from "../../lib/hooks";
import SearchBar from "../MenuListPage/SearchBar";
import styles from "./index.module.scss";
import { Owner } from "../../lib/types";

export default function StoreListPage() {
  const [search, setSearch] = useMySearchParams("search");
  const { data: stores } = useApiData(useApiOwnerList(search));
  return (
    <div className={styles.page}>
      <div className={styles["search-container"]}>
        <SearchBar
          search={search ?? ""}
          setSearch={(value) =>
            value.length ? setSearch(value) : setSearch(null)
          }
        />
      </div>
      <ul>
        {stores?.map((store) => (
          <StoreDisplay owner={store} key={store.id} />
        ))}
      </ul>
    </div>
  );
}

function StoreDisplay({ owner }: { owner: Owner }) {
  return (
    <li>
      <Link to={`/stores/${owner.id}`}>
        <h1>{owner.store_name ?? "이름없는가게"}</h1>
        <h2>{owner.username}</h2>
        <p>{owner.store_description}</p>
      </Link>
    </li>
  );
}
