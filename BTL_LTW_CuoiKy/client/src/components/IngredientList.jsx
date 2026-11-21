const IngredientList = ({ ingredients = [], ratio = 1 }) => (
  <ul className="list-disc space-y-1 pl-5">
    {ingredients.map((i, idx) => (
      <li key={`${i.nameNorm}-${idx}`}>{+(i.amount * ratio).toFixed(2)} {i.unit} {i.name}</li>
    ))}
  </ul>
);
export default IngredientList;
