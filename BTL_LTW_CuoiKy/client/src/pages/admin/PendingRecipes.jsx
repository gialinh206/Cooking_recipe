import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useFetch } from '../../hooks/useFetch';
import Spinner from '../../components/Spinner.jsx';

const PendingRecipes = () => {
  const { data, loading, refetch } = useFetch('/admin/recipes', { status: 'pending' });

  const setStatus = async (id, status) => {
    await api.patch(`/admin/recipes/${id}/status`, { status });
    refetch();
  };

  if (loading) return <Spinner />;
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Công thức chờ duyệt</h1>
      <ul className="space-y-2">
        {data?.data.map((r) => (
          <li key={r._id} className="flex items-center justify-between rounded border border-gray-200 p-3 dark:border-gray-700">
            <div>
              <Link to={`/recipes/${r._id}`} className="font-semibold">{r.title}</Link>
              <p className="text-sm text-gray-500">bởi {r.author?.name} · {r.category?.name}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn" onClick={() => setStatus(r._id, 'approved')}>Duyệt</button>
              <button type="button" className="btn-outline text-red-600" onClick={() => setStatus(r._id, 'rejected')}>Từ chối</button>
            </div>
          </li>
        ))}
      </ul>
      {data?.data.length === 0 && <p className="text-gray-500">Không có công thức nào chờ duyệt.</p>}
    </>
  );
};
export default PendingRecipes;
