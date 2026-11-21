import { useEffect, useState } from 'react';
import { imgUrl } from '../utils/helpers';

const ImageUploader = ({ file, currentUrl, onChange, error }) => {
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!file) { setPreview(''); return undefined; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url); // thu hồi URL khi đổi/bỏ ảnh
  }, [file]);

  return (
    <div className="mb-3">
      <label htmlFor="image" className="mb-1 block text-sm font-medium">Ảnh món (jpg/png/webp, ≤ 2MB)</label>
      <input id="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onChange(e.target.files[0] || null)} />
      {(preview || currentUrl) && <img src={preview || imgUrl(currentUrl)} alt="Xem trước" className="mt-2 h-40 rounded object-cover" />}
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
    </div>
  );
};
export default ImageUploader;
