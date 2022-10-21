import closeIcon from "../resources/close-icon.svg";
import imagePlaceholder from "../resources/image-placeholder.png";
import editIcon from "../resources/edit-icon.svg";
import deleteIcon from "../resources/delete-icon.svg";
import { formatPrice } from "../lib/formatting";
import "./MenuDetails.css";
import { Link } from "react-router-dom";
import { Menu } from "../types/types";

export default function MenuDetails({
  menu,
  onCloseDetail,
  onDeleteButton,
}: {
  menu: Menu;
  onCloseDetail(): void;
  onDeleteButton(): void;
}) {
  const formattedPrice = formatPrice(menu.price);
  return (
    <div className="menu-details">
      <button
        className="close-button"
        onClick={() => {
          onCloseDetail();
        }}
      >
        <img src={closeIcon} alt="닫기" />
      </button>
      <div className="info-container">
        <img
          src={menu.image !== "" ? menu.image : imagePlaceholder}
          alt="상품 이미지"
        />
        <h3>{menu.name}</h3>
        <p>{formattedPrice}원</p>
        <div className="buttons-container">
          <Link to={`/menus/${menu.id}/edit`}>
            <img src={editIcon} alt="수정" />
          </Link>
          <button onClick={() => onDeleteButton()}>
            <img src={deleteIcon} alt="삭제" />
          </button>
        </div>
      </div>
    </div>
  );
}
