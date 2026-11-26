import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../../api/axios';
import { useFetch } from '../../hooks/useFetch';
import Spinner from '../../components/Spinner.jsx';
import { imgUrl, STATUS } from '../../utils/helpers';

const TABS = ['pending', 'approved', 'rejected'];

// Quản lý toàn bộ công thức theo trạng thái: duyệt, từ chối, sửa, xóa
const AdminRecipes = () => {
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const { data, loading, refetch } = useFetch('/admin/recipes', { status });

  const changeStatus = async (id, next) => {
    try {
      await api.patch(`/admin/recipes/${id}/status`, { status: next });
      setError('');
      refetch();
    } catch (err) { setError(errMsg(err)); }
  };
  const handleDelete = async (r) => {
    if (!window.confirm(`Xóa công thức "${r.title}"? Đánh giá và lượt yêu thích của món này cũng bị xóa.`)) return;
    try {
      await api.delete(`/recipes/${r._id}`);
      setError('');
      refetch();
    } catch (err) { setError(errMsg(err)); }
  };

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Quản lý công thức</h1>

      <div className="mb-4 flex gap-2" role="group" aria-label="Lọc theo trạng thái">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={status === t}
            className={status === t ? 'btn' : 'btn-outline'}
            onClick={() => setStatus(t)}
          >
            {STATUS[t]}
          </button>
        ))}
      </div>

      {error && <p className="mb-2 text-red-600" role="alert">{error}</p>}
      {loading ? <Spinner /> : (
        <>
          <ul className="space-y-2">
            {data?.data.map((r) => (
              <li key={r._id} className="flex flex-col gap-3 rounded border border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <img src={imgUrl(r.image)} alt="" className="h-14 w-20 rounded object-cover" />
                  <div>
                    <Link to={`/recipes/${r._id}`} className="font-semibold">{r.title}</Link>
                    <p className="text-sm text-gray-500">bởi {r.author?.name} · {r.category?.name}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.status !== 'approved' && (
                    <button type="button" className="btn" onClick={() => changeStatus(r._id, 'approved')}>Duyệt</button>
                  )}
                  {r.status !== 'rejected' && (
                    <button type="button" className="btn-outline" onClick={() => changeStatus(r._id, 'rejected')}>Từ chối</button>
                  )}
                  <Link to={`/recipes/${r._id}/edit`} className="btn-outline">Sửa</Link>
                  <button type="button" className="btn-outline text-red-600" onClick={() => handleDelete(r)}>Xóa</button>
                </div>
              </li>
            ))}
          </ul>
          {data?.data.length === 0 && <p className="text-gray-500">Không có công thức nào ở trạng thái "{STATUS[status]}".</p>}
        </>
      )}
    </>
  );
};
export default AdminRecipes;