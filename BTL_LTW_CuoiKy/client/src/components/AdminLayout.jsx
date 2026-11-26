import { NavLink, Outlet, Link } from 'react-router-dom';

const cls = ({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-orange-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`;

const AdminLayout = () => (
  <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-4 p-4 md:flex-row">
    <aside className="md:w-56">
      <Link to="/" className="mb-3 block text-sm text-orange-600">← Về trang chủ</Link>
      <nav className="space-y-1">
        <NavLink end to="/admin" className={cls}>Thống kê</NavLink>
        <NavLink to="/admin/pending" className={cls}>Duyệt công thức</NavLink>
        <NavLink to="/admin/recipes" className={cls}>Quản lý công thức</NavLink>
        <NavLink to="/admin/reviews" className={cls}>Bình luận</NavLink>
        <NavLink to="/admin/categories" className={cls}>Loại món</NavLink>
      </nav>
    </aside>
    <main className="flex-1"><Outlet /></main>
  </div>
);
export default AdminLayout;
