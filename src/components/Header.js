import waffleLogo from "../resources/waffle-logo.svg";

export default function Header() {
  return (
    <header>
      <img src={waffleLogo} alt="와플스튜디오 로고" />
      <h1>와플스튜디오 메뉴 관리</h1>
    </header>
  );
}
