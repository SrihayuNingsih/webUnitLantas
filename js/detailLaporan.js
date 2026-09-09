/* ============================================================
   HALAMAN DETAIL LAPORAN LAKA LANTAS
   JavaScript Vanilla

   Alur:

   URL
      ↓
   ambil ID laporan
      ↓
   ambilDataLaporan()
      ↓
   JSON
      ↓
   normalisasi data
      ↓
   renderLaporan()
      ↓
   tampil di halaman
============================================================ */

/* ============================================================
   1. KONFIGURASI API
============================================================ */

const API_CONFIG = {
  /*
   * Gunakan:
   *
   * "mock"
   * untuk pengujian tampilan lokal.
   *
   * Setelah Apps Script siap,
   * ubah menjadi:
   *
   * mode: "api"
   */

  mode: 'mock',

  /*
   * Nanti isi dengan URL Web App Apps Script.
   *
   * Contoh:
   *
   * endpoint:
   * "https://script.google.com/macros/s/XXXX/exec"
   */

  endpoint: 'GANTI_DENGAN_URL_WEB_APP_APPS_SCRIPT',
};

/* ============================================================
   2. DATA MOCK
   Hanya untuk testing tampilan
============================================================ */

const MOCK_DATA = {
  idLaporan: 'LAKA-20260821-144950-C1Z7',

  noUrut: '01',

  waktuInput: '21 Agustus 2026, 14:49:50',

  /*
   * Status ini hanya placeholder tampilan.
   *
   * Jika database sebenarnya tidak mempunyai
   * kolom Status, nanti bagian ini bisa dihapus.
   */

  status: 'Dalam Penanganan',

  tkp: 'Jl. Raya Baureno, Desa Baureno, Kecamatan Baureno, Kabupaten Bojonegoro',

  waktuKejadian: {
    hari: 'Jumat',
    tanggal: '21 Agustus 2026',
    jam: '13.45 WIB',
  },

  kendaraan: [
    {
      nomor: 1,

      kendaraan: {
        jenis: 'Sepeda Motor',
        merk: 'Honda Beat',
        nomorPolisi: 'S 1234 AB',
        warna: 'Hitam',
      },

      pengendara: {
        nama: 'Amin',
        umur: '32 Tahun',
        alamat: 'Desa Baureno',
        pekerjaan: 'Swasta',
      },

      pembonceng: [
        {
          nama: 'Siti',
          umur: '29 Tahun',
          hubungan: 'Istri',
        },
      ],
    },

    {
      nomor: 2,

      kendaraan: {
        jenis: 'Sepeda Motor',
        merk: 'Yamaha NMAX',
        nomorPolisi: 'S 5678 CD',
        warna: 'Biru',
      },

      pengendara: {
        nama: 'Budi',
        umur: '28 Tahun',
        alamat: 'Desa Sraturejo',
        pekerjaan: 'Wiraswasta',
      },

      pembonceng: [],
    },
  ],

  saksi: [
    {
      nomor: 1,
      nama: 'Slamet',
      umur: '45 Tahun',
      alamat: 'Desa Baureno',
      pekerjaan: 'Petani',
    },

    {
      nomor: 2,
      nama: 'Joko',
      umur: '38 Tahun',
      alamat: 'Desa Gunungsari',
      pekerjaan: 'Swasta',
    },
  ],

  kronologi:
    'Pada hari Jumat tanggal 21 Agustus 2026 sekitar pukul 13.45 WIB telah terjadi kecelakaan lalu lintas di Jl. Raya Baureno. Kendaraan pertama berjalan dari arah barat ke timur. Pada saat bersamaan kendaraan kedua melaju dari arah berlawanan. Sesampainya di lokasi kejadian terjadi benturan antara kedua kendaraan.',

  korban: {
    lr: 1,
    lb: 0,
    md: 0,
  },

  kermat: 2500000,

  petugas: ['Aipda Ahmad', 'Bripka Budi Santoso', 'Briptu Candra'],

  linkDokumentasi: 'https://drive.google.com/',
};

/* ============================================================
   3. HELPER
============================================================ */

/*
 * Menghindari error jika data kosong/null/undefined.
 */

function nilaiAman(nilai, fallback = '-') {
  if (nilai === null || nilai === undefined || String(nilai).trim() === '') {
    return fallback;
  }

  return nilai;
}

/*
 * Escape HTML.
 *
 * Penting karena data nantinya berasal dari Google Sheets.
 */

function escapeHTML(nilai) {
  return String(nilaiAman(nilai, ''))
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/*
 * Format angka menjadi Rupiah.
 */

function formatRupiah(nilai) {
  const angka = Number(nilai) || 0;

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(angka);
}

/*
 * Mengubah object menjadi array jika diperlukan.
 */

function pastikanArray(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (data === null || data === undefined || data === '') {
    return [];
  }

  return [data];
}

/* ============================================================
   4. AMBIL ID LAPORAN DARI URL
============================================================ */

function ambilIdLaporanDariURL() {
  const params = new URLSearchParams(window.location.search);

  /*
   * Mendukung beberapa nama parameter.
   */

  return (
    params.get('id') ||
    params.get('idLaporan') ||
    params.get('laporan') ||
    ''
  ).trim();
}

/* ============================================================
   5. AMBIL DATA LAPORAN
============================================================ */

async function ambilDataLaporan(idLaporan) {
  /*
   * MODE MOCK
   */

  if (API_CONFIG.mode === 'mock') {
    /*
     * Kita cek ID.
     *
     * Untuk testing:
     * jika ID kosong, tetap gunakan mock.
     */

    return {
      success: true,

      data: {
        ...MOCK_DATA,

        /*
         * Jika URL mempunyai ID,
         * gunakan ID tersebut.
         */

        idLaporan: idLaporan || MOCK_DATA.idLaporan,
      },
    };
  }

  /* ========================================================
       MODE API
    ======================================================== */

  if (!API_CONFIG.endpoint || API_CONFIG.endpoint.includes('GANTI_DENGAN')) {
    throw new Error('URL Apps Script belum dikonfigurasi.');
  }

  const url =
    API_CONFIG.endpoint +
    '?action=getLaporan&id=' +
    encodeURIComponent(idLaporan);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Gagal menghubungi server.');
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || 'Data laporan tidak ditemukan.');
  }

  return json;
}

/* ============================================================
   6. NORMALISASI DATA
============================================================ */

function normalisasiLaporan(raw) {
  /*
   * Fungsi ini menjadi jembatan antara:
   *
   * Google Sheets
   *       ↓
   * JSON Apps Script
   *       ↓
   * UI
   *
   * Jadi nama kolom Sheets tidak harus
   * sama persis dengan nama property UI.
   */

  const data = raw || {};

  const hasil = {
    idLaporan: data.idLaporan ?? data['ID Laporan'] ?? '',

    noUrut: data.noUrut ?? data['No Urut'] ?? '',

    waktuInput: data.waktuInput ?? data['Waktu Input'] ?? '',

    status: data.status ?? data['Status'] ?? '',

    tkp: data.tkp ?? data['TKP'] ?? '',

    waktuKejadian: data.waktuKejadian ?? data['Waktu Kejadian'] ?? '',

    kendaraan:
      data.kendaraan ?? data['Kendaraan yang Terlibat Kecelakaan'] ?? [],

    saksi: data.saksi ?? data['Identitas Saksi-Saksi'] ?? [],

    kronologi: data.kronologi ?? data['Kronologi Kejadian'] ?? '',

    korban: {
      lr: data.korban?.lr ?? data.LR ?? data['LR'] ?? 0,

      lb: data.korban?.lb ?? data.LB ?? data['LB'] ?? 0,

      md: data.korban?.md ?? data.MD ?? data['MD'] ?? 0,
    },

    kermat: data.kermat ?? data['Kermat'] ?? 0,

    petugas: data.petugas ?? data['Petugas'] ?? [],

    linkDokumentasi:
      data.linkDokumentasi ?? data['Link dokumentasi Google Drive'] ?? '',
  };

  /*
   * Waktu kejadian bisa berupa object
   * atau teks biasa.
   */

  if (hasil.waktuKejadian && typeof hasil.waktuKejadian === 'object') {
    hasil.waktuKejadian = {
      hari: hasil.waktuKejadian.hari ?? '',

      tanggal: hasil.waktuKejadian.tanggal ?? '',

      jam: hasil.waktuKejadian.jam ?? '',
    };
  }

  return hasil;
}

/* ============================================================
   7. RENDER HERO
============================================================ */

function renderHeader(data) {
  document.getElementById('laporanId').textContent = nilaiAman(data.idLaporan);

  document.getElementById('waktuInput').textContent = nilaiAman(
    data.waktuInput,
  );

  const badge = document.getElementById('statusBadge');

  /*
   * Jika status tidak tersedia,
   * jangan tampilkan status palsu.
   */

  if (
    data.status === null ||
    data.status === undefined ||
    String(data.status).trim() === ''
  ) {
    badge.classList.add('hidden');

    return;
  }

  badge.textContent = data.status;
}

/* ============================================================
   8. RENDER RINGKASAN
============================================================ */

function renderRingkasan(data) {
  document.getElementById('jumlahLR').textContent = nilaiAman(
    data.korban?.lr,
    0,
  );

  document.getElementById('jumlahLB').textContent = nilaiAman(
    data.korban?.lb,
    0,
  );

  document.getElementById('jumlahMD').textContent = nilaiAman(
    data.korban?.md,
    0,
  );

  document.getElementById('jumlahKermat').textContent = formatRupiah(
    data.kermat,
  );
}

/* ============================================================
   9. RENDER WAKTU + LOKASI
============================================================ */

function renderWaktuLokasi(data) {
  const waktuElement = document.getElementById('waktuKejadian');

  /*
   * Jika object.
   */

  if (data.waktuKejadian && typeof data.waktuKejadian === 'object') {
    waktuElement.innerHTML = `

            <div
                class="
                    grid
                    gap-3
                    sm:grid-cols-3
                "
            >

                ${buatInfoWaktu('Hari', data.waktuKejadian.hari)}

                ${buatInfoWaktu('Tanggal', data.waktuKejadian.tanggal)}

                ${buatInfoWaktu('Jam', data.waktuKejadian.jam)}

            </div>

        `;
  } else {
    /*
     * Jika berupa teks biasa.
     */
    waktuElement.innerHTML = `

            <div
                class="
                    rounded-2xl
                    border
                    border-blue-200
                    bg-blue-50/70
                    p-4
                    text-sm
                    font-semibold
                    leading-relaxed
                    text-slate-700
                "
            >
                ${escapeHTML(nilaiAman(data.waktuKejadian))}
            </div>

        `;
  }

  document.getElementById('tkp').textContent = nilaiAman(data.tkp);
}

function buatInfoWaktu(label, value) {
  return `

        <div
            class="
                rounded-2xl
                border
                border-blue-200
                bg-blue-50/70
                p-4
            "
        >

            <p class="field-label">
                ${escapeHTML(label)}
            </p>

            <p
                class="
                    mt-1
                    text-sm
                    font-bold
                    text-slate-800
                "
            >
                ${escapeHTML(nilaiAman(value))}
            </p>

        </div>

    `;
}

/* ============================================================
   10. RENDER KENDARAAN
============================================================ */

function renderKendaraan(data) {
  const container = document.getElementById('kendaraanGrid');

  const kendaraan = pastikanArray(data.kendaraan);

  if (kendaraan.length === 0) {
    container.innerHTML = buatEmptyState('Data kendaraan belum tersedia.');

    return;
  }

  container.innerHTML = kendaraan
    .map((item, index) => buatKartuKendaraan(item, index))
    .join('');
}

function buatKartuKendaraan(item, index) {
  const nomor = item.nomor ?? index + 1;

  const kendaraan = item.kendaraan || item.vehicle || {};

  const pengendara = item.pengendara || item.pengemudi || item.driver || {};

  const pembonceng = pastikanArray(item.pembonceng);

  return `

        <article class="vehicle-card">

            <!-- HEADER KENDARAAN -->

            <div class="vehicle-header">

                <div class="vehicle-number">
                    ${escapeHTML(nomor)}
                </div>

                <div>

                    <p class="vehicle-title">
                        Kendaraan ${escapeHTML(nomor)}
                    </p>

                    <p
                        class="
                            mt-0.5
                            text-xs
                            text-slate-500
                        "
                    >
                        Identitas kendaraan
                    </p>

                </div>

            </div>


            <!-- DATA KENDARAAN -->

            <div class="vehicle-section">

                <p class="vehicle-section-title">
                    Kendaraan
                </p>


                ${buatDataRow('Jenis', kendaraan.jenis)}

                ${buatDataRow('Merk / Tipe', kendaraan.merk)}

                ${buatDataRow('Nomor Polisi', kendaraan.nomorPolisi)}

                ${buatDataRow('Warna', kendaraan.warna)}

            </div>


            <!-- PENGENDARA -->

            <div class="vehicle-section">

                <p class="vehicle-section-title">
                    Pengendara / Pengemudi
                </p>


                ${buatDataRow('Nama', pengendara.nama)}

                ${buatDataRow('Umur', pengendara.umur)}

                ${buatDataRow('Alamat', pengendara.alamat)}

                ${buatDataRow('Pekerjaan', pengendara.pekerjaan)}

            </div>


            ${
              pembonceng.length > 0
                ? `

                        <div class="vehicle-section">

                            <p class="vehicle-section-title">
                                Pembonceng
                            </p>

                            <div class="flex flex-col gap-3">

                                ${pembonceng
                                  .map(
                                    (orang, pemboncengIndex) => `

                                            <div
                                                class="
                                                    rounded-xl
                                                    border
                                                    border-blue-200
                                                    bg-blue-50/60
                                                    p-3
                                                "
                                            >

                                                <div
                                                    class="
                                                        mb-2
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                                                >

                                                    <div
                                                        class="
                                                            flex
                                                            h-7
                                                            w-7
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            bg-blue-100
                                                            text-xs
                                                            font-bold
                                                            text-blue-700
                                                        "
                                                    >
                                                        ${pemboncengIndex + 1}
                                                    </div>

                                                    <span
                                                        class="
                                                            text-xs
                                                            font-bold
                                                            text-blue-800
                                                        "
                                                    >
                                                        Pembonceng
                                                    </span>

                                                </div>


                                                ${buatDataRow(
                                                  'Nama',
                                                  orang.nama,
                                                )}

                                                ${buatDataRow(
                                                  'Umur',
                                                  orang.umur,
                                                )}

                                                ${buatDataRow(
                                                  'Hubungan',
                                                  orang.hubungan,
                                                )}

                                            </div>

                                        `,
                                  )
                                  .join('')}

                            </div>

                        </div>

                    `
                : ''
            }

        </article>

    `;
}

/* ============================================================
   DATA ROW
============================================================ */

function buatDataRow(label, value) {
  return `

        <div class="data-row">

            <span class="data-label">
                ${escapeHTML(label)}
            </span>

            <span class="data-value">
                ${escapeHTML(nilaiAman(value))}
            </span>

        </div>

    `;
}

/* ============================================================
   11. RENDER SAKSI
============================================================ */

function renderSaksi(data) {
  const container = document.getElementById('saksiGrid');

  const saksi = pastikanArray(data.saksi);

  if (saksi.length === 0) {
    container.innerHTML = buatEmptyState('Data saksi belum tersedia.');

    return;
  }

  container.innerHTML = saksi
    .map((item, index) => buatKartuSaksi(item, index))
    .join('');
}

function buatKartuSaksi(item, index) {
  const nomor = item.nomor ?? index + 1;

  return `

        <article class="person-card">

            <div
                class="
                    mb-3
                    flex
                    items-center
                    gap-3
                "
            >

                <div class="person-number">
                    ${escapeHTML(nomor)}
                </div>

                <div>

                    <p
                        class="
                            text-sm
                            font-extrabold
                            text-slate-800
                        "
                    >
                        Saksi ${escapeHTML(nomor)}
                    </p>

                    <p
                        class="
                            text-xs
                            text-slate-500
                        "
                    >
                        Identitas saksi
                    </p>

                </div>

            </div>


            ${buatDataRow('Nama', item.nama)}

            ${buatDataRow('Umur', item.umur)}

            ${buatDataRow('Alamat', item.alamat)}

            ${buatDataRow('Pekerjaan', item.pekerjaan)}

        </article>

    `;
}

/* ============================================================
   12. RENDER KRONOLOGI
============================================================ */

function renderKronologi(data) {
  document.getElementById('kronologi').textContent = nilaiAman(data.kronologi);
}

/* ============================================================
   13. RENDER PETUGAS
============================================================ */

function renderPetugas(data) {
  const container = document.getElementById('petugasList');

  const petugas = pastikanArray(data.petugas);

  if (petugas.length === 0) {
    container.innerHTML = buatEmptyState('Data petugas belum tersedia.');

    return;
  }

  container.innerHTML = petugas
    .map((item, index) => {
      /*
       * Jika nanti Apps Script mengirim
       * object petugas, kita juga siap.
       */

      const nama =
        typeof item === 'object' ? item.nama || item.name || '-' : item;

      return `

                        <div class="petugas-item">

                            <div class="petugas-number">
                                ${index + 1}
                            </div>

                            <div class="min-w-0">

                                <p
                                    class="
                                        break-words
                                        text-sm
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    ${escapeHTML(nama)}
                                </p>

                            </div>

                        </div>

                    `;
    })
    .join('');
}

/* ============================================================
   14. RENDER DOKUMENTASI
============================================================ */

function renderDokumentasi(data) {
  const link = document.getElementById('linkDokumentasi');

  const nama = document.getElementById('namaDokumentasi');

  const url = String(data.linkDokumentasi || '').trim();

  if (!url) {
    link.removeAttribute('href');

    link.classList.add('disabled');

    nama.textContent = 'Dokumentasi belum tersedia.';

    return;
  }

  link.href = url;

  nama.textContent = 'Buka folder / dokumentasi Google Drive';
}

/* ============================================================
   15. RENDER MAP
============================================================ */

function renderMap(data) {
  /*
   * Untuk sekarang kita belum memasukkan
   * koordinat karena struktur database
   * belum mempunyai latitude/longitude.
   *
   * Jangan mengarang koordinat.
   */

  const container = document.getElementById('mapContainer');

  if (
    data.latitude !== undefined &&
    data.longitude !== undefined &&
    data.latitude !== '' &&
    data.longitude !== ''
  ) {
    const lat = Number(data.latitude);

    const lng = Number(data.longitude);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      /*
       * Nanti bagian ini dapat diganti
       * dengan Google Maps Embed/API.
       */

      container.innerHTML = `

                <div
                    class="
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-center
                    "
                >

                    <p
                        class="
                            text-sm
                            font-bold
                            text-slate-700
                        "
                    >
                        Koordinat Lokasi
                    </p>

                    <p
                        class="
                            mt-1
                            text-xs
                            text-slate-500
                        "
                    >
                        ${lat}, ${lng}
                    </p>

                </div>

            `;

      return;
    }
  }
}

/* ============================================================
   16. RENDER SEMUA DATA
============================================================ */

function renderLaporan(data) {
  renderHeader(data);

  renderRingkasan(data);

  renderWaktuLokasi(data);

  renderKendaraan(data);

  renderSaksi(data);

  renderKronologi(data);

  renderPetugas(data);

  renderDokumentasi(data);

  renderMap(data);
}

/* ============================================================
   17. EMPTY STATE
============================================================ */

function buatEmptyState(pesan) {
  return `

        <div
            class="
                rounded-2xl
                border
                border-dashed
                border-blue-300
                bg-blue-50/60
                p-5
                text-center
            "
        >

            <p
                class="
                    text-sm
                    font-semibold
                    text-slate-500
                "
            >
                ${escapeHTML(pesan)}
            </p>

        </div>

    `;
}

/* ============================================================
   18. TOAST
============================================================ */

let toastTimer = null;

function tampilkanToast(pesan) {
  const toast = document.getElementById('toast');

  toast.textContent = pesan;

  toast.classList.remove('hidden');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2500);
}

/* ============================================================
   19. NAVIGASI KEMBALI
============================================================ */

function kembaliKeDaftar() {
  /*
   * Jika halaman sebelumnya tersedia,
   * gunakan history browser.
   */

  if (window.history.length > 1) {
    window.history.back();

    return;
  }

  /*
   * Fallback jika halaman dibuka langsung.
   */

  window.location.href = 'halLakaLantas.html';
}

/* ============================================================
   20. ACTION BUTTON
============================================================ */

function setupActions() {
  const btnKembali = document.getElementById('btnKembali');

  const btnTutupMobile = document.getElementById('btnTutupMobile');

  const btnPdf = document.getElementById('btnPdf');

  const btnBagikan = document.getElementById('btnBagikan');

  const pdfPopover = document.getElementById('pdfPopover');

  const sharePopover = document.getElementById('sharePopover');

  /* ========================================================
       KEMBALI
    ======================================================== */

  btnKembali.addEventListener('click', kembaliKeDaftar);

  btnTutupMobile.addEventListener('click', kembaliKeDaftar);

  /* ========================================================
       PDF POPOVER
    ======================================================== */

  btnPdf.addEventListener('click', function (event) {
    event.stopPropagation();

    sharePopover.classList.add('hidden');

    pdfPopover.classList.toggle('hidden');
  });

  /* ========================================================
       SHARE POPOVER
    ======================================================== */

  btnBagikan.addEventListener('click', function (event) {
    event.stopPropagation();

    pdfPopover.classList.add('hidden');

    sharePopover.classList.toggle('hidden');
  });

  /* ========================================================
       CLICK DI LUAR POPOVER
    ======================================================== */

  document.addEventListener('click', function () {
    pdfPopover.classList.add('hidden');

    sharePopover.classList.add('hidden');
  });

  /*
   * Supaya klik di dalam popover
   * tidak langsung menutupnya.
   */

  pdfPopover.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  sharePopover.addEventListener('click', function (event) {
    event.stopPropagation();
  });
}

/* ============================================================
   21. TAMPILKAN ERROR
============================================================ */

function tampilkanError(pesan) {
  const container = document.getElementById('halamanDetail');

  container.innerHTML = `

        <div
            class="
                flex
                min-h-screen
                items-center
                justify-center
                bg-blue-50
                p-5
            "
        >

            <div
                class="
                    w-full
                    max-w-md
                    rounded-3xl
                    border
                    border-blue-200
                    bg-white
                    p-6
                    text-center
                    shadow-lg
                "
            >

                <div
                    class="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-blue-100
                        text-blue-700
                    "
                >

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 9v4m0 4h.01M10.3 3.9L2.8 17a2 2 0 001.7 3h15a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"
                        />
                    </svg>

                </div>


                <h1
                    class="
                        mt-4
                        text-lg
                        font-extrabold
                        text-slate-800
                    "
                >
                    Data Laporan Tidak Dapat Ditampilkan
                </h1>


                <p
                    class="
                        mt-2
                        text-sm
                        leading-relaxed
                        text-slate-500
                    "
                >
                    ${escapeHTML(pesan)}
                </p>


                <button
                    type="button"
                    onclick="kembaliKeDaftar()"
                    class="
                        mt-5
                        rounded-xl
                        bg-blue-700
                        px-5
                        py-2.5
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:bg-blue-800
                    "
                >
                    Kembali ke Daftar Laporan
                </button>

            </div>

        </div>

    `;
}

/* ============================================================
   22. INIT HALAMAN
============================================================ */

async function initHalaman() {
  setupActions();

  const idLaporan = ambilIdLaporanDariURL();

  try {
    /*
     * Ambil data.
     */

    const response = await ambilDataLaporan(idLaporan);

    /*
     * Pastikan response benar.
     */

    if (!response || response.success === false) {
      throw new Error(response?.message || 'Data laporan tidak tersedia.');
    }

    /*
     * Normalisasi.
     */

    const data = normalisasiLaporan(response.data || response);

    /*
     * Render.
     */

    renderLaporan(data);
  } catch (error) {
    console.error('Error halaman detail:', error);

    tampilkanError(error.message || 'Terjadi kesalahan saat mengambil data.');
  }
}

/* ============================================================
   23. JALANKAN
============================================================ */

document.addEventListener('DOMContentLoaded', initHalaman);
