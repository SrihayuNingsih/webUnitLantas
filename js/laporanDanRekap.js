/* =====================================================
   LAPORAN & REKAP
   Frontend Logic
   ===================================================== */

(() => {
  'use strict';

  /* =====================================================
     1. KONFIGURASI
     ===================================================== */

  const CONFIG = {
    USE_MOCK_DATA: true,

    // Simulasi waktu loading backend
    MOCK_DELAY: 500,

    // Halaman daftar laporan
    REPORT_PAGE: 'halLakaLantas.html',
  };

  /* =====================================================
     2. STATE APLIKASI
     ===================================================== */

  const state = {
    periodType: 'semua',

    period: {
      startDate: null,
      endDate: null,
    },

    loading: false,

    lastRequestId: 0,

    lastSuccessfulResponse: null,

    currentResponse: null,

    mode:
      localStorage.getItem('isOfficerMode') === 'true' ? 'officer' : 'visitor',
  };

  /* =====================================================
     3. REFERENSI DOM
     ===================================================== */

  const el = {};

  function cacheElements() {
    el.backButton = document.getElementById('laporanBackButton');

    el.jenisPeriode = document.getElementById('jenisPeriode');

    el.periodeBulanan = document.getElementById('periodeBulanan');
    el.tahunBulanan = document.getElementById('tahunBulanan');
    el.bulanBulanan = document.getElementById('bulanBulanan');

    el.periodeTahunan = document.getElementById('periodeTahunan');
    el.tahunTahunan = document.getElementById('tahunTahunan');

    el.periodeRentang = document.getElementById('periodeRentang');
    el.tanggalMulai = document.getElementById('tanggalMulai');
    el.tanggalAkhir = document.getElementById('tanggalAkhir');

    el.tampilkanRekapButton = document.getElementById('tampilkanRekapButton');

    el.resetFilterButton = document.getElementById('resetFilterButton');

    el.filterMingguIni = document.getElementById('filterMingguIni');

    el.filterBulanIni = document.getElementById('filterBulanIni');

    el.filterTahunIni = document.getElementById('filterTahunIni');

    el.periodeAktifText = document.getElementById('periodeAktifText');

    el.dataDiperbaruiText = document.getElementById('dataDiperbaruiText');

    el.totalKejadianLaporan = document.getElementById('totalKejadianLaporan');

    el.korbanLRLaporan = document.getElementById('korbanLRLaporan');

    el.korbanLBLaporan = document.getElementById('korbanLBLaporan');

    el.korbanMDLaporan = document.getElementById('korbanMDLaporan');

    el.kerugianMaterialLaporan = document.getElementById(
      'kerugianMaterialLaporan',
    );

    el.statusDalamPenangananLaporan = document.getElementById(
      'statusDalamPenangananLaporan',
    );

    el.statusRJLaporan = document.getElementById('statusRJLaporan');

    el.statusLimpahPolresLaporan = document.getElementById(
      'statusLimpahPolresLaporan',
    );

    el.laporanCountText = document.getElementById('laporanCountText');

    el.laporanCountNumber = document.getElementById('laporanCountNumber');

    el.lihatDaftarLaporanButton = document.getElementById(
      'lihatDaftarLaporanButton',
    );

    el.exportPdfButton = document.getElementById('exportPdfButton');

    el.exportExcelButton = document.getElementById('exportExcelButton');
  }

  /* =====================================================
     4. DATA MOCK
     
     Bentuk data dibuat menyerupai response backend.
     Nanti ketika Code.gs sudah siap, bagian sumber data
     ini yang diganti.
     ===================================================== */

  // const MOCK_RESPONSE = {
  //   success: true,

  //   message: 'Data berhasil diproses.',

  //   periode: {
  //     type: 'semua',
  //     label: 'Semua Data',
  //     startDate: null,
  //     endDate: null,
  //   },

  //   summary: {
  //     totalKejadian: 18,
  //     korbanLR: 12,
  //     korbanLB: 4,
  //     korbanMD: 2,
  //     kerugianMaterial: 45750000,
  //   },

  //   status: {
  //     dalamPenanganan: 9,
  //     rj: 6,
  //     limpahPolres: 3,
  //   },

  //   reports: [
  //     {
  //       id: 'L/01/I/2026',
  //       tanggalKejadian: '2026-01-08',
  //     },
  //     {
  //       id: 'L/02/I/2026',
  //       tanggalKejadian: '2026-01-17',
  //     },
  //     {
  //       id: 'L/03/II/2026',
  //       tanggalKejadian: '2026-02-05',
  //     },
  //     {
  //       id: 'L/04/II/2026',
  //       tanggalKejadian: '2026-02-19',
  //     },
  //     {
  //       id: 'L/05/III/2026',
  //       tanggalKejadian: '2026-03-12',
  //     },
  //     {
  //       id: 'L/06/IV/2026',
  //       tanggalKejadian: '2026-04-03',
  //     },
  //     {
  //       id: 'L/07/IV/2026',
  //       tanggalKejadian: '2026-04-25',
  //     },
  //     {
  //       id: 'L/08/V/2026',
  //       tanggalKejadian: '2026-05-09',
  //     },
  //     {
  //       id: 'L/09/V/2026',
  //       tanggalKejadian: '2026-05-27',
  //     },
  //     {
  //       id: 'L/10/VI/2026',
  //       tanggalKejadian: '2026-06-04',
  //     },
  //     {
  //       id: 'L/11/VI/2026',
  //       tanggalKejadian: '2026-06-18',
  //     },
  //     {
  //       id: 'L/12/VII/2026',
  //       tanggalKejadian: '2026-07-02',
  //     },
  //     {
  //       id: 'L/13/VII/2026',
  //       tanggalKejadian: '2026-07-16',
  //     },
  //     {
  //       id: 'L/14/VII/2026',
  //       tanggalKejadian: '2026-07-29',
  //     },
  //     {
  //       id: 'L/15/VIII/2026',
  //       tanggalKejadian: '2026-08-05',
  //     },
  //     {
  //       id: 'L/16/VIII/2026',
  //       tanggalKejadian: '2026-08-12',
  //     },
  //     {
  //       id: 'L/17/VIII/2026',
  //       tanggalKejadian: '2026-08-20',
  //     },
  //     {
  //       id: 'L/18/VIII/2026',
  //       tanggalKejadian: '2026-08-28',
  //     },
  //   ],

  //   updatedAt: new Date().toISOString(),
  // };

  /* =====================================================
     5. MOCK RESPONSE ERROR / DATA KOSONG
     
     Tidak digunakan secara default.
     Bisa digunakan untuk testing.
     ===================================================== */

  const MOCK_EMPTY_RESPONSE = {
    success: true,

    message: 'Tidak ada data pada periode yang dipilih.',

    periode: {
      type: 'rentang',
      label: 'Tidak ada data',
      startDate: null,
      endDate: null,
    },

    summary: {
      totalKejadian: 0,
      korbanLR: 0,
      korbanLB: 0,
      korbanMD: 0,
      kerugianMaterial: 0,
    },

    status: {
      dalamPenanganan: 0,
      rj: 0,
      limpahPolres: 0,
    },

    reports: [],

    updatedAt: new Date().toISOString(),
  };

  const MOCK_ERROR_RESPONSE = {
    success: false,

    message: 'Data rekap tidak dapat dimuat.',

    periode: null,

    summary: null,

    status: null,

    reports: null,

    updatedAt: null,
  };

  /* =====================================================
     6. HELPER DOM
     ===================================================== */

  function elementExists(element) {
    return element !== null && element !== undefined;
  }

  function setText(element, value) {
    if (!elementExists(element)) return;

    element.textContent = value;
  }

  /* =====================================================
     7. HELPER ANGKA
     ===================================================== */

  function safeNumber(value, fallback = 0) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return fallback;
    }

    return number;
  }

  function formatNumber(value) {
    return safeNumber(value).toLocaleString('id-ID');
  }

  function formatRupiah(value) {
    const number = safeNumber(value);

    return number.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  /* =====================================================
     8. HELPER TANGGAL
     ===================================================== */

  // Tambahan Code

  function parseIndonesiaDate(dateStr) {
    if (!dateStr) return null;

    const monthMap = {
      Januari: 0,
      Februari: 1,
      Maret: 2,
      April: 3,
      Mei: 4,
      Juni: 5,
      Juli: 6,
      Agustus: 7,
      September: 8,
      Oktober: 9,
      November: 10,
      Desember: 11,
    };

    const parts = String(dateStr).split(',');

    const datePart = parts.length > 1 ? parts[1].trim() : parts[0].trim();

    const tokens = datePart.split(/\s+/);

    if (tokens.length < 3) return null;

    const day = Number(tokens[0]);
    const month = monthMap[tokens[1]];
    const year = Number(tokens[2]);

    if (
      !Number.isFinite(day) ||
      month === undefined ||
      !Number.isFinite(year)
    ) {
      return null;
    }

    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);

    return date;
  }

  function formatDateForInput(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // Akhir tambahan Code

  function padNumber(number) {
    return String(number).padStart(2, '0');
  }

  function createLocalDate(year, month, day) {
    const date = new Date(year, month, day);

    date.setHours(0, 0, 0, 0);

    return date;
  }

  function dateToInputValue(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return '';
    }

    return [
      date.getFullYear(),
      padNumber(date.getMonth() + 1),
      padNumber(date.getDate()),
    ].join('-');
  }

  function inputValueToDate(value) {
    if (!value) return null;

    const parts = value.split('-');

    if (parts.length !== 3) {
      return null;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(day)
    ) {
      return null;
    }

    const date = createLocalDate(year, month - 1, day);

    // Memastikan tanggal benar-benar valid.
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  function getStartOfWeek(date) {
    const result = new Date(date);

    result.setHours(0, 0, 0, 0);

    const day = result.getDay();

    // Senin = 1
    // Minggu = 0
    const difference = day === 0 ? -6 : 1 - day;

    result.setDate(result.getDate() + difference);

    return result;
  }

  function getEndOfWeek(date) {
    const result = getStartOfWeek(date);

    result.setDate(result.getDate() + 6);

    return result;
  }

  function getStartOfMonth(date) {
    return createLocalDate(date.getFullYear(), date.getMonth(), 1);
  }

  function getEndOfMonth(date) {
    return createLocalDate(date.getFullYear(), date.getMonth() + 1, 0);
  }

  function getStartOfYear(date) {
    return createLocalDate(date.getFullYear(), 0, 1);
  }

  function getEndOfYear(date) {
    return createLocalDate(date.getFullYear(), 11, 31);
  }

  /* =====================================================
     9. FORMAT PERIODE
     ===================================================== */

  const MONTH_NAMES = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  function formatDateIndonesia(date) {
    if (!(date instanceof Date)) {
      return '-';
    }

    return [
      padNumber(date.getDate()),
      MONTH_NAMES[date.getMonth()],
      date.getFullYear(),
    ].join(' ');
  }

  function createPeriodLabel(startDate, endDate) {
    if (!startDate && !endDate) {
      return 'Semua Data';
    }

    if (startDate && endDate) {
      return `${formatDateIndonesia(startDate)} – ${formatDateIndonesia(endDate)}`;
    }

    if (startDate) {
      return formatDateIndonesia(startDate);
    }

    if (endDate) {
      return formatDateIndonesia(endDate);
    }

    return 'Semua Data';
  }

  /* =====================================================
     10. TAHUN SELECT
     ===================================================== */

  function populateYearOptions() {
    const currentYear = new Date().getFullYear();

    const startYear = currentYear - 10;
    const endYear = currentYear + 1;

    const selects = [el.tahunBulanan, el.tahunTahunan];

    selects.forEach((select) => {
      if (!elementExists(select)) return;

      select.innerHTML = '';

      for (let year = endYear; year >= startYear; year--) {
        const option = document.createElement('option');

        option.value = String(year);
        option.textContent = String(year);

        if (year === currentYear) {
          option.selected = true;
        }

        select.appendChild(option);
      }
    });
  }

  /* =====================================================
     11. TAMPILKAN / SEMBUNYIKAN PANEL PERIODE
     ===================================================== */

  function hidePeriodPanels() {
    if (elementExists(el.periodeBulanan)) {
      el.periodeBulanan.classList.add('hidden');
    }

    if (elementExists(el.periodeTahunan)) {
      el.periodeTahunan.classList.add('hidden');
    }

    if (elementExists(el.periodeRentang)) {
      el.periodeRentang.classList.add('hidden');
    }
  }

  function updatePeriodTypeUI(type) {
    hidePeriodPanels();

    if (type === 'bulanan') {
      if (elementExists(el.periodeBulanan)) {
        el.periodeBulanan.classList.remove('hidden');
      }
    }

    if (type === 'tahunan') {
      if (elementExists(el.periodeTahunan)) {
        el.periodeTahunan.classList.remove('hidden');
      }
    }

    if (type === 'rentang') {
      if (elementExists(el.periodeRentang)) {
        el.periodeRentang.classList.remove('hidden');
      }
    }
  }

  /* =====================================================
     12. SET DEFAULT
     ===================================================== */

  function setDefaultPeriod() {
    state.periodType = 'semua';

    state.period.startDate = null;
    state.period.endDate = null;

    if (elementExists(el.jenisPeriode)) {
      el.jenisPeriode.value = 'semua';
    }

    hidePeriodPanels();

    if (elementExists(el.tahunBulanan)) {
      el.tahunBulanan.value = String(new Date().getFullYear());
    }

    if (elementExists(el.bulanBulanan)) {
      el.bulanBulanan.value = String(new Date().getMonth() + 1);
    }

    if (elementExists(el.tahunTahunan)) {
      el.tahunTahunan.value = String(new Date().getFullYear());
    }

    if (elementExists(el.tanggalMulai)) {
      el.tanggalMulai.value = '';
    }

    if (elementExists(el.tanggalAkhir)) {
      el.tanggalAkhir.value = '';
    }

    setText(el.periodeAktifText, 'Semua Data');
  }

  /* =====================================================
     13. AMBIL PERIODE DARI FORM
     ===================================================== */

  function getSelectedPeriod() {
    const type = el.jenisPeriode ? el.jenisPeriode.value : 'semua';

    /* ---------- SEMUA ---------- */

    if (type === 'semua') {
      return {
        valid: true,
        type: 'semua',
        startDate: null,
        endDate: null,
        label: 'Semua Data',
      };
    }

    /* ---------- BULANAN ---------- */

    if (type === 'bulanan') {
      const year = Number(el.tahunBulanan?.value);

      const month = Number(el.bulanBulanan?.value);

      if (
        !Number.isInteger(year) ||
        !Number.isInteger(month) ||
        month < 1 ||
        month > 12
      ) {
        return {
          valid: false,
          message: 'Tahun atau bulan belum dipilih dengan benar.',
        };
      }

      const startDate = createLocalDate(year, month - 1, 1);

      const endDate = getEndOfMonth(startDate);

      return {
        valid: true,
        type: 'bulanan',
        startDate,
        endDate,
        label: `${MONTH_NAMES[month - 1]} ${year}`,
      };
    }

    /* ---------- TAHUNAN ---------- */

    if (type === 'tahunan') {
      const year = Number(el.tahunTahunan?.value);

      if (!Number.isInteger(year)) {
        return {
          valid: false,
          message: 'Tahun belum dipilih dengan benar.',
        };
      }

      const startDate = getStartOfYear(createLocalDate(year, 0, 1));

      const endDate = getEndOfYear(createLocalDate(year, 0, 1));

      return {
        valid: true,
        type: 'tahunan',
        startDate,
        endDate,
        label: `Tahun ${year}`,
      };
    }

    /* ---------- RENTANG ---------- */

    if (type === 'rentang') {
      const startDate = inputValueToDate(el.tanggalMulai?.value);

      const endDate = inputValueToDate(el.tanggalAkhir?.value);

      if (!startDate || !endDate) {
        return {
          valid: false,
          message: 'Tanggal mulai dan tanggal akhir harus diisi.',
        };
      }

      if (endDate < startDate) {
        return {
          valid: false,
          message: 'Tanggal akhir tidak boleh lebih awal dari tanggal mulai.',
        };
      }

      return {
        valid: true,
        type: 'rentang',
        startDate,
        endDate,
        label: createPeriodLabel(startDate, endDate),
      };
    }

    return {
      valid: false,
      message: 'Jenis periode tidak dikenali.',
    };
  }

  /* =====================================================
     14. BUILD REQUEST
     
     Inilah bentuk data yang nantinya dapat dikirim
     ke backend / Code.gs.
     ===================================================== */

  function buildRequestPayload(period) {
    return {
      action: 'getLaporanRekap',

      periode: {
        type: period.type,

        startDate: period.startDate ? dateToInputValue(period.startDate) : null,

        endDate: period.endDate ? dateToInputValue(period.endDate) : null,
      },
    };
  }

  /* =====================================================
     15. MOCK BACKEND
     
     Seolah-olah frontend sedang menerima JSON
     dari backend.
     ===================================================== */

  function requestMockData(payload) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = createMockResponseForPeriod(payload);

        resolve(response);
      }, CONFIG.MOCK_DELAY);
    });
  }

  /* =====================================================
     16. FILTER DATA MOCK
     
     Ini hanya untuk simulasi frontend.
     Nanti tidak digunakan ketika backend sudah aktif.
     ===================================================== */

  // function createMockResponseForPeriod(payload) {
  //   const type = payload?.periode?.type || 'semua';

  //   let startDate = null;
  //   let endDate = null;

  //   if (payload?.periode?.startDate) {
  //     startDate = inputValueToDate(payload.periode.startDate);
  //   }

  //   if (payload?.periode?.endDate) {
  //     endDate = inputValueToDate(payload.periode.endDate);
  //   }

  //   const reports = Array.isArray(MOCK_RESPONSE.reports)
  //     (?) MOCK_RESPONSE.reports
  //     : [];

  //   /* Semua periode */

  //   if (type === 'semua') {
  //     return cloneObject(MOCK_RESPONSE);
  //   }

  //   /* Filter laporan berdasarkan tanggal */

  //   const filteredReports = reports.filter((report) => {
  //     const reportDate = inputValueToDate(report.tanggalKejadian);

  //     if (!reportDate) {
  //       return false;
  //     }

  //     if (startDate && reportDate < startDate) {
  //       return false;
  //     }

  //     if (endDate && reportDate > endDate) {
  //       return false;
  //     }

  //     return true;
  //   });

  //   /*
  //     Untuk mock, angka ringkasan dihitung secara
  //     proporsional agar UI bisa dites.

  //     Backend nantinya yang melakukan perhitungan
  //     sebenarnya.
  //   */

  //   const total = filteredReports.length;

  //   if (total === 0) {
  //     return cloneObject({
  //       ...MOCK_EMPTY_RESPONSE,

  //       periode: {
  //         type,
  //         label: createPeriodLabel(startDate, endDate),
  //         startDate: startDate ? dateToInputValue(startDate) : null,
  //         endDate: endDate ? dateToInputValue(endDate) : null,
  //       },
  //     });
  //   }

  //   const ratio = total / MOCK_RESPONSE.reports.length;

  //   return cloneObject({
  //     success: true,

  //     message: 'Data berhasil diproses.',

  //     periode: {
  //       type,
  //       label: createPeriodLabel(startDate, endDate),
  //       startDate: startDate ? dateToInputValue(startDate) : null,
  //       endDate: endDate ? dateToInputValue(endDate) : null,
  //     },

  //     summary: {
  //       totalKejadian: total,

  //       korbanLR: Math.round(MOCK_RESPONSE.summary.korbanLR * ratio),

  //       korbanLB: Math.round(MOCK_RESPONSE.summary.korbanLB * ratio),

  //       korbanMD: Math.round(MOCK_RESPONSE.summary.korbanMD * ratio),

  //       kerugianMaterial: Math.round(
  //         MOCK_RESPONSE.summary.kerugianMaterial * ratio,
  //       ),
  //     },

  //     status: {
  //       dalamPenanganan: Math.round(
  //         MOCK_RESPONSE.status.dalamPenanganan * ratio,
  //       ),

  //       rj: Math.round(MOCK_RESPONSE.status.rj * ratio),

  //       limpahPolres: Math.round(MOCK_RESPONSE.status.limpahPolres * ratio),
  //     },

  //     reports: filteredReports,

  //     updatedAt: new Date().toISOString(),
  //   });
  // }

  function createMockResponseForPeriod(payload) {
    const sourceData = Array.isArray(lakaData) ? lakaData : [];

    const type = payload?.periode?.type || 'semua';

    const startDate = payload?.periode?.startDate
      ? inputValueToDate(payload.periode.startDate)
      : null;

    const endDate = payload?.periode?.endDate
      ? inputValueToDate(payload.periode.endDate)
      : null;

    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }

    const filteredData = sourceData.filter((item) => {
      const itemDate = parseIndonesiaDate(item.hariTanggal);

      if (!itemDate) {
        return false;
      }

      if (startDate && itemDate < startDate) {
        return false;
      }

      if (endDate && itemDate > endDate) {
        return false;
      }

      return true;
    });

    const summary = {
      totalKejadian: filteredData.length,

      korbanLR: filteredData.reduce(
        (total, item) => total + safeNumber(item.lr),
        0,
      ),

      korbanLB: filteredData.reduce(
        (total, item) => total + safeNumber(item.lb),
        0,
      ),

      korbanMD: filteredData.reduce(
        (total, item) => total + safeNumber(item.md),
        0,
      ),

      kerugianMaterial: filteredData.reduce(
        (total, item) => total + safeNumber(item.kermat),
        0,
      ),
    };

    const status = {
      dalamPenanganan: filteredData.filter(
        (item) => String(item.status || '').trim() === 'Dalam Penanganan',
      ).length,

      rj: filteredData.filter(
        (item) => String(item.status || '').trim() === 'RJ',
      ).length,

      limpahPolres: filteredData.filter(
        (item) => String(item.status || '').trim() === 'Limpah Polres',
      ).length,
    };

    const reports = filteredData.map((item) => {
      const itemDate = parseIndonesiaDate(item.hariTanggal);

      return {
        ...item,
        tanggalKejadian: itemDate ? formatDateForInput(itemDate) : '',
      };
    });

    return {
      success: true,

      message:
        filteredData.length > 0
          ? 'Data berhasil diproses.'
          : 'Tidak ada data pada periode yang dipilih.',

      periode: {
        type,
        label: payload?.periode?.label || createPeriodLabel(startDate, endDate),

        startDate: startDate ? dateToInputValue(startDate) : null,

        endDate: endDate ? dateToInputValue(endDate) : null,
      },

      summary,

      status,

      reports,

      updatedAt: new Date().toISOString(),
    };
  }

  /* =====================================================
     17. CLONE OBJECT
     ===================================================== */

  function cloneObject(object) {
    return JSON.parse(JSON.stringify(object));
  }

  /* =====================================================
     18. VALIDASI RESPONSE JSON
     ===================================================== */

  function validateResponse(response) {
    if (!response || typeof response !== 'object') {
      return {
        valid: false,
        type: 'invalid',
        message: 'Response data tidak valid.',
      };
    }

    if (response.success !== true) {
      return {
        valid: false,
        type: 'error',
        message: response.message || 'Data rekap gagal dimuat.',
      };
    }

    if (!response.summary || typeof response.summary !== 'object') {
      return {
        valid: false,
        type: 'invalid',
        message: 'Data ringkasan tidak lengkap.',
      };
    }

    if (!response.status || typeof response.status !== 'object') {
      return {
        valid: false,
        type: 'invalid',
        message: 'Data status penanganan tidak lengkap.',
      };
    }

    if (!Array.isArray(response.reports)) {
      return {
        valid: false,
        type: 'invalid',
        message: 'Daftar laporan tidak valid.',
      };
    }

    return {
      valid: true,
      type: 'success',
      message: response.message || '',
    };
  }

  /* =====================================================
     19. NORMALISASI RESPONSE
     ===================================================== */

  function normalizeResponse(response) {
    const summary = response.summary || {};
    const status = response.status || {};

    return {
      success: true,

      message: response.message || '',

      periode: response.periode || {
        type: 'semua',
        label: 'Semua Data',
        startDate: null,
        endDate: null,
      },

      summary: {
        totalKejadian: safeNumber(summary.totalKejadian),

        korbanLR: safeNumber(summary.korbanLR),

        korbanLB: safeNumber(summary.korbanLB),

        korbanMD: safeNumber(summary.korbanMD),

        kerugianMaterial: safeNumber(summary.kerugianMaterial),
      },

      status: {
        dalamPenanganan: safeNumber(status.dalamPenanganan),

        rj: safeNumber(status.rj),

        limpahPolres: safeNumber(status.limpahPolres),
      },

      reports: Array.isArray(response.reports) ? response.reports : [],

      updatedAt: response.updatedAt || null,
    };
  }

  /* =====================================================
     20. RENDER REKAP
     ===================================================== */

  function renderSummary(response) {
    const summary = response.summary;
    const status = response.status;

    setText(el.totalKejadianLaporan, formatNumber(summary.totalKejadian));

    setText(el.korbanLRLaporan, formatNumber(summary.korbanLR));

    setText(el.korbanLBLaporan, formatNumber(summary.korbanLB));

    setText(el.korbanMDLaporan, formatNumber(summary.korbanMD));

    setText(el.kerugianMaterialLaporan, formatRupiah(summary.kerugianMaterial));

    setText(
      el.statusDalamPenangananLaporan,
      formatNumber(status.dalamPenanganan),
    );

    setText(el.statusRJLaporan, formatNumber(status.rj));

    setText(el.statusLimpahPolresLaporan, formatNumber(status.limpahPolres));
  }

  /* =====================================================
     21. RENDER INFORMASI PERIODE
     ===================================================== */

  function renderPeriodInfo(response) {
    const label = response?.periode?.label || 'Semua Data';

    setText(el.periodeAktifText, label);

    if (response.updatedAt) {
      const date = new Date(response.updatedAt);

      if (!Number.isNaN(date.getTime())) {
        const formatted = date.toLocaleString('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });

        setText(el.dataDiperbaruiText, formatted);

        return;
      }
    }

    setText(el.dataDiperbaruiText, '-');
  }

  /* =====================================================
     22. RENDER JUMLAH LAPORAN
     ===================================================== */

  function renderReportCount(response) {
    const count = Number(response?.summary?.totalKejadian) || 0;

    setText(el.laporanCountNumber, formatNumber(count));

    if (count === 0) {
      setText(
        el.laporanCountText,
        'Tidak ada laporan ditemukan dalam periode ini.',
      );
    } else {
      el.laporanCountText.innerHTML = `<span class="font-bold text-md">
            ${formatNumber(count)}
          </span>
        laporan ditemukan dalam periode ini.`;
    }

    updateReportLinkState(count);
  }

  /* =====================================================
     23. STATUS TOMBOL DAFTAR LAPORAN
     ===================================================== */

  function updateReportLinkState(count) {
    if (!elementExists(el.lihatDaftarLaporanButton)) {
      return;
    }

    if (count <= 0) {
      el.lihatDaftarLaporanButton.classList.add('opacity-50');

      el.lihatDaftarLaporanButton.classList.add('pointer-events-none');

      el.lihatDaftarLaporanButton.setAttribute('aria-disabled', 'true');
    } else {
      el.lihatDaftarLaporanButton.classList.remove('opacity-50');

      el.lihatDaftarLaporanButton.classList.remove('pointer-events-none');

      el.lihatDaftarLaporanButton.removeAttribute('aria-disabled');
    }
  }

  /* =====================================================
     24. LOADING STATE
     ===================================================== */

  function setLoading(isLoading) {
    state.loading = isLoading;

    if (!elementExists(el.tampilkanRekapButton)) {
      return;
    }

    if (isLoading) {
      el.tampilkanRekapButton.disabled = true;

      el.tampilkanRekapButton.dataset.originalText =
        el.tampilkanRekapButton.textContent;

      el.tampilkanRekapButton.textContent = 'Memproses...';

      el.tampilkanRekapButton.classList.add('opacity-70');
    } else {
      el.tampilkanRekapButton.disabled = false;

      const originalText = el.tampilkanRekapButton.dataset.originalText;

      el.tampilkanRekapButton.textContent = originalText || 'Tampilkan Rekap';

      el.tampilkanRekapButton.classList.remove('opacity-70');
    }
  }

  /* =====================================================
     25. NOTIFIKASI ERROR / INFO
     
     Tidak membuat komponen HTML baru.
     Menggunakan alert sederhana sementara.
     Nanti bisa diganti toast/modal.
     ===================================================== */

  function showMessage(message) {
    if (!message) return;

    window.alert(message);
  }

  /* =====================================================
     26. TAMPILKAN KONDISI ERROR
     ===================================================== */

  function renderErrorState(message) {
    const safeMessage = message || 'Data rekap tidak dapat dimuat.';

    /*
      Jangan menampilkan data lama sebagai hasil
      request baru.
    */

    setText(el.totalKejadianLaporan, '-');

    setText(el.korbanLRLaporan, '-');

    setText(el.korbanLBLaporan, '-');

    setText(el.korbanMDLaporan, '-');

    setText(el.kerugianMaterialLaporan, '-');

    setText(el.statusDalamPenangananLaporan, '-');

    setText(el.statusRJLaporan, '-');

    setText(el.statusLimpahPolresLaporan, '-');

    setText(el.laporanCountNumber, '-');

    setText(el.laporanCountText, 'Data tidak dapat dimuat.');

    updateReportLinkState(0);

    setText(el.dataDiperbaruiText, '-');

    showMessage(safeMessage);
  }

  /* =====================================================
     27. TAMPILKAN DATA KOSONG
     ===================================================== */

  function renderEmptyState(response) {
    const normalized = normalizeResponse(response);

    renderSummary(normalized);
    renderPeriodInfo(normalized);
    renderReportCount(normalized);
  }

  /* =====================================================
     28. LOAD REKAP
     ===================================================== */

  async function loadRekap() {
    const period = getSelectedPeriod();

    /* Validasi */

    if (!period.valid) {
      showMessage(period.message || 'Periode tidak valid.');

      return;
    }

    state.periodType = period.type;

    state.period.startDate = period.startDate;

    state.period.endDate = period.endDate;

    /* Request ID */

    const requestId = ++state.lastRequestId;

    setLoading(true);

    try {
      const payload = buildRequestPayload(period);

      let response;

      if (CONFIG.USE_MOCK_DATA) {
        response = await requestMockData(payload);
      } else {
        /*
          TEMPAT BACKEND NANTI

          Contoh konsep:

          response =
            await requestBackendData(payload);

          Bagian ini sengaja belum
          diaktifkan.
        */

        throw new Error('Backend belum diaktifkan.');
      }

      /*
        Jika ada request baru setelah request
        ini dimulai, response lama tidak boleh
        menimpa hasil terbaru.
      */

      if (requestId !== state.lastRequestId) {
        return;
      }

      const validation = validateResponse(response);

      if (!validation.valid) {
        renderErrorState(validation.message);

        return;
      }

      const normalized = normalizeResponse(response);

      state.currentResponse = normalized;

      state.lastSuccessfulResponse = normalized;

      renderSummary(normalized);

      renderPeriodInfo(normalized);

      renderReportCount(normalized);
    } catch (error) {
      console.error('Laporan & Rekap error:', error);

      if (requestId !== state.lastRequestId) {
        return;
      }

      renderErrorState('Terjadi kesalahan saat memuat data rekap.');
    } finally {
      if (requestId === state.lastRequestId) {
        setLoading(false);
      }
    }
  }

  /* =====================================================
     29. FILTER CEPAT
     ===================================================== */

  // function applyQuickFilter(type) {
  //   const today = new Date();

  //   let startDate;
  //   let endDate;

  //   if (type === 'minggu') {
  //     startDate = getStartOfWeek(today);

  //     endDate = getEndOfWeek(today);
  //   } else if (type === 'bulan') {
  //     startDate = getStartOfMonth(today);

  //     endDate = getEndOfMonth(today);
  //   } else if (type === 'tahun') {
  //     startDate = getStartOfYear(today);

  //     endDate = getEndOfYear(today);
  //   } else {
  //     return;
  //   }

  //   /*
  //     Filter cepat menggunakan tipe rentang
  //     karena hasil akhirnya adalah tanggal
  //     awal dan tanggal akhir.
  //   */

  //   state.periodType = 'rentang';

  //   state.period.startDate = startDate;

  //   state.period.endDate = endDate;

  //   if (elementExists(el.jenisPeriode)) {
  //     el.jenisPeriode.value = 'rentang';
  //   }

  //   updatePeriodTypeUI('rentang');

  //   if (elementExists(el.tanggalMulai)) {
  //     el.tanggalMulai.value = dateToInputValue(startDate);
  //   }

  //   if (elementExists(el.tanggalAkhir)) {
  //     el.tanggalAkhir.value = dateToInputValue(endDate);
  //   }

  //   loadRekap();
  // }

  function applyQuickFilter(type) {
    const today = new Date();

    /*
    BULAN INI
    Gunakan filter Bulanan:
    Tahun + Bulan
  */
    if (type === 'bulan') {
      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      state.periodType = 'bulanan';
      state.period.startDate = getStartOfMonth(today);
      state.period.endDate = getEndOfMonth(today);

      if (elementExists(el.jenisPeriode)) {
        el.jenisPeriode.value = 'bulanan';
      }

      updatePeriodTypeUI('bulanan');

      if (elementExists(el.tahunBulanan)) {
        el.tahunBulanan.value = String(year);
      }

      if (elementExists(el.bulanBulanan)) {
        el.bulanBulanan.value = String(month);
      }

      loadRekap();
      return;
    }

    /*
    TAHUN INI
    Gunakan filter Tahunan:
    Tahun saja
  */
    if (type === 'tahun') {
      const year = today.getFullYear();

      state.periodType = 'tahunan';
      state.period.startDate = getStartOfYear(today);
      state.period.endDate = getEndOfYear(today);

      if (elementExists(el.jenisPeriode)) {
        el.jenisPeriode.value = 'tahunan';
      }

      updatePeriodTypeUI('tahunan');

      if (elementExists(el.tahunTahunan)) {
        el.tahunTahunan.value = String(year);
      }

      loadRekap();
      return;
    }

    /*
    MINGGU INI
    Gunakan filter Rentang Tanggal.
  */
    if (type === 'minggu') {
      const startDate = getStartOfWeek(today);
      const endDate = getEndOfWeek(today);

      state.periodType = 'rentang';
      state.period.startDate = startDate;
      state.period.endDate = endDate;

      if (elementExists(el.jenisPeriode)) {
        el.jenisPeriode.value = 'rentang';
      }

      updatePeriodTypeUI('rentang');

      if (elementExists(el.tanggalMulai)) {
        el.tanggalMulai.value = dateToInputValue(startDate);
      }

      if (elementExists(el.tanggalAkhir)) {
        el.tanggalAkhir.value = dateToInputValue(endDate);
      }

      loadRekap();
    }
  }

  /* =====================================================
     30. RESET
     ===================================================== */

  function resetFilter() {
    /*
      Batalkan request lama.
    */

    state.lastRequestId++;

    setDefaultPeriod();

    /*
      Reset tampilan terlebih dahulu.
    */

    renderLoadingPlaceholder();

    /*
      Kemudian ambil kembali semua data.
    */

    loadRekap();
  }

  /* =====================================================
     31. PLACEHOLDER SAAT RESET / LOADING
     ===================================================== */

  function renderLoadingPlaceholder() {
    setText(el.totalKejadianLaporan, '...');

    setText(el.korbanLRLaporan, '...');

    setText(el.korbanLBLaporan, '...');

    setText(el.korbanMDLaporan, '...');

    setText(el.kerugianMaterialLaporan, '...');

    setText(el.statusDalamPenangananLaporan, '...');

    setText(el.statusRJLaporan, '...');

    setText(el.statusLimpahPolresLaporan, '...');

    setText(el.laporanCountNumber, '...');

    setText(el.laporanCountText, 'Memuat data laporan...');

    setText(el.dataDiperbaruiText, 'Memuat...');
  }

  /* =====================================================
     32. NAVIGASI KEMBALI
     ===================================================== */

  function goBack() {
    /*
      Jika halaman memiliki history sebelumnya,
      gunakan history browser.
    */

    if (window.history.length > 1) {
      window.history.back();

      return;
    }

    /*
      Fallback.
    */

    window.location.href = '../index.html';
  }

  /* =====================================================
     33. URL UNTUK LAPORAN.HTML
     ===================================================== */

  // function buildReportPageUrl() {
  //   const period = getSelectedPeriod();

  //   if (!period.valid) {
  //     return null;
  //   }

  //   const params = new URLSearchParams();

  //   params.set('periode', period.type);

  //   if (period.startDate) {
  //     params.set('tanggalMulai', dateToInputValue(period.startDate));
  //   }

  //   if (period.endDate) {
  //     params.set('tanggalAkhir', dateToInputValue(period.endDate));
  //   }

  //   return `${CONFIG.REPORT_PAGE}?${params.toString()}`;
  // }

  // function buildReportPageUrl() {
  //   const period = getSelectedPeriod();

  //   if (!period.valid) {
  //     return null;
  //   }

  //   /*
  //   Semua Periode:
  //   Tidak perlu query parameter.
  //   Halaman Laka Lantas memang default-nya
  //   menampilkan semua data.
  // */
  //   if (period.type === 'semua') {
  //     return CONFIG.REPORT_PAGE;
  //   }

  //   const params = new URLSearchParams();

  //   /*
  //   BULANAN
  //   Kirim Tahun + Bulan sesuai filter
  //   yang sudah tersedia di halaman Laka Lantas.
  // */
  //   if (period.type === 'bulanan') {
  //     params.set('tahun', String(period.startDate.getFullYear()));

  //     params.set('bulan', padNumber(period.startDate.getMonth() + 1));

  //     return `${CONFIG.REPORT_PAGE}?${params.toString()}`;
  //   }

  //   /*
  //   TAHUNAN
  //   Hanya kirim Tahun.
  // */
  //   if (period.type === 'tahunan') {
  //     params.set('tahun', String(period.startDate.getFullYear()));

  //     return `${CONFIG.REPORT_PAGE}?${params.toString()}`;
  //   }

  //   /*
  //   RENTANG TANGGAL
  //   Kirim tanggal mulai + tanggal akhir.
  // */
  //   if (period.type === 'rentang') {
  //     params.set('tanggalMulai', dateToInputValue(period.startDate));

  //     params.set('tanggalAkhir', dateToInputValue(period.endDate));

  //     return `${CONFIG.REPORT_PAGE}?${params.toString()}`;
  //   }

  //   return CONFIG.REPORT_PAGE;
  // }

  // Ganti code lagi

  function buildReportPageUrl() {
    const period = getSelectedPeriod();

    if (!period.valid) {
      return null;
    }

    const params = new URLSearchParams();

    /*
     * SEMUA
     * Tidak perlu parameter.
     */
    if (period.type === 'semua') {
      return CONFIG.REPORT_PAGE;
    }

    /*
     * BULANAN
     * Kirim tahun dan bulan.
     *
     * Contoh:
     * halLakaLantas.html?tahun=2026&bulan=09
     */
    if (period.type === 'bulanan') {
      params.set('tahun', String(period.startDate.getFullYear()));

      params.set('bulan', padNumber(period.startDate.getMonth() + 1));

      return `${CONFIG.REPORT_PAGE}?${params.toString()}`;
    }

    /*
     * TAHUNAN
     *
     * Contoh:
     * halLakaLantas.html?tahun=2026
     */
    if (period.type === 'tahunan') {
      params.set('tahun', String(period.startDate.getFullYear()));

      return `${CONFIG.REPORT_PAGE}?${params.toString()}`;
    }

    /*
     * RENTANG
     *
     * Contoh:
     * halLakaLantas.html?tanggalMulai=2026-09-01&tanggalAkhir=2026-09-04
     */
    if (period.type === 'rentang') {
      if (period.startDate) {
        params.set('tanggalMulai', dateToInputValue(period.startDate));
      }

      if (period.endDate) {
        params.set('tanggalAkhir', dateToInputValue(period.endDate));
      }

      const queryString = params.toString();

      return queryString
        ? `${CONFIG.REPORT_PAGE}?${queryString}`
        : CONFIG.REPORT_PAGE;
    }

    return CONFIG.REPORT_PAGE;
  }

  /* =====================================================
     34. BUKA DAFTAR LAPORAN
     ===================================================== */

  function openReportList() {
    const url = buildReportPageUrl();

    if (!url) {
      showMessage('Periode yang dipilih tidak valid.');

      return;
    }

    const response = state.currentResponse;

    const reportCount = Number(response?.summary?.totalKejadian) || 0;

    if (reportCount <= 0) {
      showMessage('Tidak ada laporan pada periode yang dipilih.');

      return;
    }

    window.location.href = url;
  }

  /* =====================================================
     35. UPDATE MODE APLIKASI
     ===================================================== */

  function updateApplicationMode(isOfficerMode) {
    state.mode = isOfficerMode ? 'officer' : 'visitor';

    /*
      Saat ini tampilan Laporan & Rekap
      sama untuk kedua mode.

      State tetap disimpan supaya nanti
      jika ada fitur khusus petugas,
      logic dapat ditambahkan tanpa mengubah
      sistem utama.
    */
  }

  /* =====================================================
     36. EVENT LISTENER
     ===================================================== */

  function setupEventListeners() {
    /* ---------- Back ---------- */

    if (elementExists(el.backButton)) {
      el.backButton.addEventListener('click', goBack);
    }

    /* ---------- Jenis Periode ---------- */

    if (elementExists(el.jenisPeriode)) {
      el.jenisPeriode.addEventListener('change', (event) => {
        const type = event.target.value;

        state.periodType = type;

        updatePeriodTypeUI(type);
      });
    }

    /* ---------- Tampilkan Rekap ---------- */

    if (elementExists(el.tampilkanRekapButton)) {
      el.tampilkanRekapButton.addEventListener('click', loadRekap);
    }

    /* ---------- Reset ---------- */

    if (elementExists(el.resetFilterButton)) {
      el.resetFilterButton.addEventListener('click', resetFilter);
    }

    /* ---------- Minggu Ini ---------- */

    if (elementExists(el.filterMingguIni)) {
      el.filterMingguIni.addEventListener('click', () =>
        applyQuickFilter('minggu'),
      );
    }

    /* ---------- Bulan Ini ---------- */

    if (elementExists(el.filterBulanIni)) {
      el.filterBulanIni.addEventListener('click', () =>
        applyQuickFilter('bulan'),
      );
    }

    /* ---------- Tahun Ini ---------- */

    if (elementExists(el.filterTahunIni)) {
      el.filterTahunIni.addEventListener('click', () =>
        applyQuickFilter('tahun'),
      );
    }

    /* ---------- Lihat Daftar Laporan ---------- */

    if (elementExists(el.lihatDaftarLaporanButton)) {
      el.lihatDaftarLaporanButton.addEventListener('click', openReportList);
    }

    /* ---------- Mode Aplikasi ---------- */

    document.addEventListener('modeChanged', (event) => {
      const isOfficer = Boolean(event.detail?.isOfficerMode);

      updateApplicationMode(isOfficer);
    });

    /* ---------- Perubahan mode umum ---------- */

    document.addEventListener('setApplicationMode', (event) => {
      if (event.detail?.mode === 'officer') {
        updateApplicationMode(true);
      } else if (event.detail?.mode === 'visitor') {
        updateApplicationMode(false);
      }
    });
  }

  /* =====================================================
     37. INISIALISASI
     ===================================================== */

  async function init() {
    cacheElements();

    /*
      Pastikan elemen utama memang tersedia.
    */

    if (!elementExists(el.jenisPeriode)) {
      console.error('Laporan & Rekap: elemen #jenisPeriode tidak ditemukan.');

      return;
    }

    populateYearOptions();

    /*
      WAJIB:
      Default halaman = Semua Periode.
    */

    setDefaultPeriod();

    setupEventListeners();

    /*
      Export masih dalam pengembangan.
      Pastikan tetap disabled walaupun HTML
      mengalami perubahan.
    */

    if (elementExists(el.exportPdfButton)) {
      el.exportPdfButton.disabled = true;

      el.exportPdfButton.setAttribute('aria-disabled', 'true');
    }

    if (elementExists(el.exportExcelButton)) {
      el.exportExcelButton.disabled = true;

      el.exportExcelButton.setAttribute('aria-disabled', 'true');
    }

    /*
      Tampilkan loading sementara.
    */

    renderLoadingPlaceholder();

    /*
      Load pertama = SEMUA DATA.
    */

    await loadRekap();
  }

  /* =====================================================
     38. PUBLIC API
     
     Tidak wajib dipakai HTML.
     Disediakan agar mudah dites dari console
     dan mudah dikembangkan nanti.
     ===================================================== */

  window.LaporanRekapComponent = {
    init,

    loadRekap,

    resetFilter,

    getState() {
      return {
        ...state,
        period: {
          ...state.period,
        },
      };
    },

    getCurrentResponse() {
      return state.currentResponse;
    },

    getRequestPayload() {
      const period = getSelectedPeriod();

      if (!period.valid) {
        return null;
      }

      return buildRequestPayload(period);
    },

    setMockResponse(response) {
      const validation = validateResponse(response);

      if (!validation.valid) {
        renderErrorState(validation.message);

        return false;
      }

      const normalized = normalizeResponse(response);

      state.currentResponse = normalized;

      state.lastSuccessfulResponse = normalized;

      renderSummary(normalized);

      renderPeriodInfo(normalized);

      renderReportCount(normalized);

      return true;
    },
  };

  /* =====================================================
     39. JALANKAN APLIKASI
     ===================================================== */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
