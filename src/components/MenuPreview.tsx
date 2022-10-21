import closeIcon from "../resources/close-icon.svg";
import imagePlaceholder from "../resources/image-placeholder.png";
import { formatPrice } from "../lib/formatting";
import styles from "./MenuPreview.module.css";
import { Link } from "react-router-dom";
import { Menu } from "../types/types";

export default function MenuPreview({
  menu,
  onClosePreview,
}: {
  menu: Menu;
  onClosePreview(): void;
}) {
  const formattedPrice = formatPrice(menu.price);
  return (
    <div className={styles["menu-preview"]}>
      <button
        className={styles["close-button"]}
        onClick={() => {
          onClosePreview();
        }}
      >
        <img src={closeIcon} alt="닫기" />
      </button>
      <div className={styles["info-container"]}>
        <img
          src={menu.image !== "" ? menu.image : imagePlaceholder}
          alt="상품 이미지"
        />
        <h3>{menu.name}</h3>
        <p>{formattedPrice}원</p>
        <Link className={styles["link-details"]} to={`/menus/${menu.id}`}>
          자세히 보기
        </Link>
      </div>
    </div>
  );
}
