import { useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from './context/AuthContext';
import { fetchFavorites } from './store/favoriteSlice';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';
import Login from './pages/Login';
import Register from './pages/Register';

const linkClass = ({ isActive }) => (isActive ? 'font-bold text-orange-500' : 'hover:underline');

// Trang tạm — thay bằng trang thật của nhóm
const Page = ({ title }) => <main className="p-6"><h1 className="text-2xl font-bold">{title}</h1></main>;

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, signOut } = useAuth();

  // Có đăng nhập thì tải danh sách yêu thích vào Redux
  useEffect(() => {
    if (isAuthenticated) dispatch(fetchFavorites());
  }, [isAuthenticated, dispatch]);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header>
        <nav className="flex items-center gap-4 border-b p-4 dark:border-gray-700">
          <NavLink to="/" end className={linkClass}>Trang chủ</NavLink>
          {isAuthenticated && <NavLink to="/favorites" className={linkClass}>Yêu thích</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={linkClass}>Quản trị</NavLink>}
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="text-sm">Xin chào, {user.name}</span>
                <button onClick={signOut} className="text-sm underline">Đăng xuất</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>Đăng nhập</NavLink>
                <NavLink to="/register" className={linkClass}>Đăng ký</NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Page title="Trang chủ" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/favorites" element={<Page title="Món yêu thích" />} />
        </Route>
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin" element={<Page title="Quản trị" />} />
        </Route>

        <Route path="*" element={<Page title="404 - Không tìm thấy trang" />} />
      </Routes>
    </div>
  );
};

export default App;
