import { useState } from 'react';
import api, { errMsg } from '../api/axios';
import StarRating from './StarRating.jsx';

const ReviewForm = ({ recipeId, onDone }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setError('Vui lòng chọn số sao');
    setSubmitting(true);
    try {
      await api.post(`/recipes/${recipeId}/reviews`, { rating, comment });
      setRating(0); setComment(''); setError('');
      onDone?.();
    } catch (err) {
      setError(errMsg(err)); // ví dụ 409: Bạn đã đánh giá món này rồi
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <StarRating value={rating} onChange={setRating} />
      <label htmlFor="comment" className="sr-only">Bình luận</label>
      <textarea id="comment" className="input" rows={3} placeholder="Chia sẻ cảm nhận..." value={comment} onChange={(e) => setComment(e.target.value)} />
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <button type="submit" className="btn" disabled={submitting}>Gửi đánh giá</button>
    </form>
  );
};
export default ReviewForm;
