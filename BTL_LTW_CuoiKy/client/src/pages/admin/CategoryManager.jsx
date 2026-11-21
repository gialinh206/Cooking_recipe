import { useState } from 'react';
import api, { errMsg } from '../../api/axios';
import { useFetch } from '../../hooks/useFetch';
import Spinner from '../../components/Spinner.jsx';

const CategoryManager = () => {
  const { data, loading, refetch } = useFetch('/categories');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name });
      setName(''); setError('');
      refetch();
    } catch (err) { setError(errMsg(err)); }
  };
  const handleDelete = async (id) => {
    try { await api.delete(`/categories/${id}`); refetch(); } catch (err) { setError(errMsg(err)); }
  };

  if (loading) return <Spinner />;
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Loại món</h1>
      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <label htmlFor="catName" className="sr-only">Tên loại món</label>
        <input id="catName" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên loại món mới" />
        <button type="submit" className="btn">Thêm</button>
      </form>
      {error && <p className="mb-2 text-red-600" role="alert">{error}</p>}
      <ul className="space-y-2">
        {data?.data.map((c) => (
          <li key={c._id} className="flex items-center justify-between rounded border border-gray-200 p-2 dark:border-gray-700">
            {c.name}
            <button type="button" className="btn-outline text-red-600" onClick={() => handleDelete(c._id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </>
  );
};
export default CategoryManager;
