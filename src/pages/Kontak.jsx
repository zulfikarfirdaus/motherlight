import { ArrowUpRight } from 'lucide-react';
import useReveal from '../hooks/useReveal';
import { operatingHours } from '../data/doctors';
import CtaSection from '../components/CtaSection';
import './Kontak.css';
import Seo from '../components/Seo';

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
      <Seo
        title="Kontak & Lokasi Klinik Bersalin Karanganyar | Motherlight"
        description="Hubungi Motherlight Birth Center di Jl. Adi Sumarmo No.369, Tohudan, Colomadu, Karanganyar. Telepon 0851-1781-7414, IGD dan persalinan 24 jam."
        path="/kontak"
      />
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.3726653097597!2d110.77260947500248!3d-7.534271092478973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a15003167ab8d%3A0xcc486c010b47c5d!2sMotherlight%20Birth%20Center!5e0!3m2!1sen!2sid!4v1781103572843!5m2!1sen!2sid"
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
