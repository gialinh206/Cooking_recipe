// Label + input/select/textarea + thông báo lỗi
const FormField = ({ label, id, error, as: Tag = 'input', children, ...props }) => (
  <div className="mb-3">
    <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
    <Tag id={id} name={id} className="input" aria-invalid={!!error} {...props}>{children}</Tag>
    {error && <p className="mt-1 text-sm text-red-600" role="alert">{error}</p>}
  </div>
);
export default FormField;
