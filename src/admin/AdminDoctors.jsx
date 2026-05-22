import { useEffect, useState } from 'react';
import { Plus, Trash2, Check, X, PenLine, Pencil } from 'lucide-react';
import {
  getDoctors,
  updateDoctors,
  getCategories,
  createCategory,
  renameCategory,
  deleteCategory,
} from '../lib/supabase';

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
  const [categories,        setCategories]        = useState([]);
  const [data,              setData]              = useState(null);
  const [activeTab,         setActiveTab]         = useState(null);
  const [editIdx,           setEditIdx]           = useState(null);
  const [saving,            setSaving]            = useState(false);
  const [toast,             setToast]             = useState(null);
  const [editingCategory,   setEditingCategory]   = useState(null); // { key, label }
  const [showNewCategory,   setShowNewCategory]   = useState(false);
  const [newCategoryLabel,  setNewCategoryLabel]  = useState('');

  const notify = (msg, type = 'success') => setToast({ msg, type });

  useEffect(() => {
    Promise.all([getDoctors(), getCategories()])
      .then(([docs, cats]) => {
        setData(docs);
        setCategories(cats);
        if (cats.length > 0) setActiveTab(cats[0].key);
      })
      .catch((err) => {
        console.error('Load error:', err);
        notify('Gagal memuat data', 'error');
        setData({});
        setCategories([]);
      });
  }, []);

  // ── Category handlers ──────────────────────────────────────────

  async function handleCreateCategory(e) {
    e.preventDefault();
    if (!newCategoryLabel.trim()) return;
    try {
      const cat = await createCategory(newCategoryLabel);
      setCategories(prev => [...prev, cat]);
      setData(prev => ({ ...prev, [cat.key]: [] }));
      setActiveTab(cat.key);
      setNewCategoryLabel('');
      setShowNewCategory(false);
      notify('Kategori ditambahkan');
    } catch (err) {
      notify(err.message || 'Gagal menambah kategori', 'error');
    }
  }

  async function handleRenameCategory() {
    if (!editingCategory?.label.trim()) { setEditingCategory(null); return; }
    try {
      const updated = await renameCategory(editingCategory.key, editingCategory.label);
      setCategories(prev => prev.map(c => c.key === updated.key ? updated : c));
      setEditingCategory(null);
      notify('Nama kategori diperbarui');
    } catch (err) {
      notify(err.message || 'Gagal mengubah nama', 'error');
    }
  }

  async function handleDeleteCategory(cat) {
    if (!window.confirm(`Hapus kategori "${cat.label}"? Semua dokter di dalamnya juga akan dihapus.`)) return;
    try {
      await deleteCategory(cat.key);
      const remaining = categories.filter(c => c.key !== cat.key);
      setCategories(remaining);
      setData(prev => { const next = { ...prev }; delete next[cat.key]; return next; });
      setActiveTab(remaining[0]?.key || null);
      setEditIdx(null);
      notify('Kategori dihapus');
    } catch (err) {
      notify(err.message || 'Gagal menghapus kategori', 'error');
    }
  }

  // ── Doctor handlers ────────────────────────────────────────────

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
      nextData[activeTab] = nextData[activeTab].map((d, i) => i === index ? updatedDoctor : d);
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

  if (data === null) return <div style={{ padding: 32 }}><div className="admin-empty"><p>Memuat…</p></div></div>;

  const doctors = activeTab ? (data[activeTab] || []) : [];

  return (
    <div style={{ padding: 32 }}>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}

      <div className="admin-section-header">
        <h1 className="admin-section-title">Jadwal Dokter</h1>
        {saving && <span style={{ fontSize: 12, color: 'var(--a-muted)' }}>Menyimpan…</span>}
      </div>

      {/* ── Category tabs with management ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        <div className="admin-tabs" style={{ marginBottom: 0 }}>
          {categories.map(cat => (
            <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {editingCategory?.key === cat.key ? (
                <>
                  <input
                    autoFocus
                    className="admin-input"
                    value={editingCategory.label}
                    onChange={e => setEditingCategory(prev => ({ ...prev, label: e.target.value }))}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { e.preventDefault(); handleRenameCategory(); }
                      if (e.key === 'Escape') setEditingCategory(null);
                    }}
                    style={{ width: 160, fontSize: 13, padding: '5px 10px' }}
                  />
                  <button className="btn-admin btn-admin-primary" style={{ padding: '5px 8px' }} onClick={handleRenameCategory}>
                    <Check size={13} />
                  </button>
                  <button className="btn-admin btn-admin-ghost" style={{ padding: '5px 8px' }} onClick={() => setEditingCategory(null)}>
                    <X size={13} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={`admin-tab${activeTab === cat.key ? ' active' : ''}`}
                    onClick={() => { setActiveTab(cat.key); setEditIdx(null); }}
                  >
                    {cat.label}
                  </button>
                  {activeTab === cat.key && (
                    <>
                      <button
                        className="btn-admin btn-admin-ghost"
                        style={{ padding: '4px 6px', opacity: 0.6 }}
                        title="Ubah nama kategori"
                        onClick={() => setEditingCategory({ key: cat.key, label: cat.label })}
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        className="btn-admin btn-admin-ghost"
                        style={{ padding: '4px 6px', color: 'var(--a-danger)', opacity: 0.7 }}
                        title="Hapus kategori"
                        onClick={() => handleDeleteCategory(cat)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {showNewCategory ? (
          <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              autoFocus
              className="admin-input"
              placeholder="Nama kategori…"
              value={newCategoryLabel}
              onChange={e => setNewCategoryLabel(e.target.value)}
              style={{ width: 180, fontSize: 13 }}
            />
            <button type="submit" className="btn-admin btn-admin-primary" style={{ padding: '6px 12px' }}>
              Simpan
            </button>
            <button type="button" className="btn-admin btn-admin-ghost" style={{ padding: '6px 8px' }} onClick={() => { setShowNewCategory(false); setNewCategoryLabel(''); }}>
              <X size={13} />
            </button>
          </form>
        ) : (
          <button
            className="btn-admin btn-admin-ghost"
            style={{ padding: '6px 12px', fontSize: 12, whiteSpace: 'nowrap' }}
            onClick={() => setShowNewCategory(true)}
          >
            <Plus size={13} /> Tambah Kategori
          </button>
        )}
      </div>

      {/* ── Doctor list ── */}
      {categories.length === 0 && (
        <div className="admin-empty"><p>Belum ada kategori. Tambahkan kategori terlebih dahulu.</p></div>
      )}

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

      {/* ── Add new doctor ── */}
      {activeTab && (
        editIdx === 'new' ? (
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
        )
      )}
    </div>
  );
}
