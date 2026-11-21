// Thêm/bớt nguyên liệu động, luôn tạo mảng mới (không mutate)
const DynamicIngredientRows = ({ rows, onChange, error }) => {
  const update = (i, patch) => onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i));
  const add = () => onChange([...rows, { key: crypto.randomUUID(), name: '', amount: '', unit: '' }]);

  return (
    <fieldset className="mb-3">
      <legend className="mb-1 text-sm font-medium">Nguyên liệu</legend>
      {rows.map((r, i) => (
        <div key={r.key} className="mb-2 flex gap-2">
          <input className="input" placeholder="Tên" aria-label="Tên nguyên liệu" value={r.name} onChange={(e) => update(i, { name: e.target.value })} />
          <input className="input w-24" type="number" min="0" step="any" placeholder="SL" aria-label="Số lượng" value={r.amount} onChange={(e) => update(i, { amount: e.target.value })} />
          <input className="input w-24" placeholder="Đơn vị" aria-label="Đơn vị" value={r.unit} onChange={(e) => update(i, { unit: e.target.value })} />
          <button type="button" className="btn-outline" onClick={() => remove(i)} disabled={rows.length === 1} aria-label="Xóa dòng">✕</button>
        </div>
      ))}
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <button type="button" className="btn-outline" onClick={add}>+ Thêm nguyên liệu</button>
    </fieldset>
  );
};
export default DynamicIngredientRows;
