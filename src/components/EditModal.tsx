import { useEffect, useId, useState } from "react";
import { formatPrice, priceToNum } from "../lib/formatting";
import {
  greenButtonClass,
  ModalButtonContainer,
  ModalForm,
  ModalInputSuffix,
  ModalTitle,
} from "./Modal";
import { Menu, MenuUpdateInput } from "../lib/types";

export default function EditModal({
  handleUpdateMenu,
  handleCloseModal,
  validateMenu,
  initialData,
}: {
  handleUpdateMenu(menu: MenuUpdateInput): void;
  handleCloseModal(): void;
  validateMenu(menu: MenuUpdateInput): string;
  initialData: Menu;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  useEffect(() => {
    setName(initialData.name);
    setPrice(formatPrice(initialData.price));
    setImage(initialData.image ?? "");
  }, [initialData.image, initialData.name, initialData.price]);
  const id = useId();
  return (
    <>
      <ModalTitle>메뉴 수정</ModalTitle>
      <ModalForm>
        <label htmlFor={`${id}-name`}>이름</label>
        <input
          id={`${id}-name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor={`${id}-price`}>가격</label>
        <ModalInputSuffix suffix="원">
          <input
            id={`${id}-price`}
            value={price}
            onChange={(e) => setPrice(formatPrice(priceToNum(e.target.value)))}
          />
          <span className="input-suffix">원</span>
        </ModalInputSuffix>
        <label htmlFor={`${id}-image`}>상품 이미지</label>
        <input
          id={`${id}-image`}
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </ModalForm>
      <ModalButtonContainer>
        <button
          className={greenButtonClass}
          onClick={() => {
            const menu = { name, price: priceToNum(price), image };
            const error = validateMenu(menu);
            if (error) alert(error);
            else {
              handleUpdateMenu(menu);
              handleCloseModal();
            }
          }}
        >
          저장
        </button>
        <button onClick={() => handleCloseModal()}>취소</button>
      </ModalButtonContainer>
    </>
  );
}
