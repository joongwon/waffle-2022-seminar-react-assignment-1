import imagePlaceholder from "../resources/image-placeholder.png";
import editIcon from "../resources/edit-icon.svg";
import deleteIcon from "../resources/delete-icon.svg";
import { formatPrice } from "../lib/formatting";
import styles from "./MenuDetails.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "../types/types";
import { useModal } from "./Modal";
import DeleteModal from "./DeleteModal";
import { useMenuDataContext } from "../contexts/MenuDataContext";

export default function MenuDetails({ menu }: { menu: Menu }) {
  const formattedPrice = formatPrice(menu.price);
  const { deleteMenu } = useMenuDataContext();
  const navigate = useNavigate();
  const { closeModal, openModal, modal } = useModal({
    children: (
      <DeleteModal
        handleDeleteMenu={() => {
          deleteMenu(menu.id);
          navigate(`/stores/1`);
        }}
        handleCloseModal={() => closeModal()}
      />
    ),
    onBackgroundClicked: () => closeModal(),
  });
  return (
    <div className={styles["menu-details"]}>
      <div className={styles["info-container"]}>
        <img
          src={menu.image !== "" ? menu.image : imagePlaceholder}
          alt="상품 이미지"
        />
        <h3>{menu.name}</h3>
        <p>{formattedPrice}원</p>
        <p>{menu.description}</p>
        <div className={styles["buttons-container"]}>
          <Link to={`/menus/${menu.id}/edit`} className={styles["button"]}>
            <img src={editIcon} alt="수정" />
          </Link>
          <button onClick={() => openModal()} className={styles["button"]}>
            <img src={deleteIcon} alt="삭제" />
          </button>
        </div>
      </div>
      {modal}
    </div>
  );
}
