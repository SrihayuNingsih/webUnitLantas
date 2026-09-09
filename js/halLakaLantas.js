/* =====================================================
       AWAL SCRIPT UTAMA & INTEGRASI LAKA LANTAS
  ====================================================== */

// State Mode Petugas Global
// var isOfficerMode = true;

// State Halaman Laka
let lakaPageCurrent = 1;
let lakaPageSize = 10;
let lakaSortOrder = 'terbaru';
let lakaFilteredData = [...lakaData];

/* =====================================================
   MODE RENTANG TANGGAL
   ===================================================== */

let lakaRentangTanggalAktif = false;
let lakaPageActionMenu = null;
let lakaPageActiveMenuId = null;

/* =====================================================
         HELPER STATUS LAKA
      ===================================================== */
function getStatusDot(statusText) {
  const status = (statusText || '').toLowerCase().trim();
  if (status === 'selesai') return 'bg-emerald-500';
  if (status === 'dalam penanganan') return 'bg-amber-600';
  if (status === 'limpah polres') return 'bg-rose-600';
  return 'bg-slate-300';
}

function getStatusText(statusText) {
  const status = (statusText || '').toLowerCase().trim();
  if (status === 'selesai') return 'text-emerald-600';
  if (status === 'dalam penanganan') return 'text-amber-600';
  if (status === 'limpah polres') return 'text-rose-600';
  return 'text-slate-500';
}

/* =====================================================
         HELPER TANGGAL & WAKTU LAKA
      ===================================================== */
function getLakaMonthNumber(item) {
  if (!item || !item.hariTanggal) return '';
  const bulanMap = {
    Januari: '01',
    Februari: '02',
    Maret: '03',
    April: '04',
    Mei: '05',
    Juni: '06',
    Juli: '07',
    Agustus: '08',
    September: '09',
    Oktober: '10',
    November: '11',
    Desember: '12',
  };
  const bagianTanggal = item.hariTanggal.split(',');
  if (bagianTanggal.length < 2) return '';
  const tanggal = bagianTanggal[1].trim().split(' ');
  if (tanggal.length < 2) return '';
  return bulanMap[tanggal[1]] || '';
}

function getLakaYear(item) {
  if (!item || !item.hariTanggal) return '';
  const bagianTanggal = item.hariTanggal.trim().split(' ');
  return bagianTanggal[bagianTanggal.length - 1] || '';
}

function getLakaHour(item) {
  if (!item || !item.waktu) return null;
  const hasil = item.waktu.match(/\d{1,2}/);
  if (!hasil) return null;
  return Number(hasil[0]);
}

/* =====================================================
         FILTER LAKA
      ===================================================== */
// function applyLakaFilter() {
//   const tahunEl = document.getElementById("filter-tahun");
//   const bulanEl = document.getElementById("filter-bulan");
//   const waktuEl = document.getElementById("filter-waktu");

//   const tahun = tahunEl ? tahunEl.value : "";
//   const bulan = bulanEl ? bulanEl.value : "";
//   const waktu = waktuEl ? waktuEl.value : "";

//   lakaFilteredData = lakaData.filter(function (item) {
//     if (tahun && getLakaYear(item) !== tahun) return false;
//     if (bulan && getLakaMonthNumber(item) !== bulan) return false;
//     if (waktu) {
//       const jam = getLakaHour(item);
//       if (jam === null) return false;
//       if (waktu === "00-06" && (jam < 0 || jam >= 6)) return false;
//       if (waktu === "06-12" && (jam < 6 || jam >= 12)) return false;
//       if (waktu === "12-18" && (jam < 12 || jam >= 18)) return false;
//       if (waktu === "18-24" && (jam < 18 || jam >= 24)) return false;
//     }
//     return true;
//   });

//   lakaPageCurrent = 1;
//   renderLakaPage();
// }

// function resetLakaFilter() {
//   const tahun = document.getElementById("filter-tahun");
//   const bulan = document.getElementById("filter-bulan");
//   const waktu = document.getElementById("filter-waktu");

//   if (tahun) tahun.value = "";
//   if (bulan) bulan.value = "";
//   if (waktu) waktu.value = "";

//   lakaFilteredData = [...lakaData];
//   lakaPageCurrent = 1;
//   renderLakaPage();
// }

function parseIndonesianDate(dateStr) {
  if (!dateStr) return null;
  const monthMap = {
    Januari: '01',
    Februari: '02',
    Maret: '03',
    April: '04',
    Mei: '05',
    Juni: '06',
    Juli: '07',
    Agustus: '08',
    September: '09',
    Oktober: '10',
    November: '11',
    Desember: '12',
  };
  const parts = dateStr.split(',');
  const strToParse = parts.length > 1 ? parts[1].trim() : parts[0].trim();
  const dateTokens = strToParse.split(' ');
  if (dateTokens.length < 3) return null;

  const day = dateTokens[0].padStart(2, '0');
  const month = monthMap[dateTokens[1]] || '01';
  const year = dateTokens[2];

  return new Date(`${year}-${month}-${day}`);
}

// Tambahan Code
/* =====================================================
   SORTIR DATA LAKA
   ===================================================== */
function sortLakaData(data) {
  return [...data].sort(function (a, b) {
    const dateA = parseIndonesianDate(a.hariTanggal);
    const dateB = parseIndonesianDate(b.hariTanggal);

    /*
     * Jika kedua tanggal tidak valid,
     * pertahankan posisi relatif.
     */
    if (!dateA && !dateB) return 0;

    /*
     * Data tanpa tanggal valid
     * ditempatkan paling bawah.
     */
    if (!dateA) return 1;
    if (!dateB) return -1;

    /*
     * Terbaru → Terlama
     */
    if (lakaSortOrder === 'terbaru') {
      return dateB - dateA;
    }

    /*
     * Terlama → Terbaru
     */
    return dateA - dateB;
  });
}

/* =====================================================
   DROPDOWN SORTIR LAKA
   ===================================================== */

function toggleLakaSortMenu() {
  const button = document.getElementById('laka-sort-button');
  const menu = document.getElementById('laka-sort-menu');

  if (!button || !menu) return;

  const isHidden = menu.classList.contains('hidden');

  menu.classList.toggle('hidden', !isHidden);
  button.setAttribute('aria-expanded', String(isHidden));

  if (window.lucide) {
    lucide.createIcons();
  }
}

function closeLakaSortMenu() {
  const button = document.getElementById('laka-sort-button');
  const menu = document.getElementById('laka-sort-menu');

  if (!menu) return;

  menu.classList.add('hidden');

  if (button) {
    button.setAttribute('aria-expanded', 'false');
  }
}

function applyLakaSort(sortValue) {
  /*
   * newest = Terbaru → Terlama
   * oldest = Terlama → Terbaru
   */
  if (sortValue === 'newest') {
    lakaSortOrder = 'terbaru';
  } else if (sortValue === 'oldest') {
    lakaSortOrder = 'terlama';
  } else {
    return;
  }

  /*
   * Urutkan data yang sedang aktif.
   * Penting:
   * lakaFilteredData adalah hasil filter,
   * bukan lakaData asli.
   */
  lakaFilteredData = sortLakaData(lakaFilteredData);

  /*
   * Kembali ke halaman pertama
   * setelah urutan berubah.
   */
  lakaPageCurrent = 1;

  renderLakaPage();

  /* Update Tanda Centang Sesuai pilihan sortir yang aktif */

  document
    .querySelectorAll('#laka-sort-menu [data-sort]')
    .forEach(function (item) {
      const checkIcon = item.querySelector('[data-sort-check]');

      if (!checkIcon) return;

      const isActive = item.dataset.sort === sortValue;

      checkIcon.classList.toggle('hidden', !isActive);
    });

  /*
   * Tutup dropdown setelah pilihan dibuat.
   */
  closeLakaSortMenu();
}
// Akhir tambahan Code

function applyLakaFilter() {
  const tahunEl = document.getElementById('filter-tahun');
  const bulanEl = document.getElementById('filter-bulan');
  const waktuEl = document.getElementById('filter-waktu');
  const tglMulaiEl = document.getElementById('filter-tanggal-mulai');
  const tglAkhirEl = document.getElementById('filter-tanggal-akhir');

  lakaFilteredData = lakaData.filter(function (item) {
    if (lakaRentangTanggalAktif) {
      const itemDate = parseIndonesianDate(item.hariTanggal);
      if (!itemDate) return false;

      if (tglMulaiEl && tglMulaiEl.value) {
        const startDate = new Date(tglMulaiEl.value);
        startDate.setHours(0, 0, 0, 0);
        if (itemDate < startDate) return false;
      }

      if (tglAkhirEl && tglAkhirEl.value) {
        const endDate = new Date(tglAkhirEl.value);
        endDate.setHours(23, 59, 59, 999);
        if (itemDate > endDate) return false;
      }
      return true;
    }

    const tahun = tahunEl ? tahunEl.value : '';
    const bulan = bulanEl ? bulanEl.value : '';
    const waktu = waktuEl ? waktuEl.value : '';

    if (tahun && getLakaYear(item) !== tahun) return false;
    if (bulan && getLakaMonthNumber(item) !== bulan) return false;
    if (waktu) {
      const jam = getLakaHour(item);
      if (jam === null) return false;
      if (waktu === '00-06' && (jam < 0 || jam >= 6)) return false;
      if (waktu === '06-12' && (jam < 6 || jam >= 12)) return false;
      if (waktu === '12-18' && (jam < 12 || jam >= 18)) return false;
      if (waktu === '18-24' && (jam < 18 || jam >= 24)) return false;
    }
    return true;
  });

  // lakaPageCurrent = 1;
  // renderLakaPage();
  // code diatas diganti code dibawah

  lakaFilteredData = sortLakaData(lakaFilteredData);
  lakaPageCurrent = 1;
  renderLakaPage();
}

function resetLakaFilter() {
  const tahun = document.getElementById('filter-tahun');
  const bulan = document.getElementById('filter-bulan');
  const waktu = document.getElementById('filter-waktu');
  const tglMulai = document.getElementById('filter-tanggal-mulai');
  const tglAkhir = document.getElementById('filter-tanggal-akhir');

  if (tahun) tahun.value = '';
  if (bulan) bulan.value = '';
  if (waktu) waktu.value = '';
  if (tglMulai) tglMulai.value = '';
  if (tglAkhir) tglAkhir.value = '';

  if (lakaRentangTanggalAktif && rentangTanggalButton) {
    rentangTanggalButton.click();
  }

  /*
   * Reset SORTIR ke default halaman:
   * Terbaru → Terlama
   */
  lakaSortOrder = 'terbaru';

  /*
   * Kembalikan tanda centang dropdown
   * ke Terbaru → Terlama.
   */
  document
    .querySelectorAll('#laka-sort-menu [data-sort]')
    .forEach(function (item) {
      const checkIcon = item.querySelector('[data-sort-check]');

      if (!checkIcon) return;

      const isActive = item.dataset.sort === 'newest';

      checkIcon.classList.toggle('hidden', !isActive);
    });

  /*
   * Kembalikan seluruh data,
   * kemudian urutkan menggunakan default.
   */
  lakaFilteredData = sortLakaData(lakaData);

  /*
   * Kembali ke halaman pertama.
   */
  lakaPageCurrent = 1;

  /*
   * Tutup dropdown sortir jika sedang terbuka.
   */
  closeLakaSortMenu();

  /*
   * Render ulang halaman.
   */
  renderLakaPage();
}

// Tambahan Code (menyesuaikan halaman Laporan dan Rekap)

/* =====================================================
   FILTER DARI HALAMAN LAPORAN & REKAP
   Membaca parameter periode dari URL
   ===================================================== */
function applyLakaFilterFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const tahun = params.get('tahun');
  const bulan = params.get('bulan');
  const tanggalMulai = params.get('tanggalMulai');
  const tanggalAkhir = params.get('tanggalAkhir');

  const tahunEl = document.getElementById('filter-tahun');
  const bulanEl = document.getElementById('filter-bulan');
  const waktuEl = document.getElementById('filter-waktu');
  const tglMulaiEl = document.getElementById('filter-tanggal-mulai');
  const tglAkhirEl = document.getElementById('filter-tanggal-akhir');

  /*
    Tidak ada parameter:
    biarkan halaman menggunakan default
    Semua Data.
  */
  // if (!tahun && !bulan && !tanggalMulai && !tanggalAkhir) {
  //   renderLakaPage();
  //   return;
  // }
  // function diatas diganti funvtion dibawah

  if (!tahun && !bulan && !tanggalMulai && !tanggalAkhir) {
    lakaFilteredData = sortLakaData(lakaData);
    renderLakaPage();
    return;
  }
  /*
    RENTANG TANGGAL
    Jika tanggal mulai/akhir dikirim,
    aktifkan mode rentang menggunakan
    tombol yang sudah ada.
  */
  if (tanggalMulai || tanggalAkhir) {
    if (!lakaRentangTanggalAktif && rentangTanggalButton) {
      rentangTanggalButton.click();
    }

    if (tglMulaiEl) {
      tglMulaiEl.value = tanggalMulai || '';
    }

    if (tglAkhirEl) {
      tglAkhirEl.value = tanggalAkhir || '';
    }

    /*
      Waktu tidak digunakan dalam mode rentang.
    */
    if (waktuEl) {
      waktuEl.value = '';
    }

    applyLakaFilter();
    return;
  }

  /*
    BULANAN / TAHUNAN
    Gunakan filter Tahun dan Bulan
    yang sudah ada.
  */
  if (lakaRentangTanggalAktif && rentangTanggalButton) {
    rentangTanggalButton.click();
  }

  if (tahunEl) {
    tahunEl.value = tahun || '';
  }

  if (bulanEl) {
    bulanEl.value = bulan || '';
  }

  if (waktuEl) {
    waktuEl.value = '';
  }

  applyLakaFilter();
}
// Akhir tambahan Code

/* =====================================================
         PAGINATION
      ===================================================== */
function getLakaPaginationPages(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  const pages = [1];
  if (current > 4) pages.push('...');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let page = start; page <= end; page++) {
    pages.push(page);
  }
  if (current < total - 3) pages.push('...');
  pages.push(total);
  return pages;
}

function renderLakaPagination() {
  const container = document.getElementById('laka-pagination');
  if (!container) return;

  const total = lakaFilteredData.length;
  const totalPages = Math.ceil(total / lakaPageSize);

  let html = `
          <button
            type="button"
            data-page="first"
            ${lakaPageCurrent === 1 ? 'disabled' : ''}
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Halaman pertama"
          >
            <i data-lucide="chevrons-left" class="h-4 w-4"></i>
          </button>
          <button
            type="button"
            data-page="prev"
            ${lakaPageCurrent === 1 ? 'disabled' : ''}
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Halaman sebelumnya"
          >
            <i data-lucide="chevron-left" class="h-4 w-4"></i>
          </button>
        `;

  const pages = getLakaPaginationPages(lakaPageCurrent, totalPages);
  pages.forEach(function (page) {
    if (page === '...') {
      html += `<span class="flex h-9 w-9 items-center justify-center text-sm text-slate-400">...</span>`;
      return;
    }
    const active = page === lakaPageCurrent;
    html += `
            <button
              type="button"
              data-page="${page}"
              ${active ? 'aria-current="page"' : ''}
              class="flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-blue-100 bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700'
              }"
            >
              ${page}
            </button>
          `;
  });

  html += `
          <button
            type="button"
            data-page="next"
            ${lakaPageCurrent === totalPages ? 'disabled' : ''}
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Halaman berikutnya"
          >
            <i data-lucide="chevron-right" class="h-4 w-4"></i>
          </button>
          <button
            type="button"
            data-page="last"
            ${lakaPageCurrent === totalPages ? 'disabled' : ''}
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Halaman terakhir"
          >
            <i data-lucide="chevrons-right" class="h-4 w-4"></i>
          </button>
        `;

  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

/* =====================================================
   TOGGLE RENTANG TANGGAL
   ===================================================== */

// const rentangTanggalButton = document.getElementById("btn-rentang-tanggal");

// if (rentangTanggalButton) {
//   rentangTanggalButton.addEventListener("click", function () {
//     lakaRentangTanggalAktif = !lakaRentangTanggalAktif;

//     const container = document.getElementById("rentang-tanggal-container");

//     const icon = document.getElementById("icon-rentang-tanggal");

//     const filterTahun = document.getElementById("filter-tahun");

//     const filterBulan = document.getElementById("filter-bulan");

//     const filterWaktu = document.getElementById("filter-waktu");

//     if (lakaRentangTanggalAktif) {
//       /*
//        * Tampilkan input tanggal
//        */

//       if (container) {
//         container.classList.remove("hidden");
//       }

//       /*
//        * Disable filter Tahun, Bulan,
//        * dan Waktu Kejadian
//        */

//       if (filterTahun) {
//         filterTahun.disabled = true;
//       }

//       if (filterBulan) {
//         filterBulan.disabled = true;
//       }

//       if (filterWaktu) {
//         filterWaktu.disabled = true;
//       }

//       /*
//        * Putar icon chevron
//        */

//       if (icon) {
//         icon.classList.add("rotate-180");
//       }

//       /*
//        * Tampilan tombol aktif
//        */

//       rentangTanggalButton.classList.remove("bg-white", "text-blue-600");

//       rentangTanggalButton.classList.add(
//         "bg-blue-50",
//         "text-blue-700",
//         "border-blue-200",
//       );
//     } else {
//       /*
//        * Sembunyikan input tanggal
//        */

//       if (container) {
//         container.classList.add("hidden");
//       }

//       /*
//        * Aktifkan kembali filter
//        */

//       if (filterTahun) {
//         filterTahun.disabled = false;
//       }

//       if (filterBulan) {
//         filterBulan.disabled = false;
//       }

//       if (filterWaktu) {
//         filterWaktu.disabled = false;
//       }

//       /*
//        * Kembalikan icon
//        */

//       if (icon) {
//         icon.classList.remove("rotate-180");
//       }

//       /*
//        * Kembalikan tampilan tombol
//        */

//       rentangTanggalButton.classList.add("bg-white", "text-blue-600");

//       rentangTanggalButton.classList.remove(
//         "bg-blue-50",
//         "text-blue-700",
//         "border-blue-200",
//       );
//     }

//     if (window.lucide) {
//       lucide.createIcons();
//     }
//   });
// }

/* =====================================================
   TOGGLE RENTANG TANGGAL
   ===================================================== */
const rentangTanggalButton = document.getElementById('btn-rentang-tanggal');

if (rentangTanggalButton) {
  rentangTanggalButton.addEventListener('click', function () {
    lakaRentangTanggalAktif = !lakaRentangTanggalAktif;

    const container = document.getElementById('rentang-tanggal-container');
    const icon = document.getElementById('icon-rentang-tanggal');
    const filterTahun = document.getElementById('filter-tahun');
    const filterBulan = document.getElementById('filter-bulan');
    const filterWaktu = document.getElementById('filter-waktu');

    const disabledClasses = [
      'bg-slate-100',
      'text-slate-400',
      'cursor-not-allowed',
      'border-slate-200',
    ];

    if (lakaRentangTanggalAktif) {
      if (container) container.classList.remove('hidden');

      [filterTahun, filterBulan, filterWaktu].forEach((el) => {
        if (el) {
          el.disabled = true;
          el.classList.add(...disabledClasses);
        }
      });

      if (icon) icon.classList.add('rotate-180');
      rentangTanggalButton.classList.remove('bg-white', 'text-blue-600');
      rentangTanggalButton.classList.add(
        'bg-blue-50',
        'text-blue-700',
        'border-blue-200',
      );
    } else {
      if (container) container.classList.add('hidden');

      [filterTahun, filterBulan, filterWaktu].forEach((el) => {
        if (el) {
          el.disabled = false;
          el.classList.remove(...disabledClasses);
        }
      });

      if (icon) icon.classList.remove('rotate-180');
      rentangTanggalButton.classList.add('bg-white', 'text-blue-600');
      rentangTanggalButton.classList.remove(
        'bg-blue-50',
        'text-blue-700',
        'border-blue-200',
      );
    }

    if (window.lucide) lucide.createIcons();
  });
}

/* =====================================================
         RENDER HALAMAN LAKA
      ===================================================== */
function renderLakaPage() {
  const container = document.getElementById('laka-page-list');
  const emptyState = document.getElementById('laka-page-empty');
  const totalData = document.getElementById('laka-total-data');

  if (!container) return;

  const total = lakaFilteredData.length;
  if (totalData) totalData.textContent = total;

  if (total === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    renderLakaPagination();
    if (window.lucide) lucide.createIcons();
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  const startIndex = (lakaPageCurrent - 1) * lakaPageSize;
  const endIndex = startIndex + lakaPageSize;
  const pageData = lakaFilteredData.slice(startIndex, endIndex);

  container.innerHTML = pageData
    .map(function (item, index) {
      return `
            <article
              id="laka-page-card-${index}"
              data-id="${item.id}"
              class="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div class="mb-2.5 flex items-center gap-2">
                <i data-lucide="file-text" class="h-4 w-4 shrink-0 text-blue-500"></i>
                <span class="text-[15px] font-bold text-blue-700">${item.id}</span>
              </div>

              <div class="mb-2.5 flex items-center gap-2 text-sm text-slate-600">
                <i data-lucide="calendar-days" class="h-4 w-4 shrink-0 text-blue-400"></i>
                <span>${item.hariTanggal} | ${item.waktu}</span>
              </div>

              <div class="mb-2.5 flex items-start gap-2">
                <i data-lucide="map-pin" class="mt-0.5 h-4 w-4 shrink-0 text-blue-400"></i>
                <p class="text-sm leading-snug text-slate-600">${item.lokasi}</p>
              </div>

              <div class="mb-2.5 flex items-center gap-3 text-sm font-medium">
                <span class="text-slate-600">LR <span class="font-semibold text-blue-600">${item.lr}</span></span>
                <span class="text-blue-200">|</span>
                <span class="text-slate-600">LB <span class="font-semibold text-amber-600">${item.lb}</span></span>
                <span class="text-blue-200">|</span>
                <span class="text-slate-600">MD <span class="font-semibold text-rose-600">${item.md}</span></span>
              </div>

              <div class="mb-4 flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full ${getStatusDot(item.status)}"></span>
                <span class="text-sm font-medium ${getStatusText(item.status)}">${item.status}</span>
              </div>

              <div class="flex items-center justify-end gap-2 border-t border-blue-50 pt-3">
                <button
                  type="button"
                  data-action="detail-visitor-page"
                  data-id="${item.id}"
                  class="visitor-page-detail-button inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 hover:text-blue-800"
                >
                  Lihat Detail
                  <i data-lucide="chevron-right" class="h-4 w-4"></i>
                </button>

                <button
                  type="button"
                  data-action="detail-officer-page"
                  data-id="${item.id}"
                  class="officer-page-detail-button hidden inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 hover:text-blue-800"
                >
                  Lihat Detail
                </button>

                <button
                  type="button"
                  data-action="menu-page"
                  data-id="${item.id}"
                  class="officer-page-action-button hidden flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
                  aria-label="Menu aksi"
                >
                  <i data-lucide="more-vertical" class="h-5 w-5"></i>
                </button>
              </div>
            </article>
          `;
    })
    .join('');

  renderLakaPagination();
  if (window.lucide) lucide.createIcons();
  updateLakaMode(
    typeof isOfficerMode !== 'undefined' ? Boolean(isOfficerMode) : false,
  );
}

/* =====================================================
         UPDATE MODE (PENGUNJUNG / PETUGAS)
      ===================================================== */
function updateLakaMode(isOfficer) {
  document
    .querySelectorAll('.visitor-page-action')
    .forEach((btn) => btn.classList.toggle('hidden', isOfficer));
  document
    .querySelectorAll('.officer-page-action')
    .forEach((btn) => btn.classList.toggle('hidden', !isOfficer));
  document
    .querySelectorAll('.visitor-page-detail-button')
    .forEach((btn) => btn.classList.toggle('hidden', isOfficer));
  document
    .querySelectorAll('.officer-page-detail-button')
    .forEach((btn) => btn.classList.toggle('hidden', !isOfficer));
  document
    .querySelectorAll('.officer-page-action-button')
    .forEach((btn) => btn.classList.toggle('hidden', !isOfficer));

  const visitorStatus = document.getElementById('visitorStatus');
  const adminStatus = document.getElementById('adminStatus');
  if (visitorStatus) visitorStatus.classList.toggle('hidden', isOfficer);
  if (adminStatus) adminStatus.classList.toggle('hidden', !isOfficer);

  if (!isOfficer) closeActionMenu();
}

/* =====================================================
         ACTION MENU HANDLER
      ===================================================== */
// function toggleActionMenu(event, id, button) {
//   event.stopPropagation();
//   const officer =
//     typeof isOfficerMode !== "undefined" ? Boolean(isOfficerMode) : false;
//   if (!officer || !lakaPageActionMenu || !button) return;

//   if (
//     lakaPageActiveMenuId === id &&
//     !lakaPageActionMenu.classList.contains("hidden")
//   ) {
//     closeActionMenu();
//     return;
//   }

//   lakaPageActiveMenuId = id;
//   lakaPageActionMenu.classList.remove("hidden");

//   const rect = button.getBoundingClientRect();
//   const menuHeight = lakaPageActionMenu.offsetHeight || 90;
//   const menuWidth = lakaPageActionMenu.offsetWidth || 176;
//   const spaceBelow = window.innerHeight - rect.bottom;

//   if (spaceBelow < menuHeight && rect.top > menuHeight) {
//     lakaPageActionMenu.style.top = `${rect.top - menuHeight - 6}px`;
//   } else {
//     lakaPageActionMenu.style.top = `${rect.bottom + 6}px`;
//   }

//   const leftPos = Math.min(
//     rect.right - menuWidth,
//     window.innerWidth - menuWidth - 10,
//   );
//   lakaPageActionMenu.style.left = `${Math.max(10, leftPos)}px`;
// }

// function closeActionMenu() {
//   if (lakaPageActionMenu) {
//     lakaPageActionMenu.classList.add("hidden");
//     lakaPageActionMenu.style.top = "";
//     lakaPageActionMenu.style.left = "";
//   }
//   lakaPageActiveMenuId = null;
// }

/* =====================================================
   ACTION MENU HANDLER
===================================================== */
function toggleActionMenu(event, id, button) {
  event.stopPropagation();
  const officer =
    typeof isOfficerMode !== 'undefined' ? Boolean(isOfficerMode) : false;
  if (!officer || !lakaPageActionMenu || !button) return;

  // Jika tombol titik tiga diklik ulang pada item yang sama, sembunyikan menu
  if (
    lakaPageActiveMenuId === id &&
    !lakaPageActionMenu.classList.contains('hidden')
  ) {
    closeActionMenu();
    return;
  }

  lakaPageActiveMenuId = id;
  lakaPageActionMenu.classList.remove('hidden');

  const rect = button.getBoundingClientRect();
  const menuHeight = lakaPageActionMenu.offsetHeight || 150;
  const menuWidth = lakaPageActionMenu.offsetWidth || 224;

  // Orientasi Vertikal
  const spaceBelow = window.innerHeight - rect.bottom;
  if (spaceBelow < menuHeight + 10 && rect.top > menuHeight) {
    lakaPageActionMenu.style.top = `${rect.top - menuHeight - 6}px`;
  } else {
    lakaPageActionMenu.style.top = `${rect.bottom + 6}px`;
  }

  // Orientasi Horisontal
  let leftPos = rect.right - menuWidth;
  if (leftPos + menuWidth > window.innerWidth - 10) {
    leftPos = window.innerWidth - menuWidth - 10;
  }
  if (leftPos < 10) leftPos = 10;

  lakaPageActionMenu.style.left = `${leftPos}px`;
  if (window.lucide) lucide.createIcons();
}

function closeActionMenu() {
  if (lakaPageActionMenu) {
    lakaPageActionMenu.classList.add('hidden');
    lakaPageActionMenu.style.top = '';
    lakaPageActionMenu.style.left = '';
  }
  lakaPageActiveMenuId = null;
}

/* =====================================================
   ACTION FUNCTIONS (EDIT & HAPUS WITH MODAL)
===================================================== */
let lakaIdToDelete = null;

function handleEdit() {
  if (!lakaPageActiveMenuId) return;
  const id = lakaPageActiveMenuId;
  closeActionMenu();
  alert(`Edit laporan: ${id}`);
}

function handleDelete() {
  if (!lakaPageActiveMenuId) return;
  lakaIdToDelete = lakaPageActiveMenuId;
  closeActionMenu();

  const modal = document.getElementById('deleteLakaModal');
  const textId = document.getElementById('delete-laka-id-text');

  if (textId) textId.textContent = lakaIdToDelete;
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeDeleteLakaModal() {
  const modal = document.getElementById('deleteLakaModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  lakaIdToDelete = null;
}

function confirmDeleteLaka() {
  if (!lakaIdToDelete) return;

  const index = lakaData.findIndex((item) => item.id === lakaIdToDelete);
  if (index !== -1) {
    lakaData.splice(index, 1);
    lakaFilteredData = [...lakaData];
    const totalPages = Math.max(
      1,
      Math.ceil(lakaFilteredData.length / lakaPageSize),
    );
    if (lakaPageCurrent > totalPages) lakaPageCurrent = totalPages;
    renderLakaPage();
  }

  closeDeleteLakaModal();
}

/* =====================================================
         ACTION FUNCTIONS
      ===================================================== */
function lihatDetail(id) {
  alert(`Membuka detail laporan: ${id}`);
}

function inputLaporanBaru() {
  alert('Membuka form Input Laporan Baru.');
}

function handleEdit() {
  if (!lakaPageActiveMenuId) return;
  const id = lakaPageActiveMenuId;
  closeActionMenu();
  alert(`Edit laporan: ${id}`);
}

// function handleDelete() {
//   if (!lakaPageActiveMenuId) return;
//   const id = lakaPageActiveMenuId;
//   const confirmed = confirm(`Yakin ingin menghapus laporan ${id}?`);
//   if (!confirmed) {
//     closeActionMenu();
//     return;
//   }

//   const index = lakaData.findIndex((item) => item.id === id);
//   if (index !== -1) {
//     lakaData.splice(index, 1);
//     lakaFilteredData = [...lakaData];
//     const totalPages = Math.max(
//       1,
//       Math.ceil(lakaFilteredData.length / lakaPageSize),
//     );
//     if (lakaPageCurrent > totalPages) lakaPageCurrent = totalPages;
//     renderLakaPage();
//   }
//   closeActionMenu();
// }

/* =====================================================
         MODAL & AUTH
      ===================================================== */
function openLogoutModal() {
  const modal = document.getElementById('logoutModal');
  if (modal) (modal.classList.remove('hidden'), modal.classList.add('flex'));
}

function closeLogoutModal() {
  const modal = document.getElementById('logoutModal');
  if (modal) (modal.classList.add('hidden'), modal.classList.remove('flex'));
}

function confirmLogout() {
  isOfficerMode = false;
  closeLogoutModal();
  updateLakaMode(false);
  document.dispatchEvent(
    new CustomEvent('modeChanged', { detail: { isOfficerMode: false } }),
  );
}

// tambahan code button kembali

/* =====================================================
   TOMBOL KEMBALI HALAMAN LAKA LANTAS
   ===================================================== */
function initLakaPageBackButton() {
  const lakaPageButton = document.getElementById('lakaPageButton');

  if (!lakaPageButton) return;

  lakaPageButton.addEventListener('click', function () {
    window.history.back();
  });
}

/* =====================================================
         INITIALIZATION & EVENT LISTENERS
      ===================================================== */
function initLakaPage() {
  lakaPageActionMenu = document.getElementById('action-menu-laka-page');

  // Tambahan Code
  initLakaPageBackButton();

  // =====================================================
  // SORTIR LAKA
  // =====================================================

  const lakaSortButton = document.getElementById('laka-sort-button');
  const lakaSortMenu = document.getElementById('laka-sort-menu');

  /*
   * Tombol icon sortir.
   * Default dropdown tersembunyi.
   */
  if (lakaSortButton && lakaSortMenu) {
    lakaSortButton.setAttribute('aria-expanded', 'false');

    lakaSortButton.addEventListener('click', function (event) {
      event.stopPropagation();
      toggleLakaSortMenu();
    });

    /*
     * Pilihan sortir:
     * newest = Terbaru → Terlama
     * oldest = Terlama → Terbaru
     */
    lakaSortMenu.addEventListener('click', function (event) {
      const sortItem = event.target.closest('[data-sort]');

      if (!sortItem) return;

      event.stopPropagation();

      const sortValue = sortItem.dataset.sort;

      applyLakaSort(sortValue);
    });
  }

  /*
   * Klik di luar tombol/dropdown
   * akan menutup dropdown sortir.
   */
  document.addEventListener('click', function (event) {
    if (
      !event.target.closest('#laka-sort-button') &&
      !event.target.closest('#laka-sort-menu')
    ) {
      closeLakaSortMenu();
    }
  });

  // Akhir tambahan code

  // Event Listener Pagination & Menu Card
  document.addEventListener('click', function (event) {
    const pageButton = event.target.closest(
      '#laka-pagination button[data-page]',
    );
    if (pageButton) {
      const totalPages = Math.ceil(lakaFilteredData.length / lakaPageSize);
      const action = pageButton.dataset.page;
      if (action === 'first') lakaPageCurrent = 1;
      else if (action === 'prev')
        lakaPageCurrent = Math.max(1, lakaPageCurrent - 1);
      else if (action === 'next')
        lakaPageCurrent = Math.min(totalPages, lakaPageCurrent + 1);
      else if (action === 'last') lakaPageCurrent = totalPages;
      else lakaPageCurrent = Number(action);
      renderLakaPage();
      return;
    }

    const menuButton = event.target.closest('[data-action="menu-page"]');
    if (menuButton) {
      toggleActionMenu(event, menuButton.dataset.id, menuButton);
      return;
    }

    const visitorDetail = event.target.closest(
      '[data-action="detail-visitor-page"]',
    );
    if (visitorDetail) {
      lihatDetail(visitorDetail.dataset.id);
      return;
    }

    const officerDetail = event.target.closest(
      '[data-action="detail-officer-page"]',
    );
    if (officerDetail) {
      lihatDetail(officerDetail.dataset.id);
      return;
    }

    if (!event.target.closest('#action-menu-laka-page')) {
      closeActionMenu();
    }
  });

  // Filter Controls
  const resetFilterBtn = document.getElementById('btn-reset-filter');
  if (resetFilterBtn) resetFilterBtn.addEventListener('click', resetLakaFilter);

  const applyFilterBtn = document.getElementById('btn-terapkan-filter');
  if (applyFilterBtn) applyFilterBtn.addEventListener('click', applyLakaFilter);

  const pageSizeSelect = document.getElementById('laka-page-size');
  if (pageSizeSelect) {
    pageSizeSelect.addEventListener('change', function () {
      lakaPageSize = Number(this.value);
      lakaPageCurrent = 1;
      renderLakaPage();
    });
  }

  // Header Action Controls
  const inputLaporanBtn = document.getElementById('btn-input-laporan');
  if (inputLaporanBtn)
    inputLaporanBtn.addEventListener('click', inputLaporanBaru);

  // const lihatSemuaBtn = document.getElementById("btn-lihat-semua-page");
  // if (lihatSemuaBtn)
  //   lihatSemuaBtn.addEventListener("click", () => renderLakaPage());

  // Popup Actions
  const editBtn = document.getElementById('action-edit-page');
  if (editBtn) editBtn.addEventListener('click', handleEdit);

  const deleteBtn = document.getElementById('action-delete-page');
  if (deleteBtn) deleteBtn.addEventListener('click', handleDelete);

  // Auth Controls
  const loginBtn = document.getElementById('loginButton');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      isOfficerMode = true;
      updateLakaMode(true);
      document.dispatchEvent(
        new CustomEvent('modeChanged', {
          detail: { isOfficerMode: true },
        }),
      );
    });
  }

  // Tambahan Code =======================================================================================
  // Listener Modal Konfirmasi Hapus Laka
  const cancelDeleteLakaBtn = document.getElementById('cancelDeleteLakaButton');
  if (cancelDeleteLakaBtn)
    cancelDeleteLakaBtn.addEventListener('click', closeDeleteLakaModal);

  const confirmDeleteLakaBtn = document.getElementById(
    'confirmDeleteLakaButton',
  );
  if (confirmDeleteLakaBtn)
    confirmDeleteLakaBtn.addEventListener('click', confirmDeleteLaka);
  // Akhir tambahan code =================================================================================

  const logoutBtn = document.getElementById('logoutButton');
  if (logoutBtn) logoutBtn.addEventListener('click', openLogoutModal);

  const cancelLogoutBtn = document.getElementById('cancelLogoutButton');
  if (cancelLogoutBtn)
    cancelLogoutBtn.addEventListener('click', closeLogoutModal);

  const confirmLogoutBtn = document.getElementById('confirmLogoutButton');
  if (confirmLogoutBtn)
    confirmLogoutBtn.addEventListener('click', confirmLogout);

  // Window scroll & resize
  // window.addEventListener("resize", closeActionMenu);
  // window.addEventListener("scroll", () => closeActionMenu(), true);

  window.addEventListener('scroll', closeActionMenu, true);
  window.addEventListener('resize', closeActionMenu);

  // Global modeChanged Event
  document.addEventListener('modeChanged', function (e) {
    const officer = Boolean(e.detail && e.detail.isOfficerMode);
    updateLakaMode(officer);
  });

  // First Render
  // renderLakaPage();
  applyLakaFilterFromUrl();
  updateLakaMode(Boolean(isOfficerMode));
}

document.addEventListener('DOMContentLoaded', initLakaPage);

/* =====================================================
       AKHIR SCRIPT UTAMA & INTEGRASI LAKA LANTAS
  ====================================================== */
