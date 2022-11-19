import { useEffect, useState } from "react";
import closeIcon from "../../resources/close-icon.svg";
import imagePlaceholder from "../../resources/image-placeholder.png";
import { formatPrice } from "../../lib/formatting";
import styles from "./MenuPreview.module.css";
import { Link } from "react-router-dom";
import { displayType, Menu, MenuType } from "../../lib/types";
import { DummyMenu } from "../../lib/types";

interface MenuPreviewProps {
  menu: Menu | DummyMenu | null;

  onClosePreview(): void;
}

export default function MenuPreview({
  menu: menuInput,
  onClosePreview,
}: MenuPreviewProps) {
  const [menu, setMenu] = useState<typeof menuInput>(null);
  useEffect(() => {
    if (menuInput) {
      setMenu(menuInput);
    } else {
      const timeoutId = window.setTimeout(() => setMenu(menuInput), 300);
      return () => window.clearTimeout(timeoutId);
    }
  }, [setMenu, menuInput]);

  return (
    menu && (
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
            src={menu.image ?? imagePlaceholder}
            onError={() => setMenu({ ...menu, image: imagePlaceholder })}
            alt="상품 이미지"
          />
          <h3>{menu.name ?? "맛있는 와플"}</h3>
          <p>{formatPrice(menu.price ?? 0)}원</p>
          <p>{displayType(menu.type ?? MenuType.waffle)}</p>
          <Link className={styles["link-details"]} to={`/menus/${menu.id}`}>
            자세히 보기
          </Link>
        </div>
      </div>
    )
  );
}
