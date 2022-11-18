import styles from "./index.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import MenuDetails from "./MenuDetails";
import ArrowBackIcon from "../../resources/arrow-back-icon.svg";
import { useApiData, useApiMenuFetcher } from "../../lib/api";
import { useEffect } from "react";
import { useHeaderDataContext } from "../../contexts/HeaderDataContext";
import ReviewList from "./ReviewList";
import { toast } from "react-toastify";
import axios from "axios";

export default function MenuDetailsPage() {
  const menuId = Number(useParams().menuId);
  const { setOwner } = useHeaderDataContext();
  const { data: menu, error } = useApiData(useApiMenuFetcher(menuId));
  const navigate = useNavigate();
  useEffect(() => {
    if (error && axios.isAxiosError(error) && error.response?.status === 404) {
      toast.warning("존재하지 않는 메뉴입니다");
      navigate(-1);
    }
  }, [error, navigate]);
  useEffect(() => {
    menu && setOwner(menu?.owner);
  }, [menu, setOwner]);
  return (
    <div className={styles["container"]}>
      <Link
        to={`/stores/${menu?.owner.id}?menu=${menuId}`}
        className={styles["back-link"]}
      >
        <img src={ArrowBackIcon} alt="" width="32px" />
        메뉴 목록
      </Link>
      <MenuDetails menu={menu} />
      <div className={styles["review-container"]}>
        <ReviewList menuId={menuId} />
      </div>
    </div>
  );
}
