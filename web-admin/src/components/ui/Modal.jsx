import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export default function Modal({
  isOpen = false,
  onClose,
  title,
  description,
  subtitle,
  children,
  footer,
  size = 'md',
  className = '',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-dialog modal-dialog--${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div>
            {title && <h3 className="modal-title">{title}</h3>}
            {(subtitle || description) && (
              <p className="modal-description">{subtitle || description}</p>
            )}
          </div>
          {onClose && (
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Tutup modal"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
