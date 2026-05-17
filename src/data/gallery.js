/*
  Gallery data — albums and their photos.

  THUMBNAIL SETUP:
    Place thumbnails in /public/images/galeri/thumbnails/ using these filenames:
      Baby Spa.png          → baby-spa.png
      Pharmacy.png          → farmasi.png
      Rawat inap.png        → fasilitas-ranap.png
      Lab.png               → laboratorium.png
      Obygin.png            → obgyn.png
      Playground.png        → playground.png
      poli concelor menyusui.png → poli-konselor-menyusui.png
      Poli Specialis ANak.png    → poli-spesialis-anak.png
      Poli Umum.png              → poli-umum.png
      facilities terapi wicara.png → terapi-wicara.png

  PHOTO SETUP:
    Place each album's photos in /public/images/galeri/[slug]/ e.g.:
      /public/images/galeri/baby-spa/foto-1.jpg
    Then add them to the photos array below:
      { src: '/images/galeri/baby-spa/foto-1.jpg', alt: 'Baby SPA' }
*/

export const albums = [
  {
    slug: 'baby-spa',
    name: 'Baby SPA',
    thumbnail: '/images/galeri/thumbnails/baby-spa.png',
    photos: [],
  },
  {
    slug: 'facade',
    name: 'Facade',
    thumbnail: null,
    photos: [],
  },
  {
    slug: 'farmasi',
    name: 'Farmasi',
    thumbnail: '/images/galeri/thumbnails/farmasi.png',
    photos: [],
  },
  {
    slug: 'fasilitas-ranap',
    name: 'Fasilitas Ranap',
    thumbnail: '/images/galeri/thumbnails/fasilitas-ranap.png',
    photos: [],
  },
  {
    slug: 'laboratorium',
    name: 'Laboratorium',
    thumbnail: '/images/galeri/thumbnails/laboratorium.png',
    photos: [],
  },
  {
    slug: 'obgyn',
    name: 'Obgyn',
    thumbnail: '/images/galeri/thumbnails/obgyn.png',
    photos: [],
  },
  {
    slug: 'pelayanan-bidan',
    name: 'Pelayanan Bidan',
    thumbnail: null,
    photos: [],
  },
  {
    slug: 'playground',
    name: 'Playground',
    thumbnail: '/images/galeri/thumbnails/playground.png',
    photos: [],
  },
  {
    slug: 'poli-konselor-menyusui',
    name: 'Poli Konselor Menyusui',
    thumbnail: '/images/galeri/thumbnails/poli-konselor-menyusui.png',
    photos: [],
  },
  {
    slug: 'poli-spesialis-anak',
    name: 'Poli Spesialis Anak',
    thumbnail: '/images/galeri/thumbnails/poli-spesialis-anak.png',
    photos: [],
  },
  {
    slug: 'poli-umum',
    name: 'Poli Umum',
    thumbnail: '/images/galeri/thumbnails/poli-umum.png',
    photos: [],
  },
  {
    slug: 'terapi-wicara',
    name: 'Terapi Wicara',
    thumbnail: '/images/galeri/thumbnails/terapi-wicara.png',
    photos: [],
  },
];
