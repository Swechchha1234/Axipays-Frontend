import React, { useEffect, useRef, useCallback } from 'react';
import '../../styles/component.css';
import Icon from '../../media/icon/icons';

const ResponsiveModal = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  children,
  title = '',
  content = '',
  iconName = '',
  iconColor = '',
  iconClassName = '',
  titleClassName = '',
  contentClassName = '',
  modalButtonCancel = '',
  modalButtonConfirm = '',
  modalContainerClass = '',
  modalHeaderClassName = '',
  modalButtonsClassName = '',
  icon = null,
  overlay = true,
  centered = false,
  customPosition = {},
  showButtons = false,
  showDivider = false,
  closeOnScroll = false,
  showDividerBottom = false,
  closeOnOutsideClick = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  const modalRef = useRef(null);
    // console.log("ref: ",modalRef)
  // Close modal when clicking outside
  const handleOutsideClick = useCallback(
    (e) => {
      if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    },
    [closeOnOutsideClick, onClose]
  );

  // Close modal on scroll
  const handleScroll = useCallback(() => {
    if (closeOnScroll) {
      onClose();
    }
  }, [closeOnScroll, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    if (closeOnOutsideClick) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    if (closeOnScroll) {
      document.addEventListener('scroll', handleScroll);
    }

    // Cleanup listeners on unmount or dependency change
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, handleOutsideClick, handleScroll]);

  if (!isOpen) return null;

  return (
    <>
      {overlay && <div className="modal-overlay" onClick={onClose} />}
      <div
        ref={modalRef}
        className={`modal-container ${centered ? 'modal-centered' : ''} ${modalContainerClass}`}
        style={centered ? {} : customPosition}
        onClick={(e) => e.stopPropagation()} // Prevent overlay clicks
      >
        <div className="modal-content">
          <div className={`modal-header ${modalHeaderClassName}`}>
            {title && (
              <div className={`modal-title ${titleClassName}`}>
                {icon && (
                  <div className={`modal-icon ${iconClassName}`}>
                    <Icon name={icon} width={20} height={20} color="#00264c" />
                  </div>
                )}
                {title}
              </div>
            )}
            {content && <p className={`modal-description ${contentClassName}`}>{content}</p>}
            <div className="cross-icon" onClick={onClose}>
              <Icon name="close_fill" width={20} height={20} color="#002966" />
            </div>
          </div>
          {showDivider && <div className="modal-divider" />}
          {children && <div className="modal-details">{children}</div>}
          {showDividerBottom && <div className="modal-divider" />}
          {showButtons && (
            <div className={`modal-actions ${modalButtonsClassName}`}>
              {cancelText && (
                <button className={`modal-button ${modalButtonCancel}`} onClick={onCancel}>
                  {cancelText}
                </button>
              )}
              {confirmText && (
                <button
                  className={`modal-button modal-confirm-btn ${modalButtonConfirm}`}
                  onClick={onConfirm}
                >
                  <Icon name={iconName} width={20} height={20} color={iconColor} />
                  {confirmText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResponsiveModal;
