import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import GoogleButton from '../components/GoogleButton';

const validate = ({ name, email, password, confirm }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Nhập tên hiển thị';
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Email không hợp lệ';
  if (password.length < 6) errors.password = 'Mật khẩu tối thiểu 6 ký tự';
  if (confirm !== password) errors.confirm = 'Mật khẩu nhập lại không khớp';
  return errors;
};

const Register = () => {
  const { signUp, status, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const handleChange = ({ target: { name, value } }) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    const { confirm, ...payload } = form; // rest: bỏ confirm trước khi gửi
    try {
      await signUp(payload);
      navigate('/', { replace: true });
    } catch {
      /* hiển thị qua state.auth.error */
    }
  };

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="mb-4 text-2xl font-bold">Đăng ký</h1>
      <form onSubmit={handleSubmit} noValidate>
        <FormField id="name" label="Tên hiển thị" value={form.name} onChange={handleChange} error={errors.name} />
        <FormField id="email" label="Email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
        <FormField id="password" label="Mật khẩu" type="password" value={form.password} onChange={handleChange} error={errors.password} />
        <FormField id="confirm" label="Nhập lại mật khẩu" type="password" value={form.confirm} onChange={handleChange} error={errors.confirm} />
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <button disabled={status === 'loading'} className="w-full rounded bg-orange-500 py-2 text-white disabled:opacity-50">
          {status === 'loading' ? 'Đang tạo...' : 'Tạo tài khoản'}
        </button>
      </form>
      <GoogleButton onSuccess={() => navigate('/', { replace: true })} />
      <p className="mt-4 text-sm">Đã có tài khoản? <Link to="/login" className="underline">Đăng nhập</Link></p>
    </main>
  );
};

export default Register;
