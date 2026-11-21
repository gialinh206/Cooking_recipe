import { useFetch } from '../../hooks/useFetch';
import Spinner from '../../components/Spinner.jsx';

const AdminDashboard = () => {
  const { data, loading, error } = useFetch('/admin/stats/top-rated');
  if (loading) return <Spinner />;
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Món được đánh giá cao nhất</h1>
      {error && <p className="text-red-600">{error}</p>}
      <table className="w-full border-collapse">
        <thead><tr className="border-b text-left"><th className="p-2">Món</th><th className="p-2">Điểm TB</th><th className="p-2">Lượt đánh giá</th></tr></thead>
        <tbody>
          {data?.data.map((r) => (
            <tr key={r._id} className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-2">{r.title}</td><td className="p-2">{r.avg}</td><td className="p-2">{r.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default AdminDashboard;
