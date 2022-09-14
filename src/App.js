import "./App.css";
import { useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MenuList from "./components/MenuList";
import addIcon from "./resources/add-icon.svg";

import initialData from "./data.json";
import MenuDetails from "./components/MenuDetails";
import {
  MODAL_ADD,
  MODAL_DELETE,
  MODAL_EDIT,
  MODAL_NONE,
} from "./lib/modalTypes";
import AddModal from "./components/AddModal";
import EditModal from "./components/EditModal";
import DeleteModal from "./components/DeleteModal";

function App() {
  const [nextId, setNextId] = useState(100);
  const [menus, setMenus] = useState(initialData);

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(MODAL_NONE);
  const [selectedId, setSelectedId] = useState(null);

  const selectedMenu = menus.find((menu) => menu.id === selectedId) ?? null;

  function addMenu(newMenu) {
    setMenus([...menus, { ...newMenu, id: nextId }]);
    setNextId(nextId + 1);
  }

  function updateMenu(editedMenu) {
    const newMenus = menus.map((menu) =>
      menu.id === selectedId ? { ...editedMenu, id: selectedId } : menu
    );
    setMenus(newMenus);
  }

  function deleteMenu() {
    setMenus(menus.filter((menu) => menu.id !== selectedId));
  }

  function closeModal() {
    setModal(MODAL_NONE);
  }

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
              menus={menus}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
            <button
              className="open-add-modal"
              onClick={() => setModal(MODAL_ADD)}
            >
              <img src={addIcon} alt="새 메뉴" />
            </button>
          </div>
          {selectedMenu && (
            <div className="details-wrapper">
              <MenuDetails
                menu={selectedMenu}
                setModal={setModal}
                handleCloseDetail={() => setSelectedId(null)}
              />
            </div>
          )}
        </div>
      </div>
      {modal !== MODAL_NONE && (
        <div
          className="modal-container"
          onClick={() => {
            closeModal();
          }}
        >
          {modal === MODAL_ADD ? (
            <AddModal handleAddMenu={addMenu} handleCloseModal={closeModal} />
          ) : modal === MODAL_EDIT ? (
            <EditModal
              handleUpdateMenu={updateMenu}
              handleCloseModal={closeModal}
              initialData={selectedMenu}
            />
          ) : modal === MODAL_DELETE ? (
            <DeleteModal
              handleDeleteMenu={deleteMenu}
              handleCloseModal={closeModal}
            />
          ) : null}
        </div>
      )}
    </>
  );
}

export default App;
