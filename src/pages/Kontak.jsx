import { ArrowUpRight } from 'lucide-react';
import useReveal from '../hooks/useReveal';
import { operatingHours } from '../data/doctors';
import CtaSection from '../components/CtaSection';
import './Kontak.css';

function SectionReveal({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const contactItems = [
  {
    label: 'Alamat',
    content: 'Jl. Adi Sumarmo No.369, Colomadu, Karanganyar',
    link: 'https://maps.google.com/?q=Motherlight+Birth+Center+Karanganyar',
    linkLabel: 'Buka di Google Maps',
  },
  {
    label: 'Email',
    content: 'motherlightbirthcenter@gmail.com',
    link: 'mailto:motherlightbirthcenter@gmail.com',
    linkLabel: 'Kirim Email',
  },
  {
    label: 'Instagram',
    content: '@motherlight.id',
    link: 'https://www.instagram.com/motherlight.id',
    linkLabel: 'Ikuti di Instagram',
  },
];

export default function Kontak() {
  return (
    <div className="kontak">
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero kontak-hero">
        <div className="container">
          <SectionReveal className="text-center">
            <h1 className="heading-xl">Hubungi Kami</h1>
            <p className="kontak-hero-desc">
              Kami selalu siap membantu. Hubungi kami untuk membuat janji atau konsultasi awal, kapan saja.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── Contact Cards + Info ──────────────────────────────── */}
      <section className="section kontak-main-section">
        <div className="container">
          <div className="kontak-cards">
            {contactItems.map((item, i) => (
              <SectionReveal key={item.label} delay={i * 60}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kontak-card"
                  aria-label={item.linkLabel}
                >
                  <div className="kontak-card-top">
                    <span className="kontak-card-label">{item.label}</span>
                    <span className="kontak-card-icon" aria-hidden="true">
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                  <div className="kontak-card-value">{item.content}</div>
                  <div className="kontak-card-link">{item.linkLabel}</div>
                </a>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal delay={120} className="kontak-info-card">
            <div className="kontak-info-grid">
              <div className="kontak-hours">
                <div className="kontak-hours-heading">
                  Jam Operasional
                </div>
                <ul className="kontak-hours-list">
                  {operatingHours.map((h) => (
                    <li key={h.day} className="kontak-hours-row">
                      <span className="kontak-hours-day">{h.day}</span>
                      <span className={`kontak-hours-time${h.day === 'Gawat Darurat & Persalinan' ? ' emergency' : ''}`}>
                        {h.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="kontak-map-container">
                <iframe
                  src="https://maps.google.com/maps?q=Motherlight+Birth+Center+Karanganyar&output=embed&z=16"
                  title="Lokasi Motherlight Birth Center"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <CtaSection />
    </div>
  );
}
