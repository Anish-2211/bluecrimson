import { useState, useEffect } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete User",
  message = "Are you sure you want to delete this user?",
  confirmText = "Yes, Delete",
  cancelText = "Cancel"
}: DeleteModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
      setClosing(false);
    }, 250);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      handleClose();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes slideDown {
          0% { transform: translateY(-20px) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-20px) scale(0.95); opacity: 0; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .modal-slide-down { 
          animation: slideDown 0.25s ease-out forwards; 
        }
        .modal-slide-up { 
          animation: slideUp 0.25s ease-in forwards; 
        }
        .backdrop-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .backdrop-fade-out {
          animation: fadeOut 0.2s ease-in forwards;
        }
      `}</style>

      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          closing ? 'backdrop-fade-out' : 'backdrop-fade-in'
        }`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      >
        <div className="modal-dialog modal-dialog-centered" style={{ marginTop: '5vh', marginBottom: '5vh' }}>
          <div
            className={`bg-white rounded-xl shadow-xl max-w-md w-full mx-4 border-0 ${
              closing ? 'modal-slide-up' : 'modal-slide-down'
            }`}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              padding: '10px 0px 20px 0px'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-4 pb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}
                >
                  <AlertTriangle className="h-6 w-6" style={{ color: '#dc3545' }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50 rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-2 text-center">
              <p className="text-gray-700 mb-2 font-medium">
                {message}
              </p>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>

            {/* Footer */}
            <div className="flex justify-center gap-3 px-6 pt-4 pb-2 mt-2">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="btn-cancel px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-300 ease-in-out disabled:opacity-50 border"
                style={{
                  backgroundColor: '#fff',
                  color: 'var(--bs-primary, #3b82f6)',
                  border: '1px solid var(--bs-primary, #3b82f6)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bs-primary, #3b82f6)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.color = 'var(--bs-primary, #3b82f6)';
                }}
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="btn-delete px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-300 ease-in-out disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: '1px solid #dc3545'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#b02a37';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc3545';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                      style={{
                        width: '1rem',
                        height: '1rem',
                        border: '2px solid currentColor',
                        borderRightColor: 'transparent'
                      }}
                    ></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    {confirmText}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;