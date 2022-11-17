import waffleLogo from "../resources/waffle-logo.svg";
import styles from "./Layout.module.css";
import { Link, Outlet } from "react-router-dom";
import { useSessionContext } from "../contexts/SessionContext";
import { useCallback } from "react";
import { apiLogout } from "../lib/api";

export default function Layout() {
  const { access_token, owner, setLoginInfo } = useSessionContext();
  const logout = useCallback(() => {
    access_token && apiLogout(access_token).catch();
    setLoginInfo(null);
  }, [access_token, setLoginInfo]);
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div>
          <Link to="/">
            <img src={waffleLogo} alt="와플스튜디오 로고" />
          </Link>
          <Link to="/">
            <h1>와플스튜디오 메뉴 관리</h1>
          </Link>
        </div>
        {owner ? (
          <div>
            <span>{owner.username}님 환영합니다!</span>
            <Link to={`stores/${owner.id}`} className={styles["button"]}>
              내 가게
            </Link>
            <button onClick={logout} className={styles["button"]}>
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
