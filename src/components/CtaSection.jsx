import { Link } from 'react-router-dom';
import './CtaSection.css';

export default function CtaSection({ hideScheduleLink = false }) {
  return (
    <section className="cta-section">
      <div className="cta-pattern cta-pattern-left" />
      <div className="cta-pattern cta-pattern-right" />
      <div className="cta-content">
        <h2 className="cta-heading">Rencanakan Persalinanmu<br />Bersama Kami</h2>
        <p className="cta-sub">
          Kami ada untuk mendampingi setiap langkah perjalanan Anda
          dari trimester pertama hingga pelukan pertama bersama si kecil.
        </p>
        <div className="cta-actions">
          <a
            href="https://wa.me/6285117817414"
            target="_blank"
            rel="noopener noreferrer"
            className="btn cta-btn-primary"
          >
            Konsultasi Kehamilan
          </a>
          {!hideScheduleLink && (
            <Link to="/jadwal" className="btn cta-btn-outline">
              Lihat Jadwal Dokter
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
