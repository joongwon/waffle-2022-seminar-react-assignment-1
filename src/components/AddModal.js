import { useState } from "react";
import Modal from "./Modal";

export default function AddModal({ handleAddMenu, handleCloseModal }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  return (
    <Modal>
      <div className="modal-title">메뉴 추가</div>
      <div className="modal-form">
        <label htmlFor="name">이름</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="price">가격</label>
        <input
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <label htmlFor="image">상품 이미지</label>
        <input
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <div className="modal-button-container">
        <button
          className="green-button"
          onClick={() => handleAddMenu({ name, price, image })}
        >
          추가
        </button>
        <button onClick={() => handleCloseModal()}>취소</button>
      </div>
    </Modal>
  );
}
