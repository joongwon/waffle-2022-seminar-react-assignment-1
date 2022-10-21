import waffleLogo from "../resources/waffle-logo.svg";
import styles from "./Layout.module.css";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Link to="/">
          <img src={waffleLogo} alt="와플스튜디오 로고" />
        </Link>
        <Link to="/">
          <h1>와플스튜디오 메뉴 관리</h1>
        </Link>
      </header>
      <Outlet />
    </div>
  );
}
