import { useLayoutEffect } from 'react';

const SITE = 'https://motherlight.co.id';
const DEFAULT_IMAGE = `${SITE}/images/og-image.jpg`;

/** Create the tag once if missing, then keep its content in sync. */
function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(attrs.rel ? 'link' : 'meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

/**
 * Per-route document head. The prerender step captures whatever this has
 * written, so each URL ships its own title and description in raw HTML.
 */
export default function Seo({ title, description, path, image = DEFAULT_IMAGE }) {
  const url = `${SITE}${path}`;

  useLayoutEffect(() => {
    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: url });

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'id_ID' });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Motherlight Birth Center' });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
  }, [title, description, url, image]);

  return null;
}
