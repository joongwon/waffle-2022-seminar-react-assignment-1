import { useId, useState } from "react";
import { formatPrice, priceToNum } from "../lib/formatting";
import {
  greenButtonClass,
  ModalButtonContainer,
  ModalForm,
  ModalInputSuffix,
  ModalTitle,
} from "./Modal";
import { MenuCreateInput, MenuType } from "../types/types";

export default function AddModal({
  handleAddMenu,
  handleCloseModal,
  validateMenu,
}: {
  handleAddMenu(menu: MenuCreateInput): void;
  handleCloseModal(): void;
  validateMenu(menu: MenuCreateInput): string;
}) {
  const id = useId();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  return (
    <>
      <ModalTitle>메뉴 추가</ModalTitle>
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
            const menu = {
              name,
              price: priceToNum(price),
              image,
              type: MenuType.waffle,
            };
            const error = validateMenu(menu);
            if (error) alert(error);
            else {
              handleAddMenu(menu);
              handleCloseModal();
            }
          }}
        >
          추가
        </button>
        <button onClick={() => handleCloseModal()}>취소</button>
      </ModalButtonContainer>
    </>
  );
}
