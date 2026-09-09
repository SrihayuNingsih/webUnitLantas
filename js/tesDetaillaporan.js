/* =====================================================
         ELEMENT
      ====================================================== */

const detailLaporanOverlay = document.getElementById('detailLaporanOverlay');

const btnTutupDetail = document.getElementById('btnTutupDetail');

const btnTutupDetailBottom = document.getElementById('btnTutupDetailBottom');

/* =====================================================
         TUTUP DETAIL
         HANYA MENYEMBUNYIKAN OVERLAY.
         TIDAK NAVIGASI.
      ====================================================== */

function tutupDetailLaporan() {
  detailLaporanOverlay.classList.add('hidden');

  detailLaporanOverlay.setAttribute('aria-hidden', 'true');

  document.body.classList.remove('overflow-hidden');
}

btnTutupDetail?.addEventListener('click', tutupDetailLaporan);

btnTutupDetailBottom?.addEventListener('click', tutupDetailLaporan);

/* =====================================================
         STATUS
         3 NILAI TERKUNCI
      ====================================================== */

function setStatusLaporan(status) {
  const badge = document.getElementById('statusBadge');

  const badgeText = document.getElementById('statusBadgeText');

  const badgeDot = document.getElementById('statusBadgeDot');

  if (!badge || !badgeText || !badgeDot) {
    return;
  }

  /*
          Bersihkan style status sebelumnya.
        */

  badge.style.background = '';
  badge.style.borderColor = '';
  badge.style.color = '';

  badgeDot.style.background = '';

  let statusNormal = String(status || '')
    .trim()
    .toLowerCase();

  /*
          STATUS 1
          DALAM PENANGANAN
        */

  if (statusNormal === 'dalam penanganan') {
    badgeText.textContent = 'Dalam Penanganan';

    badge.style.background = 'linear-gradient(135deg, #fef3c7, #f59e0b)';

    badge.style.borderColor = '#f59e0b';

    badge.style.color = '#78350f';

    badgeDot.style.background = '#d97706';

    return;
  }

  /*
          STATUS 2
          SELESAI / RJ
        */

  if (
    statusNormal === 'selesai/rj' ||
    statusNormal === 'selesai / rj' ||
    statusNormal === 'selesai' ||
    statusNormal === 'rj'
  ) {
    badgeText.textContent = 'Selesai/RJ';

    badge.style.background = 'linear-gradient(135deg, #dcfce7, #16a34a)';

    badge.style.borderColor = '#16a34a';

    badge.style.color = '#14532d';

    badgeDot.style.background = '#15803d';

    return;
  }

  /*
          STATUS 3
          LIMPAH POLRES
        */

  if (statusNormal === 'limpah polres') {
    badgeText.textContent = 'Limpah Polres';

    badge.style.background = 'linear-gradient(135deg, #fee2e2, #dc2626)';

    badge.style.borderColor = '#dc2626';

    badge.style.color = '#7f1d1d';

    badgeDot.style.background = '#b91c1c';

    return;
  }

  /*
          Jika status kosong/tidak dikenal,
          tetap gunakan status aman.
        */

  badgeText.textContent = status || 'Dalam Penanganan';

  badge.style.background = 'linear-gradient(135deg, #dbeafe, #93c5fd)';

  badge.style.borderColor = '#60a5fa';

  badge.style.color = '#1e3a8a';

  badgeDot.style.background = '#2563eb';
}

/* =====================================================
         HELPER
      ====================================================== */

function safeText(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
}

function formatRupiah(value) {
  const number = Number(String(value || 0).replace(/[^\d]/g, ''));

  return 'Rp ' + number.toLocaleString('id-ID');
}

/* =====================================================
         DATA DEMO
         HANYA UNTUK PREVIEW SAAT lakaData
         BELUM TERSEDIA.
      ====================================================== */

const dataPreview = {
  id: 'L/12/IX/2026',

  tanggal: '4 September 2026',

  jam: '09:15 WIB',

  waktuInput: '4 September 2026, 09:15 WIB',

  status: 'Dalam Penanganan',

  jumlahLR: 1,

  jumlahLB: 1,

  jumlahMD: 0,

  kermat: 4250000,

  tkp: 'Jalan Raya Baureno, Desa Sratu, Kecamatan Baureno, Kabupaten Bojonegoro',

  kendaraan: [
    {
      kendaraan: 'Honda Beat S 1234 AB, warna hitam',

      pengendara:
        'Susanto, 20 tahun, swasta, alamat Desa Sratu RT 12 RW 04 Kec. Baureno Bojonegoro',
    },

    {
      kendaraan: 'Toyota Avanza S 5678 CD, warna putih',

      pengendara:
        'Budi Santoso, 38 tahun, wiraswasta, alamat Desa Baureno RT 03 RW 02 Kec. Baureno Bojonegoro',
    },
  ],

  saksi: [
    'Slamet, 45 tahun, petani, alamat Desa Sratu RT 02 RW 01 Kec. Baureno Bojonegoro',

    'Joko, 36 tahun, swasta, alamat Desa Baureno RT 05 RW 03 Kec. Baureno Bojonegoro',
  ],

  kronologi:
    'Pada hari Jumat tanggal 4 September 2026 sekitar pukul 09.15 WIB telah terjadi kecelakaan lalu lintas di Jalan Raya Baureno. Kendaraan yang terlibat kecelakaan kemudian dilakukan penanganan oleh Unit Lantas Polsek Baureno.',

  petugas: ['Aipda Heri Susanto', 'Bripka Budi Santoso'],

  dokumentasi: {
    nama: 'Dokumentasi L/12/IX/2026',
    url: '#',
  },
};

/* =====================================================
         RENDER HEADER
      ====================================================== */

function renderHeader(data) {
  const laporanId = document.getElementById('laporanId');

  const laporanIdSecondary = document.getElementById('laporanIdSecondary');

  const waktuInput = document.getElementById('waktuInput');

  const id = safeText(data.id);

  if (laporanId) {
    laporanId.textContent = id;
  }

  if (laporanIdSecondary) {
    laporanIdSecondary.textContent = id;
  }

  if (waktuInput) {
    waktuInput.textContent = safeText(data.waktuInput);
  }

  setStatusLaporan(data.status);
}

/* =====================================================
         RENDER RINGKASAN
      ====================================================== */

function renderRingkasan(data) {
  document.getElementById('jumlahLR').textContent = safeText(data.jumlahLR);

  document.getElementById('jumlahLB').textContent = safeText(data.jumlahLB);

  document.getElementById('jumlahMD').textContent = safeText(data.jumlahMD);

  document.getElementById('jumlahKermat').textContent = formatRupiah(
    data.kermat,
  );
}

/* =====================================================
         RENDER WAKTU
      ====================================================== */

function renderWaktu(data) {
  document.getElementById('tanggalKejadian').textContent = safeText(
    data.tanggal,
  );

  document.getElementById('jamKejadian').textContent = safeText(data.jam);
}

/* =====================================================
         RENDER LOKASI
      ====================================================== */

function renderLokasi(data) {
  document.getElementById('tkp').textContent = safeText(data.tkp);
}

/* =====================================================
         RENDER KENDARAAN
         DATA KENDARAAN TETAP DIGABUNG.
         BELUM DIPECAH MENJADI FIELD TERPISAH.
      ====================================================== */

function renderKendaraan(data) {
  const container = document.getElementById('kendaraanGrid');

  if (!container) {
    return;
  }

  const kendaraan = Array.isArray(data.kendaraan) ? data.kendaraan : [];

  if (!kendaraan.length) {
    container.innerHTML = `
              <div class="empty-state lg:col-span-2">
                Tidak ada data kendaraan yang tersedia.
              </div>
            `;

    return;
  }

  container.innerHTML = kendaraan
    .map(
      (item, index) => `
                <article class="vehicle-card">

                  <div class="vehicle-header">

                    <div class="vehicle-number">
                      V${index + 1}
                    </div>

                    <div class="min-w-0">
                      <p class="vehicle-title">
                        Kendaraan ${index + 1}
                      </p>

                      <p class="mt-0.5 text-[11px] font-medium text-blue-800/70">
                        Kendaraan yang terlibat
                      </p>
                    </div>

                  </div>


                  <div class="vehicle-section">

                    <p class="vehicle-section-title">
                      Identitas Kendaraan
                    </p>

                    <div class="data-row">

                      <span class="data-label">
                        Kendaraan
                      </span>

                      <span class="data-value">
                        ${safeText(item.kendaraan)}
                      </span>

                    </div>

                  </div>


                  <div class="vehicle-section">

                    <p class="vehicle-section-title">
                      Pengendara
                    </p>

                    <div class="data-row">

                      <span class="data-label">
                        Identitas
                      </span>

                      <span class="data-value">
                        ${safeText(item.pengendara)}
                      </span>

                    </div>

                  </div>

                </article>
              `,
    )
    .join('');
}

/* =====================================================
         RENDER SAKSI
      ====================================================== */

function renderSaksi(data) {
  const container = document.getElementById('saksiGrid');

  if (!container) {
    return;
  }

  const saksi = Array.isArray(data.saksi) ? data.saksi : [];

  if (!saksi.length) {
    container.innerHTML = `
              <div class="empty-state md:col-span-2">
                Tidak ada data saksi yang tersedia.
              </div>
            `;

    return;
  }

  container.innerHTML = saksi
    .map(
      (item, index) => `
                <article class="person-card">

                  <div class="flex items-start gap-3">

                    <div class="person-number">
                      ${index + 1}
                    </div>

                    <div class="min-w-0 flex-1">

                      <p class="text-sm font-extrabold text-blue-950">
                        Saksi ${index + 1}
                      </p>

                      <p class="mt-2 text-xs font-semibold leading-6 text-blue-900">
                        ${safeText(item)}
                      </p>

                    </div>

                  </div>

                </article>
              `,
    )
    .join('');
}

/* =====================================================
         RENDER KRONOLOGI
      ====================================================== */

function renderKronologi(data) {
  document.getElementById('kronologi').textContent = safeText(data.kronologi);
}

/* =====================================================
         RENDER PETUGAS
      ====================================================== */

function renderPetugas(data) {
  const container = document.getElementById('petugasList');

  if (!container) {
    return;
  }

  const petugas = Array.isArray(data.petugas) ? data.petugas : [];

  if (!petugas.length) {
    container.innerHTML = `
              <div class="empty-state">
                Belum ada data petugas yang tersedia.
              </div>
            `;

    return;
  }

  container.innerHTML = petugas
    .map(
      (item, index) => `
                <div class="petugas-item">

                  <div class="petugas-number">
                    ${index + 1}
                  </div>

                  <div class="min-w-0">

                    <p class="text-sm font-extrabold text-blue-950">
                      ${safeText(item)}
                    </p>

                    <p class="mt-0.5 text-[11px] font-medium text-blue-800/70">
                      Petugas penanganan laporan
                    </p>

                  </div>

                </div>
              `,
    )
    .join('');
}

/* =====================================================
         RENDER DOKUMENTASI
      ====================================================== */

function renderDokumentasi(data) {
  const section = document.getElementById('sectionDokumentasi');

  const link = document.getElementById('linkDokumentasi');

  const nama = document.getElementById('namaDokumentasi');

  if (!section || !link || !nama) {
    return;
  }

  if (!data.dokumentasi) {
    section.classList.add('hidden');

    return;
  }

  section.classList.remove('hidden');

  nama.textContent = safeText(data.dokumentasi.nama);

  link.href = data.dokumentasi.url || '#';
}

/* =====================================================
         RENDER SEMUA
      ====================================================== */

function renderLaporan(data) {
  renderHeader(data);

  renderRingkasan(data);

  renderWaktu(data);

  renderLokasi(data);

  renderKendaraan(data);

  renderSaksi(data);

  renderKronologi(data);

  renderPetugas(data);

  renderDokumentasi(data);

  /*
          Render ulang icon setelah elemen
          dinamis dibuat.
        */

  if (window.lucide) {
    lucide.createIcons();
  }
}

/* =====================================================
         AMBIL DATA DARI lakaData
         Jika lakaData sudah tersedia,
         cari berdasarkan ?id=...
      ====================================================== */

function ambilDataLaporan() {
  const params = new URLSearchParams(window.location.search);

  const id = params.get('id');

  /*
          Jika global lakaData tersedia,
          gunakan data tersebut.
        */

  if (Array.isArray(window.lakaData)) {
    const laporan = window.lakaData.find(
      (item) =>
        String(item.id || item.ID || item.nomorLaporan || '') === String(id),
    );

    if (laporan) {
      return normalisasiData(laporan);
    }
  }

  /*
          Jika data belum tersedia,
          gunakan preview.
        */

  return dataPreview;
}

/* =====================================================
         NORMALISASI DATA
         Sementara dibuat fleksibel.
      ====================================================== */

function normalisasiData(data) {
  return {
    id: data.id || data.ID || data.nomorLaporan || data.nomor || dataPreview.id,

    tanggal:
      data.tanggal || data.tanggalKejadian || data.date || dataPreview.tanggal,

    jam: data.jam || data.jamKejadian || data.waktu || dataPreview.jam,

    waktuInput: data.waktuInput || data.inputTime || dataPreview.waktuInput,

    status:
      data.status ||
      data.statusPenanganan ||
      data.penanganan ||
      dataPreview.status,

    jumlahLR: data.jumlahLR ?? data.lr ?? data.LR ?? dataPreview.jumlahLR,

    jumlahLB: data.jumlahLB ?? data.lb ?? data.LB ?? dataPreview.jumlahLB,

    jumlahMD: data.jumlahMD ?? data.md ?? data.MD ?? dataPreview.jumlahMD,

    kermat: data.kermat ?? data.kerugianMaterial ?? dataPreview.kermat,

    tkp: data.tkp || data.lokasi || data.tempatKejadian || dataPreview.tkp,

    kendaraan: Array.isArray(data.kendaraan)
      ? data.kendaraan
      : dataPreview.kendaraan,

    saksi: Array.isArray(data.saksi) ? data.saksi : dataPreview.saksi,

    kronologi: data.kronologi || data.uraian || dataPreview.kronologi,

    petugas: Array.isArray(data.petugas) ? data.petugas : dataPreview.petugas,

    dokumentasi: data.dokumentasi || dataPreview.dokumentasi,
  };
}

/* =====================================================
         INIT
      ====================================================== */

function initDetailLaporan() {
  /*
          Overlay langsung aktif.
        */

  detailLaporanOverlay.classList.remove('hidden');

  detailLaporanOverlay.setAttribute('aria-hidden', 'false');

  document.body.classList.add('overflow-hidden');

  const data = ambilDataLaporan();

  renderLaporan(data);

  if (window.lucide) {
    lucide.createIcons();
  }
}

/* =====================================================
         ESC UNTUK MENUTUP
      ====================================================== */

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    tutupDetailLaporan();
  }
});

/* =====================================================
         DOM READY
      ====================================================== */

document.addEventListener('DOMContentLoaded', initDetailLaporan);
