import { useFetch } from '../hooks/useFetch';
import RecipeGrid from '../components/RecipeGrid.jsx';
import Spinner from '../components/Spinner.jsx';

const Favorites = () => {
  const { data, loading, error } = useFetch('/favorites');
  if (loading) return <Spinner />;
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Món yêu thích</h1>
      {error && <p className="text-red-600">{error}</p>}
      {data && <RecipeGrid recipes={data.data.map((f) => f.recipe)} />}
    </>
  );
};
export default Favorites;
