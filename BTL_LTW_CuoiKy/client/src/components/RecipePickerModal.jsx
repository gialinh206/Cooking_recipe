import { useState } from 'react';
import Modal from './Modal.jsx';
import SearchBox from './SearchBox.jsx';
import Spinner from './Spinner.jsx';
import { useFetch } from '../hooks/useFetch';
import { useDebounce } from '../hooks/useDebounce';

const RecipePickerModal = ({ onPick, onClose }) => {
  const [q, setQ] = useState('');
  const debouncedQ = useDebounce(q);
  const { data, loading } = useFetch('/recipes', { q: debouncedQ, limit: 10 });

  return (
    <Modal title="Chọn món cho bữa ăn" onClose={onClose}>
      <SearchBox value={q} onChange={setQ} />
      {loading ? <Spinner /> : (
        <ul className="mt-3 space-y-1">
          {data?.data.map((r) => (
            <li key={r._id}>
              <button type="button" className="w-full rounded p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => onPick(r)}>{r.title}</button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};
export default RecipePickerModal;
