import styles from "./index.module.css";
import { useParams } from "react-router-dom";
import MenuDetails from "./MenuDetails";
import ArrowBackIcon from "../../resources/arrow-back-icon.svg";
import { useApiData, useApiMenuFetcher } from "../../lib/api";
import { useSetHeaderOwner } from "../../contexts/HeaderDataContext";
import ReviewList from "./ReviewList";
import { ConditionalLink, RedirectWithMessage, to } from "../../lib/hooks";
import { axiosErrorStatus } from "../../lib/error";

export default function MenuDetailsPage() {
  const menuId = Number(useParams().menuId);
  const { data: menu, error } = useApiData(useApiMenuFetcher(menuId));
  useSetHeaderOwner(menu?.owner ?? null);
  return axiosErrorStatus(error) === 404 ? (
    <RedirectWithMessage message="해당하는 아이디의 메뉴가 없습니다" to={-1} />
  ) : (
    <div className={styles["container"]}>
      <ConditionalLink to={to`/stores/${menu?.owner.id}#menu-${menuId}`}>
        <img src={ArrowBackIcon} alt="" width="32px" />
        메뉴 목록
      </ConditionalLink>
      <MenuDetails menu={menu} />
      <div className={styles["review-container"]}>
        <ReviewList menuId={menuId} />
      </div>
    </div>
  );
}
