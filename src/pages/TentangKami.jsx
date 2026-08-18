import useReveal from '../hooks/useReveal';
import './TentangKami.css';
import Seo from '../components/Seo';

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
      <Seo
        title="Tentang Kami | Motherlight Birth Center Karanganyar"
        description="Mengenal Motherlight Birth Center, klinik bersalin Islami di Colomadu, Karanganyar, dan dr. Bima Suryantara, Sp.OG., Subsp. Obginsos selaku pendiri."
        path="/tentang-kami"
      />
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
              <h2 className="intro-headline">
                Motherlight hadir untuk mendampingi perjalanan ibu
                <em>dengan tenang, lembut, dan penuh kasih.</em>
              </h2>
            </SectionReveal>
            <SectionReveal className="intro-body" delay={100}>
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
      <section className="visi-section">
        <div className="container">
          <SectionReveal className="visi-row">
            <h2 className="visi-title">Visi Kami</h2>
            <p className="visi-desc">
              Menjadi birth center Islami yang dikenal karena ketenangan, kenyamanan,
              dan pelayanan penuh kasih.
            </p>
          </SectionReveal>

          <SectionReveal className="visi-row" delay={100}>
            <h2 className="visi-title">Harapan Kami</h2>
            <p className="visi-desc">
              Agar setiap ibu dapat menjalani kehamilan dan persalinan dengan lebih
              tenang, percaya diri, dan penuh rasa syukur.
            </p>
          </SectionReveal>
        </div>
        <hr className="visi-rule" />
      </section>

      {/* ── Pendiri ───────────────────────────────────────────── */}
      <section className="section founder-section">
        <div className="container founder-grid">
          <aside className="founder-media">
            <SectionReveal className="founder-sticky">
              <figure className="founder-figure">
                <img
                  className="founder-photo"
                  src="/images/tim/dr-bima.jpg"
                  alt="dr. Bima Suryantara, Sp.OG., Subsp. Obginsos"
                  loading="lazy"
                />
              </figure>
            </SectionReveal>
          </aside>

          <SectionReveal className="founder-content" delay={100}>
            <span className="section-label">Pendiri Motherlight</span>
            <h2 className="heading-lg founder-title">
              dr. Bima Suryantara, Sp.OG., Subsp. Obginsos
            </h2>
            <p>
              dr. Bima Suryantara adalah Dokter Spesialis Obstetri dan Ginekologi,
              Subspesialis Obstetri dan Ginekologi Sosial, sekaligus pendiri Motherlight.
            </p>
            <p>
              Beliau menyelesaikan pendidikan Spesialis Obstetri dan Ginekologi di
              Universitas Gadjah Mada pada tahun 2012, kemudian melanjutkan pendidikan
              hingga menjadi konsultan pada tahun 2018.
            </p>
            <p>
              Dalam kesehariannya, dr. Bima mendampingi para ibu dan keluarga melalui
              praktik klinis dengan pendekatan yang tenang, personal, dan penuh perhatian.
              Baginya, setiap ibu perlu merasa didengar, dipahami, dan dilibatkan dalam
              setiap keputusan selama perjalanan kehamilan dan persalinan. Pendekatan ini
              selaras dengan nilai Motherlight yang mengutamakan pendampingan personal,
              komunikasi yang baik, serta penghormatan terhadap pilihan dan martabat
              setiap ibu.
            </p>
            <p>
              Selain menjalankan praktik klinis, dr. Bima juga aktif dalam dunia pendidikan.
              Sejak tahun 2020, beliau mengajar di Program Magister Kebidanan STIKES Guna
              Bangsa Yogyakarta, dengan bidang pengajaran yang mencakup kehamilan,
              persalinan, masa nifas, kesehatan reproduksi, praktik klinis kebidanan, dan
              penelitian.
            </p>
            <p>
              Kecintaannya pada pendidikan juga diwujudkan melalui karya ilmiah dan
              publikasi. Pada tahun 2025, dr. Bima menjadi salah satu penulis Buku Ajar
              Asuhan Persalinan dan BBL, yang membahas berbagai aspek penting dalam
              pendampingan ibu dan bayi, mulai dari proses persalinan dan perawatan bayi
              baru lahir hingga masa postpartum dan komunikasi dalam pelayanan kesehatan.
            </p>
            <p>
              Melalui Motherlight, dr. Bima membawa pengalaman klinis dan akademis tersebut
              ke dalam sebuah ruang yang dirancang untuk menemani perjalanan ibu dengan
              lebih utuh. Mulai dari mempersiapkan kehamilan dan persalinan, mendampingi
              proses kelahiran, hingga masa nifas dan menyusui.
            </p>
            <p>
              Sebuah perjalanan yang tidak hanya dijalani dengan ilmu dan profesionalisme,
              tetapi juga dengan ketenangan, kasih, adab, dan penghormatan kepada setiap ibu.
            </p>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
