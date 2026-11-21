const SearchBox = ({ value, onChange, placeholder = 'Tìm theo tên món...' }) => (
  <input type="search" className="input" value={value} placeholder={placeholder}
    aria-label="Tìm kiếm" onChange={(e) => onChange(e.target.value)} />
);
export default SearchBox;
