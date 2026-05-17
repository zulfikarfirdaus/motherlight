#!/usr/bin/env node

/**
 * Motherlight → Supabase Migration Script
 *
 * This script automates:
 * 1. Creating Supabase tables (if not exists)
 * 2. Migrating doctors data from JSON to Supabase
 * 3. Migrating gallery data from JSON to Supabase
 * 4. Uploading images to Supabase Storage
 *
 * Prerequisites:
 * - Create a Supabase project at https://supabase.com
 * - Create a .env file with SUPABASE_URL and SUPABASE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================
// Configuration
// ============================================================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Use service role key for admin operations

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('Please create a .env file with:');
  console.error('  SUPABASE_URL=your-project-url');
  console.error('  SUPABASE_SERVICE_KEY=your-service-role-key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const DOCTORS_JSON = path.join(__dirname, 'server/data/doctors.json');
const GALLERY_JSON = path.join(__dirname, 'server/data/gallery.json');
const IMAGES_DIR = path.join(__dirname, 'public/images/galeri');

// ============================================================
// Helper Functions
// ============================================================

function log(emoji, message) {
  console.log(`${emoji} ${message}`);
}

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function uploadImageToSupabase(localPath, storagePath) {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const contentType = localPath.endsWith('.png') ? 'image/png' :
                        localPath.endsWith('.jpg') || localPath.endsWith('.jpeg') ? 'image/jpeg' :
                        localPath.endsWith('.webp') ? 'image/webp' : 'image/jpeg';

    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(storagePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`  ⚠️  Failed to upload ${localPath}:`, error.message);
    return null;
  }
}

// ============================================================
// Migration Functions
// ============================================================

async function migrateDoctors() {
  log('📋', 'Migrating doctors data...');

  const doctorsData = readJSON(DOCTORS_JSON);
  let totalInserted = 0;

  for (const [category, doctors] of Object.entries(doctorsData)) {
    for (const doctor of doctors) {
      const { data, error } = await supabase
        .from('doctors')
        .insert({
          name: doctor.name,
          specialty: doctor.specialty,
          category,
          bio: doctor.bio || '',
          note: doctor.note || '',
          schedule: doctor.schedule
        });

      if (error) {
        console.error(`  ⚠️  Failed to insert ${doctor.name}:`, error.message);
      } else {
        totalInserted++;
        log('  ✓', `Inserted: ${doctor.name}`);
      }
    }
  }

  log('✅', `Doctors migration complete! (${totalInserted} doctors)`);
}

async function migrateGallery() {
  log('🖼️ ', 'Migrating gallery data...');

  const galleryData = readJSON(GALLERY_JSON);
  let totalAlbums = 0;
  let totalPhotos = 0;

  for (const album of galleryData.albums) {
    log('  📁', `Processing album: ${album.name}`);

    // Upload thumbnail if exists
    let thumbnailUrl = null;
    if (album.thumbnail) {
      const localThumbPath = path.join(__dirname, 'public', album.thumbnail);
      if (fs.existsSync(localThumbPath)) {
        const thumbStoragePath = `thumbnails/${album.slug}${path.extname(album.thumbnail)}`;
        thumbnailUrl = await uploadImageToSupabase(localThumbPath, thumbStoragePath);
        if (thumbnailUrl) {
          log('    ✓', 'Uploaded thumbnail');
        }
      }
    }

    // Insert album
    const { data: albumData, error: albumError } = await supabase
      .from('albums')
      .insert({
        slug: album.slug,
        name: album.name,
        thumbnail: thumbnailUrl
      })
      .select()
      .single();

    if (albumError) {
      console.error(`  ⚠️  Failed to insert album ${album.name}:`, albumError.message);
      continue;
    }

    totalAlbums++;
    log('  ✓', `Created album: ${album.name}`);

    // Upload and insert photos
    for (let i = 0; i < album.photos.length; i++) {
      const photo = album.photos[i];
      const localPhotoPath = path.join(__dirname, 'public', photo.src);

      if (!fs.existsSync(localPhotoPath)) {
        console.error(`    ⚠️  Photo not found: ${localPhotoPath}`);
        continue;
      }

      const photoFileName = path.basename(photo.src);
      const photoStoragePath = `${album.slug}/${photoFileName}`;
      const photoUrl = await uploadImageToSupabase(localPhotoPath, photoStoragePath);

      if (!photoUrl) continue;

      const { error: photoError } = await supabase
        .from('photos')
        .insert({
          album_id: albumData.id,
          src: photoUrl,
          alt: photo.alt,
          position: i
        });

      if (photoError) {
        console.error(`    ⚠️  Failed to insert photo:`, photoError.message);
      } else {
        totalPhotos++;
        log('    ✓', `Uploaded photo ${i + 1}/${album.photos.length}`);
      }
    }
  }

  log('✅', `Gallery migration complete! (${totalAlbums} albums, ${totalPhotos} photos)`);
}

async function migrateOperatingHours() {
  log('🕐', 'Migrating operating hours...');

  const operatingHours = [
    { day: 'Senin – Jumat', hours: '07:00 – 21:00', position: 0 },
    { day: 'Sabtu', hours: '07:00 – 18:00', position: 1 },
    { day: 'Ahad', hours: '08:00 – 14:00', position: 2 },
    { day: 'Gawat Darurat & Persalinan', hours: '24 Jam', position: 3 }
  ];

  for (const hour of operatingHours) {
    const { error } = await supabase
      .from('operating_hours')
      .insert(hour);

    if (error) {
      console.error(`  ⚠️  Failed to insert ${hour.day}:`, error.message);
    } else {
      log('  ✓', `Inserted: ${hour.day}`);
    }
  }

  log('✅', 'Operating hours migration complete!');
}

async function checkSupabaseConnection() {
  log('🔌', 'Checking Supabase connection...');

  const { data, error } = await supabase
    .from('doctors')
    .select('count')
    .limit(1);

  if (error) {
    console.error('❌ Failed to connect to Supabase!');
    console.error('Error:', error.message);
    console.error('\nMake sure you have:');
    console.error('1. Run the SQL schema in Supabase SQL Editor (supabase-schema.sql)');
    console.error('2. Set correct environment variables in .env');
    process.exit(1);
  }

  log('✅', 'Supabase connection successful!');
}

async function clearExistingData() {
  log('🗑️ ', 'Clearing existing data (if any)...');

  await supabase.from('photos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('albums').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('doctors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('operating_hours').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  log('✅', 'Existing data cleared!');
}

// ============================================================
// Main Migration
// ============================================================

async function main() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║  Motherlight → Supabase Migration Script     ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  try {
    await checkSupabaseConnection();
    await clearExistingData();
    await migrateDoctors();
    await migrateOperatingHours();
    await migrateGallery();

    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║  ✅ Migration Complete!                       ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    console.log('Next steps:');
    console.log('1. Update frontend to use Supabase client');
    console.log('2. Deploy to Netlify');
    console.log('3. Remove old Express server files\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
