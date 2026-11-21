import api from '../../api/axios';
import { useFetch } from '../../hooks/useFetch';
import Spinner from '../../components/Spinner.jsx';
import StarRating from '../../components/StarRating.jsx';

const ReviewModeration = () => {
  const { data, loading, refetch } = useFetch('/admin/reviews');

  const toggle = async (id) => {
    await api.patch(`/reviews/${id}/hide`);
    refetch();
  };

  if (loading) return <Spinner />;
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Kiểm duyệt bình luận</h1>
      <ul className="space-y-2">
        {data?.data.map((r) => (
          <li key={r._id} className={`rounded border border-gray-200 p-3 dark:border-gray-700 ${r.hidden ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <span><strong>{r.user?.name}</strong> về <em>{r.recipe?.title}</em></span>
              <StarRating value={r.rating} readOnly />
            </div>
            <p>{r.comment}</p>
            <button type="button" className="btn-outline mt-2" onClick={() => toggle(r._id)}>{r.hidden ? 'Hiện lại' : 'Ẩn'}</button>
          </li>
        ))}
      </ul>
    </>
  );
};
export default ReviewModeration;
