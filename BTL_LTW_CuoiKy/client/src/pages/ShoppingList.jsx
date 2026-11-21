import { useSelector } from 'react-redux';
import { useFetch } from '../hooks/useFetch';
import ShoppingListTable from '../components/ShoppingListTable.jsx';
import Spinner from '../components/Spinner.jsx';

// Lưu ý: cần bấm "Lưu thực đơn" ở trang Thực đơn trước, danh sách tính từ dữ liệu đã lưu
const ShoppingList = () => {
  const weekStart = useSelector((s) => s.mealPlan.weekStart);
  const { data, loading, error } = useFetch('/mealplans/shopping-list', { weekStart });
  if (loading) return <Spinner />;
  return (
    <>
      <h1 className="mb-1 text-2xl font-bold">Danh sách đi chợ</h1>
      <p className="mb-4 text-gray-500">Tuần bắt đầu {weekStart}</p>
      {error && <p className="text-red-600">{error}</p>}
      {data && (data.items.length ? <ShoppingListTable items={data.items} /> : <p>Thực đơn tuần này đang trống.</p>)}
    </>
  );
};
export default ShoppingList;
