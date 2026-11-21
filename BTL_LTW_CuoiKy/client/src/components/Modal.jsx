import { useEffect } from 'react';

const Modal = ({ title, onClose, children }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey); // cleanup listener
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" className="max-h-[85vh] w-full max-w-lg overflow-auto rounded bg-white p-4 dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Đóng">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};
export default Modal;
