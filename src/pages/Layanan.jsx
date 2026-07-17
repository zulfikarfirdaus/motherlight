import { CheckCircle } from 'lucide-react';
import useReveal from '../hooks/useReveal';
import { layananList } from '../data/services';
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
            <h1 className="heading-xl">Layanan &amp; Fasilitas Motherlight</h1>
            <p className="layanan-hero-desc">
              Ruang pelayanan terpadu untuk ibu, bayi, anak, dan keluarga.
              Kami mendampingi setiap tahap dengan pendekatan yang tenang,
              profesional, dan penuh kasih.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── Services list ─────────────────────────────────────── */}
      <section className="section layanan-list-section">
        <div className="container">
          <div className="layanan-list">
            {layananList.map((svc, i) => (
              <SectionReveal key={svc.name} delay={(i % 3) * 80}>
                <article className="layanan-item">
                  <h3 className="layanan-item-name">{svc.name}</h3>
                  <p className="layanan-item-desc">{svc.description}</p>
                  {svc.items && (
                    <div className="layanan-item-meta">
                      <span className="layanan-item-label">
                        {svc.itemsLabel || 'Layanan meliputi:'}
                      </span>
                      <ul className="layanan-item-sub">
                        {svc.items.map((item) => (
                          <li key={item}>
                            <CheckCircle size={14} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <CtaSection />
    </div>
  );
}
