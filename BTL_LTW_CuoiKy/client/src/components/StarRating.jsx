const StarRating = ({ value = 0, onChange, readOnly = false }) => (
  <span className="inline-flex" aria-label={`${value} sao`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button" disabled={readOnly} onClick={() => onChange?.(n)}
        className={`text-xl ${n <= Math.round(value) ? 'text-yellow-500' : 'text-gray-300'} ${readOnly ? 'cursor-default' : ''}`}
        aria-label={`${n} sao`}>★</button>
    ))}
  </span>
);
export default StarRating;
