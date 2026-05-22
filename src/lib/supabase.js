import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// Doctors API
// ============================================================

export async function getDoctors() {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .order('created_at');

  if (error) throw error;

  const grouped = {};
  data.forEach(doctor => {
    if (!grouped[doctor.category]) grouped[doctor.category] = [];
    grouped[doctor.category].push(doctor);
  });

  return grouped;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('position');
  if (error) throw error;
  return data;
}

export async function createCategory(label) {
  const key = label.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const { data: last } = await supabase
    .from('categories')
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle();

  const position = last ? last.position + 1 : 0;

  const { data, error } = await supabase
    .from('categories')
    .insert({ key, label: label.trim(), position })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function renameCategory(key, label) {
  const { data, error } = await supabase
    .from('categories')
    .update({ label: label.trim() })
    .eq('key', key)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(key) {
  await supabase.from('doctors').delete().eq('category', key);
  const { error } = await supabase.from('categories').delete().eq('key', key);
  if (error) throw error;
  return { ok: true };
}

export async function updateDoctors(groupedData) {
  const { error: deleteError } = await supabase
    .from('doctors')
    .delete()
    .not('id', 'is', null);

  if (deleteError) throw deleteError;

  const rows = [];
  for (const [category, doctors] of Object.entries(groupedData)) {
    for (const doc of (doctors || [])) {
      rows.push({
        name: doc.name,
        specialty: doc.specialty,
        category,
        bio: doc.bio || '',
        note: doc.note || '',
        schedule: doc.schedule,
      });
    }
  }

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from('doctors').insert(rows);
    if (insertError) throw insertError;
  }

  return { ok: true };
}

// ============================================================
// Gallery API
// ============================================================

export async function getGallery() {
  const { data: albums, error: albumsError } = await supabase
    .from('albums')
    .select(`
      *,
      photos (
        id,
        src,
        alt,
        position
      )
    `)
    .order('created_at');

  if (albumsError) throw albumsError;

  // Sort photos by position
  albums.forEach(album => {
    album.photos.sort((a, b) => a.position - b.position);
  });

  return { albums };
}

export async function createAlbum(name) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const { data, error } = await supabase
    .from('albums')
    .insert({ slug, name })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function renameAlbum(slug, newName) {
  const { data, error } = await supabase
    .from('albums')
    .update({ name: newName })
    .eq('slug', slug)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAlbum(slug) {
  // Photos will be deleted automatically due to CASCADE
  const { error } = await supabase
    .from('albums')
    .delete()
    .eq('slug', slug);

  if (error) throw error;
  return { ok: true };
}

export async function uploadAlbumThumbnail(slug, file) {
  const ext = file.name.split('.').pop();
  const filePath = `thumbnails/${slug}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('gallery')
    .getPublicUrl(filePath);

  // Update album thumbnail URL
  const { error: updateError } = await supabase
    .from('albums')
    .update({ thumbnail: urlData.publicUrl })
    .eq('slug', slug);

  if (updateError) throw updateError;

  return { thumbnail: urlData.publicUrl };
}

export async function uploadAlbumPhotos(slug, files) {
  // Get album ID
  const { data: album, error: albumError } = await supabase
    .from('albums')
    .select('id, name')
    .eq('slug', slug)
    .single();

  if (albumError) throw albumError;

  // Get current max position
  const { data: photos } = await supabase
    .from('photos')
    .select('position')
    .eq('album_id', album.id)
    .order('position', { ascending: false })
    .limit(1);

  let position = photos && photos.length > 0 ? photos[0].position + 1 : 0;

  const uploadedPhotos = [];

  for (const file of files) {
    const fileName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-');
    const filePath = `${slug}/${Date.now()}-${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    const { data: photoData, error: insertError } = await supabase
      .from('photos')
      .insert({
        album_id: album.id,
        src: urlData.publicUrl,
        alt: album.name,
        position: position++
      })
      .select()
      .single();

    if (!insertError) {
      uploadedPhotos.push(photoData);
    }
  }

  return { added: uploadedPhotos.length, photos: uploadedPhotos };
}

export async function deleteAlbumPhoto(slug, photoId) {
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId);

  if (error) throw error;
  return { ok: true };
}

// ============================================================
// Operating Hours API
// ============================================================

export async function getOperatingHours() {
  const { data, error } = await supabase
    .from('operating_hours')
    .select('*')
    .order('position');

  if (error) throw error;
  return data;
}

// ============================================================
// Auth (for admin panel)
// ============================================================

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
