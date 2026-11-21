import { imgUrl } from '../utils/helpers';

const MealSlot = ({ recipe, onClick, onClear }) => (
  <div className="relative min-h-16 rounded border border-dashed border-gray-300 p-1 dark:border-gray-600">
    <button type="button" onClick={onClick} className="w-full text-left text-sm">
      {recipe ? (
        <span className="flex items-center gap-1">
          <img src={imgUrl(recipe.image)} alt="" className="h-8 w-8 rounded object-cover" />
          <span className="line-clamp-2">{recipe.title}</span>
        </span>
      ) : <span className="text-gray-400">+ Chọn món</span>}
    </button>
    {recipe && <button type="button" onClick={onClear} className="absolute right-1 top-0 text-xs text-red-600" aria-label="Xóa món">✕</button>}
  </div>
);
export default MealSlot;
