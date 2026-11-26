import { useEffect, useRef, useState } from 'react';
import { imgUrl } from '../utils/helpers';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB, khớp với giới hạn của server

const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)}MB`;

// Giữ nguyên props cũ: file, currentUrl, onChange, error -> không cần sửa RecipeForm
const ImageUploader = ({ file, currentUrl, onChange, error }) => {
  const [preview, setPreview] = useState('');
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!file) { setPreview(''); return undefined; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url); // thu hồi URL khi đổi/bỏ ảnh
  }, [file]);

  const pick = (f) => {
    if (!f) return;
    if (!ALLOWED.includes(f.type)) { setLocalError('Chỉ nhận ảnh jpg, png hoặc webp.'); return; }
    if (f.size > MAX_SIZE) { setLocalError(`Ảnh nặng ${formatSize(f.size)}, tối đa là 2MB.`); return; }
    setLocalError('');
    onChange(f);
  };
  const clear = () => {
    setLocalError('');
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files[0]);
  };

  const shown = preview || (currentUrl ? imgUrl(currentUrl) : '');
  const message = localError || error;

  return (
    <div
      className="mb-3"
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <span className="mb-1 block text-sm font-medium">Ảnh món</span>

      <input
        ref={inputRef}
        id="image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="peer sr-only"
        onChange={(e) => pick(e.target.files[0])}
      />

      {shown ? (
        <div className={`overflow-hidden rounded-lg border ${dragging ? 'border-orange-500' : 'border-gray-300 dark:border-gray-600'}`}>
          <img src={shown} alt="Xem trước ảnh món" className="h-56 w-full object-cover" />
          <div className="flex flex-wrap items-center justify-between gap-2 p-2">
            <p className="min-w-0 truncate text-sm text-gray-500">
              {file ? `${file.name} (${formatSize(file.size)})` : 'Ảnh hiện tại của công thức'}
            </p>
            <div className="flex gap-2">
              <button type="button" className="btn-outline" onClick={() => inputRef.current?.click()}>Đổi ảnh</button>
              {file && <button type="button" className="btn-outline text-red-600" onClick={clear}>Bỏ ảnh đã chọn</button>}
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor="image"
          className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-orange-500 ${
            dragging
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
              : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'
          }`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="1.8" />
            <path d="m21 16-5-5-8 8" />
          </svg>
          <span className="font-medium">Bấm để chọn ảnh hoặc kéo thả vào đây</span>
          <span className="text-sm text-gray-500">jpg, png hoặc webp, tối đa 2MB</span>
        </label>
      )}

      {message && <p className="mt-1 text-sm text-red-600" role="alert">{message}</p>}
    </div>
  );
};
export default ImageUploader;