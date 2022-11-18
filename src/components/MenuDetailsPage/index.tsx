import styles from "./index.module.css";
import { Link, useParams } from "react-router-dom";
import MenuDetails from "./MenuDetails";
import ArrowBackIcon from "../../resources/arrow-back-icon.svg";
import { useApiData, useApiMenuFetcher } from "../../lib/api";
import { useEffect } from "react";
import { useHeaderDataContext } from "../../contexts/HeaderDataContext";

export default function MenuDetailsPage() {
  const menuId = Number(useParams().menuId);
  const { setOwner } = useHeaderDataContext();
  const { data: menu } = useApiData(useApiMenuFetcher(menuId));
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
      <div className={styles["review-container"]} />
    </div>
  );
}
