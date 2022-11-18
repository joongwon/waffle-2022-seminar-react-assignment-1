import imagePlaceholder from "../../resources/image-placeholder.png";
import editIcon from "../../resources/edit-icon.svg";
import deleteIcon from "../../resources/delete-icon.svg";
import { formatPrice } from "../../lib/formatting";
import styles from "./MenuDetails.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { displayType } from "../../lib/types";
import { Modal, useModal } from "../Modal";
import DeleteModal from "./DeleteModal";
import { useCallback, useEffect, useState } from "react";
import { useSessionContext } from "../../contexts/SessionContext";
import { apiDeleteMenu, Menu, MenuType } from "../../lib/api";
import { toast } from "react-toastify";

type MenuDetailsProps = { menu: Menu | null };

export default function MenuDetails({ menu }: MenuDetailsProps) {
  const formattedPrice = formatPrice(menu?.price ?? 0);
  const navigate = useNavigate();
  const modalHandle = useModal();
  const { withToken } = useSessionContext();
  const onDelete = useCallback(() => {
    menu &&
      withToken((token) => apiDeleteMenu(menu.id, token)).then(() => {
        toast.success("메뉴를 삭제하였습니다");
        navigate(`/stores/${menu.owner.id}`);
      });
  }, [menu, navigate, withToken]);
  const [image, setImage] = useState(menu?.image);
  useEffect(() => setImage(menu?.image), [menu]);
  const { me } = useSessionContext();
  return (
    <div className={styles["menu-details"]}>
      <div className={styles["info-container"]}>
        <img
          src={image ?? imagePlaceholder}
          onError={() => setImage(undefined)}
          alt="상품 이미지"
        />
        <h3>{menu?.name || "맛있는와플"}</h3>
        <p>{formattedPrice}원</p>
        <p>{displayType(menu?.type ?? MenuType.waffle)}</p>
        <p>{menu?.description}</p>
        {me?.id === menu?.owner.id && (
          <div className={styles["buttons-container"]}>
            <Link to={`/menus/${menu?.id}/edit`} className={styles["button"]}>
              <img src={editIcon} alt="수정" />
            </Link>
            <button
              onClick={() => modalHandle.openModal()}
              className={styles["button"]}
            >
              <img src={deleteIcon} alt="삭제" />
            </button>
          </div>
        )}
      </div>
      {
        <Modal handle={modalHandle}>
          <DeleteModal
            handleDeleteMenu={onDelete}
            handleCloseModal={modalHandle.closeModal}
          />
        </Modal>
      }
    </div>
  );
}
