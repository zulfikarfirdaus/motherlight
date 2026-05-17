import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

// Instagram icon component
const InstagramIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const navLinks = [
  { label: 'Beranda', to: '/' },
  { label: 'Tentang Kami', to: '/tentang-kami' },
  { label: 'Layanan', to: '/layanan' },
  { label: 'Jadwal', to: '/jadwal' },
  { label: 'Galeri', to: '/galeri' },
  { label: 'Kontak', to: '/kontak' },
];

const regularHours = [
  { day: 'Senin-Jumat', time: '07.00-21.00' },
  { day: 'Sabtu', time: '07.00-18.00' },
  { day: 'Ahad', time: '08.00-14.00' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <img src="/images/logo.png" alt="Motherlight Birth Center" className="footer-logo" />
          <p className="footer-tagline">
            Mendampingi setiap ibu dengan kehangatan, berbasis bukti, dan menghormati hak alamiah ibu dan bayi.
          </p>
          <a
            href="https://www.instagram.com/motherlight.id"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social"
          >
            <InstagramIcon size={18} />
            @motherlight.id
          </a>
        </div>

        {/* Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Navigasi</h4>
          <ul className="footer-links">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4 className="footer-heading">Kontak</h4>
          <ul className="footer-contact">
            <li>
              <MapPin size={15} />
              <span>Jl. Adi Sumarmo No.369, Kepoh RT 6/RW 4, Tohudan, Colomadu, Karanganyar 57173</span>
            </li>
            <li>
              <Phone size={15} />
              <a href="https://wa.me/6285117817414" target="_blank" rel="noopener noreferrer">
                +62 851-1781-7414
              </a>
            </li>
            <li>
              <Mail size={15} />
              <a href="mailto:motherlightbirthcenter@gmail.com">motherlightbirthcenter@gmail.com</a>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div className="footer-col">
          <h4 className="footer-heading">Jam Operasional</h4>
          <div className="footer-hours-list">
            {regularHours.map((h) => (
              <p key={h.day} className="footer-hours-item">
                {h.day}: {h.time}
              </p>
            ))}
            <p className="footer-hours-item footer-emergency">
              IGD & Persalinan: 24 Jam
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Motherlight Birth Center. All rights reserved.</p>
      </div>
    </footer>
  );
}
