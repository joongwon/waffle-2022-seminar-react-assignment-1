import Modal from "./Modal";

export default function DeleteModal({ handleDeleteMenu, handleCloseModal }) {
  return (
    <Modal>
      <div className="modal-title">메뉴 삭제</div>
      <div className="modal-button-container">
        <button className="red-button" onClick={() => handleDeleteMenu()}>
          저장
        </button>
        <button onClick={() => handleCloseModal()}>취소</button>
      </div>
    </Modal>
  );
}
