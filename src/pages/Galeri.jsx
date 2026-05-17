import { useEffect, useState } from 'react';
import { ArrowLeft, Images } from 'lucide-react';
import useReveal from '../hooks/useReveal';
import CtaSection from '../components/CtaSection';
import './Galeri.css';

function SectionReveal({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function AlbumCard({ album, index, onClick }) {
  return (
    <SectionReveal delay={index * 60}>
      <button className="album-card" onClick={() => onClick(album)} aria-label={`Buka album ${album.name}`}>
        {album.thumbnail
          ? <img className="album-thumb" src={album.thumbnail} alt={album.name} />
          : (
            <div className="album-thumb-fallback">
              <Images size={36} strokeWidth={1.2} />
            </div>
          )
        }
        <div className="album-overlay">
          <span className="album-name">{album.name}</span>
          {album.photos.length > 0 && (
            <span className="album-count">{album.photos.length} foto</span>
          )}
        </div>
      </button>
    </SectionReveal>
  );
}

function AlbumDetail({ album, onBack, onPhotoClick }) {
  return (
    <div className="album-detail">
      <div className="album-detail-header">
        <button className="album-back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          Semua Album
        </button>
        <h2 className="album-detail-title">{album.name}</h2>
      </div>

      {album.photos.length === 0 ? (
        <div className="album-empty">
          <Images size={48} strokeWidth={1} />
          <p>Foto sedang disiapkan</p>
        </div>
      ) : (
        <div className="album-photos-grid">
          {album.photos.map((photo, i) => (
            <SectionReveal key={photo.src} delay={i * 50}>
              <button
                className="photo-item"
                onClick={() => onPhotoClick(i)}
                aria-label={`Lihat foto: ${photo.alt}`}
              >
                <img src={photo.src} alt={photo.alt} />
                <div className="photo-overlay" />
              </button>
            </SectionReveal>
          ))}
        </div>
      )}
    </div>
  );
}

function Lightbox({ album, index, onClose, onPrev, onNext }) {
  const photo = album.photos[index];
  const hasPrev = index > 0;
  const hasNext = index < album.photos.length - 1;

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Tutup">×</button>

      {hasPrev && (
        <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Sebelumnya">
          <ArrowLeft size={22} />
        </button>
      )}

      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <img src={photo.src} alt={photo.alt} />
        <p className="lightbox-caption">{photo.alt}</p>
        <span className="lightbox-counter">{index + 1} / {album.photos.length}</span>
      </div>

      {hasNext && (
        <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Berikutnya">
          <ArrowLeft size={22} style={{ transform: 'rotate(180deg)' }} />
        </button>
      )}
    </div>
  );
}

export default function Galeri() {
  const [albums,      setAlbums]      = useState([]);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(d => setAlbums(d.albums || []));
  }, []);

  useEffect(() => {
    if (activeAlbum !== null) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeAlbum]);

  return (
    <div className="galeri">
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero galeri-hero">
        <div className="container">
          <SectionReveal className="text-center">
            <h1 className="heading-xl">Galeri Motherlight</h1>
            <p className="galeri-hero-desc">
              Selayang pandang fasilitas, ruangan, dan kegiatan di Motherlight Birth Center.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── Albums / Detail ───────────────────────────────────── */}
      <section className="section galeri-section">
        <div className="container">
          {activeAlbum === null ? (
            <div className="albums-grid">
              {albums.map((album, i) => (
                <AlbumCard key={album.slug} album={album} index={i} onClick={setActiveAlbum} />
              ))}
            </div>
          ) : (
            <AlbumDetail
              album={activeAlbum}
              onBack={() => { setActiveAlbum(null); setLightboxIdx(null); }}
              onPhotoClick={setLightboxIdx}
            />
          )}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <CtaSection />

      {/* ── Lightbox ──────────────────────────────────────────── */}
      {activeAlbum && lightboxIdx !== null && (
        <Lightbox
          album={activeAlbum}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx((i) => i - 1)}
          onNext={() => setLightboxIdx((i) => i + 1)}
        />
      )}
    </div>
  );
}
