export const services = [
  {
    id: 'obgyn',
    name: 'Poli Spesialis Obgyn',
    description: 'Pemeriksaan kehamilan, kesehatan reproduksi wanita, program KB, program kesuburan, dan skrining kesehatan pranikah.',
    image: '/images/services/obgyn.png',
    subServices: [
      'Pemeriksaan kehamilan & USG 4D',
      'Skrining kesehatan reproduksi wanita',
      'Layanan kontrasepsi & KB',
      'Program kesuburan',
      'Skrining kesehatan pranikah',
      'Pap smear & IVA test',
    ],
  },
  {
    id: 'anak',
    name: 'Poli Spesialis Anak',
    description: 'Pemeriksaan tumbuh kembang, status gizi, konsultasi nutrisi, gangguan makan anak, konsultasi alergi, dan skrining TB.',
    image: '/images/services/anak.png',
    subServices: [
      'Pemeriksaan tumbuh kembang anak',
      'Penilaian status gizi & nutrisi',
      'Konsultasi MPASI & pola makan',
      'Gangguan makan anak (GTM, pilih-pilih)',
      'Konsultasi & tes alergi',
      'Skrining tuberkulosis (TB)',
    ],
  },
  {
    id: 'umum',
    name: 'Poli Umum',
    description: 'Pelayanan gawat darurat, injeksi vitamin, perawatan luka, pemasangan dan pelepasan jahitan, serta pembersihan telinga.',
    image: '/images/services/umum.png',
    subServices: [
      'Pelayanan gawat darurat',
      'Injeksi vitamin & suplemen',
      'Perawatan dan ganti balut luka',
      'Pemasangan & pelepasan jahitan',
      'Pembersihan telinga',
    ],
  },
  {
    id: 'rawat-inap',
    name: 'Fasilitas Rawat Inap',
    description: 'Kamar rawat inap pribadi bernuansa rumah, nyaman dan hangat, dilengkapi rawat gabung 24 jam untuk pemulihan optimal bunda dan si kecil.',
    image: '/images/services/rawat-inap.jpeg',
    subServices: [
      'Kamar inap pribadi & nyaman',
      'Rawat gabung 24 jam ibu dan bayi',
      'Monitoring tenaga medis sepanjang malam',
      'Pendampingan laktasi & ASI pasca lahir',
      'Nutrisi pemulihan untuk ibu nifas',
      'Pendampingan perawatan bayi baru lahir',
    ],
  },
  {
    id: 'spa',
    name: 'Spa Ibu dan Bayi',
    description: 'Layanan spa komprehensif untuk ibu hamil, pasca melahirkan, dan bayi, membantu pemulihan dan tumbuh kembang optimal.',
    image: '/images/services/spa.png',
    subServices: [
      'Pijat prenatal & perineal massage',
      'Pijat oksitosin & laktasi',
      'Pijat pascamelahirkan',
      'Perawatan payudara',
      'Renang bayi & pijat bayi',
      'Baby spa (potong kuku, cukur rambut, tindik telinga)',
      'Terapi nebulizer & inframerah',
      'Fisioterapi dada',
    ],
  },
  {
    id: 'konselor',
    name: 'Poli Konselor Menyusui',
    description: 'Pendampingan laktasi oleh konselor bersertifikat untuk memastikan perjalanan menyusui yang sukses dan nyaman.',
    image: '/images/services/konselor.png',
    subServices: [
      'Konsultasi masalah menyusui',
      'Evaluasi posisi & perlekatan',
      'Manajemen ASI perah',
      'Pendampingan ibu menyusui eksklusif',
    ],
  },
];

export const additionalServices = [
  'Rehabilitasi Medik (Terapi Okupasi, Terapi Wicara, Fisioterapi)',
  'Farmasi & apotek',
  'Laboratorium klinik',
  'Teleconsultation',
  'Layanan imunisasi & vaksinasi',
  'Sunat (sirkumsisi)',
  'Layanan psikologi',
  'Kelas SEHATI (senam hamil)',
  'Pelayanan persalinan 24 jam',
  'Layanan water birth',
  'Rawat gabung 24 jam',
  'Layanan kesehatan Umroh & Haji',
];

// Full services & facilities list shown on the Layanan page
export const layananList = [
  {
    name: 'Poli Spesialis Obgin',
    description:
      'Layanan pemeriksaan dan konsultasi kesehatan wanita bersama dokter spesialis obgin, dengan pendekatan yang hangat, jelas, dan menghormati kebutuhan setiap pasien.',
    items: [
      'Pemeriksaan kehamilan',
      'Pemeriksaan sistem reproduksi wanita',
      'Pelayanan kontrasepsi',
      'Program hamil',
      'Skrining pranikah',
    ],
  },
  {
    name: 'Poli Spesialis Anak',
    description:
      'Motherlight mendampingi tumbuh kembang anak sejak awal kehidupan. Pemeriksaan dilakukan untuk membantu orang tua memahami kondisi kesehatan, nutrisi, dan perkembangan anak dengan lebih tenang.',
    items: [
      'Pemeriksaan anak',
      'Pemeriksaan tumbuh kembang',
      'Pemeriksaan status gizi anak',
      'Konsultasi nutrisi dan MPASI',
      'Penanganan masalah makan pada anak, seperti sulit makan, GTM, picky eater, serta kesulitan mengunyah atau menelan',
      'Konsultasi alergi anak',
      'Tes alergi anak',
      'Skrining TB',
    ],
  },
  {
    name: 'Poli Konselor Menyusui',
    description:
      'Kami memahami bahwa perjalanan menyusui bisa membawa banyak pertanyaan dan tantangan. Melalui layanan konselor menyusui, ibu akan didampingi dengan sabar agar lebih percaya diri dalam memberikan ASI.',
  },
  {
    name: 'Sunday Clinic',
    description:
      'Layanan klinik di hari Minggu untuk membantu keluarga yang membutuhkan waktu pemeriksaan lebih fleksibel.',
  },
  {
    name: 'Telekonsultasi',
    description:
      'Untuk ibu dan keluarga yang membutuhkan konsultasi dari rumah, Motherlight menyediakan layanan telekonsultasi yang praktis, aman, dan tetap personal.',
  },
  {
    name: 'Poli Umum',
    description:
      'Layanan kesehatan umum untuk kebutuhan harian keluarga, ditangani dengan sigap dan tetap mengutamakan kenyamanan pasien.',
    items: [
      'Pelayanan IGD',
      'Injeksi vitamin',
      'Wound care',
      'Jahit luka',
      'Lepas jahitan',
      'Pembersihan sumbatan telinga',
    ],
  },
  {
    name: 'Farmasi',
    description:
      'Motherlight menyediakan layanan farmasi untuk mendukung kebutuhan obat dan perawatan pasien setelah pemeriksaan.',
  },
  {
    name: 'Laboratorium',
    description:
      'Fasilitas laboratorium tersedia untuk membantu proses pemeriksaan, pemantauan kesehatan, dan penunjang diagnosis secara lebih menyeluruh.',
  },
  {
    name: 'Pregnancy Pilates dan Senam Hamil',
    description:
      'Program gerak dan latihan untuk membantu ibu hamil mempersiapkan tubuh menjelang persalinan. Setiap sesi dirancang agar ibu merasa lebih kuat, rileks, dan percaya diri.',
  },
  {
    name: 'Kelas Menjadi Ibu Berdaya',
    description:
      'Kelas edukatif untuk membantu ibu dan keluarga mempersiapkan fase kehamilan, persalinan, menyusui, dan pengasuhan awal dengan ilmu yang jelas dan menenangkan.',
    itemsLabel: 'Kelas meliputi:',
    items: [
      'Kelas ibu hamil dan persiapan persalinan',
      'Childbirth education',
      'Kelas newborn',
      'Kelas menyusui',
      'Kelas MPASI',
    ],
  },
  {
    name: 'Post Partum Recovery Treatment',
    description:
      'Layanan pemulihan pasca melahirkan untuk ibu dan bayi, membantu proses pemulihan berlangsung lebih nyaman, lembut, dan terarah.',
  },
  {
    name: 'Spa Ibu dan Bayi',
    description:
      'Layanan perawatan untuk ibu, bayi, dan anak yang dirancang untuk mendukung kenyamanan, relaksasi, bonding, dan kesehatan keluarga.',
    items: [
      'Pijat ibu hamil',
      'Pijat perineum',
      'Pijat oksitosin',
      'Pijat pasca melahirkan',
      'Pijat laktasi',
      'Breast care',
      'Baby and kids massage',
      'Baby swim',
      'Oral care',
      'Potong kuku bayi',
      'Potong rambut bayi',
      'Pijat batuk pilek',
      'Pijat nafsu makan',
      'Pijat sembelit',
      'Tindik bayi',
      'Nebu',
      'Infrared',
      'Fisioterapi dada',
    ],
  },
  {
    name: 'Rehabilitasi Medik',
    description:
      'Layanan rehabilitasi untuk mendukung perkembangan anak dan pemulihan fungsi tubuh, dengan pendampingan yang terarah sesuai kebutuhan masing-masing pasien.',
    items: [
      'Terapi sensori integrasi',
      'Terapi okupasi',
      'Terapi wicara',
      'Fisioterapi',
    ],
  },
  {
    name: 'Vaksinasi Anak dan Dewasa',
    description:
      'Motherlight menyediakan layanan vaksinasi untuk anak dan dewasa, sebagai bagian dari ikhtiar menjaga kesehatan keluarga secara berkelanjutan.',
  },
  {
    name: 'Khitan Anak',
    description:
      'Layanan khitan anak dengan pendekatan yang aman, nyaman, dan ramah bagi anak serta keluarga.',
  },
];

export const featuredCategories = [
  {
    title: 'Layanan Unggulan Obgyn',
    icon: 'Leaf',
    desc: 'Kami memahami bahwa kesehatan ibu adalah fondasi awal kehidupan yang sehat. Temani perjalanan kehamilan Anda dengan pelayanan yang aman dan terpercaya.',
    items: [
      {
        name: 'Gentle & Comfort Normal Birth Center',
        sub: [
          'Persalinan normal minim intervensi',
          'Metode gentle birth',
          'Ruang bersalin nyaman, privat & bernuansa rumah',
          'Pendampingan suami/keluarga',
          'IMD & dukungan menyusui',
        ],
      },
      {
        name: 'Prenatal Wellness Program',
        sub: [
          'Kelas ibu hamil',
          'Prenatal pilates',
          'Edukasi persiapan persalinan',
          'Konseling laktasi & relaksasi',
        ],
      },
      {
        name: 'Postnatal & Home Care',
        sub: [
          'Kunjungan nifas ke rumah',
          'Perawatan ibu & bayi',
          'Konseling menyusui di rumah',
        ],
      },
    ],
  },
  {
    title: 'Layanan Unggulan Anak',
    icon: 'Heart',
    desc: 'Kami hadir untuk memastikan setiap anak tumbuh sehat, kuat, dan bahagia. Mari wujudkan tumbuh kembang anak yang optimal bersama Motherlight Birth Center.',
    items: [
      {
        name: 'Baby Spa & Newborn Care',
        sub: [
          'Baby spa (pijat & hidroterapi)',
          'Perawatan bayi baru lahir',
          'Edukasi pijat bayi untuk orang tua',
          'Meningkatkan kualitas tidur & bonding',
        ],
      },
      {
        name: 'Klinik Tumbuh Kembang Anak',
        sub: [
          'Pemantauan tumbuh kembang',
          'Skrining keterlambatan perkembangan',
          'Konsultasi nutrisi & stimulasi',
          'Pendampingan orang tua',
        ],
      },
      {
        name: 'Rehabilitasi Medik Anak & Dewasa',
        sub: [
          'Penanganan keterlambatan motorik',
          'Terapi pasca cedera/kelainan neurologis ringan',
          'Program stimulasi perkembangan terarah',
        ],
      },
    ],
  },
  {
    title: 'Terapi & Layanan Lainnya',
    icon: 'Droplets',
    desc: 'Hadirkan solusi terapi okupasi, wicara, kesehatan wanita, hingga layanan imunisasi serta vaksinasi umroh untuk menjaga kesejahteraan seluruh anggota keluarga Anda.',
    items: [
      {
        name: 'Okupasi Terapi',
        sub: [
          'Melatih kemandirian anak (makan, berpakaian, aktivitas harian)',
          'Stimulasi motorik halus & sensori integrasi',
          'Terapi untuk anak dengan kebutuhan khusus',
        ],
      },
      {
        name: 'Terapi Wicara',
        sub: [
          'Gangguan bicara & bahasa',
          'Keterlambatan bicara (speech delay)',
          'Gangguan komunikasi & oral motor',
        ],
      },
      {
        name: 'Layanan Kesehatan Wanita',
        sub: [
          'Suntik KB (termasuk suntik tidak haid)',
          'Konsultasi reproduksi',
          'Kontrol pasca persalinan',
        ],
      },
      {
        name: 'Layanan Imunisasi & Vaksinasi',
        sub: [
          'Vaksin ibu & anak lengkap',
          'Vaksin umroh/haji (meningitis, dll)',
          'Edukasi jadwal imunisasi',
        ],
      },
      {
        name: 'Layanan Kesehatan Umroh & Haji',
        sub: [
          'Vaksinasi persiapan ibadah',
          'Skrining kesehatan',
          'Edukasi kesehatan perjalanan',
        ],
      },
    ],
  },
];

export const alurLayanan = [
  { step: '1', title: 'Daftarkan Diri Anda', desc: 'Hubungi kami via WhatsApp atau kunjungi langsung, tim kami akan membantu memilih layanan yang sesuai.' },
  { step: '2', title: 'Konsultasi Awal', desc: 'Bertemu dokter di Motherlight untuk pemeriksaan & perencanaan persalinan yang personal.' },
  { step: '3', title: 'Program Persiapan', desc: 'Kelas senam, hypnobirthing, dan antenatal class tersedia setiap minggu agar fisik dan mental makin siap.' },
  { step: '4', title: 'Hari Persalinan', desc: 'Kami ada 24 jam. Tim bidan & dokter siap mendampingi Anda dengan tenang dan penuh kasih.' },
  { step: '5', title: 'Pemulihan & Pendampingan', desc: 'Rawat gabung, konsultasi ASI, dan pendampingan nifas agar Bunda pulih dengan optimal.' },
];
