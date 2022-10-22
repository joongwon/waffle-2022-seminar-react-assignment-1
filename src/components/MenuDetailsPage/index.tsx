import styles from "./index.module.css";
import { Link, useParams } from "react-router-dom";
import { useMenuDataContext } from "../../contexts/MenuDataContext";
import { useMemo } from "react";
import MenuDetails from "./MenuDetails";
import ArrowBackIcon from "../../resources/arrow-back-icon.svg";

export default function () {
  const { getMenuById } = useMenuDataContext();
  const menuId = Number(useParams().menuId);
  const menu = useMemo(() => getMenuById(menuId), [getMenuById, menuId]);
  if (!menu) throw new Error("존재하지 않는 메뉴입니다");
  return (
    <div className={styles["container"]}>
      <Link to={`/stores/1?menu=${menuId}`} className={styles["back-link"]}>
        <img src={ArrowBackIcon} alt="" width="32px" />
        메뉴 목록
      </Link>
      <MenuDetails menu={menu} />
      <div className={styles["review-container"]} />
    </div>
  );
}
