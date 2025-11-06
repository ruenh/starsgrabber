import { Component, JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
}

export const Modal: Component<ModalProps> = (props) => {
  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div class="modal-backdrop" onClick={handleBackdropClick}>
          <div class="modal-content" onClick={(e) => e.stopPropagation()}>
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
};
