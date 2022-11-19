import { useCallback, useEffect, useMemo } from "react";
import SearchBar from "./SearchBar";
import MenuList from "./MenuList";
import addIcon from "../../resources/add-icon.svg";
import MenuPreview from "./MenuPreview";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./index.module.css";
import { useSessionContext } from "../../contexts/SessionContext";
import {
  useApiData,
  useApiMenuFetcher,
  useApiMenuListFetcher,
  useApiOwnerInfo,
} from "../../lib/api";
import { nanToNull } from "../../lib/formatting";
import {
  RedirectWithMessage,
  to,
  useMySearchParams,
  useSyncedState,
} from "../../lib/hooks";
import { useSetHeaderOwner } from "../../contexts/HeaderDataContext";
import { DummyMenu, Menu } from "../../lib/types";
import { axiosErrorStatus } from "../../lib/error";

function useHashMenu() {
  const hash = useLocation().hash;
  const selectedId = hash.startsWith("#menu-")
    ? nanToNull(parseInt(hash.substring("#menu-".length)))
    : null;
  const navigate = useNavigate();
  const setSelectedId = useCallback(
    (newSelectedId: number | null) => {
      navigate({ hash: to`#menu-${newSelectedId ?? undefined}` ?? undefined });
    },
    [navigate]
  );
  return [selectedId, setSelectedId] as const;
}

function useSelectedMenu(ownerId: number | null) {
  const [selectedId, setSelectedId] = useHashMenu();
  const { data, error } = useApiData(useApiMenuFetcher(selectedId));
  const dummy = useMemo(
    () => (selectedId ? { id: selectedId } : null),
    [selectedId]
  );
  const [selectedMenu, setSelectedMenu] = useSyncedState<
    Menu | null | DummyMenu
  >(data ?? dummy);
  const select = useCallback(
    (menu: Menu | null) => {
      setSelectedMenu(menu);
      setSelectedId(menu?.id ?? null);
    },
    [setSelectedId, setSelectedMenu]
  );
  useEffect(() => {
    const invalidOwner =
      ownerId && selectedMenu?.owner && selectedMenu.owner.id !== ownerId;
    const menuNotFound = axiosErrorStatus(error?.payload) === 404;
    if (invalidOwner || menuNotFound) select(null);
  }, [error, ownerId, select, selectedMenu]);
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
  const { data: ownerData, error: ownerError } = useApiData(
    useApiOwnerInfo(ownerId)
  );
  useSetHeaderOwner(ownerData?.owner ?? null);
  if (!ownerId)
    return <RedirectWithMessage message="잘못된 주소입니다" to={-1} />;
  if (axiosErrorStatus(ownerError?.payload) === 404)
    return <RedirectWithMessage message="존재하지 않는 가게입니다" to={-1} />;
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
            onClosePreview={() => select(null)}
          />
        </div>
      </div>
    </>
  );
}

export default MenuListPage;
