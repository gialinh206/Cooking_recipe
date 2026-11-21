import { Link } from 'react-router-dom';
import StarRating from './StarRating.jsx';
import { imgUrl, DIFFICULTY } from '../utils/helpers';

const RecipeCard = ({ recipe }) => (
  <Link to={`/recipes/${recipe._id}`} className="block overflow-hidden rounded border border-gray-200 hover:shadow dark:border-gray-700">
    <img src={imgUrl(recipe.image)} alt={recipe.title} className="h-40 w-full object-cover" />
    <div className="space-y-1 p-3">
      <h3 className="font-semibold">{recipe.title}</h3>
      <p className="text-sm text-gray-500">⏱ {recipe.cookTime} phút · {DIFFICULTY[recipe.difficulty]}</p>
      <div className="flex items-center gap-1 text-sm">
        <StarRating value={recipe.avgRating} readOnly /> ({recipe.ratingCount})
      </div>
      {recipe.matchCount !== undefined && (
        <p className="text-sm text-green-600">Khớp {recipe.matchCount}/{recipe.totalIngredients} nguyên liệu</p>
      )}
    </div>
  </Link>
);
export default RecipeCard;
