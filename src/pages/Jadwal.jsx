import { useEffect, useState } from 'react';
import { Clock, Phone, Calendar } from 'lucide-react';
import useReveal from '../hooks/useReveal';
import { operatingHours } from '../data/doctors';
import CtaSection from '../components/CtaSection';
import { getDoctors, getCategories } from '../lib/supabase';
import './Jadwal.css';
import Seo from '../components/Seo';


function SectionReveal({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function DoctorCard({ doctor, index }) {
  const initials = doctor.name
    .replace(/^dr\.\s*/i, '')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <SectionReveal delay={index * 80}>
      <div className="doctor-card">
        <div className="doctor-header">
          <div className="doctor-avatar">{initials}</div>
          <div className="doctor-info">
            <h3 className="doctor-name">{doctor.name}</h3>
            <p className="doctor-specialty">{doctor.specialty}</p>
            {doctor.note && <span className="doctor-note">{doctor.note}</span>}
          </div>
        </div>
        {doctor.bio && <p className="doctor-bio">{doctor.bio}</p>}
        <div className="doctor-schedule">
          <div className="schedule-label">
            <Calendar size={14} />
            Jadwal Praktek
          </div>
          <ul className="schedule-list">
            {doctor.schedule.map((s) => (
              <li key={s.day} className="schedule-row">
                <span className="schedule-day">{s.day}</span>
                <span className="schedule-times">
                  {s.times.map((t, i) => (
                    <span key={i} className="schedule-time">{t}</span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionReveal>
  );
}

export default function Jadwal() {
  const [doctors,    setDoctors]    = useState({});
  const [categories, setCategories] = useState([]);
  const [activeTab,  setActiveTab]  = useState(null);

  useEffect(() => {
    Promise.all([getDoctors(), getCategories()])
      .then(([docs, cats]) => {
        setDoctors(docs);
        setCategories(cats);
        if (cats.length > 0) setActiveTab(cats[0].key);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="jadwal">
      <Seo
        title="Jadwal Dokter Kandungan & Anak | Motherlight Karanganyar"
        description="Jadwal praktik dokter spesialis kandungan dan anak di Motherlight Birth Center, Colomadu, Karanganyar. IGD dan persalinan buka 24 jam."
        path="/jadwal"
      />
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero jadwal-hero">
        <div className="container">
          <SectionReveal className="text-center">
            <h1 className="heading-xl">Jadwal Praktek Dokter</h1>
            <p className="jadwal-hero-desc">
              Konsultasikan kebutuhan Anda dengan dokter dan tenaga medis kami yang berpengalaman, hubungi kami untuk membuat janji temu.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── Hours Banner ──────────────────────────────────────── */}
      <div className="hours-banner">
        <div className="container hours-grid">
          {operatingHours.map((h) => (
            <div
              key={h.day}
              className={`hour-item${h.day === 'Gawat Darurat & Persalinan' ? ' hour-item--emergency' : ''}`}
            >
              <div className="hour-icon-wrap">
                <Clock size={17} />
              </div>
              <div>
                <div className="hour-day">{h.day}</div>
                <div className="hour-time">{h.hours}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Doctor Tabs ───────────────────────────────────────── */}
      <section className="section jadwal-section">
        <div className="container">
          <div className="jadwal-tabs">
            {categories.map((tab) => (
              <button
                key={tab.key}
                className={`jadwal-tab${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="doctors-grid">
            {doctors[activeTab]?.map((doc, i) => (
              <DoctorCard key={doc.name} doctor={doc} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Baby SPA & Farmasi ───────────────────────────────── */}
      <section className="section section-alt spa-farmasi-section">
        <div className="container">
          <SectionReveal className="text-center">
            <span className="section-label">Layanan Harian</span>
            <h2 className="heading-lg section-title">Baby SPA &amp; Farmasi</h2>
          </SectionReveal>
          <div className="spa-farmasi-grid">
            <SectionReveal>
              <div className="spa-farmasi-card">
                <h3>Baby SPA</h3>
                <p>Oleh tim bidan kami yang terlatih</p>
                <div className="spa-time">
                  <Clock size={15} />
                  Setiap Hari · 07:00 – 21:00
                </div>
                <p className="spa-note">Dengan perjanjian</p>
              </div>
            </SectionReveal>
            <SectionReveal delay={100}>
              <div className="spa-farmasi-card">
                <h3>Farmasi</h3>
                <p>Apotek klinik dengan obat-obatan lengkap</p>
                <div className="spa-time">
                  <Clock size={15} />
                  Setiap Hari · 07:00 – 21:00
                </div>
                <p className="spa-note">Dengan perjanjian</p>
              </div>
            </SectionReveal>
            <SectionReveal delay={200}>
              <div className="spa-farmasi-card">
                <h3>Gawat Darurat &amp; Persalinan</h3>
                <p>Layanan persalinan dan kegawatdaruratan</p>
                <div className="spa-time">
                  <Clock size={15} />
                  24 Jam · Setiap Hari
                </div>
                <p className="spa-note emergency">Selalu siap</p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <CtaSection hideScheduleLink />
    </div>
  );
}
