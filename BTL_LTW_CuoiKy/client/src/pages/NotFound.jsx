import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="py-16 text-center">
    <h1 className="text-5xl font-bold">404</h1>
    <p className="my-3">Trang bạn tìm không tồn tại.</p>
    <Link to="/" className="btn inline-block">Về trang chủ</Link>
  </div>
);
export default NotFound;
