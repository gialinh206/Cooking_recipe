import RecipeCard from './RecipeCard.jsx';

const RecipeGrid = ({ recipes = [] }) =>
  recipes.length === 0 ? (
    <p className="py-8 text-center text-gray-500">Không tìm thấy công thức nào.</p>
  ) : (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {recipes.map((r) => <RecipeCard key={r._id} recipe={r} />)}
    </div>
  );
export default RecipeGrid;
