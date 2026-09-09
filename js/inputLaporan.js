/* ============================================================
   HALAMAN INPUT LAPORAN LAKA LANTAS
   ============================================================

   Fungsi file ini:
   1. Mengatur pilihan Input WhatsApp / Manual
   2. Mengatur perpindahan VIEW
   3. Memproses teks WhatsApp melalui Apps Script
   4. Menerima JSON hasil parser
   5. Mengisi FORM dari JSON
   6. Mengatur data dinamis:
      - Kendaraan
      - Pengendara
      - Saksi
      - Petugas
   7. Validasi form
   8. Mengirim JSON laporan ke Apps Script
   9. Mengatur loading / disabled button
   10. Menangani response sukses / error
   11. Menangani tombol kembali / batal

   CATATAN:
   - Parser tetap berada di Apps Script.
   - ID laporan tetap dibuat backend.
   - Nomor urut tetap dibuat backend.
   - Waktu input resmi tetap dibuat backend.
   - Frontend hanya mengirim dan menerima JSON.

   ============================================================ */

/* ============================================================
   1. KONFIGURASI
   ============================================================ */

const InputLaporanConfig = {
  /*
     Selama frontend masih dites, gunakan dummy backend.

     true  = gunakan dummy
     false = gunakan Apps Script asli
  */
  USE_DUMMY_BACKEND: true,

  /*
     Nama ENTRY POINT Apps Script.

     Nama ini boleh diganti nanti apabila nama function
     backend final berbeda.

     Frontend tidak perlu mengetahui function parser
     internal seperti ambilTKP(), ambilKendaraan(), dll.
  */
  BACKEND_FUNCTION: {
    PROSES_WHATSAPP: 'prosesLaporanWhatsApp',

    AMBIL_PETUGAS: 'ambilDaftarPetugas',

    SIMPAN_LAPORAN: 'simpanLaporan',
  },

  /*
     Halaman tujuan setelah laporan berhasil disimpan.
  */
  HALAMAN_LAKA_LANTAS: 'laka-lantas.html',
};

/* ============================================================
   2. ELEMENT HALAMAN
   ============================================================ */

const InputLaporanElements = {
  /* ---------- HEADER ---------- */

  btnBackPrevious: document.getElementById('btn-back-previous'),

  pageTitle: document.getElementById('page-title'),

  pageSubtitle: document.getElementById('page-subtitle'),

  /* ---------- VIEW ---------- */

  viewSelectionCards: document.getElementById('view-selection-cards'),

  viewInputWA: document.getElementById('view-input-wa'),

  viewFormReview: document.getElementById('view-form-review'),

  /* ---------- PILIHAN INPUT ---------- */

  cardSelectWA: document.getElementById('card-select-wa'),

  cardSelectManual: document.getElementById('card-select-manual'),

  /* ---------- WHATSAPP ---------- */

  textareaRawWA: document.getElementById('textarea-raw-wa'),

  btnProsesLaporan: document.getElementById('btn-proses-laporan'),

  alertWarningPaste: document.getElementById('alert-warning-paste'),

  bannerSuccessParse: document.getElementById('banner-success-parse'),

  /* ---------- FORM ---------- */

  formLaporanUtama: document.getElementById('form-laporan-utama'),

  inputIdLaporan: document.getElementById('input-id-laporan'),

  inputNoUrut: document.getElementById('input-no-urut'),

  inputWaktuInput: document.getElementById('input-waktu-input'),

  inputTKP: document.getElementById('input-tkp'),

  inputTanggalKejadian: document.getElementById('input-tanggal-kejadian'),

  selectHariKejadian: document.getElementById('select-hari-kejadian'),

  inputJamKejadian: document.getElementById('input-jam-kejadian'),

  textareaKronologiFinal: document.getElementById('textarea-kronologi-final'),

  inputKorbanLR: document.getElementById('input-korban-lr'),

  inputKorbanLB: document.getElementById('input-korban-lb'),

  inputKorbanMD: document.getElementById('input-korban-md'),

  inputKermatRupiah: document.getElementById('input-kermat-rupiah'),

  selectStatusPenanganan: document.getElementById('select-status-penanganan'),

  /* ---------- DYNAMIC ---------- */

  containerListKendaraan: document.getElementById('container-list-kendaraan'),

  containerListPengendara: document.getElementById('container-list-pengendara'),

  containerListSaksi: document.getElementById('container-list-saksi'),

  containerTagsPetugas: document.getElementById('container-tags-petugas'),

  /* ---------- BUTTON ---------- */

  btnAddKendaraan: document.getElementById('btn-add-kendaraan'),

  btnAddPengendara: document.getElementById('btn-add-pengendara'),

  btnAddSaksi: document.getElementById('btn-add-saksi'),

  btnAddPetugas: document.getElementById('btn-add-petugas'),

  btnKirimLaporan: document.getElementById('btn-kirim-laporan'),

  btnBatalForm: document.getElementById('btn-batal-form'),
};

/* ============================================================
   3. STATE HALAMAN
   ============================================================ */

const InputLaporanState = {
  /*
     View yang sedang aktif.

     selection
     whatsapp
     form
  */
  currentView: 'selection',

  /*
     Cara input yang sedang digunakan.

     whatsapp
     manual
  */
  inputMethod: 'whatsapp',

  /*
     Data terakhir yang diterima dari backend.
  */
  lastBackendResponse: null,

  /*
     Data laporan yang sedang diedit.
  */
  currentReport: null,

  /*
     Daftar petugas dari backend.
  */
  daftarPetugas: [],

  /*
     Petugas yang sedang dipilih.
  */
  selectedPetugas: [],

  /*
     Penanda apakah form berasal dari hasil parser.
  */
  parsedFromWhatsApp: false,
};

/* ============================================================
   4. HELPER DASAR
   ============================================================ */

/*
   Mengambil value secara aman.
*/
function ambilNilai(data, keys, defaultValue = '') {
  if (!data || typeof data !== 'object') {
    return defaultValue;
  }

  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null) {
      return data[key];
    }
  }

  return defaultValue;
}

/*
   Mengambil array secara aman.
*/
function ambilArray(data, keys) {
  const value = ambilNilai(data, keys, []);

  if (Array.isArray(value)) {
    return value;
  }

  /*
     Jika backend mengirim satu object,
     ubah menjadi array satu item.
  */
  if (value && typeof value === 'object') {
    return [value];
  }

  /*
     Jika backend mengirim string,
     jadikan satu item.
  */
  if (typeof value === 'string' && value.trim() !== '') {
    return [value];
  }

  return [];
}

/*
   Mengubah nilai menjadi string aman.
*/
function nilaiKeString(value) {
  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

/*
   Escape HTML.

   Digunakan ketika membuat element dinamis.
*/
function escapeHTML(value) {
  const text = nilaiKeString(value);

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================================
   5. VIEW MANAGEMENT
   ============================================================ */

/*
   Menampilkan satu VIEW dan menyembunyikan VIEW lainnya.

   Ini sengaja menjadi pusat perpindahan view.

   Jadi klik Manual tidak hanya mengganti class active,
   tetapi benar-benar mengganti tampilan halaman.
*/
function showInputView(viewName) {
  const elements = InputLaporanElements;

  /*
     Semua view disembunyikan terlebih dahulu.
  */
  if (elements.viewSelectionCards) {
    elements.viewSelectionCards.classList.remove('hidden');
  }

  if (elements.viewInputWA) {
    elements.viewInputWA.classList.add('hidden');
  }

  if (elements.viewFormReview) {
    elements.viewFormReview.classList.add('hidden');
  }

  /*
     Tentukan VIEW yang aktif.
  */
  switch (viewName) {
    case 'selection':
      if (elements.viewSelectionCards) {
        elements.viewSelectionCards.classList.remove('hidden');
      }

      InputLaporanState.currentView = 'selection';

      updatePageHeader('INPUT LAPORAN LAKA LANTAS', 'Pilih cara input laporan');

      /*
         Tombol kembali tidak diperlukan
         pada halaman awal.
      */
      hideBackButton();

      break;

    case 'whatsapp':
      if (elements.viewInputWA) {
        elements.viewInputWA.classList.remove('hidden');
      }

      InputLaporanState.currentView = 'whatsapp';

      updatePageHeader(
        'INPUT DARI WHATSAPP',
        'Tempel laporan WhatsApp untuk diproses',
      );

      showBackButton();

      break;

    case 'form':
      if (elements.viewFormReview) {
        elements.viewFormReview.classList.remove('hidden');
      }

      InputLaporanState.currentView = 'form';

      updatePageHeader(
        InputLaporanState.inputMethod === 'manual'
          ? 'INPUT MANUAL LAPORAN'
          : 'REVIEW LAPORAN',
        InputLaporanState.inputMethod === 'manual'
          ? 'Isi data laporan secara manual'
          : 'Periksa dan edit hasil parsing sebelum dikirim',
      );

      showBackButton();

      break;
  }

  /*
     Scroll kembali ke atas ketika pindah view.
  */
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });

  /*
     Render icon jika Lucide tersedia.
  */
  if (window.lucide) {
    lucide.createIcons();
  }
}

/*
   Update judul halaman.
*/
function updatePageHeader(title, subtitle) {
  if (InputLaporanElements.pageTitle) {
    InputLaporanElements.pageTitle.textContent = title;
  }

  if (InputLaporanElements.pageSubtitle) {
    InputLaporanElements.pageSubtitle.textContent = subtitle;
  }
}

/*
   Tampilkan tombol kembali.
*/
function showBackButton() {
  if (!InputLaporanElements.btnBackPrevious) {
    return;
  }

  InputLaporanElements.btnBackPrevious.classList.remove('hidden');
}

/*
   Sembunyikan tombol kembali.
*/
function hideBackButton() {
  if (!InputLaporanElements.btnBackPrevious) {
    return;
  }

  InputLaporanElements.btnBackPrevious.classList.add('hidden');
}

/* ============================================================
   6. ACTIVE STATE CARD PILIHAN INPUT
   ============================================================ */

/*
   Mengatur card mana yang aktif.

   Penting:
   active state dan perpindahan VIEW berjalan bersamaan.
*/
function updateInputMethodActiveState(method) {
  const wa = InputLaporanElements.cardSelectWA;

  const manual = InputLaporanElements.cardSelectManual;

  if (!wa || !manual) {
    return;
  }

  /*
     RESET KEDUA CARD
  */
  wa.classList.remove('border-blue-600', 'bg-blue-50', 'shadow-sm');

  wa.classList.add('border-slate-200', 'bg-white');

  manual.classList.remove('border-blue-600', 'bg-blue-50', 'shadow-sm');

  manual.classList.add('border-slate-200', 'bg-white');

  /*
     RESET WARNA TEKS
  */
  const waTitle = wa.querySelector('h3');
  const waText = wa.querySelector('p');
  const waIcon = wa.querySelector('.icon-wrapper');

  const manualTitle = manual.querySelector('h3');
  const manualText = manual.querySelector('p');
  const manualIcon = manual.querySelector('.icon-wrapper');

  if (waTitle) {
    waTitle.classList.remove('text-blue-600');
    waTitle.classList.add('text-slate-800');
  }

  if (waText) {
    waText.classList.remove('text-blue-500');
    waText.classList.add('text-slate-500');
  }

  if (waIcon) {
    waIcon.classList.remove('text-blue-600');
    waIcon.classList.add('text-slate-700');
  }

  if (manualTitle) {
    manualTitle.classList.remove('text-blue-600');
    manualTitle.classList.add('text-slate-800');
  }

  if (manualText) {
    manualText.classList.remove('text-blue-500');
    manualText.classList.add('text-slate-500');
  }

  if (manualIcon) {
    manualIcon.classList.remove('text-blue-600');
    manualIcon.classList.add('text-slate-700');
  }

  /*
     AKTIF WHATSAPP
  */
  if (method === 'whatsapp') {
    wa.classList.remove('border-slate-200', 'bg-white');

    wa.classList.add('border-blue-600', 'bg-blue-50', 'shadow-sm');

    if (waTitle) {
      waTitle.classList.remove('text-slate-800');
      waTitle.classList.add('text-blue-600');
    }

    if (waText) {
      waText.classList.remove('text-slate-500');
      waText.classList.add('text-blue-500');
    }

    if (waIcon) {
      waIcon.classList.remove('text-slate-700');
      waIcon.classList.add('text-blue-600');
    }
  }

  /*
     AKTIF MANUAL
  */
  if (method === 'manual') {
    manual.classList.remove('border-slate-200', 'bg-white');

    manual.classList.add('border-blue-600', 'bg-blue-50', 'shadow-sm');

    if (manualTitle) {
      manualTitle.classList.remove('text-slate-800');

      manualTitle.classList.add('text-blue-600');
    }

    if (manualText) {
      manualText.classList.remove('text-slate-500');

      manualText.classList.add('text-blue-500');
    }

    if (manualIcon) {
      manualIcon.classList.remove('text-slate-700');

      manualIcon.classList.add('text-blue-600');
    }
  }
}

/* ============================================================
   7. PILIH INPUT WHATSAPP
   ============================================================ */

function pilihInputWhatsApp() {
  InputLaporanState.inputMethod = 'whatsapp';

  InputLaporanState.parsedFromWhatsApp = false;

  updateInputMethodActiveState('whatsapp');

  /*
     Pastikan halaman WhatsApp benar-benar tampil.
  */
  showInputView('whatsapp');
}

/* ============================================================
   8. PILIH INPUT MANUAL
   ============================================================ */

function pilihInputManual() {
  InputLaporanState.inputMethod = 'manual';

  InputLaporanState.parsedFromWhatsApp = false;

  updateInputMethodActiveState('manual');

  /*
     Form manual harus benar-benar muncul.
  */
  resetFormLaporan();

  /*
     Banner hasil parser disembunyikan karena
     ini bukan hasil parsing WhatsApp.
  */
  hideBannerSuccessParse();

  /*
     Ambil daftar petugas.
  */
  ambilDaftarPetugas();

  /*
     Tampilkan form.
  */
  showInputView('form');
}

/* ============================================================
   9. TOMBOL KEMBALI
   ============================================================ */

/*
   Fungsi ini menangani tombol Kembali.

   Kita bedakan berdasarkan VIEW saat ini.

   Dari Form:
       kembali ke VIEW sebelumnya.

   Dari WhatsApp:
       kembali ke pilihan metode.

   Dari selection:
       kembali ke halaman sebelumnya.
*/
function kembaliKeHalamanSebelumnya() {
  const currentView = InputLaporanState.currentView;

  /*
     Jika sedang di FORM.
  */
  if (currentView === 'form') {
    /*
       Jika masuk form dari WhatsApp,
       kembali ke halaman WhatsApp.
    */
    if (InputLaporanState.inputMethod === 'whatsapp') {
      showInputView('whatsapp');

      return;
    }

    /*
       Jika form manual,
       kembali ke halaman pilihan input.
    */
    showInputView('selection');

    updateInputMethodActiveState('manual');

    return;
  }

  /*
     Jika sedang di halaman WhatsApp,
     kembali ke pilihan input.
  */
  if (currentView === 'whatsapp') {
    showInputView('selection');

    updateInputMethodActiveState('whatsapp');

    return;
  }

  /*
     Jika sudah di selection,
     kembali ke halaman sebelumnya.

     Karena HTML halaman ini berada di
     pages/laka-lantas-input.html,
     history.back() adalah pilihan paling aman.
  */
  if (currentView === 'selection') {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = InputLaporanConfig.HALAMAN_LAKA_LANTAS;
    }
  }
}

/* ============================================================
   10. PROSES LAPORAN WHATSAPP
   ============================================================ */

function prosesLaporanWhatsApp() {
  const textarea = InputLaporanElements.textareaRawWA;

  const button = InputLaporanElements.btnProsesLaporan;

  if (!textarea) {
    return;
  }

  const rawText = textarea.value.trim();

  /*
     Jangan proses jika kosong.
  */
  if (!rawText) {
    tampilkanAlert('warning', 'Laporan WhatsApp belum diisi.');

    textarea.focus();

    return;
  }

  /*
     Kunci tombol.
  */
  setButtonLoading(button, true, '⏳ MEMPROSES...');

  sembunyikanAlert();

  /*
     MODE DUMMY
  */
  if (InputLaporanConfig.USE_DUMMY_BACKEND) {
    jalankanDummyProsesWhatsApp(rawText)
      .then(function (response) {
        handleProcessWhatsAppSuccess(response);
      })
      .catch(function (error) {
        handleProcessWhatsAppError(error);
      })
      .finally(function () {
        setButtonLoading(button, false, '⚙ PROSES LAPORAN');
      });

    return;
  }

  /*
     MODE APPS SCRIPT ASLI
  */
  if (typeof google === 'undefined' || !google.script || !google.script.run) {
    handleProcessWhatsAppError('google.script.run tidak tersedia.');

    setButtonLoading(button, false, '⚙ PROSES LAPORAN');

    return;
  }

  google.script.run
    .withSuccessHandler(function (response) {
      handleProcessWhatsAppSuccess(response);

      setButtonLoading(button, false, '⚙ PROSES LAPORAN');
    })
    .withFailureHandler(function (error) {
      handleProcessWhatsAppError(error);

      setButtonLoading(button, false, '⚙ PROSES LAPORAN');
    })
    [InputLaporanConfig.BACKEND_FUNCTION.PROSES_WHATSAPP](rawText);
}

/* ============================================================
   11. RESPONSE PROSES WHATSAPP
   ============================================================ */

function handleProcessWhatsAppSuccess(response) {
  InputLaporanState.lastBackendResponse = response;

  /*
     Pastikan response memiliki format
     yang dapat dibaca.
  */
  const normalized = normalisasiResponseBackend(response);

  if (!normalized.success) {
    handleProcessWhatsAppError(
      normalized.message || 'Laporan tidak berhasil diproses.',
    );

    return;
  }

  const data = normalized.data || {};

  InputLaporanState.currentReport = data;

  InputLaporanState.parsedFromWhatsApp = true;

  /*
     Isi form dari JSON.
  */
  isiFormDariJSON(data);

  /*
     Banner sukses parser.
  */
  showBannerSuccessParse();

  /*
     Ambil daftar petugas.
  */
  ambilDaftarPetugas();

  /*
     Pindah ke FORM REVIEW.
  */
  showInputView('form');

  tampilkanAlert(
    'success',
    normalized.message ||
      'Data laporan berhasil diproses. Periksa kembali sebelum dikirim.',
  );
}

/* ============================================================
   12. RESPONSE ERROR PROSES WHATSAPP
   ============================================================ */

function handleProcessWhatsAppError(error) {
  console.error('[InputLaporan] Proses WhatsApp gagal:', error);

  let message =
    'Laporan gagal diproses. Silakan periksa kembali data yang ditempel.';

  if (typeof error === 'string') {
    message = error;
  }

  if (error && typeof error === 'object' && error.message) {
    message = error.message;
  }

  tampilkanAlert('error', message);
}

/* ============================================================
   13. NORMALISASI RESPONSE BACKEND
   ============================================================ */

function normalisasiResponseBackend(response) {
  /*
     Jika response sudah object.
  */
  if (response && typeof response === 'object') {
    return {
      success: response.success !== false,

      message: response.message || '',

      data: response.data !== undefined ? response.data : response,
    };
  }

  /*
     Jika backend mengirim JSON string.
  */
  if (typeof response === 'string') {
    try {
      const parsed = JSON.parse(response);

      return normalisasiResponseBackend(parsed);
    } catch (error) {
      return {
        success: false,
        message: 'Response backend bukan JSON yang valid.',
        data: null,
      };
    }
  }

  return {
    success: false,
    message: 'Response backend kosong atau tidak valid.',
    data: null,
  };
}

/* ============================================================
   14. ISI FORM DARI JSON
   ============================================================ */

function isiFormDariJSON(data) {
  if (!data) {
    return;
  }

  const elements = InputLaporanElements;

  /*
     --------------------------------------------
     INFORMASI LAPORAN
     --------------------------------------------
  */

  elements.inputIdLaporan.value = ambilNilai(data, [
    'idLaporan',
    'id_laporan',
    'id',
  ]);

  elements.inputNoUrut.value = ambilNilai(data, [
    'noUrut',
    'no_urut',
    'nomorUrut',
  ]);

  elements.inputWaktuInput.value = ambilNilai(data, [
    'waktuInput',
    'waktu_input',
    'tanggalInput',
  ]);

  /*
     --------------------------------------------
     WAKTU & TEMPAT
     --------------------------------------------
  */

  elements.inputTKP.value = ambilNilai(data, ['tkp', 'TKP']);

  elements.inputTanggalKejadian.value = ambilNilai(data, [
    'tanggalKejadian',
    'tanggal_kejadian',
    'tanggal',
  ]);

  setSelectValue(
    elements.selectHariKejadian,
    ambilNilai(data, ['hariKejadian', 'hari_kejadian', 'hari']),
  );

  elements.inputJamKejadian.value = ambilNilai(data, [
    'jamKejadian',
    'jam_kejadian',
    'jam',
  ]);

  /*
     --------------------------------------------
     KRONOLOGI
     --------------------------------------------
  */

  elements.textareaKronologiFinal.value = ambilNilai(data, [
    'kronologi',
    'kronologiKejadian',
    'kronologi_kejadian',
  ]);

  /*
     --------------------------------------------
     KORBAN
     --------------------------------------------
  */

  elements.inputKorbanLR.value = ambilNilai(
    data,
    ['korbanLR', 'korbanLr', 'lr'],
    0,
  );

  elements.inputKorbanLB.value = ambilNilai(
    data,
    ['korbanLB', 'korbanLb', 'lb'],
    0,
  );

  elements.inputKorbanMD.value = ambilNilai(
    data,
    ['korbanMD', 'korbanMd', 'md'],
    0,
  );

  /*
     --------------------------------------------
     KERMAT
     --------------------------------------------
  */

  elements.inputKermatRupiah.value = ambilNilai(data, [
    'kermat',
    'kermatRupiah',
    'kerugianMaterial',
    'kerugian_material',
  ]);

  /*
     --------------------------------------------
     STATUS
     --------------------------------------------
  */

  const status = ambilNilai(data, [
    'statusPenanganan',
    'status_penanganan',
    'status',
  ]);

  setStatusPenanganan(status);

  /*
     --------------------------------------------
     KENDARAAN
     --------------------------------------------
  */

  const kendaraan = ambilArray(data, [
    'kendaraan',
    'kendaraanTerlibat',
    'kendaraanYangTerlibat',
  ]);

  renderListKendaraan(kendaraan);

  /*
     --------------------------------------------
     PENGENDARA
     --------------------------------------------
  */

  const pengendara = ambilArray(data, ['pengendara', 'dataPengendara']);

  renderListPengendara(pengendara);

  /*
     --------------------------------------------
     SAKSI
     --------------------------------------------
  */

  const saksi = ambilArray(data, ['saksi', 'saksiSaksi']);

  renderListSaksi(saksi);

  /*
     --------------------------------------------
     PETUGAS
     --------------------------------------------
  */

  const petugas = ambilArray(data, ['petugas', 'petugasYangMenangani']);

  InputLaporanState.selectedPetugas = normalizePetugasArray(petugas);

  renderSelectedPetugas();
}

/* ============================================================
   15. SET VALUE SELECT
   ============================================================ */

function setSelectValue(selectElement, value) {
  if (!selectElement) {
    return;
  }

  if (value === undefined || value === null || value === '') {
    return;
  }

  const text = String(value).trim();

  const option = Array.from(selectElement.options).find(function (item) {
    return item.value.toLowerCase() === text.toLowerCase();
  });

  if (option) {
    selectElement.value = option.value;
  }
}

/* ============================================================
   16. STATUS PENANGANAN
   ============================================================ */

function setStatusPenanganan(status) {
  if (!status) {
    return;
  }

  let normalized = String(status).trim().toLowerCase();

  /*
     Normalisasi variasi status lama/backend.
  */

  if (
    normalized === 'selesai' ||
    normalized === 'selesai / damai' ||
    normalized === 'selesai/damai'
  ) {
    normalized = 'Selesai / Damai';
  } else if (normalized === 'limpah polres' || normalized === 'pelimpahan') {
    normalized = 'Pelimpahan';
  } else if (normalized === 'dalam penanganan') {
    normalized = 'Dalam Penanganan';
  }

  setSelectValue(InputLaporanElements.selectStatusPenanganan, normalized);
}

/* ============================================================
   17. KENDARAAN
   ============================================================ */

function renderListKendaraan(kendaraanList = []) {
  const container = InputLaporanElements.containerListKendaraan;

  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (!kendaraanList.length) {
    tambahKendaraan();

    return;
  }

  kendaraanList.forEach(function (item, index) {
    tambahKendaraan(item, index);
  });
}

function tambahKendaraan(data = '', index = null) {
  const container = InputLaporanElements.containerListKendaraan;

  if (!container) {
    return;
  }

  const item = document.createElement('div');

  item.className =
    'dynamic-item-kendaraan border border-slate-200 rounded-lg p-2 bg-slate-50';

  const value = ambilDataItemString(data);

  item.innerHTML = `
    <div class="flex items-center justify-between gap-2 mb-1">
      <label class="text-[10px] font-semibold text-slate-500">
        KENDARAAN ${index !== null ? index + 1 : container.children.length + 1}
      </label>

      <button
        type="button"
        data-action="hapus-kendaraan"
        class="text-red-500 text-[10px] font-semibold hover:text-red-700"
      >
        Hapus
      </button>
    </div>

    <input
      type="text"
      data-field="kendaraan"
      value="${escapeHTML(value)}"
      placeholder="Identitas kendaraan"
      class="w-full text-xs p-2 border border-slate-300 rounded bg-white"
    />
  `;

  container.appendChild(item);
}

/* ============================================================
   18. PENGENDARA
   ============================================================ */

function renderListPengendara(pengendaraList = []) {
  const container = InputLaporanElements.containerListPengendara;

  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (!pengendaraList.length) {
    tambahPengendara();

    return;
  }

  pengendaraList.forEach(function (item, index) {
    tambahPengendara(item, index);
  });
}

function tambahPengendara(data = '', index = null) {
  const container = InputLaporanElements.containerListPengendara;

  if (!container) {
    return;
  }

  const item = document.createElement('div');

  item.className =
    'dynamic-item-pengendara border border-slate-200 rounded-lg p-2 bg-slate-50';

  const value = ambilDataItemString(data);

  item.innerHTML = `
    <div class="flex items-center justify-between gap-2 mb-1">
      <label class="text-[10px] font-semibold text-slate-500">
        PENGENDARA ${index !== null ? index + 1 : container.children.length + 1}
      </label>

      <button
        type="button"
        data-action="hapus-pengendara"
        class="text-red-500 text-[10px] font-semibold hover:text-red-700"
      >
        Hapus
      </button>
    </div>

    <input
      type="text"
      data-field="pengendara"
      value="${escapeHTML(value)}"
      placeholder="Nama / identitas pengendara"
      class="w-full text-xs p-2 border border-slate-300 rounded bg-white"
    />
  `;

  container.appendChild(item);
}

/* ============================================================
   19. SAKSI
   ============================================================ */

function renderListSaksi(saksiList = []) {
  const container = InputLaporanElements.containerListSaksi;

  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (!saksiList.length) {
    tambahSaksi();

    return;
  }

  saksiList.forEach(function (item, index) {
    tambahSaksi(item, index);
  });
}

function tambahSaksi(data = '', index = null) {
  const container = InputLaporanElements.containerListSaksi;

  if (!container) {
    return;
  }

  const item = document.createElement('div');

  item.className =
    'dynamic-item-saksi border border-slate-200 rounded-lg p-2 bg-slate-50';

  const value = ambilDataItemString(data);

  item.innerHTML = `
    <div class="flex items-center justify-between gap-2 mb-1">
      <label class="text-[10px] font-semibold text-slate-500">
        SAKSI ${index !== null ? index + 1 : container.children.length + 1}
      </label>

      <button
        type="button"
        data-action="hapus-saksi"
        class="text-red-500 text-[10px] font-semibold hover:text-red-700"
      >
        Hapus
      </button>
    </div>

    <input
      type="text"
      data-field="saksi"
      value="${escapeHTML(value)}"
      placeholder="Nama / identitas saksi"
      class="w-full text-xs p-2 border border-slate-300 rounded bg-white"
    />
  `;

  container.appendChild(item);
}

/* ============================================================
   20. NORMALISASI DATA ITEM
   ============================================================ */

function ambilDataItemString(item) {
  if (item === undefined || item === null) {
    return '';
  }

  /*
     Jika backend mengirim string.
  */
  if (typeof item === 'string') {
    return item;
  }

  /*
     Jika backend mengirim object,
     cari property umum.
  */
  if (typeof item === 'object') {
    return ambilNilai(
      item,
      ['nama', 'name', 'identitas', 'keterangan', 'data', 'uraian', 'value'],
      JSON.stringify(item),
    );
  }

  return String(item);
}

/* ============================================================
   21. PETUGAS
   ============================================================ */

/*
   Ambil daftar petugas dari backend.
*/
function ambilDaftarPetugas() {
  /*
     Jika sudah tersedia,
     tidak perlu meminta lagi.
  */
  if (InputLaporanState.daftarPetugas.length) {
    renderPetugasSelector();

    return;
  }

  /*
     Dummy.
  */
  if (InputLaporanConfig.USE_DUMMY_BACKEND) {
    jalankanDummyDaftarPetugas()
      .then(function (response) {
        handleGetPetugasSuccess(response);
      })
      .catch(function (error) {
        handleGetPetugasError(error);
      });

    return;
  }

  /*
     Apps Script asli.
  */
  if (typeof google === 'undefined' || !google.script || !google.script.run) {
    handleGetPetugasError('google.script.run tidak tersedia.');

    return;
  }

  google.script.run
    .withSuccessHandler(function (response) {
      handleGetPetugasSuccess(response);
    })
    .withFailureHandler(function (error) {
      handleGetPetugasError(error);
    })
    [InputLaporanConfig.BACKEND_FUNCTION.AMBIL_PETUGAS]();
}

/*
   Response daftar petugas.
*/
function handleGetPetugasSuccess(response) {
  const normalized = normalisasiResponseBackend(response);

  if (!normalized.success) {
    handleGetPetugasError(
      normalized.message || 'Daftar petugas gagal diambil.',
    );

    return;
  }

  const data = normalized.data || [];

  /*
     Backend dapat mengembalikan:
     data: []
     atau
     data: { petugas: [] }
  */
  const petugasArray = Array.isArray(data)
    ? data
    : ambilArray(data, ['petugas', 'daftarPetugas', 'dataPetugas']);

  InputLaporanState.daftarPetugas = normalizePetugasArray(petugasArray);

  renderPetugasSelector();

  renderSelectedPetugas();
}

/*
   Error daftar petugas.
*/
function handleGetPetugasError(error) {
  console.error('[InputLaporan] Gagal mengambil petugas:', error);

  /*
     Tidak menghapus form.

     Petugas tetap dapat mengisi data lain.
  */

  tampilkanAlert('warning', 'Daftar petugas belum berhasil dimuat.');
}

/* ============================================================
   22. NORMALISASI PETUGAS
   ============================================================ */

function normalizePetugasArray(list = []) {
  if (!Array.isArray(list)) {
    return [];
  }

  return list
    .map(function (item) {
      if (typeof item === 'string') {
        return {
          id: item,
          nama: item,
        };
      }

      if (item && typeof item === 'object') {
        return {
          id: ambilNilai(item, [
            'id',
            'idPetugas',
            'id_personil',
            'idPersonil',
          ]),

          nama: ambilNilai(item, [
            'nama',
            'namaPetugas',
            'namaPersonil',
            'name',
          ]),
        };
      }

      return null;
    })
    .filter(function (item) {
      return item && item.id && item.nama;
    });
}

/* ============================================================
   23. RENDER SELECTOR PETUGAS
   ============================================================ */

function renderPetugasSelector() {
  const container = InputLaporanElements.containerTagsPetugas;

  if (!container) {
    return;
  }

  /*
     Jangan menghapus chip yang sudah dipilih.

     Buat selector jika belum ada.
  */
  let selector = container.parentElement.querySelector(
    '[data-role="petugas-selector"]',
  );

  if (!selector) {
    selector = document.createElement('select');

    selector.dataset.role = 'petugas-selector';

    selector.className =
      'w-full text-xs p-2 border border-slate-300 rounded bg-white mt-2';

    const defaultOption = document.createElement('option');

    defaultOption.value = '';

    defaultOption.textContent = '-- Pilih Petugas --';

    selector.appendChild(defaultOption);

    InputLaporanState.daftarPetugas.forEach(function (petugas) {
      const option = document.createElement('option');

      option.value = petugas.id;

      option.textContent = petugas.nama;

      selector.appendChild(option);
    });

    selector.addEventListener('change', function () {
      const id = selector.value;

      if (!id) {
        return;
      }

      const petugas = InputLaporanState.daftarPetugas.find(function (item) {
        return item.id === id;
      });

      if (!petugas) {
        return;
      }

      const alreadySelected = InputLaporanState.selectedPetugas.some(
        function (item) {
          return item.id === id;
        },
      );

      if (!alreadySelected) {
        InputLaporanState.selectedPetugas.push(petugas);

        renderSelectedPetugas();
      }

      selector.value = '';
    });

    container.parentElement.appendChild(selector);
  }
}

/* ============================================================
   24. RENDER CHIP PETUGAS
   ============================================================ */

function renderSelectedPetugas() {
  const container = InputLaporanElements.containerTagsPetugas;

  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (!InputLaporanState.selectedPetugas.length) {
    const empty = document.createElement('span');

    empty.className = 'text-[10px] text-slate-400';

    empty.textContent = 'Belum ada petugas dipilih';

    container.appendChild(empty);

    return;
  }

  InputLaporanState.selectedPetugas.forEach(function (petugas) {
    const chip = document.createElement('span');

    chip.className =
      'inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-2 py-1 text-[10px]';

    chip.innerHTML = `
        <span>${escapeHTML(petugas.nama)}</span>

        <button
          type="button"
          data-action="hapus-petugas"
          data-id="${escapeHTML(petugas.id)}"
          class="font-bold text-blue-500 hover:text-red-500"
          title="Hapus petugas"
        >
          ×
        </button>
      `;

    container.appendChild(chip);
  });
}

/*
   Hapus petugas.
*/
function hapusPetugas(id) {
  InputLaporanState.selectedPetugas = InputLaporanState.selectedPetugas.filter(
    function (item) {
      return item.id !== id;
    },
  );

  renderSelectedPetugas();
}

/* ============================================================
   25. AMBIL DATA FORM
   ============================================================ */

function ambilDataForm() {
  const elements = InputLaporanElements;

  return {
    /*
       Data resmi dari backend.
    */
    idLaporan: elements.inputIdLaporan.value.trim(),

    noUrut: elements.inputNoUrut.value.trim(),

    waktuInput: elements.inputWaktuInput.value.trim(),

    /*
       Data laporan.
    */
    tkp: elements.inputTKP.value.trim(),

    tanggalKejadian: elements.inputTanggalKejadian.value.trim(),

    hariKejadian: elements.selectHariKejadian.value,

    jamKejadian: elements.inputJamKejadian.value.trim(),

    /*
       Array.
    */
    kendaraan: ambilListKendaraan(),

    pengendara: ambilListPengendara(),

    saksi: ambilListSaksi(),

    /*
       Kronologi.
    */
    kronologi: elements.textareaKronologiFinal.value.trim(),

    /*
       Korban.
    */
    korbanLR: elements.inputKorbanLR.value || 0,

    korbanLB: elements.inputKorbanLB.value || 0,

    korbanMD: elements.inputKorbanMD.value || 0,

    /*
       Kermat.
    */
    kermat: elements.inputKermatRupiah.value.trim(),

    /*
       Petugas.
    */
    petugas: InputLaporanState.selectedPetugas.map(function (item) {
      return {
        id: item.id,
        nama: item.nama,
      };
    }),

    /*
       Status.
    */
    statusPenanganan: elements.selectStatusPenanganan.value,
  };
}

/* ============================================================
   26. AMBIL LIST KENDARAAN
   ============================================================ */

function ambilListKendaraan() {
  const container = InputLaporanElements.containerListKendaraan;

  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll('[data-field="kendaraan"]'))
    .map(function (input) {
      return input.value.trim();
    })
    .filter(function (value) {
      return value !== '';
    });
}

/* ============================================================
   27. AMBIL LIST PENGENDARA
   ============================================================ */

function ambilListPengendara() {
  const container = InputLaporanElements.containerListPengendara;

  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll('[data-field="pengendara"]'))
    .map(function (input) {
      return input.value.trim();
    })
    .filter(function (value) {
      return value !== '';
    });
}

/* ============================================================
   28. AMBIL LIST SAKSI
   ============================================================ */

function ambilListSaksi() {
  const container = InputLaporanElements.containerListSaksi;

  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll('[data-field="saksi"]'))
    .map(function (input) {
      return input.value.trim();
    })
    .filter(function (value) {
      return value !== '';
    });
}

/* ============================================================
   29. VALIDASI FORM
   ============================================================ */

function validasiForm(data) {
  const errors = [];

  /*
     Field utama.
  */
  if (!data.tkp) {
    errors.push('TKP belum diisi.');
  }

  if (!data.tanggalKejadian) {
    errors.push('Tanggal kejadian belum diisi.');
  }

  if (!data.jamKejadian) {
    errors.push('Jam kejadian belum diisi.');
  }

  if (!data.kronologi) {
    errors.push('Kronologi kejadian belum diisi.');
  }

  /*
     Petugas.
  */
  if (!data.petugas.length) {
    errors.push('Petugas yang menangani belum dipilih.');
  }

  /*
     Status.
  */
  if (!data.statusPenanganan) {
    errors.push('Status penanganan belum dipilih.');
  }

  return errors;
}

/* ============================================================
   30. KIRIM LAPORAN
   ============================================================ */

function kirimLaporan() {
  const button = InputLaporanElements.btnKirimLaporan;

  const data = ambilDataForm();

  /*
     Validasi frontend.
  */
  const errors = validasiForm(data);

  if (errors.length) {
    tampilkanAlert('error', errors.join(' '));

    return;
  }

  /*
     Simpan state sementara.
  */
  InputLaporanState.currentReport = data;

  /*
     Kunci tombol.
  */
  setButtonLoading(button, true, '⏳ MENYIMPAN...');

  sembunyikanAlert();

  /*
     DUMMY BACKEND
  */
  if (InputLaporanConfig.USE_DUMMY_BACKEND) {
    jalankanDummySimpanLaporan(data)
      .then(function (response) {
        handleSaveReportSuccess(response);
      })
      .catch(function (error) {
        handleSaveReportError(error);
      })
      .finally(function () {
        setButtonLoading(button, false, '🚀 KIRIM LAPORAN');
      });

    return;
  }

  /*
     APPS SCRIPT ASLI
  */
  if (typeof google === 'undefined' || !google.script || !google.script.run) {
    handleSaveReportError('google.script.run tidak tersedia.');

    setButtonLoading(button, false, '🚀 KIRIM LAPORAN');

    return;
  }

  google.script.run
    .withSuccessHandler(function (response) {
      handleSaveReportSuccess(response);

      setButtonLoading(button, false, '🚀 KIRIM LAPORAN');
    })
    .withFailureHandler(function (error) {
      handleSaveReportError(error);

      setButtonLoading(button, false, '🚀 KIRIM LAPORAN');
    })
    [InputLaporanConfig.BACKEND_FUNCTION.SIMPAN_LAPORAN](data);
}

/* ============================================================
   31. RESPONSE SAVE SUCCESS
   ============================================================ */

function handleSaveReportSuccess(response) {
  const normalized = normalisasiResponseBackend(response);

  if (!normalized.success) {
    handleSaveReportError(normalized.message || 'Laporan gagal disimpan.');

    return;
  }

  tampilkanAlert('success', normalized.message || 'Laporan berhasil disimpan.');

  /*
     Berikan sedikit waktu agar user
     melihat pesan sukses.
  */
  setTimeout(function () {
    window.location.href = InputLaporanConfig.HALAMAN_LAKA_LANTAS;
  }, 1000);
}

/* ============================================================
   32. RESPONSE SAVE ERROR
   ============================================================ */

function handleSaveReportError(error) {
  console.error('[InputLaporan] Simpan laporan gagal:', error);

  let message = 'Laporan gagal disimpan. Data form tetap dipertahankan.';

  if (typeof error === 'string') {
    message = error;
  }

  if (error && typeof error === 'object' && error.message) {
    message = error.message;
  }

  tampilkanAlert('error', message);
}

/* ============================================================
   33. RESET FORM
   ============================================================ */

function resetFormLaporan() {
  const elements = InputLaporanElements;

  /*
     Field informasi.
  */
  elements.inputIdLaporan.value = '';

  elements.inputNoUrut.value = '';

  elements.inputWaktuInput.value = '';

  /*
     Waktu & tempat.
  */
  elements.inputTKP.value = '';

  elements.inputTanggalKejadian.value = '';

  elements.inputJamKejadian.value = '';

  /*
     Hari.
  */
  if (elements.selectHariKejadian) {
    elements.selectHariKejadian.value = 'Senin';
  }

  /*
     Array.
  */
  if (elements.containerListKendaraan) {
    elements.containerListKendaraan.innerHTML = '';
  }

  if (elements.containerListPengendara) {
    elements.containerListPengendara.innerHTML = '';
  }

  if (elements.containerListSaksi) {
    elements.containerListSaksi.innerHTML = '';
  }

  /*
     Tambahkan satu baris kosong.
  */
  tambahKendaraan();

  tambahPengendara();

  tambahSaksi();

  /*
     Kronologi.
  */
  elements.textareaKronologiFinal.value = '';

  /*
     Korban.
  */
  elements.inputKorbanLR.value = 0;

  elements.inputKorbanLB.value = 0;

  elements.inputKorbanMD.value = 0;

  /*
     Kermat.
  */
  elements.inputKermatRupiah.value = '';

  /*
     Status default.
  */
  elements.selectStatusPenanganan.value = 'Dalam Penanganan';

  /*
     Petugas.
  */
  InputLaporanState.selectedPetugas = [];

  renderSelectedPetugas();

  /*
     Reset banner.
  */
  hideBannerSuccessParse();

  /*
     Reset alert.
  */
  sembunyikanAlert();
}

/* ============================================================
   34. BATAL FORM
   ============================================================ */

function batalForm() {
  /*
     Jika sedang review dari WhatsApp,
     kembali ke halaman WhatsApp.
  */
  if (
    InputLaporanState.inputMethod === 'whatsapp' &&
    InputLaporanState.parsedFromWhatsApp
  ) {
    showInputView('whatsapp');

    return;
  }

  /*
     Manual kembali ke selection.
  */
  showInputView('selection');

  updateInputMethodActiveState('whatsapp');

  InputLaporanState.inputMethod = 'whatsapp';

  InputLaporanState.parsedFromWhatsApp = false;

  resetFormLaporan();
}

/* ============================================================
   35. BANNER PARSING
   ============================================================ */

function showBannerSuccessParse() {
  if (InputLaporanElements.bannerSuccessParse) {
    InputLaporanElements.bannerSuccessParse.classList.remove('hidden');
  }
}

function hideBannerSuccessParse() {
  if (InputLaporanElements.bannerSuccessParse) {
    InputLaporanElements.bannerSuccessParse.classList.add('hidden');
  }
}

/* ============================================================
   36. ALERT
   ============================================================ */

function tampilkanAlert(type, message) {
  /*
     Untuk saat ini kita gunakan
     alert container yang sudah tersedia
     jika memungkinkan.

     Jika nanti HTML memiliki container
     alert global khusus, function ini
     tinggal diarahkan ke container tersebut.
  */

  const existing = document.getElementById('input-laporan-alert');

  let alertElement = existing;

  if (!alertElement) {
    alertElement = document.createElement('div');

    alertElement.id = 'input-laporan-alert';

    alertElement.className = 'mb-4 p-3 rounded-xl text-xs border';

    /*
       Letakkan di atas selection / content.
    */
    const anchor = InputLaporanElements.viewSelectionCards?.parentElement;

    if (anchor) {
      anchor.insertBefore(alertElement, anchor.firstChild);
    } else {
      document.body.prepend(alertElement);
    }
  }

  /*
     Reset class.
  */
  alertElement.classList.remove(
    'bg-emerald-50',
    'border-emerald-200',
    'text-emerald-800',
    'bg-red-50',
    'border-red-200',
    'text-red-800',
    'bg-amber-50',
    'border-amber-200',
    'text-amber-800',
  );

  if (type === 'success') {
    alertElement.classList.add(
      'bg-emerald-50',
      'border-emerald-200',
      'text-emerald-800',
    );
  } else if (type === 'error') {
    alertElement.classList.add('bg-red-50', 'border-red-200', 'text-red-800');
  } else {
    alertElement.classList.add(
      'bg-amber-50',
      'border-amber-200',
      'text-amber-800',
    );
  }

  alertElement.textContent = message || '';

  alertElement.classList.remove('hidden');
}

function sembunyikanAlert() {
  const alertElement = document.getElementById('input-laporan-alert');

  if (alertElement) {
    alertElement.classList.add('hidden');
  }
}

/* ============================================================
   37. BUTTON LOADING
   ============================================================ */

function setButtonLoading(button, loading, loadingText) {
  if (!button) {
    return;
  }

  if (loading) {
    /*
       Simpan teks asli.
    */
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.textContent.trim();
    }

    button.disabled = true;

    button.classList.add('opacity-70', 'cursor-not-allowed');

    button.textContent = loadingText;
  } else {
    button.disabled = false;

    button.classList.remove('opacity-70', 'cursor-not-allowed');

    button.textContent = button.dataset.originalText || loadingText || '';
  }
}

/* ============================================================
   38. EVENT DELEGATION ITEM DINAMIS
   ============================================================ */

function initializeDynamicItemEvents() {
  document.addEventListener('click', function (event) {
    const actionButton = event.target.closest('[data-action]');

    if (!actionButton) {
      return;
    }

    const action = actionButton.dataset.action;

    /*
         Hapus kendaraan.
      */
    if (action === 'hapus-kendaraan') {
      const item = actionButton.closest('.dynamic-item-kendaraan');

      if (item) {
        item.remove();
      }

      return;
    }

    /*
         Hapus pengendara.
      */
    if (action === 'hapus-pengendara') {
      const item = actionButton.closest('.dynamic-item-pengendara');

      if (item) {
        item.remove();
      }

      return;
    }

    /*
         Hapus saksi.
      */
    if (action === 'hapus-saksi') {
      const item = actionButton.closest('.dynamic-item-saksi');

      if (item) {
        item.remove();
      }

      return;
    }

    /*
         Hapus petugas.
      */
    if (action === 'hapus-petugas') {
      hapusPetugas(actionButton.dataset.id);

      return;
    }
  });
}

/* ============================================================
   39. DUMMY BACKEND - WHATSAPP
   ============================================================ */

function jalankanDummyProsesWhatsApp(rawText) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      /*
         Dummy JSON.

         Bentuk ini hanya untuk menguji
         frontend.

         Nanti diganti response Apps Script.
      */
      resolve({
        success: true,

        message: 'Dummy: laporan berhasil diproses.',

        data: {
          idLaporan: 'L/DUMMY/001',

          noUrut: '001',

          waktuInput: 'Dummy',

          tkp: 'Jl. Raya Baureno - Bojonegoro',

          tanggalKejadian: '09/09/2026',

          hariKejadian: 'Rabu',

          jamKejadian: '08:30',

          kendaraan: [
            'Sepeda motor Honda Beat N 1234 AB',
            'Mobil Toyota Avanza S 5678 CD',
          ],

          pengendara: ['Aipda Contoh / 35 tahun', 'Budi / 30 tahun'],

          saksi: ['Saksi Contoh 1', 'Saksi Contoh 2'],

          kronologi: rawText,

          korbanLR: 1,

          korbanLB: 0,

          korbanMD: 0,

          kermat: 'Rp 2.500.000',

          petugas: [],

          statusPenanganan: 'Dalam Penanganan',
        },
      });
    }, 800);
  });
}

/* ============================================================
   40. DUMMY BACKEND - PETUGAS
   ============================================================ */

function jalankanDummyDaftarPetugas() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve({
        success: true,

        message: 'Dummy: daftar petugas berhasil.',

        data: [
          {
            id: 'P001',
            nama: 'Aipda Petugas Satu',
          },

          {
            id: 'P002',
            nama: 'Bripka Petugas Dua',
          },

          {
            id: 'P003',
            nama: 'Briptu Petugas Tiga',
          },
        ],
      });
    }, 300);
  });
}

/* ============================================================
   41. DUMMY BACKEND - SIMPAN
   ============================================================ */

function jalankanDummySimpanLaporan(data) {
  return new Promise(function (resolve) {
    console.log('[DUMMY SAVE] Data laporan:', data);

    setTimeout(function () {
      resolve({
        success: true,

        message: 'Dummy: laporan berhasil disimpan.',

        data: {
          idLaporan: data.idLaporan || 'L/DUMMY/001',

          noUrut: data.noUrut || '001',

          waktuInput: data.waktuInput || 'Dummy',
        },
      });
    }, 1000);
  });
}

/* ============================================================
   42. EVENT LISTENER
   ============================================================ */

function initializeInputLaporanEvents() {
  const elements = InputLaporanElements;

  /*
     Pilihan WhatsApp.
  */
  if (elements.cardSelectWA) {
    elements.cardSelectWA.addEventListener('click', function () {
      pilihInputWhatsApp();
    });
  }

  /*
     Pilihan Manual.
  */
  if (elements.cardSelectManual) {
    elements.cardSelectManual.addEventListener('click', function () {
      pilihInputManual();
    });
  }

  /*
     Proses WhatsApp.
  */
  if (elements.btnProsesLaporan) {
    elements.btnProsesLaporan.addEventListener('click', function () {
      prosesLaporanWhatsApp();
    });
  }

  /*
     Kembali.
  */
  if (elements.btnBackPrevious) {
    elements.btnBackPrevious.addEventListener('click', function () {
      kembaliKeHalamanSebelumnya();
    });
  }

  /*
     Tambah kendaraan.
  */
  if (elements.btnAddKendaraan) {
    elements.btnAddKendaraan.addEventListener('click', function () {
      tambahKendaraan();
    });
  }

  /*
     Tambah pengendara.
  */
  if (elements.btnAddPengendara) {
    elements.btnAddPengendara.addEventListener('click', function () {
      tambahPengendara();
    });
  }

  /*
     Tambah saksi.
  */
  if (elements.btnAddSaksi) {
    elements.btnAddSaksi.addEventListener('click', function () {
      tambahSaksi();
    });
  }

  /*
     Tambah petugas.

     Selector petugas akan dibuat oleh
     renderPetugasSelector().
  */
  if (elements.btnAddPetugas) {
    elements.btnAddPetugas.addEventListener('click', function () {
      renderPetugasSelector();

      const selector =
        elements.containerTagsPetugas?.parentElement?.querySelector(
          '[data-role="petugas-selector"]',
        );

      if (selector) {
        selector.focus();
      }
    });
  }

  /*
     Kirim laporan.
  */
  if (elements.btnKirimLaporan) {
    elements.btnKirimLaporan.addEventListener('click', function () {
      kirimLaporan();
    });
  }

  /*
     Batal.
  */
  if (elements.btnBatalForm) {
    elements.btnBatalForm.addEventListener('click', function () {
      batalForm();
    });
  }

  /*
     Dynamic items.
  */
  initializeDynamicItemEvents();

  /*
     Submit form tidak dilakukan oleh browser.
  */
  if (elements.formLaporanUtama) {
    elements.formLaporanUtama.addEventListener('submit', function (event) {
      event.preventDefault();

      kirimLaporan();
    });
  }
}

/* ============================================================
   43. MODE GLOBAL
   ============================================================ */

/*
   Halaman Input Laporan tidak membuat
   isOfficerMode sendiri.

   Dashboard sudah mempunyai state global:

       isOfficerMode

   dan event:

       modeChanged

   Kita hanya mendengarkan event tersebut
   jika halaman membutuhkan perubahan UI.
*/
document.addEventListener('modeChanged', function (event) {
  const officer = Boolean(event.detail && event.detail.isOfficerMode);

  /*
       Saat halaman ini digunakan,
       input laporan seharusnya digunakan
       dalam Mode Petugas.

       Untuk sekarang kita tidak mengubah
       state global di sini.

       Hanya logging untuk debugging.
    */
  console.log(
    '[InputLaporan] Mode berubah:',
    officer ? 'Petugas' : 'Pengunjung',
  );
});

/* ============================================================
   44. PUBLIC API INPUT LAPORAN
   ============================================================ */

window.InputLaporanComponent = {
  /*
     Buka halaman pilihan input.
  */
  showSelection: function () {
    showInputView('selection');
  },

  /*
     Pilih WhatsApp.
  */
  pilihWhatsApp: function () {
    pilihInputWhatsApp();
  },

  /*
     Pilih Manual.
  */
  pilihManual: function () {
    pilihInputManual();
  },

  /*
     Proses WhatsApp.
  */
  prosesWhatsApp: function () {
    prosesLaporanWhatsApp();
  },

  /*
     Kirim laporan.
  */
  kirim: function () {
    kirimLaporan();
  },

  /*
     Ambil data form.
  */
  getData: function () {
    return ambilDataForm();
  },

  /*
     Reset form.
  */
  reset: function () {
    resetFormLaporan();
  },
};

/* ============================================================
   45. INITIALIZATION
   ============================================================ */

/*
   Nama function sengaja dibuat:
       initializeInputLaporan()

   BUKAN initializeApplication()

   karena initializeApplication()
   merupakan pusat initialization pada dashboard.

   Dengan demikian halaman ini tidak mengambil
   alih initialization global aplikasi.
*/
function initializeInputLaporan() {
  initializeInputLaporanEvents();

  /*
     Default:
     WhatsApp aktif.
  */
  InputLaporanState.inputMethod = 'whatsapp';

  InputLaporanState.parsedFromWhatsApp = false;

  /*
     Active card WhatsApp.
  */
  updateInputMethodActiveState('whatsapp');

  /*
     Default view:
     pilihan card.

     Sesuai HTML:

     View selection adalah halaman awal.
  */
  showInputView('whatsapp');

  /*
     Reset form.
  */
  resetFormLaporan();

  /*
     Jangan tampilkan banner parsing.
  */
  hideBannerSuccessParse();

  /*
     Render icon.
  */
  if (window.lucide) {
    lucide.createIcons();
  }

  console.log('[InputLaporan] Initialization selesai.');
}

/* ============================================================
   46. JALANKAN INITIALIZATION
   ============================================================ */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeInputLaporan);
} else {
  initializeInputLaporan();
}

/* ============================================================
   AKHIR JAVASCRIPT INPUT LAPORAN
   ============================================================ */
