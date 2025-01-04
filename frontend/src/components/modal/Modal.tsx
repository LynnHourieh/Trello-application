import React, { useEffect, useRef } from "react";
import "./modal-styles.scss"; // Import your modal styles
import { ModalProps } from "../../models/components";
import Button from "../button/Button.tsx";
import { CloseIcon } from "../../assests/images/icons.tsx";

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title = "",
  modalActions,
  children,
  maxWidth = "500px",
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle scroll behavior (optional)
  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = contentRef.current;
      const isEnd = scrollHeight - scrollTop <= clientHeight;

      if (isEnd) {
        contentRef.current.classList.remove("show-border");
      } else {
        contentRef.current.classList.add("show-border");
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling of background when modal is open
    }

    return () => {
      document.body.style.overflow = "auto"; // Allow scrolling of background when modal is closed
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth }}
      >
        {title && (
          <div className="modal-header">
            {" "}
            <div>{title}</div>
              <Button
                icon={<CloseIcon />}
                variant="tertiary"
                onClickHandler={onClose}
                collapse
              />
          </div>
        )}

        <div ref={contentRef} onScroll={handleScroll} className="modal-body">
          {children}
        </div>
        {modalActions && (
          <div className="modal-footer">
            {modalActions.map((action, index) => (
              <Button key={index} {...action} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
