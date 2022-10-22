import styles from "./ButtonContainer.module.css";

export function ButtonContainer({ children }: any) {
  return <div className={styles["button-container"]}>{children}</div>;
}
