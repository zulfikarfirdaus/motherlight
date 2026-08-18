const STORAGE_PATH = '/storage/v1/object/public/';
const RENDER_PATH = '/storage/v1/render/image/public/';

/**
 * Route a Supabase storage image through the render endpoint so it arrives
 * resized and WebP-encoded instead of as the full-size PNG. The stored album
 * covers are ~1.9MB each; at width 600 they come back around 38KB.
 *
 * Local /images/... paths and anything that isn't a Supabase storage URL are
 * returned untouched.
 */
export function optimizedImage(url, width, quality = 72) {
  if (typeof url !== 'string' || !url.includes(STORAGE_PATH)) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url.replace(STORAGE_PATH, RENDER_PATH)}${sep}width=${width}&quality=${quality}`;
}
