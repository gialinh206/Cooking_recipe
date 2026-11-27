import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import GoogleButton from '../components/GoogleButton';

const validate = ({ email, password }) => {
  const errors = {};
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Email không hợp lệ';
  if (password.length < 6) errors.password = 'Mật khẩu tối thiểu 6 ký tự';
  return errors;
};

const Login = () => {
  const { signIn, status, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = ({ target: { name, value } }) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    try {
      await signIn(form);
      navigate(location.state?.from?.pathname ?? '/', { replace: true });
    } catch {
      /* lỗi đã nằm trong state.auth.error */
    }
  };

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="mb-4 text-2xl font-bold">Đăng nhập</h1>
      <form onSubmit={handleSubmit} noValidate>
        <FormField id="email" label="Email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
        <FormField id="password" label="Mật khẩu" type="password" value={form.password} onChange={handleChange} error={errors.password} />
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <button disabled={status === 'loading'} className="w-full rounded bg-orange-500 py-2 text-white disabled:opacity-50">
          {status === 'loading' ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
      <GoogleButton onSuccess={() => navigate(location.state?.from?.pathname ?? '/', { replace: true })} />
      <p className="mt-4 text-sm">Chưa có tài khoản? <Link to="/register" className="underline">Đăng ký</Link></p>
    </main>
  );
};

export default Login;
