/* ================================================================
   HALAMAN INPUT LAPORAN LAKA LANTAS
   File : halInputLaporan.js

   TANGGUNG JAWAB FILE INI:
   1. Mengatur tampilan halaman input
   2. Input dari WhatsApp
   3. Input manual
   4. Memanggil backend Apps Script
   5. Menerima JSON dari backend
   6. Menampilkan JSON ke form
   7. Mengumpulkan data form menjadi object JSON
   8. Mengirim JSON form ke backend
   9. Mengatur loading / disabled button
   10. Menampilkan pesan berhasil / gagal
   11. Kembali ke halaman Laka Lantas setelah berhasil

   TIDAK DILAKUKAN DI FILE INI:
   - Parsing WhatsApp
   - Regex parser laporan
   - Membuat ID laporan
   - Membuat nomor urut
   - Membuat waktu input
   - Menyimpan langsung ke Google Sheets
   - Mengambil keputusan bisnis/backend

   Semua logic tersebut tetap berada di Apps Script.

   ================================================================ */

/* ================================================================
   1. KONFIGURASI
   ================================================================ */

const INPUT_LAPORAN_CONFIG = {
  /*
     ==============================================================
     MODE TEST

     true:
       Jika google.script.run belum tersedia, gunakan JSON dummy.

     false:
       Gunakan Apps Script asli.

     Setelah backend siap, ubah menjadi:

       USE_DUMMY_BACKEND: false
     ==============================================================
  */
  USE_DUMMY_BACKEND: true,

  /*
     ==============================================================
     NAMA FUNCTION BACKEND

     !!! PENTING !!!

     Nama di bawah ini hanya CONTOH.

     Kalau nama function Apps Script berbeda,
     cukup ganti nama di sini.

     Tidak perlu mengubah logic frontend lainnya.
     ==============================================================
  */

  BACKEND_FUNCTION: {
    /*
       RAW WHATSAPP
       ------------------------------
       Tugas backend:
       menerima teks WhatsApp
       lalu mengembalikan JSON hasil parsing.
    */
    PROCESS_WHATSAPP: 'prosesLaporanWhatsApp',

    /*
       PETUGAS
       ------------------------------
       Tugas backend:
       mengambil daftar petugas dari database.
    */
    GET_PETUGAS: 'ambilDaftarPetugas',

    /*
       SIMPAN LAPORAN
       ------------------------------
       Tugas backend:
       menerima JSON laporan
       lalu menyimpan ke database / Sheets.
    */
    SAVE_REPORT: 'simpanLaporan',
  },

  /*
     Halaman tujuan setelah laporan berhasil disimpan.
  */
  LAKA_LANTAS_PAGE: 'laka-lantas.html',
};

/* ================================================================
   2. ELEMENT HALAMAN
   ================================================================ */

const InputLaporanElements = {
  /* --------------------------------------------------------------
     View / Navigasi
     -------------------------------------------------------------- */

  selectionCards: document.getElementById('view-selection-cards'),
  viewInputWA: document.getElementById('view-input-wa'),
  viewFormReview: document.getElementById('view-form-review'),

  cardSelectWA: document.getElementById('card-select-wa'),
  cardSelectManual: document.getElementById('card-select-manual'),

  btnBackPrevious: document.getElementById('btn-back-previous'),

  pageTitle: document.getElementById('page-title'),
  pageSubtitle: document.getElementById('page-subtitle'),

  /* --------------------------------------------------------------
     WhatsApp
     -------------------------------------------------------------- */

  textareaRawWA: document.getElementById('textarea-raw-wa'),
  btnProsesLaporan: document.getElementById('btn-proses-laporan'),
  alertWarningPaste: document.getElementById('alert-warning-paste'),
  bannerSuccessParse: document.getElementById('banner-success-parse'),

  /* --------------------------------------------------------------
     Form utama
     -------------------------------------------------------------- */

  formLaporanUtama: document.getElementById('form-laporan-utama'),

  inputIdLaporan: document.getElementById('input-id-laporan'),
  inputNoUrut: document.getElementById('input-no-urut'),
  inputWaktuInput: document.getElementById('input-waktu-input'),

  inputTKP: document.getElementById('input-tkp'),
  inputTanggalKejadian: document.getElementById('input-tanggal-kejadian'),
  selectHariKejadian: document.getElementById('select-hari-kejadian'),
  inputJamKejadian: document.getElementById('input-jam-kejadian'),

  textareaKronologi: document.getElementById('textarea-kronologi-final'),

  inputKorbanLR: document.getElementById('input-korban-lr'),
  inputKorbanLB: document.getElementById('input-korban-lb'),
  inputKorbanMD: document.getElementById('input-korban-md'),

  inputKermat: document.getElementById('input-kermat-rupiah'),

  selectStatus: document.getElementById('select-status-penanganan'),

  /* --------------------------------------------------------------
     Container dynamic
     -------------------------------------------------------------- */

  containerKendaraan: document.getElementById('container-list-kendaraan'),

  containerPengendara: document.getElementById('container-list-pengendara'),

  containerSaksi: document.getElementById('container-list-saksi'),

  containerPetugas: document.getElementById('container-tags-petugas'),

  /* --------------------------------------------------------------
     Tombol dynamic
     -------------------------------------------------------------- */

  btnAddKendaraan: document.getElementById('btn-add-kendaraan'),

  btnAddPengendara: document.getElementById('btn-add-pengendara'),

  btnAddSaksi: document.getElementById('btn-add-saksi'),

  btnAddPetugas: document.getElementById('btn-add-petugas'),

  /* --------------------------------------------------------------
     Tombol akhir
     -------------------------------------------------------------- */

  btnKirimLaporan: document.getElementById('btn-kirim-laporan'),

  btnBatalForm: document.getElementById('btn-batal-form'),
};

/* ================================================================
   3. STATE FRONTEND
   ================================================================ */

/*
   State ini hanya milik halaman Input Laporan.

   Tidak membuat:
   - isOfficerMode
   - activeMenuId
   - state dashboard

   Mode Petugas/Pengunjung tetap menjadi tanggung jawab
   aplikasi global/dashboard.
*/

const InputLaporanState = {
  currentView: 'wa',

  /*
     Menyimpan JSON terakhir yang diterima
     dari backend.

     Berguna untuk debugging dan pengembangan.
  */
  lastBackendResponse: null,

  /*
     Menyimpan data petugas.
  */
  daftarPetugas: [],

  /*
     Data sementara hasil form.
  */
  currentReportData: null,
};

/* ================================================================
   4. HELPER DOM
   ================================================================ */

function getElement(id) {
  return document.getElementById(id);
}

function setElementValue(element, value) {
  if (!element) {
    return;
  }

  if (value === null || value === undefined) {
    element.value = '';
    return;
  }

  element.value = value;
}

function getElementValue(element) {
  if (!element) {
    return '';
  }

  return element.value.trim();
}

/* ================================================================
   5. TAMPILAN VIEW
   ================================================================ */

/*
   Menampilkan satu view dan menyembunyikan view lainnya.
*/

function showInputView(viewName) {
  const { selectionCards, viewInputWA, viewFormReview, btnBackPrevious } =
    InputLaporanElements;

  /*
     Semua view disembunyikan dahulu.
  */

  if (selectionCards) {
    selectionCards.classList.add('hidden');
  }

  if (viewInputWA) {
    viewInputWA.classList.add('hidden');
  }

  if (viewFormReview) {
    viewFormReview.classList.add('hidden');
  }

  /*
     Tampilkan view yang dipilih.
  */

  if (viewName === 'selection') {
    if (selectionCards) {
      selectionCards.classList.remove('hidden');
    }

    InputLaporanState.currentView = 'selection';

    updatePageHeader('INPUT LAPORAN LAKA LANTAS', 'Pilih cara input laporan');

    if (btnBackPrevious) {
      btnBackPrevious.classList.add('hidden');
    }

    return;
  }

  if (viewName === 'wa') {
    if (viewInputWA) {
      viewInputWA.classList.remove('hidden');
    }

    InputLaporanState.currentView = 'wa';

    updatePageHeader(
      'INPUT LAPORAN LAKA LANTAS',
      'Tempel laporan WhatsApp untuk diproses',
    );

    if (btnBackPrevious) {
      btnBackPrevious.classList.remove('hidden');
    }

    return;
  }

  if (viewName === 'form') {
    if (viewFormReview) {
      viewFormReview.classList.remove('hidden');
    }

    InputLaporanState.currentView = 'form';

    updatePageHeader(
      'REVIEW LAPORAN LAKA LANTAS',
      'Periksa dan koreksi data sebelum dikirim',
    );

    if (btnBackPrevious) {
      btnBackPrevious.classList.remove('hidden');
    }
  }
}

function updatePageHeader(title, subtitle) {
  const { pageTitle, pageSubtitle } = InputLaporanElements;

  if (pageTitle) {
    pageTitle.textContent = title;
  }

  if (pageSubtitle) {
    pageSubtitle.textContent = subtitle;
  }
}

/* ================================================================
   6. DEFAULT HALAMAN
   ================================================================ */

/*
   Sesuai kesepakatan:

   Saat halaman dibuka:
   - Input WhatsApp menjadi default.
   - User tetap bisa memilih Input Manual.
*/

function initializeInputView() {
  showInputView('wa');

  /*
     Pastikan banner hasil parsing tidak muncul
     sebelum proses dilakukan.
  */

  if (InputLaporanElements.bannerSuccessParse) {
    InputLaporanElements.bannerSuccessParse.classList.add('hidden');
  }
}

/* ================================================================
   7. BUTTON STATE
   ================================================================ */

/*
   Digunakan untuk mencegah double click.

   Contoh:

   PROSES LAPORAN
       ↓
   Laporan sedang diproses...
       ↓
   selesai
       ↓
   tombol aktif kembali
*/

function setButtonLoading(button, isLoading, loadingText, normalText) {
  if (!button) {
    return;
  }

  button.disabled = isLoading;

  if (isLoading) {
    button.dataset.originalText = button.textContent.trim();

    button.textContent = loadingText;

    button.classList.add('opacity-60', 'cursor-not-allowed');
  } else {
    button.textContent = normalText || button.dataset.originalText || '';

    button.classList.remove('opacity-60', 'cursor-not-allowed');
  }
}

/* ================================================================
   8. ALERT / PESAN
   ================================================================ */

function showAlertMessage(message, type = 'warning') {
  /*
     Menggunakan alert sederhana dahulu.

     Nanti kalau komponen alert khusus sudah dibuat,
     function ini cukup diganti tanpa mengubah
     logic utama.
  */

  console[type === 'error' ? 'error' : 'log']('[Input Laporan]', message);

  alert(message);
}

/* ================================================================
   9. PROSES LAPORAN WHATSAPP
   ================================================================ */

function prosesLaporanWhatsApp() {
  const textarea = InputLaporanElements.textareaRawWA;

  const button = InputLaporanElements.btnProsesLaporan;

  if (!textarea) {
    return;
  }

  const rawWhatsApp = textarea.value.trim();

  /*
     Validasi frontend.

     Hanya memastikan user memang memasukkan data.

     BUKAN melakukan parsing.
  */

  if (!rawWhatsApp) {
    showAlertMessage(
      'Silakan tempel seluruh isi laporan WhatsApp terlebih dahulu.',
      'warning',
    );

    textarea.focus();

    return;
  }

  /*
     Kunci tombol.
  */

  setButtonLoading(
    button,
    true,
    '⏳ LAPORAN SEDANG DIPROSES...',
    '⚙ PROSES LAPORAN',
  );

  /*
     ==============================================================
     BACKEND CALL #1
     ==============================================================

     TUGAS FRONTEND:
       Mengirim raw WhatsApp.

     TUGAS BACKEND:
       Melakukan parser laporan.

     BACKEND DIHARAPKAN MENGEMBALIKAN JSON.

     --------------------------------------------------------------

     Nama function backend saat ini:

       prosesLaporanWhatsApp

     Jika nama function Apps Script berbeda,
     cukup ganti:

       INPUT_LAPORAN_CONFIG.BACKEND_FUNCTION.PROCESS_WHATSAPP

     di bagian paling atas file.

     JANGAN mengubah logic frontend lainnya.
     ==============================================================
  */

  if (INPUT_LAPORAN_CONFIG.USE_DUMMY_BACKEND) {
    /*
       MODE DUMMY

       Digunakan untuk mengetes frontend
       sebelum backend sebenarnya disambungkan.
    */

    jalankanDummyProsesWhatsApp(rawWhatsApp);

    return;
  }

  /*
     ==============================================================
     APPS SCRIPT
     ==============================================================
  */

  if (typeof google === 'undefined' || !google.script || !google.script.run) {
    handleProcessWhatsAppError(
      'google.script.run tidak tersedia. Periksa koneksi Apps Script.',
    );

    return;
  }

  google.script.run

    .withSuccessHandler(handleProcessWhatsAppSuccess)

    .withFailureHandler(handleProcessWhatsAppError)

    [INPUT_LAPORAN_CONFIG.BACKEND_FUNCTION.PROCESS_WHATSAPP](rawWhatsApp);
}

/* ================================================================
   10. RESPONSE PROSES WHATSAPP
   ================================================================ */

function handleProcessWhatsAppSuccess(response) {
  /*
     Simpan response terakhir.
  */

  InputLaporanState.lastBackendResponse = response;

  console.log('[BACKEND → FRONTEND] Hasil proses WhatsApp:', response);

  /*
     Buka kembali tombol.
  */

  setButtonLoading(
    InputLaporanElements.btnProsesLaporan,
    false,
    '',
    '⚙ PROSES LAPORAN',
  );

  /*
     Validasi response.
  */

  if (!response) {
    showAlertMessage('Backend tidak mengembalikan data.', 'error');

    return;
  }

  /*
     Jika backend mengembalikan:

       {
         success: false,
         message: "..."
       }

     maka tampilkan pesan.
  */

  if (response.success === false) {
    showAlertMessage(response.message || 'Laporan gagal diproses.', 'error');

    return;
  }

  /*
     Ambil bagian data.

     Backend idealnya:

       {
         success: true,
         data: {...}
       }

     Tetapi dibuat fleksibel agar saat testing
     kita juga bisa mengembalikan object langsung.
  */

  const data = response.data !== undefined ? response.data : response;

  /*
     Masukkan JSON ke form.
  */

  isiFormDariJSON(data);

  /*
     Tampilkan form review.
  */

  showInputView('form');

  /*
     Tampilkan banner sukses.
  */

  if (InputLaporanElements.bannerSuccessParse) {
    InputLaporanElements.bannerSuccessParse.classList.remove('hidden');
  }

  /*
     Setelah JSON masuk, ambil daftar petugas.

     Ini dipisahkan dari parser.
  */

  ambilDaftarPetugas();
}

/* ================================================================
   11. ERROR PROSES WHATSAPP
   ================================================================ */

function handleProcessWhatsAppError(error) {
  console.error('[BACKEND ERROR] Proses WhatsApp:', error);

  setButtonLoading(
    InputLaporanElements.btnProsesLaporan,
    false,
    '',
    '⚙ PROSES LAPORAN',
  );

  let message = 'Terjadi kesalahan saat memproses laporan.';

  if (typeof error === 'string') {
    message = error;
  }

  if (error && error.message) {
    message = error.message;
  }

  showAlertMessage(message, 'error');
}

/* ================================================================
   12. ISI FORM DARI JSON
   ================================================================ */

/*
   FUNCTION PENTING.

   Tugasnya hanya:

       JSON
        ↓
       HTML FORM

   Tidak melakukan parsing.
*/

function isiFormDariJSON(data) {
  if (!data || typeof data !== 'object') {
    console.warn('Data JSON tidak valid:', data);

    return;
  }

  console.log('[JSON → FORM]', data);

  /*
     --------------------------------------------------------------
     A. INFORMASI LAPORAN
     --------------------------------------------------------------
  */

  setElementValue(
    InputLaporanElements.inputIdLaporan,
    ambilNilai(data, ['idLaporan', 'id_laporan', 'id']),
  );

  setElementValue(
    InputLaporanElements.inputNoUrut,
    ambilNilai(data, ['noUrut', 'no_urut', 'nomorUrut']),
  );

  setElementValue(
    InputLaporanElements.inputWaktuInput,
    ambilNilai(data, ['waktuInput', 'waktu_input']),
  );

  /*
     --------------------------------------------------------------
     B. WAKTU & TKP
     --------------------------------------------------------------
  */

  setElementValue(
    InputLaporanElements.inputTKP,
    ambilNilai(data, ['tkp', 'TKP']),
  );

  setElementValue(
    InputLaporanElements.inputTanggalKejadian,
    ambilNilai(data, ['tanggalKejadian', 'tanggal_kejadian', 'tanggal']),
  );

  setElementValue(
    InputLaporanElements.selectHariKejadian,
    ambilNilai(data, ['hariKejadian', 'hari_kejadian', 'hari']),
  );

  setElementValue(
    InputLaporanElements.inputJamKejadian,
    ambilNilai(data, ['jamKejadian', 'jam_kejadian', 'jam']),
  );

  /*
     --------------------------------------------------------------
     C. KENDARAAN
     --------------------------------------------------------------
  */

  renderListKendaraan(
    ambilArray(data, ['kendaraan', 'kendaraanTerlibat', 'kendaraan_terlibat']),
  );

  /*
     --------------------------------------------------------------
     D. PENGENDARA
     --------------------------------------------------------------
  */

  renderListPengendara(
    ambilArray(data, ['pengendara', 'dataPengendara', 'data_pengendara']),
  );

  /*
     --------------------------------------------------------------
     E. SAKSI
     --------------------------------------------------------------
  */

  renderListSaksi(ambilArray(data, ['saksi', 'saksiSaksi', 'saksi_saksi']));

  /*
     --------------------------------------------------------------
     F. KRONOLOGI
     --------------------------------------------------------------
  */

  setElementValue(
    InputLaporanElements.textareaKronologi,
    ambilNilai(data, ['kronologi', 'kronologiKejadian', 'kronologi_kejadian']),
  );

  /*
     --------------------------------------------------------------
     G. KORBAN
     --------------------------------------------------------------
  */

  const korban = data.korban || {};

  setElementValue(
    InputLaporanElements.inputKorbanLR,
    ambilNilai(
      data,
      ['korbanLR', 'korbanLr', 'lr'],
      ambilNilai(korban, ['lr', 'LR', 'lukaRingan']),
    ),
  );

  setElementValue(
    InputLaporanElements.inputKorbanLB,
    ambilNilai(
      data,
      ['korbanLB', 'korbanLb', 'lb'],
      ambilNilai(korban, ['lb', 'LB', 'lukaBerat']),
    ),
  );

  setElementValue(
    InputLaporanElements.inputKorbanMD,
    ambilNilai(
      data,
      ['korbanMD', 'korbanMd', 'md'],
      ambilNilai(korban, ['md', 'MD', 'meninggal']),
    ),
  );

  /*
     --------------------------------------------------------------
     H. KERMAT
     --------------------------------------------------------------
  */

  setElementValue(
    InputLaporanElements.inputKermat,
    ambilNilai(data, ['kermat', 'kerugianMaterial', 'kerugian_material']),
  );

  /*
     --------------------------------------------------------------
     I. PETUGAS
     --------------------------------------------------------------
  */

  const petugas = ambilArray(data, [
    'petugas',
    'petugasMenangani',
    'petugas_menangani',
  ]);

  if (petugas.length > 0) {
    renderPetugasTerpilih(petugas);
  }

  /*
     --------------------------------------------------------------
     J. STATUS
     --------------------------------------------------------------
  */

  const status = ambilNilai(data, [
    'statusPenanganan',
    'status_penanganan',
    'status',
  ]);

  if (status) {
    setStatusPenanganan(status);
  }

  /*
     Simpan data terakhir.
  */

  InputLaporanState.currentReportData = data;
}

/* ================================================================
   13. HELPER MENGAMBIL NILAI JSON
   ================================================================ */

function ambilNilai(object, keys, defaultValue = '') {
  if (!object || typeof object !== 'object') {
    return defaultValue;
  }

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];

      if (value !== null && value !== undefined) {
        return value;
      }
    }
  }

  return defaultValue;
}

function ambilArray(object, keys) {
  const value = ambilNilai(object, keys, []);

  if (Array.isArray(value)) {
    return value;
  }

  /*
     Jika backend mengembalikan satu string,
     kita tetap jadikan array satu item.
  */

  if (typeof value === 'string' && value.trim()) {
    return [value];
  }

  return [];
}

/* ================================================================
   14. RENDER KENDARAAN
   ================================================================ */

function renderListKendaraan(data = []) {
  const container = InputLaporanElements.containerKendaraan;

  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (!Array.isArray(data) || data.length === 0) {
    tambahBarisKendaraan('');

    return;
  }

  data.forEach(function (item) {
    tambahBarisKendaraan(normalisasiItemDynamic(item));
  });
}

function tambahBarisKendaraan(value = '') {
  const container = InputLaporanElements.containerKendaraan;

  if (!container) {
    return;
  }

  const wrapper = document.createElement('div');

  wrapper.className = 'flex gap-2 items-start';

  const textarea = document.createElement('textarea');

  textarea.rows = 2;

  textarea.className = 'flex-1 text-xs p-2 border border-slate-300 rounded';

  textarea.placeholder = 'Data kendaraan...';

  textarea.dataset.field = 'kendaraan';

  textarea.value = value;

  const button = document.createElement('button');

  button.type = 'button';

  button.textContent = '✕';

  button.className =
    'shrink-0 px-3 py-2 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50';

  button.addEventListener('click', function () {
    wrapper.remove();
  });

  wrapper.appendChild(textarea);
  wrapper.appendChild(button);

  container.appendChild(wrapper);
}

/* ================================================================
   15. RENDER PENGENDARA
   ================================================================ */

function renderListPengendara(data = []) {
  const container = InputLaporanElements.containerPengendara;

  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (!Array.isArray(data) || data.length === 0) {
    tambahBarisPengendara('');

    return;
  }

  data.forEach(function (item) {
    tambahBarisPengendara(normalisasiItemDynamic(item));
  });
}

function tambahBarisPengendara(value = '') {
  const container = InputLaporanElements.containerPengendara;

  if (!container) {
    return;
  }

  const wrapper = document.createElement('div');

  wrapper.className = 'flex gap-2 items-start';

  const textarea = document.createElement('textarea');

  textarea.rows = 3;

  textarea.className = 'flex-1 text-xs p-2 border border-slate-300 rounded';

  textarea.placeholder = 'Identitas pengendara...';

  textarea.dataset.field = 'pengendara';

  textarea.value = value;

  const button = document.createElement('button');

  button.type = 'button';

  button.textContent = '✕';

  button.className =
    'shrink-0 px-3 py-2 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50';

  button.addEventListener('click', function () {
    wrapper.remove();
  });

  wrapper.appendChild(textarea);
  wrapper.appendChild(button);

  container.appendChild(wrapper);
}

/* ================================================================
   16. RENDER SAKSI
   ================================================================ */

function renderListSaksi(data = []) {
  const container = InputLaporanElements.containerSaksi;

  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (!Array.isArray(data) || data.length === 0) {
    tambahBarisSaksi('');

    return;
  }

  data.forEach(function (item) {
    tambahBarisSaksi(normalisasiItemDynamic(item));
  });
}

function tambahBarisSaksi(value = '') {
  const container = InputLaporanElements.containerSaksi;

  if (!container) {
    return;
  }

  const wrapper = document.createElement('div');

  wrapper.className = 'flex gap-2 items-start';

  const textarea = document.createElement('textarea');

  textarea.rows = 3;

  textarea.className = 'flex-1 text-xs p-2 border border-slate-300 rounded';

  textarea.placeholder = 'Identitas saksi...';

  textarea.dataset.field = 'saksi';

  textarea.value = value;

  const button = document.createElement('button');

  button.type = 'button';

  button.textContent = '✕';

  button.className =
    'shrink-0 px-3 py-2 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50';

  button.addEventListener('click', function () {
    wrapper.remove();
  });

  wrapper.appendChild(textarea);
  wrapper.appendChild(button);

  container.appendChild(wrapper);
}

/* ================================================================
   17. NORMALISASI DATA ARRAY
   ================================================================ */

/*
   Untuk sementara kita fleksibel.

   Backend bisa mengembalikan:

   [
      "Aipda Budi..."
   ]

   atau:

   [
      {
        nama: "Aipda Budi",
        alamat: "..."
      }
   ]

   Untuk tahap frontend sekarang,
   object akan ditampilkan sebagai JSON yang mudah dibaca.

   Nanti kalau struktur field dynamic sudah final,
   bagian ini bisa dibuat lebih spesifik.
*/

function normalisasiItemDynamic(item) {
  if (item === null || item === undefined) {
    return '';
  }

  if (typeof item === 'string') {
    return item;
  }

  if (typeof item === 'number') {
    return String(item);
  }

  if (typeof item === 'object') {
    /*
       Jika object mempunyai field "text",
       "value", atau "nama", gunakan itu.
    */

    if (item.text !== undefined) {
      return String(item.text);
    }

    if (item.value !== undefined) {
      return String(item.value);
    }

    if (item.nama !== undefined) {
      const nama = String(item.nama);

      /*
         Jika ada alamat/keterangan,
         gabungkan tanpa menghilangkan data.
      */

      const tambahan = [];

      if (item.alamat) {
        tambahan.push(String(item.alamat));
      }

      if (item.keterangan) {
        tambahan.push(String(item.keterangan));
      }

      if (tambahan.length > 0) {
        return nama + '\n' + tambahan.join('\n');
      }

      return nama;
    }

    /*
       Fallback:
       jangan buang data.
    */

    return JSON.stringify(item, null, 2);
  }

  return String(item);
}

/* ================================================================
   18. TAMBAH DATA MANUAL
   ================================================================ */

function tambahKendaraanManual() {
  tambahBarisKendaraan('');
}

function tambahPengendaraManual() {
  tambahBarisPengendara('');
}

function tambahSaksiManual() {
  tambahBarisSaksi('');
}

/* ================================================================
   19. AMBIL DATA DYNAMIC ARRAY
   ================================================================ */

function ambilDataDynamic(container) {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll('textarea[data-field], input[data-field]'),
  )
    .map(function (element) {
      return element.value.trim();
    })
    .filter(function (value) {
      return value !== '';
    });
}

/* ================================================================
   20. PETUGAS
   ================================================================ */

/*
   Backend nantinya mengembalikan daftar petugas.

   Contoh:

   {
     success: true,
     data: [
       {
         id: "P001",
         nama: "Aipda Budi",
         pangkat: "Aipda"
       }
     ]
   }
*/

function ambilDaftarPetugas() {
  /*
     ==============================================================
     BACKEND CALL #2
     ==============================================================

     Nama function contoh:

       ambilDaftarPetugas

     Jika nama function Apps Script berbeda,
     cukup ubah:

       INPUT_LAPORAN_CONFIG.BACKEND_FUNCTION.GET_PETUGAS

     Tidak perlu mengubah logic lain.
     ==============================================================
  */

  if (INPUT_LAPORAN_CONFIG.USE_DUMMY_BACKEND) {
    jalankanDummyDaftarPetugas();

    return;
  }

  if (typeof google === 'undefined' || !google.script || !google.script.run) {
    console.error('google.script.run tidak tersedia.');

    return;
  }

  google.script.run

    .withSuccessHandler(handleDaftarPetugasSuccess)

    .withFailureHandler(handleDaftarPetugasError)

    [INPUT_LAPORAN_CONFIG.BACKEND_FUNCTION.GET_PETUGAS]();
}

/* ================================================================
   21. RESPONSE PETUGAS
   ================================================================ */

function handleDaftarPetugasSuccess(response) {
  console.log('[BACKEND → FRONTEND] Daftar petugas:', response);

  if (!response) {
    return;
  }

  if (response.success === false) {
    console.error(response.message || 'Gagal mengambil daftar petugas.');

    return;
  }

  const data = Array.isArray(response)
    ? response
    : Array.isArray(response.data)
      ? response.data
      : [];

  InputLaporanState.daftarPetugas = data;

  renderDaftarPetugas(data);
}

function handleDaftarPetugasError(error) {
  console.error('[BACKEND ERROR] Daftar petugas:', error);
}

/* ================================================================
   22. RENDER DAFTAR PETUGAS
   ================================================================ */

function renderDaftarPetugas(data = []) {
  const container = InputLaporanElements.containerPetugas;

  if (!container) {
    return;
  }

  /*
     Jangan menghapus chip petugas yang sudah dipilih
     jika belum ada data baru.
  */

  if (!Array.isArray(data) || data.length === 0) {
    return;
  }

  /*
     Tombol "+ Tambah Petugas"
     akan membuka pilihan sederhana.
  */

  InputLaporanState.daftarPetugas = data;
}

/* ================================================================
   23. TAMBAH PETUGAS TERPILIH
   ================================================================ */

function renderPetugasTerpilih(data = []) {
  const container = InputLaporanElements.containerPetugas;

  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (!Array.isArray(data)) {
    return;
  }

  data.forEach(function (item) {
    const value = normalisasiItemDynamic(item);

    tambahChipPetugas(value, item);
  });
}

function tambahChipPetugas(nama, originalData = null) {
  const container = InputLaporanElements.containerPetugas;

  if (!container) {
    return;
  }

  const chip = document.createElement('span');

  chip.className =
    'inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-[10px]';

  chip.dataset.field = 'petugas';

  /*
     Jika object mempunyai ID,
     simpan ID tersebut sebagai data attribute.
  */

  if (originalData && typeof originalData === 'object' && originalData.id) {
    chip.dataset.petugasId = originalData.id;
  }

  const text = document.createElement('span');

  text.textContent = nama;

  const removeButton = document.createElement('button');

  removeButton.type = 'button';

  removeButton.textContent = '×';

  removeButton.className = 'font-bold text-red-500';

  removeButton.addEventListener('click', function () {
    chip.remove();
  });

  chip.appendChild(text);
  chip.appendChild(removeButton);

  container.appendChild(chip);
}

/* ================================================================
   24. PILIH / TAMBAH PETUGAS
   ================================================================ */

function bukaPilihanPetugas() {
  const daftar = InputLaporanState.daftarPetugas;

  if (!Array.isArray(daftar) || daftar.length === 0) {
    showAlertMessage('Daftar petugas belum tersedia.', 'warning');

    return;
  }

  /*
     Untuk tahap frontend awal,
     gunakan prompt sederhana.

     Nanti bisa diganti modal/dropdown
     tanpa mengubah backend.
  */

  const daftarText = daftar
    .map(function (item, index) {
      const nama = normalisasiItemDynamic(item);

      return `${index + 1}. ${nama}`;
    })
    .join('\n');

  const pilihan = prompt('Pilih nomor petugas:\n\n' + daftarText);

  if (!pilihan) {
    return;
  }

  const index = Number(pilihan) - 1;

  if (Number.isNaN(index) || !daftar[index]) {
    showAlertMessage('Nomor petugas tidak valid.', 'warning');

    return;
  }

  const petugas = daftar[index];

  /*
     Hindari duplikat berdasarkan ID
     jika backend memberikan ID.
  */

  if (petugas && typeof petugas === 'object' && petugas.id) {
    const sudahAda = InputLaporanElements.containerPetugas.querySelector(
      `[data-petugas-id="${CSS.escape(String(petugas.id))}"]`,
    );

    if (sudahAda) {
      showAlertMessage('Petugas tersebut sudah dipilih.', 'warning');

      return;
    }
  }

  tambahChipPetugas(normalisasiItemDynamic(petugas), petugas);
}

/* ================================================================
   25. AMBIL DATA PETUGAS DARI FORM
   ================================================================ */

function ambilDataPetugasForm() {
  const container = InputLaporanElements.containerPetugas;

  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll('[data-field="petugas"]')).map(
    function (chip) {
      const id = chip.dataset.petugasId || '';

      const textElement = chip.querySelector('span');

      const nama = textElement
        ? textElement.textContent.trim()
        : chip.textContent.replace('×', '').trim();

      return {
        id: id,

        nama: nama,
      };
    },
  );
}

/* ================================================================
   26. STATUS PENANGANAN
   ================================================================ */

function setStatusPenanganan(status) {
  const select = InputLaporanElements.selectStatus;

  if (!select || !status) {
    return;
  }

  /*
     Status dari backend bisa berbeda sedikit
     dengan value HTML.

     Kita mapping hanya untuk tampilan frontend.
  */

  const statusText = String(status).trim().toLowerCase();

  if (statusText === 'dalam penanganan') {
    select.value = 'Dalam Penanganan';

    return;
  }

  if (statusText === 'selesai' || statusText === 'selesai / damai') {
    select.value = 'Selesai / Damai';

    return;
  }

  if (statusText === 'limpah polres' || statusText === 'pelimpahan') {
    select.value = 'Pelimpahan';

    return;
  }

  /*
     Jika tidak dikenal,
     jangan membuat option baru.

     Dropdown tetap menggunakan
     3 status yang sudah ditentukan HTML.
  */

  console.warn('Status backend tidak dikenali:', status);
}

/* ================================================================
   27. AMBIL SEMUA DATA FORM
   ================================================================ */

function ambilDataForm() {
  const data = {
    /*
       ------------------------------------------------------------
       A. INFORMASI LAPORAN
       ------------------------------------------------------------
    */

    idLaporan: getElementValue(InputLaporanElements.inputIdLaporan),

    noUrut: getElementValue(InputLaporanElements.inputNoUrut),

    waktuInput: getElementValue(InputLaporanElements.inputWaktuInput),

    /*
       ------------------------------------------------------------
       B. WAKTU & TEMPAT
       ------------------------------------------------------------
    */

    tkp: getElementValue(InputLaporanElements.inputTKP),

    tanggalKejadian: getElementValue(InputLaporanElements.inputTanggalKejadian),

    hariKejadian: getElementValue(InputLaporanElements.selectHariKejadian),

    jamKejadian: getElementValue(InputLaporanElements.inputJamKejadian),

    /*
       ------------------------------------------------------------
       C. KENDARAAN
       ------------------------------------------------------------
    */

    kendaraan: ambilDataDynamic(InputLaporanElements.containerKendaraan),

    /*
       ------------------------------------------------------------
       D. PENGENDARA
       ------------------------------------------------------------
    */

    pengendara: ambilDataDynamic(InputLaporanElements.containerPengendara),

    /*
       ------------------------------------------------------------
       E. SAKSI
       ------------------------------------------------------------
    */

    saksi: ambilDataDynamic(InputLaporanElements.containerSaksi),

    /*
       ------------------------------------------------------------
       F. KRONOLOGI
       ------------------------------------------------------------
    */

    kronologi: getElementValue(InputLaporanElements.textareaKronologi),

    /*
       ------------------------------------------------------------
       G. KORBAN
       ------------------------------------------------------------
    */

    korbanLR: getElementValue(InputLaporanElements.inputKorbanLR),

    korbanLB: getElementValue(InputLaporanElements.inputKorbanLB),

    korbanMD: getElementValue(InputLaporanElements.inputKorbanMD),

    /*
       ------------------------------------------------------------
       H. KERMAT
       ------------------------------------------------------------
    */

    kermat: getElementValue(InputLaporanElements.inputKermat),

    /*
       ------------------------------------------------------------
       I. PETUGAS
       ------------------------------------------------------------
    */

    petugas: ambilDataPetugasForm(),

    /*
       ------------------------------------------------------------
       J. STATUS
       ------------------------------------------------------------
    */

    statusPenanganan: getElementValue(InputLaporanElements.selectStatus),
  };

  return data;
}

/* ================================================================
   28. VALIDASI FORM
   ================================================================ */

function validasiForm(data) {
  if (!data) {
    return false;
  }

  /*
     Validasi minimum.

     Jangan terlalu banyak validasi di frontend,
     karena aturan bisnis tetap di backend.
  */

  if (!data.tkp) {
    showAlertMessage('TKP belum diisi.', 'warning');

    return false;
  }

  if (!data.tanggalKejadian) {
    showAlertMessage('Tanggal kejadian belum diisi.', 'warning');

    return false;
  }

  if (!data.jamKejadian) {
    showAlertMessage('Jam kejadian belum diisi.', 'warning');

    return false;
  }

  if (!data.statusPenanganan) {
    showAlertMessage('Status penanganan belum dipilih.', 'warning');

    return false;
  }

  return true;
}

/* ================================================================
   29. KIRIM LAPORAN
   ================================================================ */

function kirimLaporan() {
  const data = ambilDataForm();

  console.log('[FORM → JSON]', data);

  /*
     Validasi frontend.
  */

  if (!validasiForm(data)) {
    return;
  }

  /*
     Simpan state.
  */

  InputLaporanState.currentReportData = data;

  /*
     Kunci tombol supaya tidak double submit.
  */

  setButtonLoading(
    InputLaporanElements.btnKirimLaporan,
    true,
    '⏳ SEDANG MENGIRIM LAPORAN...',
    '🚀 KIRIM LAPORAN',
  );

  /*
     ==============================================================
     BACKEND CALL #3
     ==============================================================

     TUGAS FRONTEND:
       Mengirim object JSON laporan.

     TUGAS BACKEND:
       - Validasi akhir
       - Membuat / mempertahankan ID
       - Menentukan nomor urut
       - Menentukan waktu input
       - Menyimpan ke Google Sheets
       - Mengembalikan response JSON

     Nama function contoh:

       simpanLaporan

     Jika nama Apps Script berbeda,
     cukup ubah:

       INPUT_LAPORAN_CONFIG.BACKEND_FUNCTION.SAVE_REPORT

     ==============================================================
  */

  if (INPUT_LAPORAN_CONFIG.USE_DUMMY_BACKEND) {
    jalankanDummySimpanLaporan(data);

    return;
  }

  if (typeof google === 'undefined' || !google.script || !google.script.run) {
    handleSaveReportError('google.script.run tidak tersedia.');

    return;
  }

  google.script.run

    .withSuccessHandler(handleSaveReportSuccess)

    .withFailureHandler(handleSaveReportError)

    [INPUT_LAPORAN_CONFIG.BACKEND_FUNCTION.SAVE_REPORT](data);
}

/* ================================================================
   30. RESPONSE SIMPAN LAPORAN
   ================================================================ */

function handleSaveReportSuccess(response) {
  console.log('[BACKEND → FRONTEND] Hasil simpan:', response);

  setButtonLoading(
    InputLaporanElements.btnKirimLaporan,
    false,
    '',
    '🚀 KIRIM LAPORAN',
  );

  if (!response) {
    showAlertMessage('Backend tidak mengembalikan response.', 'error');

    return;
  }

  if (response.success === false) {
    showAlertMessage(response.message || 'Laporan gagal disimpan.', 'error');

    return;
  }

  /*
     Berhasil.

     Backend boleh mengembalikan:

       {
         success: true,
         message: "...",
         data: {
           idLaporan: "...",
           noUrut: "...",
           waktuInput: "..."
         }
       }
  */

  const result = response.data || {};

  console.log('Laporan berhasil disimpan:', result);

  showAlertMessage(response.message || 'Laporan berhasil disimpan.', 'success');

  /*
     Setelah berhasil:
     kembali ke halaman Laka Lantas.
  */

  setTimeout(function () {
    window.location.href = INPUT_LAPORAN_CONFIG.LAKA_LANTAS_PAGE;
  }, 700);
}

/* ================================================================
   31. ERROR SIMPAN LAPORAN
   ================================================================ */

function handleSaveReportError(error) {
  console.error('[BACKEND ERROR] Simpan laporan:', error);

  setButtonLoading(
    InputLaporanElements.btnKirimLaporan,
    false,
    '',
    '🚀 KIRIM LAPORAN',
  );

  let message = 'Terjadi kesalahan saat menyimpan laporan.';

  if (typeof error === 'string') {
    message = error;
  }

  if (error && error.message) {
    message = error.message;
  }

  showAlertMessage(message, 'error');
}

/* ================================================================
   32. BATAL FORM
   ================================================================ */

function batalForm() {
  const konfirmasi = confirm(
    'Batalkan input laporan ini? Data yang belum dikirim akan hilang.',
  );

  if (!konfirmasi) {
    return;
  }

  resetInputLaporan();

  showInputView('wa');
}

/* ================================================================
   33. RESET FORM
   ================================================================ */

function resetInputLaporan() {
  /*
     Raw WhatsApp
  */

  setElementValue(InputLaporanElements.textareaRawWA, '');

  /*
     Form utama
  */

  if (InputLaporanElements.formLaporanUtama) {
    InputLaporanElements.formLaporanUtama.reset();
  }

  /*
     Dynamic data
  */

  renderListKendaraan([]);
  renderListPengendara([]);
  renderListSaksi([]);

  if (InputLaporanElements.containerPetugas) {
    InputLaporanElements.containerPetugas.innerHTML = '';
  }

  /*
     Default korban.
  */

  setElementValue(InputLaporanElements.inputKorbanLR, '0');

  setElementValue(InputLaporanElements.inputKorbanLB, '0');

  setElementValue(InputLaporanElements.inputKorbanMD, '0');

  /*
     Default status.
  */

  if (InputLaporanElements.selectStatus) {
    InputLaporanElements.selectStatus.value = 'Dalam Penanganan';
  }

  /*
     Hilangkan banner.
  */

  if (InputLaporanElements.bannerSuccessParse) {
    InputLaporanElements.bannerSuccessParse.classList.add('hidden');
  }

  InputLaporanState.lastBackendResponse = null;

  InputLaporanState.currentReportData = null;
}

/* ================================================================
   34. KEMBALI KE VIEW SEBELUMNYA
   ================================================================ */

// function kembaliKeInputWA() {
//   if (InputLaporanState.currentView === 'form') {
//     showInputView('wa');

//     return;
//   }

//   showInputView('wa');
// }

function kembaliKeHalamanSebelumnya() {
  window.history.back();
}
/* ================================================================
   35. MODE DARI DASHBOARD
   ================================================================ */

/*
   PENTING:

   Kita TIDAK membuat:

       let isOfficerMode = ...

   di sini.

   Dashboard sudah mempunyai state tersebut.

   Dashboard mengirim event:

       modeChanged

   Kita hanya mendengarkan jika diperlukan.
*/

document.addEventListener('modeChanged', function (event) {
  const officer = Boolean(event.detail && event.detail.isOfficerMode);

  console.log(
    '[Input Laporan] Mode aplikasi:',
    officer ? 'PETUGAS' : 'PENGUNJUNG',
  );

  /*
       Halaman Input Laporan pada dasarnya
       digunakan Petugas.

       Kita tidak mengubah state global
       di sini.

       Jika nanti perlu proteksi halaman,
       tinggal ditambahkan di sini.
    */
});

/* ================================================================
   36. EVENT LISTENER
   ================================================================ */

function initializeInputLaporanEvents() {
  /*
     --------------------------------------------------------------
     CARD WHATSAPP
     --------------------------------------------------------------
  */

  if (InputLaporanElements.cardSelectWA) {
    InputLaporanElements.cardSelectWA.addEventListener('click', function () {
      showInputView('wa');
    });
  }

  /*
     --------------------------------------------------------------
     CARD MANUAL
     --------------------------------------------------------------
  */

  if (InputLaporanElements.cardSelectManual) {
    InputLaporanElements.cardSelectManual.addEventListener(
      'click',
      function () {
        showInputView('form');

        /*
             Manual input tidak membutuhkan
             parser WhatsApp.

             Petugas langsung mengisi form.
          */

        ambilDaftarPetugas();
      },
    );
  }

  /*
     --------------------------------------------------------------
     PROSES LAPORAN
     --------------------------------------------------------------
  */

  if (InputLaporanElements.btnProsesLaporan) {
    InputLaporanElements.btnProsesLaporan.addEventListener(
      'click',
      prosesLaporanWhatsApp,
    );
  }

  /*
     --------------------------------------------------------------
     KIRIM LAPORAN
     --------------------------------------------------------------
  */

  if (InputLaporanElements.btnKirimLaporan) {
    InputLaporanElements.btnKirimLaporan.addEventListener(
      'click',
      kirimLaporan,
    );
  }

  /*
     --------------------------------------------------------------
     BATAL
     --------------------------------------------------------------
  */

  if (InputLaporanElements.btnBatalForm) {
    InputLaporanElements.btnBatalForm.addEventListener('click', batalForm);
  }

  /*
     --------------------------------------------------------------
     KEMBALI
     --------------------------------------------------------------
  */

  //   if (InputLaporanElements.btnBackPrevious) {
  //     InputLaporanElements.btnBackPrevious.addEventListener(
  //       'click',
  //       kembaliKeInputWA,
  //     );
  //   }

  if (InputLaporanElements.btnBackPrevious) {
    InputLaporanElements.btnBackPrevious.addEventListener(
      'click',
      kembaliKeHalamanSebelumnya,
    );
  }

  /*
     --------------------------------------------------------------
     TAMBAH KENDARAAN
     --------------------------------------------------------------
  */

  if (InputLaporanElements.btnAddKendaraan) {
    InputLaporanElements.btnAddKendaraan.addEventListener(
      'click',
      tambahKendaraanManual,
    );
  }

  /*
     --------------------------------------------------------------
     TAMBAH PENGENDARA
     --------------------------------------------------------------
  */

  if (InputLaporanElements.btnAddPengendara) {
    InputLaporanElements.btnAddPengendara.addEventListener(
      'click',
      tambahPengendaraManual,
    );
  }

  /*
     --------------------------------------------------------------
     TAMBAH SAKSI
     --------------------------------------------------------------
  */

  if (InputLaporanElements.btnAddSaksi) {
    InputLaporanElements.btnAddSaksi.addEventListener(
      'click',
      tambahSaksiManual,
    );
  }

  /*
     --------------------------------------------------------------
     TAMBAH PETUGAS
     --------------------------------------------------------------
  */

  if (InputLaporanElements.btnAddPetugas) {
    InputLaporanElements.btnAddPetugas.addEventListener(
      'click',
      bukaPilihanPetugas,
    );
  }
}

/* ================================================================
   37. DUMMY BACKEND
   ================================================================ */

/*
   ================================================================
   BAGIAN INI HANYA UNTUK TEST FRONTEND.

   Nantinya:

       USE_DUMMY_BACKEND: false

   dan bagian ini tidak digunakan lagi.

   Tujuannya sekarang:
   memastikan:

       klik PROSES
            ↓
       dapat JSON
            ↓
       JSON masuk ke form

   ================================================================
*/

function jalankanDummyProsesWhatsApp(rawWhatsApp) {
  console.log('[DUMMY BACKEND] Raw WhatsApp diterima:', rawWhatsApp);

  /*
     Simulasikan waktu proses backend.
  */

  setTimeout(function () {
    const dummyResponse = {
      success: true,

      message: 'Data dummy berhasil diproses.',

      data: {
        /*
             Data informasi laporan
          */

        idLaporan: 'LAP-DUMMY-20260902-001',

        noUrut: '001',

        waktuInput: '02/09/2026 20:30 WIB',

        /*
             Waktu & TKP
          */

        tkp: 'Jl. Raya Baureno - Bojonegoro, Desa Baureno',

        tanggalKejadian: '02/09/2026',

        hariKejadian: 'Rabu',

        jamKejadian: '18:30',

        /*
             Kendaraan
          */

        kendaraan: [
          'Sepeda motor Honda Beat No. Pol. S 1234 AB',

          'Mobil Toyota Avanza No. Pol. S 5678 CD',
        ],

        /*
             Pengendara
          */

        pengendara: [
          'Aipda Contoh — Pengendara Honda Beat',

          'Budi Santoso — Pengendara Toyota Avanza',
        ],

        /*
             Saksi
          */

        saksi: [
          'Saksi 1: Ahmad — Desa Baureno',

          'Saksi 2: Suyanto — Desa Baureno',
        ],

        /*
             Kronologi
          */

        kronologi:
          'Sepeda motor berjalan dari arah Baureno menuju Bojonegoro. Pada saat di TKP terjadi benturan dengan kendaraan Toyota Avanza.',

        /*
             Korban
          */

        korbanLR: 1,

        korbanLB: 0,

        korbanMD: 0,

        /*
             Kerugian material
          */

        kermat: 'Rp 2.500.000',

        /*
             Petugas
          */

        petugas: [
          {
            id: 'P001',
            nama: 'Aipda Petugas Contoh',
            pangkat: 'Aipda',
          },
        ],

        /*
             Status
          */

        statusPenanganan: 'Dalam Penanganan',
      },
    };

    /*
         Kirim dummy JSON
         ke handler yang sama dengan backend asli.

         INI PENTING.

         Artinya kita menguji logic frontend
         seolah-olah JSON tersebut benar-benar
         berasal dari Apps Script.
      */

    handleProcessWhatsAppSuccess(dummyResponse);
  }, 800);
}

/* ================================================================
   38. DUMMY DAFTAR PETUGAS
   ================================================================ */

function jalankanDummyDaftarPetugas() {
  setTimeout(function () {
    const dummyResponse = {
      success: true,

      data: [
        {
          id: 'P001',
          nama: 'Aipda Petugas Contoh',
          pangkat: 'Aipda',
        },

        {
          id: 'P002',
          nama: 'Bripka Petugas Kedua',
          pangkat: 'Bripka',
        },

        {
          id: 'P003',
          nama: 'Briptu Petugas Ketiga',
          pangkat: 'Briptu',
        },
      ],
    };

    handleDaftarPetugasSuccess(dummyResponse);
  }, 500);
}

/* ================================================================
   39. DUMMY SIMPAN LAPORAN
   ================================================================ */

function jalankanDummySimpanLaporan(data) {
  console.log('[DUMMY BACKEND] Data yang dikirim:', data);

  setTimeout(function () {
    const dummyResponse = {
      success: true,

      message: 'Laporan dummy berhasil disimpan.',

      data: {
        idLaporan: data.idLaporan || 'LAP-DUMMY-20260902-002',

        noUrut: data.noUrut || '002',

        waktuInput: data.waktuInput || '02/09/2026 20:35 WIB',
      },
    };

    handleSaveReportSuccess(dummyResponse);
  }, 800);
}

/* ================================================================
   40. DEBUG HELPER
   ================================================================ */

/*
   Bisa dipanggil dari Console browser:

       debugInputLaporan()

   untuk melihat keadaan frontend.
*/

function debugInputLaporan() {
  const data = ambilDataForm();

  console.log('================================================');

  console.log('DEBUG INPUT LAPORAN');

  console.log('================================================');

  console.log('View:', InputLaporanState.currentView);

  console.log('Last Backend Response:', InputLaporanState.lastBackendResponse);

  console.log('Daftar Petugas:', InputLaporanState.daftarPetugas);

  console.log('Data Form:', data);

  console.log('================================================');

  return data;
}

/* ================================================================
   41. PUBLIC API
   ================================================================ */

/*
   Tidak wajib digunakan oleh halaman lain.

   Hanya disediakan supaya nanti mudah
   melakukan testing / komunikasi jika diperlukan.
*/

window.InputLaporanComponent = {
  prosesWhatsApp: prosesLaporanWhatsApp,

  isiFormDariJSON: isiFormDariJSON,

  ambilDataForm: ambilDataForm,

  kirimLaporan: kirimLaporan,

  reset: resetInputLaporan,

  debug: debugInputLaporan,
};

/* ================================================================
   42. INITIALIZATION
   ================================================================ */

function initializeHalInputLaporan() {
  console.log('================================================');

  console.log('HALAMAN INPUT LAPORAN LAKA LANTAS');

  console.log('Frontend initialized.');

  console.log('Dummy Backend:', INPUT_LAPORAN_CONFIG.USE_DUMMY_BACKEND);

  console.log('================================================');

  /*
     Inisialisasi tampilan.
  */

  initializeInputView();

  /*
     Pasang semua event listener.
  */

  initializeInputLaporanEvents();

  /*
     Siapkan satu baris kosong
     untuk input manual.

     Tidak perlu menunggu backend.
  */

  renderListKendaraan([]);
  renderListPengendara([]);
  renderListSaksi([]);

  /*
     Default status.
  */

  if (InputLaporanElements.selectStatus) {
    InputLaporanElements.selectStatus.value = 'Dalam Penanganan';
  }
}

/* ================================================================
   43. JALANKAN APLIKASI
   ================================================================ */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHalInputLaporan);
} else {
  initializeHalInputLaporan();
}

/* ================================================================
   AKHIR halInputLaporan.js
   ================================================================ */
