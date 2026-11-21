import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useFetch } from '../hooks/useFetch';
import Spinner from '../components/Spinner.jsx';
import { STATUS } from '../utils/helpers';

const MyRecipes = () => {
  const { data, loading, error, refetch } = useFetch('/recipes/mine');

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa công thức này?')) return;
    await api.delete(`/recipes/${id}`);
    refetch();
  };

  if (loading) return <Spinner />;
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Công thức của tôi</h1>
        <Link to="/recipes/new" className="btn">+ Đăng công thức</Link>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-2">
        {data?.data.map((r) => (
          <li key={r._id} className="flex items-center justify-between rounded border border-gray-200 p-3 dark:border-gray-700">
            <div>
              <Link to={`/recipes/${r._id}`} className="font-semibold">{r.title}</Link>
              <span className="ml-2 text-sm text-gray-500">{STATUS[r.status]}</span>
            </div>
            <div className="flex gap-2">
              <Link to={`/recipes/${r._id}/edit`} className="btn-outline">Sửa</Link>
              <button type="button" className="btn-outline text-red-600" onClick={() => handleDelete(r._id)}>Xóa</button>
            </div>
          </li>
        ))}
      </ul>
      {data?.data.length === 0 && <p className="text-gray-500">Bạn chưa đăng công thức nào.</p>}
    </>
  );
};
export default MyRecipes;
