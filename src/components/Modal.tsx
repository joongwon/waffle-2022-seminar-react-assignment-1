import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Modal.css";

export function useModal(afterClosed = () => {}) {
  const [state, setState] = useState<"open" | "closed" | "closing">("closed");
  const openModal = useCallback(() => {
    setState("open");
  }, []);
  const timeoutId = useRef<number>();
  const closeModal = useCallback(() => {
    setState("closing");
    timeoutId.current = window.setTimeout(() => {
      setState("closed");
      afterClosed();
    }, 300);
  }, [afterClosed]);
  // clean up timeout on unmount
  useEffect(() => () => window.clearTimeout(timeoutId.current), []);
  return useMemo(
    () => ({
      state,
      openModal,
      closeModal,
    }),
    [closeModal, openModal, state]
  );
}

export function Modal({
  children,
  handle,
  onBackgroundClicked,
}: {
  handle: ReturnType<typeof useModal>;
  children: any;
  onBackgroundClicked?: () => void;
}) {
  return handle.state !== "closed" ? (
    <div
      className={`modal-container ${handle.state}`}
      onClick={onBackgroundClicked ?? handle.closeModal}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  ) : null;
}

export function ModalTitle({ children }: { children: any }) {
  return <div className="modal-title">{children}</div>;
}

export function ModalForm({ children }: { children: any }) {
  return <div className="modal-form">{children}</div>;
}

export function ModalInputSuffix({
  children,
  suffix,
}: {
  children: any;
  suffix: any;
}) {
  return (
    <div className="input-container">
      {children}
      <span className="input-suffix">{suffix}</span>
    </div>
  );
}

export function ModalButtonContainer({ children }: { children: any }) {
  return <div className="modal-button-container">{children}</div>;
}

export const redButtonClass = "red-button";
export const greenButtonClass = "green-button";
