import { useCallback, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import MenuList from "./MenuList";
import addIcon from "../../resources/add-icon.svg";
import MenuPreview from "./MenuPreview";
import { Link, useParams } from "react-router-dom";
import styles from "./index.module.css";
import { useSessionContext } from "../../contexts/SessionContext";
import {
  DummyMenu,
  Menu,
  useApiData,
  useApiMenuFetcher,
  useApiMenuListFetcher,
  useApiOwnerInfo,
} from "../../lib/api";
import { nanToNull } from "../../lib/formatting";
import { useMySearchParams } from "../../lib/hooks";
import { useHeaderDataContext } from "../../contexts/HeaderDataContext";

function useSelectedMenu(ownerId: number | null) {
  const [rawSelectedId, setSelectedId] = useMySearchParams("menu");
  const selectedId = nanToNull(parseInt(rawSelectedId ?? "NaN"));
  const [selectedMenu, setSelectedMenu] = useState<Menu | null | DummyMenu>(
    selectedId ? { id: selectedId } : null
  );
  const fetcher = useApiMenuFetcher(selectedId);
  const { data } = useApiData(fetcher);
  const select = useCallback(
    (menu: Menu | null) => {
      setSelectedId(menu?.id.toString() ?? null);
      setSelectedMenu(menu);
    },
    [setSelectedId]
  );
  useEffect(() => {
    if (!data) return;
    if (data.owner.id === ownerId) setSelectedMenu(data);
    else setSelectedMenu(null);
  }, [data, ownerId]);
  return { select, selectedMenu };
}

function MenuListPage() {
  const [search, setSearch] = useMySearchParams("search");
  const ownerId = nanToNull(parseInt(useParams().ownerId ?? "NaN"));
  const { selectedMenu, select } = useSelectedMenu(ownerId);
  const { me } = useSessionContext();
  const { data: menusData } = useApiData(
    useApiMenuListFetcher(ownerId, search)
  );
  const menus = menusData?.data ?? null;
  const { data: ownerData } = useApiData(useApiOwnerInfo(ownerId));
  const { setOwner } = useHeaderDataContext();
  useEffect(() => {
    ownerData && setOwner(ownerData?.owner);
  }, [ownerData, setOwner]);

  return (
    <>
      <div
        className={`${styles["container"]} ${
          selectedMenu ? styles["selected"] : ""
        }`}
      >
        <div>
          <SearchBar
            search={search ?? ""}
            setSearch={(newValue) =>
              setSearch(newValue.length === 0 ? null : newValue)
            }
          />
        </div>
        <div className={styles["list-wrapper"]}>
          <MenuList
            menus={menus}
            selectedId={selectedMenu?.id ?? null}
            select={select}
          />
          {me?.id === ownerId && (
            <Link to="/menus/new" className={styles["open-add-modal"]}>
              <img src={addIcon} alt="새 메뉴" />
            </Link>
          )}
        </div>
        <div
          className={`${styles["details-wrapper"]} ${
            selectedMenu ? "" : styles["closed"]
          }`}
        >
          <MenuPreview
            menu={selectedMenu}
            onClosePreview={() => {
              select(null);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default MenuListPage;
