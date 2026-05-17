import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '72px' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
