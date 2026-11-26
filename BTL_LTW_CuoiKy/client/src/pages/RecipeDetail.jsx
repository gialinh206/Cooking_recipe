import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api/axios';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext.jsx';
import IngredientList from '../components/IngredientList.jsx';
import StepList from '../components/StepList.jsx';
import StarRating from '../components/StarRating.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import ReviewItem from '../components/ReviewItem.jsx';
import Spinner from '../components/Spinner.jsx';
import { imgUrl, DIFFICULTY, STATUS } from '../utils/helpers';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: recipe, loading, error } = useFetch(`/recipes/${id}`);
  const reviews = useFetch(`/recipes/${id}/reviews`);
  const favs = useFetch('/favorites', {}, { skip: !user });
  const [msg, setMsg] = useState('');

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-600" role="alert">{error}</p>;

  const isFav = favs.data?.data.some((f) => f.recipe._id === id);
  const canEdit = user && (user.role === 'admin' || user._id === recipe.author._id);

  const toggleFav = async () => {
    try {
      if (isFav) await api.delete(`/favorites/${id}`);
      else await api.post(`/favorites/${id}`);
      favs.refetch();
    } catch (err) { setMsg(errMsg(err)); }
  };
  const handleDelete = async () => {
    if (!window.confirm('Xóa công thức này?')) return;
    try {
      await api.delete(`/recipes/${id}`);
      navigate(user.role === 'admin' ? '/admin/recipes' : '/my-recipes');
    } catch (err) { setMsg(errMsg(err)); }
  };
  const handleReviewed = () => { reviews.refetch(); };

  return (
    <article className="space-y-4">
      <img src={imgUrl(recipe.image)} alt={recipe.title} className="h-64 w-full rounded object-cover" />
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      <p className="text-gray-500">
        {recipe.category?.name} · ⏱ {recipe.cookTime} phút · {DIFFICULTY[recipe.difficulty]} · {recipe.servings} khẩu phần · bởi {recipe.author?.name}
      </p>
      <StarRating value={recipe.avgRating} readOnly /> <span>({recipe.ratingCount} đánh giá)</span>
      {recipe.status !== 'approved' && <p className="rounded bg-yellow-100 p-2 text-yellow-800">Trạng thái: {STATUS[recipe.status]}</p>}
      <p>{recipe.description}</p>
      {msg && <p className="text-red-600" role="alert">{msg}</p>}
      <div className="flex gap-2">
        {user && <button type="button" className="btn-outline" onClick={toggleFav}>{isFav ? '♥ Bỏ yêu thích' : '♡ Yêu thích'}</button>}
        {canEdit && (
          <>
            <Link to={`/recipes/${id}/edit`} className="btn-outline">Sửa</Link>
            <button type="button" className="btn-outline text-red-600" onClick={handleDelete}>Xóa</button>
          </>
        )}
      </div>
      <section><h2 className="mb-2 text-xl font-semibold">Nguyên liệu</h2><IngredientList ingredients={recipe.ingredients} /></section>
      <section><h2 className="mb-2 text-xl font-semibold">Cách làm</h2><StepList steps={recipe.steps} /></section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Đánh giá</h2>
        {user ? <ReviewForm recipeId={id} onDone={handleReviewed} /> : <p><Link to="/login" className="text-orange-600">Đăng nhập</Link> để đánh giá.</p>}
        {reviews.data?.data.map((r) => <ReviewItem key={r._id} review={r} />)}
      </section>
    </article>
  );
};
export default RecipeDetail;
