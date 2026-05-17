import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';
import TentangKami from './pages/TentangKami';
import Layanan from './pages/Layanan';
import Jadwal from './pages/Jadwal';
import Galeri from './pages/Galeri';
import Kontak from './pages/Kontak';

// Admin loaded lazily so it's not bundled with the public site
const AdminLogin  = lazy(() => import('./admin/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminGallery = lazy(() => import('./admin/AdminGallery'));
const AdminDoctors = lazy(() => import('./admin/AdminDoctors'));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tentang-kami" element={<TentangKami />} />
          <Route path="/layanan" element={<Layanan />} />
          <Route path="/jadwal" element={<Jadwal />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/kontak" element={<Kontak />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={
          <Suspense fallback={null}><AdminLogin /></Suspense>
        } />
        <Route path="/admin" element={
          <Suspense fallback={null}><AdminLayout /></Suspense>
        }>
          <Route index element={<Navigate to="/admin/gallery" replace />} />
          <Route path="gallery" element={
            <Suspense fallback={null}><AdminGallery /></Suspense>
          } />
          <Route path="doctors" element={
            <Suspense fallback={null}><AdminDoctors /></Suspense>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
