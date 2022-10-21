import { useMemo, useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import MenuList from "../components/MenuList";
import addIcon from "../resources/add-icon.svg";
import MenuDetails from "../components/MenuDetails";
import { useMenuDataContext } from "../contexts/MenuDataContext";
import { Link } from "react-router-dom";
import { useModal } from "../components/Modal";
import DeleteModal from "../components/DeleteModal";

function MenuListPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { getMenuById, filterMenus, deleteMenu } = useMenuDataContext();
  const { modal, openModal, closeModal } = useModal({
    children: (
      <DeleteModal
        handleDeleteMenu={() => {
          if (selectedId === null) return;
          setSelectedId(null);
          deleteMenu(selectedId);
        }}
        handleCloseModal={() => closeModal()}
      />
    ),
    onBackgroundClicked() {
      closeModal();
    },
  });

  const selectedMenu = useMemo(
    () => selectedId && getMenuById(selectedId),
    [getMenuById, selectedId]
  );
  const filteredMenus = useMemo(
    () => filterMenus(search),
    [filterMenus, search]
  );

  return (
    <>
      <div className="app">
        <Header />
        <div className={`container ${selectedId !== null ? "selected" : ""}`}>
          <div className="search-wrapper">
            <SearchBar search={search} setSearch={setSearch} />
          </div>
          <div className="list-wrapper">
            <MenuList
              menus={filteredMenus}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
            <Link to="/menus/new" className="open-add-modal">
              <img src={addIcon} alt="새 메뉴" />
            </Link>
          </div>
          {selectedMenu && (
            <div className="details-wrapper">
              <MenuDetails
                menu={selectedMenu}
                onCloseDetail={() => setSelectedId(null)}
                onDeleteButton={() => openModal()}
              />
            </div>
          )}
        </div>
      </div>
      {modal}
    </>
  );
}

export default MenuListPage;
