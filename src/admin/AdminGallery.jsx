import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Plus, Trash2, Upload, Images, X, Pencil, Check } from 'lucide-react';
import {
  getGallery,
  createAlbum,
  renameAlbum,
  deleteAlbum,
  uploadAlbumThumbnail,
  uploadAlbumPhotos,
  deleteAlbumPhoto,
} from '../lib/supabase';

function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className={`admin-toast ${type}`}>{msg}</div>;
}

export default function AdminGallery() {
  const [albums,       setAlbums]       = useState([]);
  const [activeAlbum,  setActiveAlbum]  = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [uploading,    setUploading]    = useState(false);
  const [dragOver,     setDragOver]     = useState(false);
  const [newName,      setNewName]      = useState('');
  const [showNew,      setShowNew]      = useState(false);
  const [toast,        setToast]        = useState(null);
  const [editingSlug,  setEditingSlug]  = useState(null);
  const [editName,     setEditName]     = useState('');
  const thumbRef  = useRef();
  const photosRef = useRef();
  const editRef   = useRef();

  const notify = (msg, type = 'success') => setToast({ msg, type });

  // ── Load albums ───────────────────────────────────────────────
  useEffect(() => {
    getGallery()
      .then(d => { setAlbums(d.albums || []); setLoading(false); })
      .catch(() => { notify('Gagal memuat album', 'error'); setLoading(false); });
  }, []);

  // Keep activeAlbum in sync when albums update
  useEffect(() => {
    if (activeAlbum) {
      const fresh = albums.find(a => a.slug === activeAlbum.slug);
      if (fresh) setActiveAlbum(fresh);
    }
  }, [albums]); // eslint-disable-line

  // ── Album CRUD ────────────────────────────────────────────────
  async function handleCreateAlbum(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const data = await createAlbum(newName.trim());
      setAlbums(prev => [...prev, { ...data, photos: [] }]);
      setNewName('');
      setShowNew(false);
      notify('Album berhasil dibuat');
    } catch (err) {
      notify(err.message || 'Gagal membuat album', 'error');
    }
  }

  function startEdit(album, e) {
    e.stopPropagation();
    setEditingSlug(album.slug);
    setEditName(album.name);
    setTimeout(() => editRef.current?.focus(), 50);
  }

  async function saveRename(slug) {
    const name = editName.trim();
    if (!name) { setEditingSlug(null); return; }
    try {
      await renameAlbum(slug, name);
      setAlbums(prev => prev.map(a => a.slug === slug ? { ...a, name } : a));
      if (activeAlbum?.slug === slug) setActiveAlbum(prev => ({ ...prev, name }));
      setEditingSlug(null);
      notify('Nama album diperbarui');
    } catch (err) {
      notify(err.message || 'Gagal mengubah nama', 'error');
    }
  }

  async function handleDeleteAlbum(album) {
    if (!window.confirm(`Hapus album "${album.name}" beserta semua fotonya?`)) return;
    try {
      await deleteAlbum(album.slug);
      setAlbums(prev => prev.filter(a => a.slug !== album.slug));
      if (activeAlbum?.slug === album.slug) setActiveAlbum(null);
      notify('Album dihapus');
    } catch (err) {
      notify(err.message || 'Gagal menghapus album', 'error');
    }
  }

  // ── Thumbnail upload ──────────────────────────────────────────
  async function handleUploadThumbnail(file) {
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadAlbumThumbnail(activeAlbum.slug, file);
      setUploading(false);
      // Append cache-buster so the browser shows the new image immediately
      const thumbnail = `${data.thumbnail}?t=${Date.now()}`;
      setAlbums(prev => prev.map(a =>
        a.slug === activeAlbum.slug ? { ...a, thumbnail } : a
      ));
      notify('Cover diperbarui');
    } catch (err) {
      setUploading(false);
      notify(err.message || 'Gagal upload cover', 'error');
    }
  }

  // ── Photo upload ──────────────────────────────────────────────
  async function handleUploadPhotos(files) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const data = await uploadAlbumPhotos(activeAlbum.slug, Array.from(files));
      setUploading(false);
      setAlbums(prev => prev.map(a => {
        if (a.slug !== activeAlbum.slug) return a;
        const merged = [...a.photos, ...data.photos].sort((x, y) => x.position - y.position);
        return {
          ...a,
          photos: merged,
          thumbnail: a.thumbnail || data.photos[0]?.src || null,
        };
      }));
      notify(`${data.added} foto ditambahkan`);
    } catch (err) {
      setUploading(false);
      notify(err.message || 'Gagal upload foto', 'error');
    }
  }

  async function handleDeletePhoto(photoId) {
    if (!window.confirm('Hapus foto ini?')) return;
    try {
      await deleteAlbumPhoto(activeAlbum.slug, photoId);
      setAlbums(prev => prev.map(a =>
        a.slug === activeAlbum.slug
          ? { ...a, photos: a.photos.filter(p => p.id !== photoId) }
          : a
      ));
      notify('Foto dihapus');
    } catch (err) {
      notify(err.message || 'Gagal menghapus foto', 'error');
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
    handleUploadPhotos(files);
  }

  // ── Album list view ───────────────────────────────────────────
  if (!activeAlbum) {
    return (
      <div style={{ padding: 32 }}>
        {toast && <Toast {...toast} onDone={() => setToast(null)} />}

        <div className="admin-section-header">
          <h1 className="admin-section-title">Galeri</h1>
          <button
            className="btn-admin btn-admin-primary"
            onClick={() => setShowNew(v => !v)}
          >
            <Plus size={15} />
            Album Baru
          </button>
        </div>

        {showNew && (
          <form className="new-album-form" onSubmit={handleCreateAlbum}>
            <input
              autoFocus
              placeholder="Nama album…"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <button type="submit" className="btn-admin btn-admin-primary" style={{ padding: '7px 14px' }}>
              Simpan
            </button>
            <button type="button" className="btn-admin btn-admin-ghost" onClick={() => setShowNew(false)}>
              <X size={14} />
            </button>
          </form>
        )}

        {loading ? (
          <div className="admin-empty"><p>Memuat…</p></div>
        ) : (
          <div className="albums-grid-admin">
            {albums.map(album => (
              <div key={album.slug} className="album-card-admin">
                <div className="album-card-thumb" onClick={() => setActiveAlbum(album)}>
                  {album.thumbnail
                    ? <img src={album.thumbnail} alt={album.name} />
                    : <div className="album-card-thumb-placeholder"><Images size={32} strokeWidth={1} /></div>
                  }
                </div>
                <div className="album-card-body">
                  {editingSlug === album.slug ? (
                    <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                      <input
                        ref={editRef}
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') { e.preventDefault(); saveRename(album.slug); }
                          if (e.key === 'Escape') setEditingSlug(null);
                        }}
                        style={{ flex: 1, fontSize: 13, padding: '4px 8px', border: '1.5px solid var(--a-primary)', borderRadius: 6, outline: 'none' }}
                      />
                      <button
                        type="button"
                        className="btn-admin btn-admin-primary"
                        style={{ padding: '4px 8px' }}
                        onClick={() => saveRename(album.slug)}
                      >
                        <Check size={13} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <div className="album-card-name" onClick={() => setActiveAlbum(album)} style={{ cursor: 'pointer', flex: 1 }}>
                        {album.name}
                      </div>
                      <button
                        className="btn-admin btn-admin-ghost"
                        style={{ padding: '3px 6px', opacity: 0.6 }}
                        onClick={e => startEdit(album, e)}
                        title="Ubah nama"
                      >
                        <Pencil size={12} />
                      </button>
                    </div>
                  )}
                  <div className="album-card-count">{album.photos.length} foto</div>
                  <div className="album-card-actions">
                    <button className="btn-admin btn-admin-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '6px 10px' }} onClick={() => setActiveAlbum(album)}>
                      Kelola
                    </button>
                    <button className="btn-admin btn-admin-danger" style={{ padding: '6px 10px' }} onClick={() => handleDeleteAlbum(album)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Album detail view ─────────────────────────────────────────
  return (
    <div style={{ padding: 32 }}>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}

      <div className="album-detail-admin-header">
        <button className="btn-admin btn-admin-secondary" style={{ padding: '7px 14px' }} onClick={() => setActiveAlbum(null)}>
          <ArrowLeft size={15} />
          Semua Album
        </button>
        {editingSlug === activeAlbum.slug ? (
          <div style={{ display: 'flex', gap: 8, flex: 1 }}>
            <input
              ref={editRef}
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); saveRename(activeAlbum.slug); }
                if (e.key === 'Escape') setEditingSlug(null);
              }}
              style={{ flex: 1, fontSize: 16, fontWeight: 600, padding: '6px 10px', border: '1.5px solid var(--a-primary)', borderRadius: 6, outline: 'none' }}
            />
            <button
              type="button"
              className="btn-admin btn-admin-primary"
              style={{ padding: '6px 12px' }}
              onClick={() => saveRename(activeAlbum.slug)}
            >
              <Check size={14} /> Simpan
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <h1 className="album-detail-admin-title">{activeAlbum.name}</h1>
            <button
              className="btn-admin btn-admin-ghost"
              style={{ padding: '4px 8px', opacity: 0.6 }}
              onClick={e => startEdit(activeAlbum, e)}
              title="Ubah nama"
            >
              <Pencil size={14} />
            </button>
          </div>
        )}
        <button className="btn-admin btn-admin-danger" onClick={() => handleDeleteAlbum(activeAlbum)}>
          <Trash2 size={14} />
          Hapus Album
        </button>
      </div>

      {/* Cover */}
      <div className="admin-panel">
        <div className="admin-panel-title">Foto Cover</div>
        <div className="cover-area">
          <div className="cover-preview">
            {activeAlbum.thumbnail
              ? <img src={activeAlbum.thumbnail} alt="cover" />
              : <Images size={28} strokeWidth={1} />
            }
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--a-muted)', marginBottom: 10 }}>
              Foto cover ditampilkan sebagai thumbnail album di halaman galeri.
            </p>
            <input
              ref={thumbRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => handleUploadThumbnail(e.target.files[0])}
            />
            <button
              className="btn-admin btn-admin-secondary"
              onClick={() => thumbRef.current.click()}
              disabled={uploading}
            >
              <Upload size={14} />
              {activeAlbum.thumbnail ? 'Ganti Cover' : 'Upload Cover'}
            </button>
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="admin-panel">
        <div className="admin-panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Foto-foto ({activeAlbum.photos.length})</span>
          <button
            className="btn-admin btn-admin-primary"
            style={{ fontSize: 12, padding: '6px 14px' }}
            onClick={() => photosRef.current.click()}
            disabled={uploading}
          >
            <Upload size={13} />
            Upload Foto
          </button>
        </div>
        <input
          ref={photosRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => handleUploadPhotos(e.target.files)}
        />

        {uploading && (
          <div className="upload-progress">
            <span>Mengupload…</span>
          </div>
        )}

        {/* Drop zone (shown when no photos) */}
        {activeAlbum.photos.length === 0 && !uploading && (
          <div
            className={`upload-zone${dragOver ? ' drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => photosRef.current.click()}
          >
            <div className="upload-zone-icon"><Upload size={28} strokeWidth={1.5} /></div>
            <p>Drag & drop foto di sini atau klik untuk memilih</p>
            <small>JPG, PNG, WebP · Maks 15 MB per file</small>
          </div>
        )}

        {/* Photo grid */}
        {activeAlbum.photos.length > 0 && (
          <div
            className={`photos-grid-admin${dragOver ? ' drag-over' : ''}`}
            style={dragOver ? { outline: '2px dashed var(--a-primary)', borderRadius: 8, padding: 8 } : {}}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {activeAlbum.photos.map(photo => (
              <div key={photo.id || photo.src} className="photo-admin">
                <img src={photo.src} alt={photo.alt} loading="lazy" />
                <button
                  className="photo-admin-del"
                  onClick={() => handleDeletePhoto(photo.id)}
                  title="Hapus foto"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
