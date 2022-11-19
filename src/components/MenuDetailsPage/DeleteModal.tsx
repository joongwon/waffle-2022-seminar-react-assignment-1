interface DeleteModalProps {
  title: string;
  onDelete(): void;
  onClose(): void;
}

const DeleteModal = ({ title, onDelete, onClose }: DeleteModalProps) => (
  <>
    <div className="modal-title">{title}</div>
    <p>정말로 삭제하시겠습니까?</p>
    <div className="modal-button-container">
      <button
        className="red-button"
        onClick={() => {
          onDelete();
          onClose();
        }}
      >
        삭제
      </button>
      <button onClick={() => onClose()}>취소</button>
    </div>
  </>
);
export default DeleteModal;
