import waffleLogo from "../resources/waffle-logo.svg";
import styles from "./Layout.module.css";
import { Link, Outlet } from "react-router-dom";
import { useSessionContext } from "../contexts/SessionContext";
import { useHeaderDataContext } from "../contexts/HeaderDataContext";

export default function Layout() {
  const { logout, me } = useSessionContext();
  const { owner } = useHeaderDataContext();
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div>
          <Link to="/">
            <img src={waffleLogo} alt="와플스튜디오 로고" />
          </Link>
          {owner ? (
            owner.username
          ) : (
            <Link to="/">
              <h1>와플스튜디오 메뉴 관리</h1>
            </Link>
          )}
        </div>
        {me ? (
          <div>
            <span>{me.username}님 환영합니다!</span>
            <Link to={`stores/${me.id}`} className={styles["button"]}>
              내 가게
            </Link>
            <button onClick={() => logout()} className={styles["button"]}>
              로그아웃
            </button>
          </div>
        ) : (
          <div>
            <Link to="/auth/login" className={styles["button"]}>
              로그인
            </Link>
          </div>
        )}
      </header>
      <Outlet />
    </div>
  );
}
