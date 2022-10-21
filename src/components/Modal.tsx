import { useCallback, useEffect, useRef, useState } from "react";
import "./Modal.css";

export function useModal({
  children,
  onBackgroundClicked,
  afterClosed = () => {},
}: {
  afterClosed?: () => void;
  children: any;
  onBackgroundClicked(): void;
}) {
  const [state, setState] = useState<"open" | "closed" | "closing">("closed");
  const openModal = useCallback(() => {
    setState("open");
  }, []);
  const timeoutId = useRef<number>();
  const closeModal = useCallback(() => {
    console.log("closing");
    setState("closing");
    timeoutId.current = window.setTimeout(() => {
      console.log("closed");
      setState("closed");
      afterClosed();
    }, 300);
  }, [afterClosed]);
  // clean up timeout on unmount
  useEffect(() => () => window.clearTimeout(timeoutId.current));
  const modal = state !== "closed" && (
    <div
      className={`modal-container ${state}`}
      onClick={() => {
        onBackgroundClicked();
      }}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
  return {
    modal,
    openModal,
    closeModal,
  };
}
