import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const linkClass = ({ isActive }) =>
  `px-2 py-1 rounded ${isActive ? 'bg-orange-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-3">
        <Link to="/" className="text-xl font-bold text-orange-600">🍳 Sổ tay nấu ăn</Link>
        <button type="button" className="btn-outline md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Mở menu">☰</button>
        <nav className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-14 flex-col gap-1 bg-white p-3 dark:bg-gray-900 md:static md:flex md:flex-row md:items-center md:bg-transparent md:p-0`}>
          <NavLink to="/recipes" className={linkClass} onClick={() => setOpen(false)}>Công thức</NavLink>
          {user && (
            <>
              <NavLink to="/my-recipes" className={linkClass}>Của tôi</NavLink>
              <NavLink to="/favorites" className={linkClass}>Yêu thích</NavLink>
              <NavLink to="/meal-plan" className={linkClass}>Thực đơn tuần</NavLink>
              <NavLink to="/shopping-list" className={linkClass}>Đi chợ</NavLink>
            </>
          )}
          {user?.role === 'admin' && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
          <ThemeToggle />
          {user ? (
            <button type="button" className="btn-outline" onClick={handleLogout}>Đăng xuất ({user.name})</button>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Đăng nhập</NavLink>
              <NavLink to="/register" className={linkClass}>Đăng ký</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Header;
