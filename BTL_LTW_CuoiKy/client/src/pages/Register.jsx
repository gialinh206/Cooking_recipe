import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FormField from '../components/FormField.jsx';
import { errMsg } from '../api/axios';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Tên tối thiểu 2 ký tự';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Email không hợp lệ';
    if (form.password.length < 6) e.password = 'Mật khẩu tối thiểu 6 ký tự';
    if (form.confirm !== form.password) e.confirm = 'Mật khẩu nhập lại không khớp';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    try {
      await register(form.name, form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(errMsg(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm" noValidate>
      <h1 className="mb-4 text-2xl font-bold">Đăng ký</h1>
      <FormField label="Họ tên" id="name" value={form.name} onChange={handleChange} error={errors.name} />
      <FormField label="Email" id="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
      <FormField label="Mật khẩu" id="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
      <FormField label="Nhập lại mật khẩu" id="confirm" type="password" value={form.confirm} onChange={handleChange} error={errors.confirm} />
      {serverError && <p className="mb-2 text-red-600" role="alert">{serverError}</p>}
      <button type="submit" className="btn w-full">Tạo tài khoản</button>
      <p className="mt-3 text-sm">Đã có tài khoản? <Link to="/login" className="text-orange-600">Đăng nhập</Link></p>
    </form>
  );
};
export default Register;
