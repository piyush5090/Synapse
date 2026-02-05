import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <main className="w-full min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};


export default MainLayout;
