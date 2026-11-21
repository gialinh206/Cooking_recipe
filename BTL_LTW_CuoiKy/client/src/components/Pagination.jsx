const Pagination = ({ page, pages, onChange }) => {
  if (!pages || pages <= 1) return null;
  return (
    <nav className="mt-4 flex items-center justify-center gap-3" aria-label="Phân trang">
      <button type="button" className="btn-outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>Trước</button>
      <span>Trang {page}/{pages}</span>
      <button type="button" className="btn-outline" disabled={page >= pages} onClick={() => onChange(page + 1)}>Sau</button>
    </nav>
  );
};
export default Pagination;
