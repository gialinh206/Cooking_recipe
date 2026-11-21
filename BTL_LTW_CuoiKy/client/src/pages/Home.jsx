import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import RecipeGrid from '../components/RecipeGrid.jsx';
import Spinner from '../components/Spinner.jsx';

const Home = () => {
  const { data, loading, error } = useFetch('/recipes', { sort: 'rating', limit: 8 });
  return (
    <>
      <section className="py-8 text-center">
        <h1 className="text-3xl font-bold">Hôm nay nấu gì?</h1>
        <p className="my-2 text-gray-500">Nhập nguyên liệu trong tủ lạnh, chúng tôi gợi ý món phù hợp.</p>
        <Link to="/recipes" className="btn inline-block">Tìm công thức</Link>
      </section>
      <h2 className="mb-3 text-xl font-semibold">Món được đánh giá cao</h2>
      {loading && <Spinner />}
      {error && <p className="text-red-600">{error}</p>}
      {data && <RecipeGrid recipes={data.data} />}
    </>
  );
};
export default Home;
