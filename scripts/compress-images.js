#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Remove macOS metadata files
function cleanMacFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      cleanMacFiles(full);
    } else if (entry.name.startsWith('._')) {
      fs.unlinkSync(full);
      console.log(`  deleted ${path.relative(PUBLIC_DIR, full)}`);
    }
  }
}

// Returns max width based on image path
function maxWidth(filePath) {
  const rel = path.relative(PUBLIC_DIR, filePath);
  if (rel.includes('thumbnails')) return 600;
  if (rel.includes('services')) return 900;
  if (rel.includes('hero')) return 1920;
  if (rel.includes('galeri') || rel.includes('gallery')) return 1400;
  return 1600;
}

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const stat = fs.statSync(filePath);
  const originalKB = Math.round(stat.size / 1024);

  try {
    const mw = maxWidth(filePath);
    let pipeline = sharp(filePath).resize({ width: mw, withoutEnlargement: true });

    let buf;
    if (ext === '.jpg' || ext === '.jpeg') {
      buf = await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    } else if (ext === '.png') {
      buf = await pipeline.png({ quality: 80, compressionLevel: 9 }).toBuffer();
    } else {
      return;
    }

    const newKB = Math.round(buf.length / 1024);
    if (buf.length < stat.size) {
      fs.writeFileSync(filePath, buf);
      const saving = Math.round((1 - buf.length / stat.size) * 100);
      console.log(`  ${path.relative(PUBLIC_DIR, filePath)}: ${originalKB}KB → ${newKB}KB (-${saving}%)`);
    }
  } catch (e) {
    console.error(`  ERROR ${filePath}: ${e.message}`);
  }
}

async function walkAndCompress(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkAndCompress(full);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        await compressImage(full);
      }
    }
  }
}

const imagesDir = path.join(PUBLIC_DIR, 'images');

console.log('\n── Removing macOS metadata files ──');
cleanMacFiles(imagesDir);

console.log('\n── Compressing images ──');
await walkAndCompress(imagesDir);

console.log('\nDone.');
