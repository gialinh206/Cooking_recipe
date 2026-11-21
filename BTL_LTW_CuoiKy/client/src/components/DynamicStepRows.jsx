const DynamicStepRows = ({ rows, onChange, error }) => {
  const update = (i, content) => onChange(rows.map((r, idx) => (idx === i ? { ...r, content } : r)));
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i));
  const add = () => onChange([...rows, { key: crypto.randomUUID(), content: '' }]);

  return (
    <fieldset className="mb-3">
      <legend className="mb-1 text-sm font-medium">Các bước làm</legend>
      {rows.map((r, i) => (
        <div key={r.key} className="mb-2 flex gap-2">
          <span className="pt-2">{i + 1}.</span>
          <textarea className="input" rows={2} aria-label={`Bước ${i + 1}`} value={r.content} onChange={(e) => update(i, e.target.value)} />
          <button type="button" className="btn-outline" onClick={() => remove(i)} disabled={rows.length === 1} aria-label="Xóa bước">✕</button>
        </div>
      ))}
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <button type="button" className="btn-outline" onClick={add}>+ Thêm bước</button>
    </fieldset>
  );
};
export default DynamicStepRows;
