const ShoppingListTable = ({ items = [] }) => (
  <table className="w-full max-w-xl border-collapse">
    <caption className="sr-only">Danh sách đi chợ</caption>
    <thead>
      <tr className="border-b text-left"><th className="p-2">Nguyên liệu</th><th className="p-2">Số lượng</th></tr>
    </thead>
    <tbody>
      {items.map((it) => (
        <tr key={`${it.name}|${it.unit}`} className="border-b border-gray-200 dark:border-gray-700">
          <td className="p-2">{it.name}</td>
          <td className="p-2">{+it.amount.toFixed(2)} {it.unit}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
export default ShoppingListTable;
