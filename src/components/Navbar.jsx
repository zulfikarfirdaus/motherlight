import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { label: 'Beranda', to: '/' },
  { label: 'Tentang Kami', to: '/tentang-kami' },
  { label: 'Layanan', to: '/layanan' },
  { label: 'Jadwal', to: '/jadwal' },
  { label: 'Galeri', to: '/galeri' },
  { label: 'Kontak', to: '/kontak' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo">
            <img src="/images/logo.png" alt="Motherlight Birth Center" />
          </Link>

          <nav className={`navbar-links${open ? ' open' : ''}`}>
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href="https://wa.me/6285117817414"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary navbar-cta mobile-cta"
              onClick={() => setOpen(false)}
            >
              Konsultasi Sekarang
            </a>
          </nav>

          <a
            href="https://wa.me/6285117817414"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary navbar-cta desktop-cta"
          >
            Konsultasi Sekarang
          </a>

          <button
            className="navbar-hamburger"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {open && <div className="navbar-overlay" onClick={() => setOpen(false)} />}
    </>
  );
}
