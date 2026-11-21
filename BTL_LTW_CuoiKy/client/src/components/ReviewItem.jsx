import StarRating from './StarRating.jsx';

const ReviewItem = ({ review }) => (
  <article className="rounded border border-gray-200 p-3 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <strong>{review.user?.name}</strong>
      <StarRating value={review.rating} readOnly />
    </div>
    {review.comment && <p className="mt-1">{review.comment}</p>}
    <time className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</time>
  </article>
);
export default ReviewItem;
