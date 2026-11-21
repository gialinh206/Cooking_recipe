import SearchBox from './SearchBox.jsx';
import IngredientTagInput from './IngredientTagInput.jsx';

const RecipeFilterBar = ({ filters, categories = [], onChange }) => (
  <section className="mb-4 space-y-3" aria-label="Bộ lọc">
    <SearchBox value={filters.q} onChange={(q) => onChange({ q })} />
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <select className="input" aria-label="Loại món" value={filters.category} onChange={(e) => onChange({ category: e.target.value })}>
        <option value="">Tất cả loại món</option>
        {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <select className="input" aria-label="Thời gian nấu" value={filters.maxTime} onChange={(e) => onChange({ maxTime: e.target.value })}>
        <option value="">Mọi thời gian</option>
        <option value="15">≤ 15 phút</option>
        <option value="30">≤ 30 phút</option>
        <option value="60">≤ 60 phút</option>
      </select>
      <select className="input" aria-label="Độ khó" value={filters.difficulty} onChange={(e) => onChange({ difficulty: e.target.value })}>
        <option value="">Mọi độ khó</option>
        <option value="easy">Dễ</option>
        <option value="medium">Vừa</option>
        <option value="hard">Khó</option>
      </select>
    </div>
    <IngredientTagInput tags={filters.ingredients} onChange={(ingredients) => onChange({ ingredients })} />
  </section>
);
export default RecipeFilterBar;
