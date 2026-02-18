import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/atoms/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const variantColors = {
    danger: 'text-red-500 bg-red-500/10',
    warning: 'text-yellow-500 bg-yellow-500/10',
    info: 'text-cyber-blue bg-cyber-blue/10',
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-full max-w-sm bg-midnight border border-code-gray rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between p-4 border-b border-code-gray/50 bg-midnight-light">
          <h3 id="confirm-modal-title" className="font-display font-semibold text-white">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close confirmation modal"
            className="text-text-secondary hover:text-white transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div
            className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${variantColors[variant]}`}
          >
            <FaExclamationTriangle className="h-6 w-6" />
          </div>
          <p className="text-text-secondary mb-6">{message}</p>

          <div className="flex gap-3 justify-center">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              {cancelText}
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              isLoading={isLoading}
              className={`flex-1 ${variant === 'danger' ? 'bg-red-600 hover:bg-red-500 border-red-500' : ''}`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
