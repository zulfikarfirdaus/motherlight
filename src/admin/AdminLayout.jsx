import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Images, CalendarDays, LogOut } from 'lucide-react';
import { clearToken, getToken } from '../hooks/useAdmin';
import './Admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!getToken()) { navigate('/admin/login'); return; }
    fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(r => {
      if (!r.ok) { clearToken(); navigate('/admin/login'); }
      else setVerified(true);
    }).catch(() => { clearToken(); navigate('/admin/login'); });
  }, [navigate]);

  function logout() {
    clearToken();
    navigate('/admin/login');
  }

  if (!verified) return null;

  return (
    <div className="admin-root admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span>Motherlight</span>
          <small>Birth Center</small>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin/gallery"
            className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
          >
            <Images size={16} />
            Galeri
          </NavLink>
          <NavLink
            to="/admin/doctors"
            className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
          >
            <CalendarDays size={16} />
            Jadwal Dokter
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={logout}>
            <LogOut size={14} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
