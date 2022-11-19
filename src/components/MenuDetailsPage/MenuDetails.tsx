import imagePlaceholder from "../../resources/image-placeholder.png";
import editIcon from "../../resources/edit-icon.svg";
import deleteIcon from "../../resources/delete-icon.svg";
import { formatPrice } from "../../lib/formatting";
import styles from "./MenuDetails.module.scss";
import { useNavigate } from "react-router-dom";
import { displayType } from "../../lib/types";
import { Modal, useModal } from "../Modal";
import DeleteModal from "./DeleteModal";
import { useCallback } from "react";
import { useSessionContext } from "../../contexts/SessionContext";
import { apiDeleteMenu } from "../../lib/api";
import { Menu, MenuType } from "../../lib/types";
import { toast } from "react-toastify";
import { axiosErrorHandler } from "../../lib/error";
import { ConditionalLink, to, useSyncedState } from "../../lib/hooks";

type MenuDetailsProps = { menu?: Menu };

export default function MenuDetails({ menu }: MenuDetailsProps) {
  const formattedPrice = formatPrice(menu?.price ?? 0);
  const navigate = useNavigate();
  const modalHandle = useModal();
  const { withToken } = useSessionContext();
  const onDelete = useCallback(() => {
    if (menu)
      withToken((token) => apiDeleteMenu(menu.id, token))
        .then(() => {
          toast.success("메뉴를 삭제하였습니다");
          navigate(`/stores/${menu.owner.id}`);
        })
        .catch(axiosErrorHandler("메뉴를 삭제할 수 없습니다"));
  }, [menu, navigate, withToken]);
  const [image, setImage] = useSyncedState(menu?.image);
  const { me } = useSessionContext();
  const iOwnThisMenu = me?.id === menu?.owner.id;
  return (
    <div className={styles["menu-details"]}>
      <div className={styles["info-container"]}>
        <img
          src={image ?? imagePlaceholder}
          onError={() => setImage(undefined)}
          alt="상품 이미지"
        />
        <h3>{menu?.name ?? "맛있는와플"}</h3>
        <p>{formattedPrice}원</p>
        <p>{displayType(menu?.type ?? MenuType.waffle)}</p>
        <p>{menu?.description}</p>
        {iOwnThisMenu && (
          <div className={styles["buttons-container"]}>
            <ConditionalLink
              to={to`/menus/${menu?.id}/edit`}
              className={styles["button"]}
            >
              <img src={editIcon} alt="수정" />
            </ConditionalLink>
            <button
              onClick={() => modalHandle.openModal()}
              className={styles["button"]}
            >
              <img src={deleteIcon} alt="삭제" />
            </button>
          </div>
        )}
      </div>
      <Modal handle={modalHandle}>
        <DeleteModal
          title="메뉴 삭제"
          onDelete={onDelete}
          onClose={modalHandle.closeModal}
        />
      </Modal>
    </div>
  );
}
