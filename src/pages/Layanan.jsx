import { ArrowRight, CheckCircle, Phone } from 'lucide-react';
import useReveal from '../hooks/useReveal';
import { services, additionalServices } from '../data/services';
import CtaSection from '../components/CtaSection';
import './Layanan.css';

function SectionReveal({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Layanan() {
  return (
    <div className="layanan">
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero layanan-hero">
        <div className="container">
          <SectionReveal className="text-center">
            <h1 className="heading-xl">Layanan &amp; Fasilitas</h1>
            <p className="layanan-hero-desc">
              Kami menyediakan layanan kesehatan ibu dan anak yang komprehensif, dari kehamilan, persalinan, hingga tumbuh kembang si kecil, dalam satu atap.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── Main Services ─────────────────────────────────────── */}
      <section className="section layanan-grid-section">
        <div className="container">
          <div className="layanan-grid">
            {services.map((svc, i) => (
              <SectionReveal key={svc.id} delay={i * 80}>
                <div className="layanan-card card">
                  <div className="layanan-img-wrap">
                    <img src={svc.image} alt={svc.name} />
                    <div className="layanan-img-overlay" />
                  </div>
                  <div className="layanan-body">
                    <h3 className="layanan-name">{svc.name}</h3>
                    <p className="layanan-desc">{svc.description}</p>
                    <ul className="layanan-sub">
                      {svc.subServices.map((sub) => (
                        <li key={sub}>
                          <CheckCircle size={14} />
                          {sub}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Additional Services ───────────────────────────────── */}
      <section className="section section-alt additional-section">
        <div className="container">
          <SectionReveal className="text-center">
            <h2 className="heading-lg section-title">Layanan Lainnya</h2>
          </SectionReveal>
          <SectionReveal>
            <div className="additional-grid">
              {additionalServices.map((svc) => (
                <div key={svc} className="additional-item">
                  <ArrowRight size={16} />
                  {svc}
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <CtaSection />
    </div>
  );
}
