import { useEffect, useState } from 'react';
import { Plus, Trash2, Check, X, PenLine } from 'lucide-react';
import { getDoctors, updateDoctors } from '../lib/supabase';

const TABS = [
  { key: 'obgyn',   label: 'Spesialis Obgyn' },
  { key: 'anak',    label: 'Spesialis Anak' },
  { key: 'lainnya', label: 'Umum & Lainnya' },
  { key: 'terapi',  label: 'Terapi & Rehabilitasi' },
];

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return <div className={`admin-toast ${type}`}>{msg}</div>;
}

function emptyDoctor() {
  return { name: '', specialty: '', bio: '', note: '', schedule: [{ day: '', times: [''] }] };
}

function DoctorEditForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({
    ...initial,
    schedule: initial.schedule.map(s => ({
      day: s.day,
      timesStr: s.times.join(', '),
    })),
  }));

  function setField(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function setScheduleRow(i, key, val) {
    setForm(f => {
      const schedule = [...f.schedule];
      schedule[i] = { ...schedule[i], [key]: val };
      return { ...f, schedule };
    });
  }

  function addScheduleRow() {
    setForm(f => ({ ...f, schedule: [...f.schedule, { day: '', timesStr: '' }] }));
  }

  function removeScheduleRow(i) {
    setForm(f => ({ ...f, schedule: f.schedule.filter((_, idx) => idx !== i) }));
  }

  function handleSave() {
    if (!form.name.trim()) return;
    onSave({
      ...form,
      schedule: form.schedule
        .filter(s => s.day.trim())
        .map(s => ({
          day: s.day.trim(),
          times: s.timesStr.split(',').map(t => t.trim()).filter(Boolean),
        })),
    });
  }

  return (
    <div className="doctor-edit-form">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="admin-field">
          <label className="admin-label">Nama</label>
          <input className="admin-input" value={form.name} onChange={e => setField('name', e.target.value)} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Spesialisasi</label>
          <input className="admin-input" value={form.specialty} onChange={e => setField('specialty', e.target.value)} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Keterangan (opsional)</label>
          <input className="admin-input" placeholder="cth: Dengan perjanjian" value={form.note} onChange={e => setField('note', e.target.value)} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Bio (opsional)</label>
          <input className="admin-input" value={form.bio} onChange={e => setField('bio', e.target.value)} />
        </div>
      </div>

      <div className="admin-field">
        <label className="admin-label">Jadwal Praktek</label>
        <div className="schedule-editor">
          {form.schedule.map((row, i) => (
            <div className="schedule-row-editor" key={i}>
              <input
                className="admin-input"
                placeholder="Hari (cth: Senin – Jumat)"
                value={row.day}
                onChange={e => setScheduleRow(i, 'day', e.target.value)}
              />
              <input
                className="admin-input"
                placeholder="Jam (cth: 08:00–10:00, 15:00–17:00)"
                value={row.timesStr}
                onChange={e => setScheduleRow(i, 'timesStr', e.target.value)}
              />
              <button
                type="button"
                className="btn-admin btn-admin-ghost"
                style={{ color: 'var(--a-danger)', padding: '6px' }}
                onClick={() => removeScheduleRow(i)}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button type="button" className="add-schedule-btn" onClick={addScheduleRow}>
            <Plus size={13} /> Tambah Baris
          </button>
        </div>
      </div>

      <div className="doctor-edit-actions">
        <button className="btn-admin btn-admin-primary" onClick={handleSave}>
          <Check size={14} /> Simpan
        </button>
        <button className="btn-admin btn-admin-secondary" onClick={onCancel}>
          Batal
        </button>
      </div>
    </div>
  );
}

export default function AdminDoctors() {
  const [data,      setData]      = useState(null);
  const [activeTab, setActiveTab] = useState('obgyn');
  const [editIdx,   setEditIdx]   = useState(null); // index or 'new'
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState(null);

  const notify = (msg, type = 'success') => setToast({ msg, type });

  useEffect(() => {
    getDoctors()
      .then(setData)
      .catch((err) => {
        console.error('getDoctors error:', err);
        notify('Gagal memuat data dokter', 'error');
        setData({ obgyn: [], anak: [], lainnya: [], terapi: [] });
      });
  }, []);

  async function saveAll(nextData) {
    setSaving(true);
    try {
      await updateDoctors(nextData);
      setSaving(false);
      return true;
    } catch (err) {
      setSaving(false);
      notify(err.message || 'Gagal menyimpan', 'error');
      return false;
    }
  }

  async function handleSaveDoctor(index, updatedDoctor) {
    const nextData = { ...data };
    if (index === 'new') {
      nextData[activeTab] = [...(nextData[activeTab] || []), updatedDoctor];
    } else {
      nextData[activeTab] = nextData[activeTab].map((d, i) =>
        i === index ? updatedDoctor : d
      );
    }
    const ok = await saveAll(nextData);
    if (ok) { setData(nextData); setEditIdx(null); notify('Jadwal disimpan'); }
  }

  async function deleteDoctor(index) {
    const doc = data[activeTab][index];
    if (!window.confirm(`Hapus ${doc.name}?`)) return;
    const nextData = { ...data, [activeTab]: data[activeTab].filter((_, i) => i !== index) };
    const ok = await saveAll(nextData);
    if (ok) { setData(nextData); notify('Dokter dihapus'); }
  }

  if (!data) return <div style={{ padding: 32 }}><div className="admin-empty"><p>Memuat…</p></div></div>;

  const doctors = data[activeTab] || [];

  return (
    <div style={{ padding: 32 }}>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}

      <div className="admin-section-header">
        <h1 className="admin-section-title">Jadwal Dokter</h1>
        {saving && <span style={{ fontSize: 12, color: 'var(--a-muted)' }}>Menyimpan…</span>}
      </div>

      <div className="admin-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`admin-tab${activeTab === t.key ? ' active' : ''}`}
            onClick={() => { setActiveTab(t.key); setEditIdx(null); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {doctors.map((doc, i) => (
        <div key={i} className="doctor-card-admin">
          <div className="doctor-card-admin-header">
            <div>
              <div className="doctor-admin-name">{doc.name}</div>
              <div className="doctor-admin-specialty">{doc.specialty}</div>
              {doc.note && <div className="doctor-admin-note">{doc.note}</div>}
            </div>
            {editIdx !== i && (
              <div className="doctor-card-actions">
                <button className="btn-admin btn-admin-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setEditIdx(i)}>
                  <PenLine size={13} /> Edit
                </button>
                <button className="btn-admin btn-admin-danger" style={{ padding: '6px 10px' }} onClick={() => deleteDoctor(i)}>
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>

          {editIdx === i && (
            <DoctorEditForm
              initial={doc}
              onSave={updated => handleSaveDoctor(i, updated)}
              onCancel={() => setEditIdx(null)}
            />
          )}

          {editIdx !== i && (
            <ul style={{ marginTop: 10, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {doc.schedule.map((s, j) => (
                <li key={j} style={{ fontSize: 12, color: 'var(--a-muted)', display: 'flex', gap: 8 }}>
                  <span style={{ fontWeight: 600, color: 'var(--a-text)', minWidth: 140 }}>{s.day}</span>
                  <span>{s.times.join(' · ')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Add new doctor */}
      {editIdx === 'new' ? (
        <div className="doctor-card-admin">
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Dokter Baru</div>
          <DoctorEditForm
            initial={emptyDoctor()}
            onSave={d => handleSaveDoctor('new', d)}
            onCancel={() => setEditIdx(null)}
          />
        </div>
      ) : (
        <button
          className="btn-admin btn-admin-secondary"
          style={{ marginTop: 8 }}
          onClick={() => setEditIdx('new')}
        >
          <Plus size={15} />
          Tambah Dokter
        </button>
      )}
    </div>
  );
}
