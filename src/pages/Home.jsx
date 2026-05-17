import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Calendar, ArrowRight, Star, MapPin, CheckCircle, Leaf, Heart, Droplets, X, Mail, MessageCircle } from 'lucide-react';
import CtaSection from '../components/CtaSection';
import useReveal from '../hooks/useReveal';
import { services, featuredCategories, alurLayanan } from '../data/services';
import { featuredDoctors } from '../data/doctors';
import { testimonials, stats } from '../data/testimonials';
import './Home.css';

const iconMap = { Leaf, Heart, Droplets };

function FeaturedModal({ cat, onClose }) {
  return (
    <div className="feat-modal-backdrop" onClick={onClose}>
      <div className="feat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="feat-modal-handle" aria-hidden="true" />
        <div className="feat-modal-header">
          <h3 className="feat-modal-title">{cat.title}</h3>
          <button className="feat-modal-close" onClick={onClose} aria-label="Tutup">
            <X size={20} />
          </button>
        </div>
        <div className="feat-modal-body">
          {cat.items.map((item) => (
            <div key={item.name} className="feat-modal-item">
              <h4 className="feat-modal-item-name">{item.name}</h4>
              <ul className="feat-modal-sub">
                {item.sub.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const whyItems = [
  { icon: '/images/icons/edukasi.svg',      title: 'Edukasi Prahamil hingga Pasca Lahir', sub: 'Kelas rutin setiap pekan' },
  { icon: '/images/icons/rawat-gabung.svg', title: 'Rawat Gabung 24 Jam',                 sub: 'Ibu dan bayi tidak dipisahkan' },
  { icon: '/images/icons/fasilitas.svg',    title: 'Fasilitas Lengkap',                   sub: 'Dari ruang bersalin hingga farmasi' },
  { icon: '/images/icons/tenaga-medis.svg', title: 'Tenaga Medis Berkualitas',            sub: 'Berpengalaman dan tersertifikasi' },
];

function SectionReveal({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const galleryPhotos = [
  { src: '/images/galeri/baby-spa/1001168571-7728-5152-2.jpg',                              alt: 'Baby Spa Motherlight' },
  { src: '/images/galeri/playground/playground-motherlight-9029-2.jpg',                     alt: 'Playground Motherlight' },
  { src: '/images/galeri/poli-spesialis-anak/poli-spesialis-anak-motherlight-8999-2.jpg',   alt: 'Poli Spesialis Anak' },
  { src: '/images/galeri/poli-konselor-menyusui/poli-konselor-menyusui-motherlight-9059-2.jpg', alt: 'Poli Konselor Menyusui' },
  { src: '/images/galeri/obgyn/p1560875-3.png',                                             alt: 'Poli Obgyn Motherlight' },
  { src: '/images/galeri/fasilitas-ranap/dsc02152-2.jpg',                                   alt: 'Fasilitas Rawat Inap' },
];

export default function Home() {
  const [modalCat, setModalCat] = useState(null);

  return (
    <div className="home">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-card">
          <img
            src="/images/hero-building.jpg"
            alt=""
            aria-hidden="true"
            className="hero-bg-img"
          />
          <div className="hero-text">
            <span className="hero-label">MOTHERLIGHT BIRTH CENTER</span>
            <h1 className="hero-title">
              Klinik Bersalin<br />Gentle Birth di Karanganyar
            </h1>
            <p className="hero-sub">
              Mendampingi perjalanan kehamilan, persalinan, dan masa nifas Anda<br />
              dengan pendekatan hangat, berbasis bukti, dan menghormati hak alamiah ibu dan bayi.
            </p>
            <div className="hero-actions">
              <a
                href="https://wa.me/6285117817414"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Konsultasi Kehamilan
              </a>
              <Link to="/jadwal" className="btn btn-hero-outline">
                Lihat Jadwal Dokter
              </Link>
            </div>
          </div>
          <img
            src="/images/hero-building-mobile.png"
            alt="Gedung Motherlight Birth Center"
            className="hero-img-mobile"
          />
        </div>
      </section>


{/* ── Philosophy + Featured (one section) ─────────────── */}
      <section className="section philosophy-featured-section">
        <div className="container">
          <SectionReveal className="philosophy-inner">
            <span className="section-label">Filosofi Kami</span>
            <h2 className="philosophy-title">
              Kami percaya setiap ibu menyimpan kekuatan yang luar biasa
            </h2>
            <p className="philosophy-desc">
              Tugas kami bukan mengambil alih prosesnya, melainkan hadir, mendampingi, dan
              memastikan Anda merasa aman di setiap langkahnya.
            </p>
          </SectionReveal>

          <div className="featured-grid">
            {featuredCategories.map((cat, i) => {
              const Icon = iconMap[cat.icon];
              return (
                <SectionReveal key={cat.title} delay={i * 100}>
                  <div className="featured-card">
                    <div className="featured-icon-wrap">
                      {Icon && <Icon size={22} />}
                    </div>
                    <h3 className="featured-cat-title">{cat.title}</h3>
                    <p className="featured-cat-desc">{cat.desc}</p>
                    <button className="featured-detail-link" onClick={() => setModalCat(cat)}>
                      Lihat Detail
                    </button>
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {modalCat && <FeaturedModal cat={modalCat} onClose={() => setModalCat(null)} />}

      {/* ── Why Motherlight ──────────────────────────────────── */}
      <section className="why-section">
        <div className="container why-inner">
          <SectionReveal className="why-left">
            <span className="why-label">MENGAPA MOTHERLIGHT</span>
            <h2 className="why-heading">Lebih dari sekadar tempat bersalin.</h2>
            <p className="why-body">Motherlight adalah ruang kepercayaan. Setiap detail kami rancang<br />untuk memastikan Bunda merasa dilihat, didengar, dan didampingi.</p>
          </SectionReveal>
          <div className="why-right">
            {whyItems.map(({ icon, title, sub }, i) => (
              <SectionReveal key={title} delay={i * 80}>
                <div className="why-item">
                  <div className="why-item-icon">
                    <img src={icon} alt={title} className="why-item-svg" />
                  </div>
                  <div>
                    <h3 className="why-item-title">{title}</h3>
                    <p className="why-item-sub">{sub}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Specialties ──────────────────────────────── */}
      <section className="section specialties-section">
        <div className="container">
          <SectionReveal className="text-center">
            <span className="section-label">LAYANAN KAMI</span>
            <h2 className="specialties-heading">
              Dari pemeriksaan pertama hingga masa nifas,<br />
              kami menemani setiap langkah.
            </h2>
          </SectionReveal>
          <div className="specialties-grid">
            {services.map((svc, i) => (
              <SectionReveal key={svc.id} delay={i * 80}>
                <div className="specialty-card">
                  <div className="specialty-img-wrap">
                    <img src={svc.image} alt={svc.name} className="specialty-img" />
                  </div>
                  <div className="specialty-body">
                    <h3 className="specialty-name">{svc.name}</h3>
                    <p className="specialty-desc">{svc.description}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/layanan" className="btn btn-ghost">
              Lihat Semua Layanan <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Alur Layanan ─────────────────────────────────────── */}
      <section className="section alur-section">
        <div className="container alur-inner">
          <SectionReveal className="alur-left">
            <div className="alur-header">
              <span className="section-label">ALUR LAYANAN</span>
              <h2 className="alur-heading">
                Dari pendaftaran hingga pelukan pertama, kami ada di setiap tahap.
              </h2>
            </div>
            <img src="/images/alur-pelayanan.jpg" alt="Motherlight interior" className="alur-photo" />
          </SectionReveal>
          <div className="alur-steps">
            {alurLayanan.map((step, i) => (
              <SectionReveal key={step.step} delay={i * 80}>
                <div className="alur-item">
                  <div className="alur-badge">{step.step}</div>
                  <div>
                    <h3 className="alur-title">{step.title}</h3>
                    <p className="alur-desc">{step.desc}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="section section-alt testimonials-section">
        <div className="container">
          <SectionReveal className="text-center">
            <span className="section-label">Testimoni</span>
            <h2 className="heading-lg section-title">Setiap cerita adalah cahaya yang kami jaga.</h2>
          </SectionReveal>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 100}>
                <div className="testimonial-card">
                  <div className="testimonial-stars">
                    {Array(5).fill(0).map((_, j) => (
                      <Star key={j} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="testimonial-quote">"{t.quote}"</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.name[0]}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Doctors ─────────────────────────────────── */}
      <section className="doctors-section">
        <div className="container">
          <div className="doctors-header">
            <h2 className="doctors-heading">
              Ditangani langsung oleh spesialis yang<br />berpengalaman dan peduli.
            </h2>
            <Link to="/jadwal" className="doctors-all-link">
              Lihat Semua Jadwal <ArrowRight size={15} />
            </Link>
          </div>
          <div className="home-doctors-grid">
            {featuredDoctors.map((doc, i) => (
              <SectionReveal key={doc.name} delay={i * 80}>
                <div className="doc-card">
                  <div className="doc-card-top">
                    <h3 className="doc-name">{doc.name}</h3>
                    <p className="doc-specialty">{doc.specialty}</p>
                  </div>
                  <div className="doc-schedule-box">
                    <p className="doc-schedule-label">Jadwal:</p>
                    {doc.schedule.map((s) => (
                      <p key={s.day} className="doc-schedule-row">
                        {s.day}: {s.times.join(' & ')}
                      </p>
                    ))}
                  </div>
                  <a
                    href="https://wa.me/6285117817414"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary doc-btn"
                  >
                    Buat Janji
                  </a>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery Teaser ───────────────────────────────────── */}
      <section className="section gallery-teaser-section">
        <div className="container">
          <SectionReveal className="text-center">
            <span className="section-label">Galeri</span>
            <h2 className="heading-lg gallery-title">
              Ruang yang kami rancang untuk membuat Bunda merasa seperti di rumah.
            </h2>
          </SectionReveal>

          <SectionReveal>
            <div className="gallery-grid">
              {galleryPhotos.map((photo) => (
                <div key={photo.src} className="gallery-grid-item">
                  <img src={photo.src} alt={photo.alt} />
                </div>
              ))}
            </div>
          </SectionReveal>

          <div className="text-center mt-8">
            <Link to="/galeri" className="btn btn-ghost">
              Lihat Galeri <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Location CTA ─────────────────────────────────────── */}
      <section className="location-section">
        <div className="container location-inner">
          <SectionReveal className="location-info">
            <span className="section-label">Kunjungi Kami</span>
            <p className="location-address">
              Jl. Adi Sumarmo No.369, Kepoh RT 6/RW 4,<br className="location-br" />
              Tohudan, Kec. Colomadu, Kabupaten Karanganyar, Jawa Tengah 57173
            </p>
            <span className="section-label location-contact-label">Hubungi Kami</span>
            <div className="location-socials">
              <a href="https://wa.me/6285117817414" target="_blank" rel="noopener noreferrer" className="location-social-btn" aria-label="WhatsApp">
                <MessageCircle size={22} />
              </a>
              <a href="https://www.instagram.com/motherlight.id" target="_blank" rel="noopener noreferrer" className="location-social-btn" aria-label="Instagram">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="mailto:motherlightbirthcenter@gmail.com" className="location-social-btn" aria-label="Email">
                <Mail size={22} />
              </a>
            </div>
          </SectionReveal>
          <SectionReveal className="location-map">
            <iframe
              src="https://maps.google.com/maps?q=Jl.+Adi+Sumarmo+No.369,+Kepoh,+Tohudan,+Colomadu,+Karanganyar,+Jawa+Tengah+57173&output=embed&z=16"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Motherlight Birth Center"
            />
          </SectionReveal>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
