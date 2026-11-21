import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api/axios';
import { useFetch } from '../hooks/useFetch';
import FormField from '../components/FormField.jsx';
import DynamicIngredientRows from '../components/DynamicIngredientRows.jsx';
import DynamicStepRows from '../components/DynamicStepRows.jsx';
import ImageUploader from '../components/ImageUploader.jsx';
import Spinner from '../components/Spinner.jsx';

const emptyIng = () => ({ key: crypto.randomUUID(), name: '', amount: '', unit: '' });
const emptyStep = () => ({ key: crypto.randomUUID(), content: '' });

const RecipeForm = () => {
  const { id } = useParams(); // có id => chế độ sửa
  const navigate = useNavigate();
  const { data: cats } = useFetch('/categories');
  const [form, setForm] = useState({ title: '', description: '', category: '', cookTime: '', difficulty: 'easy', servings: 2 });
  const [ingredients, setIngredients] = useState([emptyIng()]);
  const [steps, setSteps] = useState([emptyStep()]);
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(!!id);

  // Nạp dữ liệu khi sửa
  useEffect(() => {
    if (!id) return;
    api.get(`/recipes/${id}`).then(({ data }) => {
      setForm({
        title: data.title, description: data.description, category: data.category._id,
        cookTime: data.cookTime, difficulty: data.difficulty, servings: data.servings,
      });
      setIngredients(data.ingredients.map((i) => ({ key: crypto.randomUUID(), name: i.name, amount: i.amount, unit: i.unit })));
      setSteps(data.steps.map((s) => ({ key: crypto.randomUUID(), content: s.content })));
      setCurrentImage(data.image);
    }).catch((err) => setServerError(errMsg(err))).finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.title.trim().length < 3) e.title = 'Tên món tối thiểu 3 ký tự';
    if (!form.category) e.category = 'Hãy chọn loại món';
    if (!(Number(form.cookTime) >= 1)) e.cookTime = 'Thời gian nấu phải >= 1 phút';
    if (!(Number(form.servings) >= 1)) e.servings = 'Khẩu phần >= 1';
    if (ingredients.some((i) => !i.name.trim() || i.amount === '' || Number(i.amount) < 0)) e.ingredients = 'Mỗi nguyên liệu cần tên và số lượng hợp lệ';
    if (steps.some((s) => !s.content.trim())) e.steps = 'Nội dung các bước không được để trống';
    if (file && file.size > 2 * 1024 * 1024) e.image = 'Ảnh tối đa 2MB';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('ingredients', JSON.stringify(ingredients.map(({ name, amount, unit }) => ({ name, amount: Number(amount), unit }))));
    fd.append('steps', JSON.stringify(steps.map(({ content }) => ({ content }))));
    if (file) fd.append('image', file);

    try {
      const { data } = id ? await api.put(`/recipes/${id}`, fd) : await api.post('/recipes', fd);
      navigate(`/recipes/${data._id}`); // chuyển sang trang chi tiết sau khi lưu
    } catch (err) {
      setServerError(errMsg(err));
    }
  };

  if (loading) return <Spinner />;
  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl" noValidate>
      <h1 className="mb-4 text-2xl font-bold">{id ? 'Sửa công thức' : 'Đăng công thức mới'}</h1>
      <FormField label="Tên món" id="title" value={form.title} onChange={handleChange} error={errors.title} />
      <FormField label="Mô tả" id="description" as="textarea" rows={3} value={form.description} onChange={handleChange} />
      <FormField label="Loại món" id="category" as="select" value={form.category} onChange={handleChange} error={errors.category}>
        <option value="">-- Chọn --</option>
        {cats?.data.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </FormField>
      <div className="grid grid-cols-3 gap-3">
        <FormField label="Thời gian (phút)" id="cookTime" type="number" min="1" value={form.cookTime} onChange={handleChange} error={errors.cookTime} />
        <FormField label="Độ khó" id="difficulty" as="select" value={form.difficulty} onChange={handleChange}>
          <option value="easy">Dễ</option><option value="medium">Vừa</option><option value="hard">Khó</option>
        </FormField>
        <FormField label="Khẩu phần" id="servings" type="number" min="1" value={form.servings} onChange={handleChange} error={errors.servings} />
      </div>
      <ImageUploader file={file} currentUrl={currentImage} onChange={setFile} error={errors.image} />
      <DynamicIngredientRows rows={ingredients} onChange={setIngredients} error={errors.ingredients} />
      <DynamicStepRows rows={steps} onChange={setSteps} error={errors.steps} />
      {serverError && <p className="mb-2 text-red-600" role="alert">{serverError}</p>}
      <button type="submit" className="btn">{id ? 'Lưu thay đổi' : 'Đăng công thức'}</button>
      <p className="mt-2 text-sm text-gray-500">Công thức sẽ hiển thị công khai sau khi admin duyệt.</p>
    </form>
  );
};
export default RecipeForm;
