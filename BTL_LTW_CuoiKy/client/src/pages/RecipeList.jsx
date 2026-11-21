import { useMemo, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useDebounce } from '../hooks/useDebounce';
import RecipeFilterBar from '../components/RecipeFilterBar.jsx';
import RecipeGrid from '../components/RecipeGrid.jsx';
import Pagination from '../components/Pagination.jsx';
import Spinner from '../components/Spinner.jsx';

const initialFilters = { q: '', category: '', maxTime: '', difficulty: '', ingredients: [] };

const RecipeList = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const debouncedQ = useDebounce(filters.q, 400);

  const { data: cats } = useFetch('/categories');

  const hasIngredients = filters.ingredients.length > 0;
  const url = hasIngredients ? '/recipes/search-by-ingredients' : '/recipes';
  // useMemo: giữ tham chiếu params ổn định, chỉ đổi khi bộ lọc thật sự đổi
  const params = useMemo(
    () => hasIngredients
      ? { items: filters.ingredients.join(','), page }
      : { q: debouncedQ, category: filters.category, maxTime: filters.maxTime, difficulty: filters.difficulty, page },
    [hasIngredients, filters, debouncedQ, page]
  );
  const { data, loading, error } = useFetch(url, params);

  const handleChange = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  return (
    <>
      <h1 className="mb-3 text-2xl font-bold">Công thức</h1>
      <RecipeFilterBar filters={filters} categories={cats?.data} onChange={handleChange} />
      {hasIngredients && <p className="mb-2 text-sm text-gray-500">Đang tìm theo nguyên liệu (bỏ qua các bộ lọc khác).</p>}
      {loading && <Spinner />}
      {error && <p className="text-red-600" role="alert">{error}</p>}
      {data && (
        <>
          <RecipeGrid recipes={data.data} />
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </>
  );
};
export default RecipeList;
