import { useState } from 'react';

// Nhập nguyên liệu, nhấn Enter để thêm thành tag
const IngredientTagInput = ({ tags, onChange }) => {
  const [text, setText] = useState('');

  const add = () => {
    const t = text.trim().toLowerCase();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setText('');
  };
  return (
    <div>
      <input className="input" value={text} placeholder="Nguyên liệu đang có (Enter để thêm)"
        aria-label="Tìm theo nguyên liệu" onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800">
            {t} <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} aria-label={`Bỏ ${t}`}>✕</button>
          </span>
        ))}
      </div>
    </div>
  );
};
export default IngredientTagInput;
