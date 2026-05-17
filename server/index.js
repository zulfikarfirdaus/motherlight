import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// override: true ensures .env always wins over system env vars
dotenv.config({ override: true });

const PORT       = process.env.PORT       || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'motherlight2025';

const GALLERY_FILE = path.join(__dirname, 'data/gallery.json');
const DOCTORS_FILE = path.join(__dirname, 'data/doctors.json');
const GALERI_DIR   = path.join(ROOT, 'public/images/galeri');
const THUMBS_DIR   = path.join(GALERI_DIR, 'thumbnails');

const app = express();
app.use(cors());
app.use(express.json());

// ── Data helpers ──────────────────────────────────────────────────────────────

const readJSON  = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const writeJSON = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2));

// ── Auth middleware ───────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ── Multer storage ────────────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const { slug } = req.params;
    const dir = req.path.includes('thumbnail')
      ? THUMBS_DIR
      : path.join(GALERI_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    const { slug } = req.params;
    if (req.path.includes('thumbnail')) {
      cb(null, `${slug}${path.extname(file.originalname)}`);
    } else {
      const ext  = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext)
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const candidate = `${base}${ext}`;
      const dest = path.join(GALERI_DIR, slug, candidate);
      cb(null, fs.existsSync(dest) ? `${base}-${Date.now()}${ext}` : candidate);
    }
  },
});

const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });

// ── Auth routes ───────────────────────────────────────────────────────────────

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN_USER || password !== ADMIN_PASS)
    return res.status(401).json({ error: 'Username atau password salah' });
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

app.get('/api/auth/verify', requireAuth, (_req, res) => res.json({ ok: true }));

// ── Gallery routes (public read) ──────────────────────────────────────────────

app.get('/api/gallery', (_req, res) => res.json(readJSON(GALLERY_FILE)));

// ── Gallery routes (admin write) ─────────────────────────────────────────────

app.post('/api/gallery/albums', requireAuth, (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Nama album wajib diisi' });

  const slug = name.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  const data = readJSON(GALLERY_FILE);

  if (data.albums.find(a => a.slug === slug))
    return res.status(409).json({ error: 'Album dengan nama ini sudah ada' });

  const album = { slug, name: name.trim(), thumbnail: null, photos: [] };
  data.albums.push(album);
  fs.mkdirSync(path.join(GALERI_DIR, slug), { recursive: true });
  writeJSON(GALLERY_FILE, data);
  res.json(album);
});

app.post('/api/gallery/albums/:slug/rename', requireAuth, (req, res) => {
  const { slug } = req.params;
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Nama album wajib diisi' });

  const data  = readJSON(GALLERY_FILE);
  const album = data.albums.find(a => a.slug === slug);
  if (!album) return res.status(404).json({ error: 'Album tidak ditemukan' });

  album.name   = name.trim();
  album.photos = album.photos.map(p => ({ ...p, alt: album.name }));
  writeJSON(GALLERY_FILE, data);
  res.json(album);
});

app.delete('/api/gallery/albums/:slug', requireAuth, (req, res) => {
  const { slug } = req.params;
  const data = readJSON(GALLERY_FILE);
  const idx = data.albums.findIndex(a => a.slug === slug);
  if (idx === -1) return res.status(404).json({ error: 'Album tidak ditemukan' });

  const albumDir = path.join(GALERI_DIR, slug);
  if (fs.existsSync(albumDir)) fs.rmSync(albumDir, { recursive: true });

  // Remove thumbnail file if it's slug-named
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
    const t = path.join(THUMBS_DIR, `${slug}${ext}`);
    if (fs.existsSync(t)) { fs.unlinkSync(t); break; }
  }

  data.albums.splice(idx, 1);
  writeJSON(GALLERY_FILE, data);
  res.json({ ok: true });
});

app.post('/api/gallery/albums/:slug/thumbnail',
  requireAuth, upload.single('file'), (req, res) => {
    const { slug } = req.params;
    const data  = readJSON(GALLERY_FILE);
    const album = data.albums.find(a => a.slug === slug);
    if (!album) return res.status(404).json({ error: 'Album tidak ditemukan' });

    const ext = path.extname(req.file.originalname);
    album.thumbnail = `/images/galeri/thumbnails/${slug}${ext}`;
    writeJSON(GALLERY_FILE, data);
    res.json({ thumbnail: album.thumbnail });
  }
);

app.post('/api/gallery/albums/:slug/photos',
  requireAuth, upload.array('files', 50), (req, res) => {
    const { slug } = req.params;
    const data  = readJSON(GALLERY_FILE);
    const album = data.albums.find(a => a.slug === slug);
    if (!album) return res.status(404).json({ error: 'Album tidak ditemukan' });

    const added = req.files.map(f => ({
      src: `/images/galeri/${slug}/${f.filename}`,
      alt: album.name,
    }));
    album.photos.push(...added);
    if (!album.thumbnail && album.photos.length > 0)
      album.thumbnail = album.photos[0].src;

    writeJSON(GALLERY_FILE, data);
    res.json({ added: added.length, photos: album.photos });
  }
);

app.delete('/api/gallery/albums/:slug/photos/:filename', requireAuth, (req, res) => {
  const { slug, filename } = req.params;
  const data  = readJSON(GALLERY_FILE);
  const album = data.albums.find(a => a.slug === slug);
  if (!album) return res.status(404).json({ error: 'Album tidak ditemukan' });

  const filePath = path.join(GALERI_DIR, slug, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  const src = `/images/galeri/${slug}/${filename}`;
  album.photos = album.photos.filter(p => p.src !== src);
  if (album.thumbnail === src)
    album.thumbnail = album.photos[0]?.src ?? null;

  writeJSON(GALLERY_FILE, data);
  res.json({ photos: album.photos });
});

// ── Doctors routes ────────────────────────────────────────────────────────────

app.get('/api/doctors', (_req, res) => res.json(readJSON(DOCTORS_FILE)));

app.put('/api/doctors', requireAuth, (req, res) => {
  writeJSON(DOCTORS_FILE, req.body);
  res.json({ ok: true });
});

// ── Serve built frontend in production ────────────────────────────────────────

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(ROOT, 'dist')));
  app.get('*', (_req, res) =>
    res.sendFile(path.join(ROOT, 'dist/index.html'))
  );
}

app.listen(PORT, () => {
  console.log(`\x1b[36m▸\x1b[0m API server   → http://localhost:${PORT}`);
  console.log(`\x1b[36m▸\x1b[0m Admin login  → http://localhost:5173/admin/login`);
  console.log(`\x1b[33m  username: ${ADMIN_USER}`);
  console.log(`  password: ${ADMIN_PASS}\x1b[0m`);
});
