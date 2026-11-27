const FormField = ({ id, label, error, ...inputProps }) => (
  <div className="mb-4">
    <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
    <input
      id={id}
      name={id}
      className={`w-full rounded border px-3 py-2 dark:bg-gray-800 ${error ? 'border-red-500' : ''}`}
      {...inputProps}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default FormField;
