import { useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import MenuList from "../components/MenuList";
import addIcon from "../resources/add-icon.svg";
import MenuPreview from "../components/MenuPreview";
import { useMenuDataContext } from "../contexts/MenuDataContext";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./MenuListPage.module.css";
import { nanToNull } from "../lib/formatting";

function MenuListPage() {
  const [search, setSearch] = useState("");
  const [params, setParams] = useSearchParams();
  const selectedId = nanToNull(Number(params.get("menu")));
  function setSelectedId(n: number | null) {
    if (n === null) setParams({});
    else setParams({ menu: n.toString() });
  }
  const { getMenuById, filterMenus } = useMenuDataContext();

  const selectedMenu = useMemo(
    () => selectedId !== null && getMenuById(selectedId),
    [getMenuById, selectedId]
  );
  const filteredMenus = useMemo(
    () => filterMenus(search),
    [filterMenus, search]
  );

  return (
    <>
      <div
        className={`${styles["container"]} ${
          selectedMenu ? styles["selected"] : ""
        }`}
      >
        <div>
          <SearchBar search={search} setSearch={setSearch} />
        </div>
        <div className={styles["list-wrapper"]}>
          <MenuList
            menus={filteredMenus}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
          <Link to="/menus/new" className={styles["open-add-modal"]}>
            <img src={addIcon} alt="새 메뉴" />
          </Link>
        </div>
        {selectedMenu && (
          <div className={styles["details-wrapper"]}>
            <MenuPreview
              menu={selectedMenu}
              onClosePreview={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default MenuListPage;
