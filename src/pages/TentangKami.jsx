import { Hand } from 'lucide-react';
import useReveal from '../hooks/useReveal';
import Stack from '../components/Stack';
import './TentangKami.css';

const visiPhotos = [
  { src: '/images/galeri/playground/p1560888-2.jpg', alt: 'Playground Motherlight' },
  { src: '/images/galeri/baby-spa/dsc02271.jpg', alt: 'Baby spa Motherlight' },
  { src: '/images/galeri/fasilitas-ranap/dsc02285-2.jpg', alt: 'Fasilitas rawat inap Motherlight' },
  { src: '/images/galeri/poli-konselor-menyusui/poli-konselor-menyusui-motherlight-9059-2.jpg', alt: 'Poli konselor menyusui Motherlight' },
  { src: '/images/galeri/poli-spesialis-anak/1001177236-5152-6440-2.jpg', alt: 'Poli spesialis anak Motherlight' },
];

function SectionReveal({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function TentangKami() {
  return (
    <div className="tentang-kami">
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero tentang-hero">
        <div className="container">
          <SectionReveal className="text-center">
            <h1 className="heading-xl tentang-hero-title">Tentang Motherlight</h1>
            <p className="tentang-hero-desc">
              Birth center Islami yang mendampingi perjalanan setiap ibu, sejak kehamilan
              hingga masa setelah melahirkan.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── Intro / Story ─────────────────────────────────────── */}
      <section className="intro-section">
        <div className="container">
          <div className="intro-grid">
            <SectionReveal className="intro-left">
              <span className="intro-quote-mark" aria-hidden="true">&ldquo;</span>
              <h2 className="intro-headline">
                Motherlight hadir untuk mendampingi perjalanan ibu dengan tenang, lembut,
                dan penuh kasih.
              </h2>
              <img
                className="intro-photo"
                src="/images/galeri/hero-building.jpg"
                alt="Gedung Motherlight Birth Center"
                loading="lazy"
              />
            </SectionReveal>
            <SectionReveal className="intro-card" delay={100}>
              <p>
                Kami percaya bahwa kelahiran bukan hanya proses medis, tetapi momen penuh
                amanah yang layak dijalani dengan ilmu, adab, dan doa. Karena itu, Motherlight
                menghadirkan birth center yang mendukung persalinan normal, menjaga kenyamanan
                ibu, serta mendampingi keluarga sejak kehamilan hingga masa setelah melahirkan.
              </p>
              <p>
                Dengan nilai-nilai Islam dan pelayanan profesional, kami ingin setiap ibu
                merasa aman, didengar, dan dimuliakan dalam menyambut kehidupan baru.
              </p>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── Visi & Harapan ────────────────────────────────────── */}
      <section className="section section-alt visi-section">
        <div className="container visi-grid">
          <SectionReveal className="visi-media">
            <div className="visi-stack-wrap">
              <span className="swipe-pill">
                <Hand size={13} /> Swipe
              </span>
              <div className="visi-stack">
                <Stack
                  randomRotation
                  sensitivity={160}
                  sendToBackOnClick
                  cards={visiPhotos.map((p, i) => (
                    <img key={i} src={p.src} alt={p.alt} className="card-image" />
                  ))}
                />
              </div>
            </div>
          </SectionReveal>

          <SectionReveal className="visi-content" delay={100}>
            <div className="visi-item">
              <h3 className="visi-title">Visi Kami</h3>
              <p className="visi-desc">
                Menjadi birth center Islami yang dikenal karena ketenangan, kenyamanan,
                dan pelayanan penuh kasih.
              </p>
            </div>

            <div className="visi-item">
              <h3 className="visi-title">Harapan Kami</h3>
              <p className="visi-desc">
                Agar setiap ibu dapat menjalani kehamilan dan persalinan dengan lebih
                tenang, percaya diri, dan penuh rasa syukur.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
