import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const MainLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="mx-auto w-full max-w-6xl flex-1 p-4">
      <Outlet />
    </main>
    <Footer />
  </div>
);
export default MainLayout;
