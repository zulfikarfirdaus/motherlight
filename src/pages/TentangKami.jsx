import { AtSign, Award, Users, Heart, TrendingUp } from 'lucide-react';
import useReveal from '../hooks/useReveal';
import { stats } from '../data/testimonials';
import CtaSection from '../components/CtaSection';
import './TentangKami.css';

function SectionReveal({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const values = [
  { icon: Heart, title: 'Pendekatan Hangat', desc: 'Kami memperlakukan setiap ibu seperti keluarga, dengan empati, sabar, dan penuh kasih.' },
  { icon: Award, title: 'Berbasis Bukti', desc: 'Setiap layanan kami didasarkan pada riset dan protokol medis terkini yang teruji.' },
  { icon: Users, title: 'Berpusat pada Ibu', desc: 'Pilihan dan suara ibu selalu menjadi pusat dalam setiap keputusan layanan.' },
  { icon: TrendingUp, title: 'Pendampingan Menyeluruh', desc: 'Dari prahamil hingga pascasalin, kami ada di setiap langkah perjalanan Anda.' },
];

export default function TentangKami() {
  return (
    <div className="tentang-kami">
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero tentang-hero">
        <div className="container">
          <SectionReveal className="text-center">
            <h1 className="heading-xl tentang-hero-title">
              Dari Sebuah Kegelisahan,<br />Lahirlah Sebuah Cahaya
            </h1>
            <p className="tentang-hero-desc">
              Motherlight hadir sebagai jawaban atas kebutuhan ibu akan pendampingan persalinan yang manusiawi, hangat, dan berbasis bukti.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────────── */}
      <section className="section story-section">
        <div className="container story-grid">
          <SectionReveal className="story-text">
            <span className="section-label">Kisah Kami</span>
            <h2 className="heading-lg section-title">Mengapa Motherlight Lahir</h2>
            <div className="divider" />
            <p>
              Lahir dari kegelisahan seorang dokter yang melihat terlalu banyak ibu yang merasa
              takut, tidak dihormati, dan sendirian dalam proses persalinan mereka. dr. Bima
              Suryantara mendirikan Motherlight Birth Center pada Februari 2026 dengan satu
              visi: menjadikan persalinan sebagai pengalaman yang indah dan memberdayakan.
            </p>
            <p style={{ marginTop: 16 }}>
              Di Motherlight, ibu bukan sekadar pasien. Ibu adalah protagonis dari kisah
              kelahiran bayinya. Kami hadir sebagai pendamping, bukan pengambil alih, dalam
              setiap tahap perjalanan kehamilan, persalinan, dan masa nifas.
            </p>
            <p style={{ marginTop: 16 }}>
              Dengan pendekatan gentle birth, evidence-based practice, dan penghormatan penuh
              pada hak alamiah ibu dan bayi, Motherlight menjadi rumah bagi ribuan ibu yang
              ingin melahirkan dengan aman, nyaman, dan bermartabat.
            </p>
          </SectionReveal>

          <SectionReveal className="founder-card" delay={100}>
            <div className="founder-inner">
              <div className="founder-avatar">
                <span>BS</span>
              </div>
              <div className="founder-info">
                <h3 className="founder-name">dr. Bima Suryantara</h3>
                <p className="founder-title">Sp. OG., Subsp. Obgynsos</p>
                <p className="founder-credential">Founder & Dokter Spesialis Obgyn</p>
                <ul className="founder-details">
                  <li>Lulusan Universitas Gadjah Mada</li>
                  <li>Mantan dokter RS JIH Solo & RS Hermina Solo</li>
                  <li>19.000+ followers sebagai edukator kesehatan</li>
                  <li>Anggota IDI & POGI</li>
                  <li>Pengalaman 10+ tahun</li>
                </ul>
                <a
                  href="https://www.instagram.com/motherlight.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="founder-ig"
                >
                  <AtSign size={16} />
                  @motherlight.id
                </a>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="section section-alt">
        <div className="container">
          <SectionReveal className="text-center">
            <span className="section-label">Pencapaian Kami</span>
            <h2 className="heading-lg section-title">Motherlight dalam Angka</h2>
            <div className="divider divider-center" />
          </SectionReveal>
          <div className="tentang-stats-grid">
            {[
              { value: 'Feb 2026', label: 'Tahun Berdiri' },
              { value: '10+', label: 'Tahun Pengalaman Dokter' },
              ...stats,
            ].map((s, i) => (
              <SectionReveal key={s.label} delay={i * 80}>
                <div className="tentang-stat-card">
                  <span className="tentang-stat-value">{s.value}</span>
                  <span className="tentang-stat-label">{s.label}</span>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────── */}
      <section className="section values-section">
        <div className="container">
          <SectionReveal className="text-center">
            <span className="section-label">Nilai-Nilai Kami</span>
            <h2 className="heading-lg section-title">Prinsip yang Memandu Kami</h2>
            <div className="divider divider-center" />
          </SectionReveal>
          <div className="values-grid">
            {values.map((v, i) => (
              <SectionReveal key={v.title} delay={i * 80}>
                <div className="value-card">
                  <div className="value-icon">
                    <v.icon size={28} />
                  </div>
                  <h3 className="value-title">{v.title}</h3>
                  <p className="value-desc">{v.desc}</p>
                </div>
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
