import Modal from "./Modal";

export default function DeleteModal({ handleDeleteMenu, handleCloseModal }) {
  return (
    <Modal>
      <div className="modal-title">메뉴 삭제</div>
      <p>정말로 삭제하시겠습니까?</p>
      <div className="modal-button-container">
        <button
          className="red-button"
          onClick={() => {
            handleDeleteMenu();
            handleCloseModal();
          }}
        >
          삭제
        </button>
        <button onClick={() => handleCloseModal()}>취소</button>
      </div>
    </Modal>
  );
}
