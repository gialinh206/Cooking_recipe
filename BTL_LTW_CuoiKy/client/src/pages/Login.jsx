import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FormField from '../components/FormField.jsx';
import { errMsg } from '../api/axios';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Email không hợp lệ';
    if (!form.password) e.password = 'Vui lòng nhập mật khẩu';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setServerError(errMsg(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm" noValidate>
      <h1 className="mb-4 text-2xl font-bold">Đăng nhập</h1>
      <FormField label="Email" id="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
      <FormField label="Mật khẩu" id="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
      {serverError && <p className="mb-2 text-red-600" role="alert">{serverError}</p>}
      <button type="submit" className="btn w-full">Đăng nhập</button>
      <p className="mt-3 text-sm">Chưa có tài khoản? <Link to="/register" className="text-orange-600">Đăng ký</Link></p>
    </form>
  );
};
export default Login;
