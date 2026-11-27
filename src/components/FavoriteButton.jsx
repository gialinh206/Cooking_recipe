import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleFavorite } from '../store/favoriteSlice';
import { useAuth } from '../context/AuthContext';

const FavoriteButton = ({ recipeId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isFav = useSelector((s) => s.favorite.ids.includes(recipeId));

  const handleClick = () => {
    if (!isAuthenticated) return navigate('/login');
    dispatch(toggleFavorite(recipeId));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isFav}
      className={`rounded px-3 py-1 text-sm ${isFav ? 'bg-red-500 text-white' : 'border'}`}
    >
      {isFav ? '♥ Đã thích' : '♡ Yêu thích'}
    </button>
  );
};

export default FavoriteButton;
