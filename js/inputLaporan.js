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
  BACKEND_FUNCTION: {
    PROSES_WHATSAPP: "prosesLaporanWhatsApp",

    AMBIL_PETUGAS: "ambilDaftarPetugas",

    SIMPAN_LAPORAN: "simpanLaporan",
  },

  HALAMAN_LAKA_LANTAS: "halLakaLantas.html",
};

/* ============================================================
   2. ELEMENT HALAMAN
   ============================================================ */

const InputLaporanElements = {
  /* ---------- HEADER ---------- */

  btnBackPrevious: document.getElementById("btn-back-previous"),

  pageTitle: document.getElementById("page-title"),

  pageSubtitle: document.getElementById("page-subtitle"),

  /* ---------- VIEW ---------- */

  viewSelectionCards: document.getElementById("view-selection-cards"),

  viewInputWA: document.getElementById("view-input-wa"),

  viewFormReview: document.getElementById("view-form-review"),

  /* ---------- PILIHAN INPUT ---------- */

  cardSelectWA: document.getElementById("card-select-wa"),

  cardSelectManual: document.getElementById("card-select-manual"),

  /* ---------- WHATSAPP ---------- */

  textareaRawWA: document.getElementById("textarea-raw-wa"),

  btnProsesLaporan: document.getElementById("btn-proses-laporan"),

  alertWarningPaste: document.getElementById("alert-warning-paste"),

  bannerSuccessParse: document.getElementById("banner-success-parse"),

  /* ---------- FORM ---------- */

  formLaporanUtama: document.getElementById("form-laporan-utama"),

  inputIdLaporan: document.getElementById("input-id-laporan"),

  inputNomorLP: document.getElementById("input-no-lp"),

  inputWaktuInput: document.getElementById("input-waktu-input"),

  inputTKP: document.getElementById("input-tkp"),

  inputTanggalKejadian: document.getElementById("input-tanggal-kejadian"),

  selectHariKejadian: document.getElementById("select-hari-kejadian"),

  inputJamKejadian: document.getElementById("input-jam-kejadian"),

  textareaKronologiFinal: document.getElementById("textarea-kronologi-final"),

  inputKorbanLR: document.getElementById("input-korban-lr"),

  inputKorbanLB: document.getElementById("input-korban-lb"),

  inputKorbanMD: document.getElementById("input-korban-md"),

  inputKermatRupiah: document.getElementById("input-kermat-rupiah"),

  selectStatusPenanganan: document.getElementById("select-status-penanganan"),

  /* ---------- DYNAMIC ---------- */

  containerListKendaraan: document.getElementById("container-list-kendaraan"),

  containerListPihakTerlibat: document.getElementById(
    "container-list-pihak-terlibat",
  ),

  containerListSaksi: document.getElementById("container-list-saksi"),

  containerTagsPetugas: document.getElementById("container-tags-petugas"),

  /* ---------- BUTTON ---------- */

  btnAddKendaraan: document.getElementById("btn-add-kendaraan"),

  btnAddSaksi: document.getElementById("btn-add-saksi"),

  btnAddPetugas: document.getElementById("btn-add-petugas"),

  btnKirimLaporan: document.getElementById("btn-kirim-laporan"),

  btnBatalForm: document.getElementById("btn-batal-form"),
};

// =====================================================
// MULAI: AUTO RESIZE TEXTAREA LAPORAN WHATSAPP
// =====================================================

if (InputLaporanElements.textareaRawWA) {
  InputLaporanElements.textareaRawWA.addEventListener("input", function () {
    this.style.height = "auto";

    const tinggiMaksimal = 400;

    this.style.height = Math.min(this.scrollHeight, tinggiMaksimal) + "px";

    this.style.overflowY =
      this.scrollHeight > tinggiMaksimal ? "auto" : "hidden";
  });

  InputLaporanElements.textareaRawWA.addEventListener("paste", function () {
    setTimeout(() => {
      this.style.height = "auto";

      const tinggiMaksimal = 600;

      this.style.height = Math.min(this.scrollHeight, tinggiMaksimal) + "px";

      this.style.overflowY =
        this.scrollHeight > tinggiMaksimal ? "auto" : "hidden";
    }, 0);
  });
}

// =====================================================
// SELESAI: AUTO RESIZE TEXTAREA LAPORAN WHATSAPP
// =====================================================

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
  currentView: "selection",

  /*
     Cara input yang sedang digunakan.

     whatsapp
     manual
  */
  inputMethod: "whatsapp",

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
  // parsedFromWhatsApp: false,
  /*
     Teks WhatsApp asli sebelum diproses parser.

     Disimpan sementara di frontend.
     Akan dikirim ke backend saat laporan disimpan.
  */
  rawLaporan: "",
};

/* ============================================================
   4. HELPER DASAR
   ============================================================ */
function updateWarnaStatus() {
  const select = InputLaporanElements.selectStatusPenanganan;

  if (!select) return;

  select.classList.remove(
    "text-amber-500",
    "text-emerald-700",
    "text-rose-700",
  );

  if (select.value === "Dalam Penanganan") {
    select.classList.add("text-amber-500");
  } else if (select.value === "Selesai / Damai") {
    select.classList.add("text-emerald-700");
  } else if (select.value === "Pelimpahan") {
    select.classList.add("text-rose-700");
  }
  console.log("STATUS:", select.value, "CLASS:", select.className);
}
/*
   Mengambil value secara aman.
*/
function ambilNilai(data, keys, defaultValue = "") {
  if (!data || typeof data !== "object") {
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
  if (value && typeof value === "object") {
    return [value];
  }

  /*
     Jika backend mengirim string,
     jadikan satu item.
  */
  if (typeof value === "string" && value.trim() !== "") {
    return [value];
  }

  return [];
}

/*
   Mengubah nilai menjadi string aman.
*/
function nilaiKeString(value) {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "object") {
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
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
    elements.viewSelectionCards.classList.remove("hidden");
  }

  if (elements.viewInputWA) {
    elements.viewInputWA.classList.add("hidden");
  }

  if (elements.viewFormReview) {
    elements.viewFormReview.classList.add("hidden");
  }

  /*
     Tentukan VIEW yang aktif.
  */
  switch (viewName) {
    case "selection":
      if (elements.viewSelectionCards) {
        elements.viewSelectionCards.classList.remove("hidden");
      }

      InputLaporanState.currentView = "selection";

      updatePageHeader("INPUT LAPORAN LAKA LANTAS", "Pilih cara input laporan");

      /*
         Tombol kembali tidak diperlukan
         pada halaman awal.
      */
      hideBackButton();

      break;

    case "whatsapp":
      if (elements.viewInputWA) {
        elements.viewInputWA.classList.remove("hidden");
      }

      InputLaporanState.currentView = "whatsapp";

      updatePageHeader(
        "INPUT DARI WHATSAPP",
        "Tempel laporan WhatsApp untuk diproses",
      );

      showBackButton();

      break;

    case "form":
      if (elements.viewFormReview) {
        elements.viewFormReview.classList.remove("hidden");
      }

      InputLaporanState.currentView = "form";

      updatePageHeader(
        InputLaporanState.inputMethod === "manual"
          ? "INPUT MANUAL LAPORAN"
          : "REVIEW LAPORAN",
        InputLaporanState.inputMethod === "manual"
          ? "Isi data laporan secara manual"
          : "Periksa dan edit hasil parsing sebelum dikirim",
      );

      showBackButton();

      break;
  }

  /*
     Scroll kembali ke atas ketika pindah view.
  */
  window.scrollTo({
    top: 0,
    behavior: "smooth",
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

  InputLaporanElements.btnBackPrevious.classList.remove("hidden");
}

/*
   Sembunyikan tombol kembali.
*/
function hideBackButton() {
  if (!InputLaporanElements.btnBackPrevious) {
    return;
  }

  InputLaporanElements.btnBackPrevious.classList.add("hidden");
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
  wa.classList.remove("border-blue-600", "bg-blue-50", "shadow-sm");

  wa.classList.add("border-slate-200", "bg-white");

  manual.classList.remove("border-blue-600", "bg-blue-50", "shadow-sm");

  manual.classList.add("border-slate-200", "bg-white");

  /*
     RESET WARNA TEKS
  */
  const waTitle = wa.querySelector("h3");
  const waText = wa.querySelector("p");
  const waIcon = wa.querySelector(".icon-wrapper");

  const manualTitle = manual.querySelector("h3");
  const manualText = manual.querySelector("p");
  const manualIcon = manual.querySelector(".icon-wrapper");

  if (waTitle) {
    waTitle.classList.remove("text-blue-600");
    waTitle.classList.add("text-slate-800");
  }

  if (waText) {
    waText.classList.remove("text-blue-500");
    waText.classList.add("text-slate-500");
  }

  if (waIcon) {
    waIcon.classList.remove("text-blue-600");
    waIcon.classList.add("text-slate-700");
  }

  if (manualTitle) {
    manualTitle.classList.remove("text-blue-600");
    manualTitle.classList.add("text-slate-800");
  }

  if (manualText) {
    manualText.classList.remove("text-blue-500");
    manualText.classList.add("text-slate-500");
  }

  if (manualIcon) {
    manualIcon.classList.remove("text-blue-600");
    manualIcon.classList.add("text-slate-700");
  }

  /*
     AKTIF WHATSAPP
  */
  if (method === "whatsapp") {
    wa.classList.remove("border-slate-200", "bg-white");

    wa.classList.add("border-blue-600", "bg-blue-50", "shadow-sm");

    if (waTitle) {
      waTitle.classList.remove("text-slate-800");
      waTitle.classList.add("text-blue-600");
    }

    if (waText) {
      waText.classList.remove("text-slate-500");
      waText.classList.add("text-blue-500");
    }

    if (waIcon) {
      waIcon.classList.remove("text-slate-700");
      waIcon.classList.add("text-blue-600");
    }
  }

  /*
     AKTIF MANUAL
  */
  if (method === "manual") {
    manual.classList.remove("border-slate-200", "bg-white");

    manual.classList.add("border-blue-600", "bg-blue-50", "shadow-sm");

    if (manualTitle) {
      manualTitle.classList.remove("text-slate-800");

      manualTitle.classList.add("text-blue-600");
    }

    if (manualText) {
      manualText.classList.remove("text-slate-500");

      manualText.classList.add("text-blue-500");
    }

    if (manualIcon) {
      manualIcon.classList.remove("text-slate-700");

      manualIcon.classList.add("text-blue-600");
    }
  }
}

/* ============================================================
   7. PILIH INPUT WHATSAPP
   ============================================================ */

function pilihInputWhatsApp() {
  InputLaporanState.inputMethod = "whatsapp";

  InputLaporanState.parsedFromWhatsApp = false;

  updateInputMethodActiveState("whatsapp");

  /*
     Pastikan halaman WhatsApp benar-benar tampil.
  */
  showInputView("whatsapp");
}

/* ============================================================
   8. PILIH INPUT MANUAL
   ============================================================ */

function pilihInputManual() {
  InputLaporanState.inputMethod = "manual";

  InputLaporanState.parsedFromWhatsApp = false;

  updateInputMethodActiveState("manual");

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
  showInputView("form");
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
  if (currentView === "form") {
    /*
       Jika masuk form dari WhatsApp,
       kembali ke halaman WhatsApp.
    */
    if (InputLaporanState.inputMethod === "whatsapp") {
      showInputView("whatsapp");

      return;
    }

    /*
       Jika form manual,
       kembali ke halaman pilihan input.
    */
    showInputView("selection");

    updateInputMethodActiveState("manual");

    return;
  }

  /*
     Jika sedang di halaman WhatsApp,
     kembali ke pilihan input.
  */
  if (currentView === "whatsapp") {
    showInputView("selection");

    updateInputMethodActiveState("whatsapp");

    return;
  }

  /*
     Jika sudah di selection,
     kembali ke halaman sebelumnya.

     Karena HTML halaman ini berada di
     pages/laka-lantas-input.html,
     history.back() adalah pilihan paling aman.
  */
  if (currentView === "selection") {
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

// =====================================================
// MULAI: PROSES PARSER LAPORAN WHATSAPP FRONTEND
// =====================================================

function prosesLaporanWhatsApp() {
  const textarea = InputLaporanElements.textareaRawWA;
  const button = InputLaporanElements.btnProsesLaporan;

  if (!textarea) return;

  // const rawText = textarea.value.trim();

  // if (!rawText) {
  //   tampilkanAlert("warning", "Laporan WhatsApp belum diisi.");
  //   textarea.focus();
  //   return;
  // }

  const rawText = textarea.value.trim();

  if (!rawText) {
    tampilkanAlert("warning", "Laporan WhatsApp belum diisi.");
    textarea.focus();
    return;
  }

  // =====================================================
  // MULAI: SIMPAN RAW LAPORAN KE STATE
  // =====================================================

  InputLaporanState.rawLaporan = rawText;

  // =====================================================
  // SELESAI: SIMPAN RAW LAPORAN KE STATE
  // =====================================================

  setButtonLoading(button, true, "⏳ MEMPROSES...");
  sembunyikanAlert();

  try {
    const hasilParser = parseLaporanWA(rawText);

    if (!hasilParser) {
      throw new Error("Laporan WhatsApp tidak dapat diproses.");
    }

    console.log("[DEBUG PARSER WA] Hasil JSON:", hasilParser);

    handleProcessWhatsAppSuccess({
      success: true,
      data: hasilParser,
      message: "Laporan WhatsApp berhasil diproses.",
    });
  } catch (error) {
    console.error("[ERROR PARSER WA]", error);
    handleProcessWhatsAppError(error);
  } finally {
    setButtonLoading(button, false, "⚙ PROSES LAPORAN");
  }
}

// =====================================================
// SELESAI: PROSES PARSER LAPORAN WHATSAPP FRONTEND
// =====================================================
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
      normalized.message || "Laporan tidak berhasil diproses.",
    );

    return;
  }

  const data = normalized.data || {};

  InputLaporanState.currentReport = data;

  InputLaporanState.parsedFromWhatsApp = true;

  /*
     Isi form dari JSON.
  */
  // =====================================================
  // MULAI DEBUG DATA KENDARAAN + PIHAK DARI FORM
  // =====================================================

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
  showInputView("form");

  tampilkanAlert(
    "success",
    normalized.message ||
      "Data laporan berhasil diproses. Periksa kembali sebelum dikirim.",
  );
}

/* ============================================================
   12. RESPONSE ERROR PROSES WHATSAPP
   ============================================================ */

function handleProcessWhatsAppError(error) {
  console.error("[InputLaporan] Proses WhatsApp gagal:", error);

  let message =
    "Laporan gagal diproses. Silakan periksa kembali data yang ditempel.";

  if (typeof error === "string") {
    message = error;
  }

  if (error && typeof error === "object" && error.message) {
    message = error.message;
  }

  tampilkanAlert("error", message);
}

/* ============================================================
   13. NORMALISASI RESPONSE BACKEND
   ============================================================ */

function normalisasiResponseBackend(response) {
  /*
     Jika response sudah object.
  */
  if (response && typeof response === "object") {
    return {
      success: response.success !== false,

      message: response.message || "",

      data: response.data !== undefined ? response.data : response,
    };
  }

  /*
     Jika backend mengirim JSON string.
  */
  if (typeof response === "string") {
    try {
      const parsed = JSON.parse(response);

      return normalisasiResponseBackend(parsed);
    } catch (error) {
      return {
        success: false,
        message: "Response backend bukan JSON yang valid.",
        data: null,
      };
    }
  }

  return {
    success: false,
    message: "Response backend kosong atau tidak valid.",
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
  console.log("[DEBUG ISI FORM] Data Edit:", data);

  const elements = InputLaporanElements;

  /*
     --------------------------------------------
     INFORMASI LAPORAN
     --------------------------------------------
  */

  elements.inputIdLaporan.value = ambilNilai(data, [
    "idLaporan",
    "id_laporan",
    "id",
  ]);

  // elements.inputNomorLP.value = ambilNilai(data, [
  //   "nomorLP",
  //   "nomorLp",
  //   "noLP",
  //   "noLp",
  // ]);

  // ==========================================================
  // MULAI: ISI NOMOR LP
  // ==========================================================

  const nomorLP = ambilNilai(
    data,
    ["nomorLP", "nomorLp", "noLP", "noLp"],
    null,
  );

  if (nomorLP !== null && String(nomorLP).trim() !== "") {
    elements.inputNomorLP.value = nomorLP;
  }

  // ==========================================================
  // SELESAI: ISI NOMOR LP
  // ==========================================================

  elements.inputWaktuInput.value = ambilNilai(data, [
    "waktuInput",
    "waktu_input",
    "tanggalInput",
  ]);

  elements.inputTanggalKejadian.value = ubahTanggalKeInputDate(
    ambilNilai(data, ["tanggalKejadian", "tanggal_kejadian", "tanggal"]),
  );

  /*
     --------------------------------------------
     WAKTU & TEMPAT
     --------------------------------------------
  */

  elements.inputTKP.value = ambilNilai(data, ["tkp", "TKP"]);

  setSelectValue(
    elements.selectHariKejadian,
    ambilNilai(data, ["hariKejadian", "hari_kejadian", "hari"]),
  );

  elements.inputJamKejadian.value = ambilNilai(data, [
    "jamKejadian",
    "jam_kejadian",
    "jam",
  ]);

  /*
     --------------------------------------------
     KRONOLOGI
     --------------------------------------------
  */

  elements.textareaKronologiFinal.value = ambilNilai(data, [
    "kronologi",
    "kronologiKejadian",
    "kronologi_kejadian",
  ]);

  /*
     --------------------------------------------
     KORBAN
     --------------------------------------------
  */

  elements.inputKorbanLR.value = ambilNilai(
    data,
    [
      "korbanLR",
      "korbanLr",
      "jumlahLR",
      "jumlahLr",
      "lr",
      "LR",
      "KorbanLR",
      "KorbanLr",
    ],
    0,
  );

  elements.inputKorbanLB.value = ambilNilai(
    data,
    [
      "korbanLB",
      "korbanLb",
      "jumlahLB",
      "jumlahLb",
      "lb",
      "LB",
      "KorbanLB",
      "KorbanLb",
    ],
    0,
  );

  elements.inputKorbanMD.value = ambilNilai(
    data,
    [
      "korbanMD",
      "korbanMd",
      "jumlahMD",
      "jumlahMd",
      "md",
      "MD",
      "KorbanMD",
      "KorbanMd",
    ],
    0,
  );

  /*
     --------------------------------------------
     KERMAT
     --------------------------------------------
  */

  elements.inputKermatRupiah.value = ambilNilai(data, [
    "kermat",
    "kermatRupiah",
    "kerugianMaterial",
    "kerugian_material",
  ]);

  /*
     --------------------------------------------
     STATUS
     --------------------------------------------
  */

  const status = ambilNilai(data, [
    "statusPenanganan",
    "status_penanganan",
    "status",
  ]);

  setStatusPenanganan(status);

  /*
     --------------------------------------------
     KENDARAAN
     --------------------------------------------
  */

  const kendaraan = ambilArray(data, [
    "kendaraan",
    "kendaraanTerlibat",
    "kendaraanYangTerlibat",
  ]);

  renderListKendaraan(kendaraan);

  /*

  --------------------------------------------

  PIHAK TERLIBAT

  --------------------------------------------

  /*
     --------------------------------------------
     SAKSI
     --------------------------------------------
  */

  const saksi = ambilArray(data, ["saksi", "saksiSaksi"]);

  renderListSaksi(saksi);

  /*
     --------------------------------------------
     PETUGAS
     --------------------------------------------
  */

  const petugas = ambilArray(data, ["petugas", "petugasYangMenangani"]);

  InputLaporanState.selectedPetugas = normalizePetugasArray(petugas);

  renderSelectedPetugas();
}

/* ============================================================
   14. ISI CODE BARU
   ============================================================ */
function ubahTanggalKeInputDate(tanggal) {
  if (!tanggal) return "";

  const teks = String(tanggal).trim();

  // Jika sudah YYYY-MM-DD, langsung gunakan
  if (/^\d{4}-\d{2}-\d{2}$/.test(teks)) {
    return teks;
  }

  const bulan = {
    januari: "01",
    februari: "02",
    maret: "03",
    april: "04",
    mei: "05",
    juni: "06",
    juli: "07",
    agustus: "08",
    september: "09",
    oktober: "10",
    november: "11",
    desember: "12",
  };

  // const cocok = teks.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);

  // if (!cocok) return "";

  // Format DD/MM/YYYY
  const cocokTanggalSlash = teks.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (cocokTanggalSlash) {
    const hari = cocokTanggalSlash[1].padStart(2, "0");
    const nomorBulan = cocokTanggalSlash[2].padStart(2, "0");
    const tahun = cocokTanggalSlash[3];

    return `${tahun}-${nomorBulan}-${hari}`;
  }

  const cocok = teks.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);

  if (!cocok) return "";

  const hari = cocok[1].padStart(2, "0");
  const namaBulan = cocok[2].toLowerCase();
  const tahun = cocok[3];

  const nomorBulan = bulan[namaBulan];

  if (!nomorBulan) return "";

  return `${tahun}-${nomorBulan}-${hari}`;
}

/* ============================================================
   15. SET VALUE SELECT
   ============================================================ */

function setSelectValue(selectElement, value) {
  if (!selectElement) {
    return;
  }

  if (value === undefined || value === null || value === "") {
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
    normalized === "selesai" ||
    normalized === "selesai / damai" ||
    normalized === "selesai/damai"
  ) {
    normalized = "Selesai / Damai";
  } else if (normalized === "Limpah Polres" || normalized === "pelimpahan") {
    normalized = "Pelimpahan";
  } else if (normalized === "dalam penanganan") {
    normalized = "Dalam Penanganan";
  }

  // setSelectValue(InputLaporanElements.selectStatusPenanganan, normalized);
  // updateWarnaStatus();

  setSelectValue(InputLaporanElements.selectStatusPenanganan, normalized);
  updateWarnaStatus();
  updateNomorLPBerdasarkanStatus();
}

// =====================================================
// MULAI ATURAN NOMOR LP BERDASARKAN STATUS
// =====================================================

function updateNomorLPBerdasarkanStatus() {
  const status = InputLaporanElements.selectStatusPenanganan?.value;
  const inputNomorLP = InputLaporanElements.inputNomorLP;

  if (!inputNomorLP) return;

  if (status === "Pelimpahan") {
    inputNomorLP.value = "Belum Tersedia";
  } else {
    inputNomorLP.value = "Nihil";
  }
}

// =====================================================
// SELESAI ATURAN NOMOR LP BERDASARKAN STATUS
// =====================================================

/* ============================================================
   17. KENDARAAN
   ============================================================ */

function renderListKendaraan(kendaraanList = []) {
  const container = InputLaporanElements.containerListKendaraan;

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!kendaraanList.length) {
    tambahKendaraan();

    return;
  }

  kendaraanList.forEach(function (item, index) {
    tambahKendaraan(item, index);
  });
}

/* ============================================================
   TAMBAH KENDARAAN
   Backend menyimpan jenis kendaraan dan nopol secara terpisah
   agar relasi pihak terlibat dapat ditentukan berdasarkan nopol.

   Frontend menampilkan keduanya sebagai satu identitas kendaraan.
   Data pengendara/pengemudi/pembonceng tidak ditampilkan di sini.
   ============================================================ */

function tambahKendaraan(data = "", index = null) {
  const container = InputLaporanElements.containerListKendaraan;

  if (!container) {
    return;
  }

  const item = document.createElement("div");

  item.className =
    "dynamic-item-kendaraan border border-slate-200 rounded-xl p-3 bg-slate-50";

  const nomor = index !== null ? index + 1 : container.children.length + 1;

  /*
     Backend tetap menyimpan kendaraan dan nopol
     sebagai field terpisah.
  */
  const kendaraan =
    data && typeof data === "object" ? data.kendaraan || "" : "";

  const nopol = data && typeof data === "object" ? data.nopol || "" : "";

  /*
     Untuk frontend, kendaraan dan nopol
     ditampilkan sebagai satu identitas.
  */
  // let identitasKendaraan = kendaraan;

  // if (nopol) {
  //   identitasKendaraan += ` No. Pol: ${nopol}`;
  // }

  // =====================================================
  // MULAI PERBAIKAN IDENTITAS KENDARAAN
  // =====================================================

  /*
   Parser sudah dapat mengirim nomor polisi
   di dalam teks kendaraan.

   Jika nopol sudah ada di dalam teks kendaraan,
   jangan tambahkan lagi.
*/
  let identitasKendaraan = kendaraan;

  if (
    nopol &&
    !identitasKendaraan.toLowerCase().includes(nopol.toLowerCase())
  ) {
    identitasKendaraan += ` No. Pol: ${nopol}`;
  }

  // =====================================================
  // SELESAI PERBAIKAN IDENTITAS KENDARAAN
  // =====================================================

  item.innerHTML = `
    <!-- HEADER KENDARAAN -->
    <div class="flex items-center justify-between gap-2 mb-2">
      <label class="text-[12px] font-bold text-slate-600">
        KENDARAAN ${nomor}
      </label>

      <button
        type="button"
        data-action="hapus-kendaraan"
        class="text-red-500 text-[12px] font-semibold hover:text-red-700"
      >
        Hapus
      </button>
    </div>

    <!-- IDENTITAS KENDARAAN -->
    <input
      type="text"
      data-field="kendaraan"
      value="${escapeHTML(identitasKendaraan)}"
      placeholder="Identitas kendaraan"
      class="w-full text-sm p-2 border border-slate-300 rounded-lg bg-white"
    />

    <!-- PIHAK TERLIBAT DALAM KENDARAAN INI -->
    <div
      class="mt-3 border-t border-slate-200 pt-3"
    >
      <div class="flex items-center justify-between gap-2 mb-2">
        <label class="text-[12px] font-bold text-slate-600">
          PIHAK TERLIBAT
        </label>

        <button
          type="button"
          data-action="tambah-pihak-kendaraan"
          class="text-blue-600 text-[12px] font-semibold hover:text-blue-800"
        >
          + Tambah Pihak
        </button>
      </div>

      <!--
        Pihak yang berhubungan dengan kendaraan ini
        akan dibuat oleh JavaScript di sini.
      -->
      <div
        data-container="pihak-kendaraan"
        class="space-y-2"
      >
      </div>
    </div>
  `;

  container.appendChild(item);

  const containerPihak = item.querySelector(
    '[data-container="pihak-kendaraan"]',
  );

  if (containerPihak) {
    const daftarPihak = buatDaftarPihakTerlibatDariKendaraan([data]);

    daftarPihak.forEach(function (pihak, index) {
      tambahPihakTerlibat(pihak, index, containerPihak);
    });
  }
}

/* ============================================================
   18. PENGENDARA
   ============================================================ */

function renderListPihakTerlibat(pihakTerlibatList = []) {
  const container = InputLaporanElements.containerListPihakTerlibat;

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!pihakTerlibatList.length) {
    tambahPihakTerlibat();
    return;
  }

  pihakTerlibatList.forEach(function (item, index) {
    tambahPihakTerlibat(item, index);
  });
}

function tambahPihakTerlibat(data = "", index = null, container = null) {
  if (!container) {
    return;
  }

  const item = document.createElement("div");

  item.className =
    "dynamic-item-pihak-terlibat border border-slate-200 rounded-lg p-2 bg-white";

  const nama = ambilNilai(
    data,
    ["nama", "name", "identitas", "keterangan", "data", "uraian", "value"],
    ambilDataItemString(data),
  );

  const jenisPihak = ambilNilai(
    data,
    ["jenisPihak", "jenis_pihak", "jenis"],
    "Pengendara",
  );

  item.innerHTML = `
    <div class="flex items-center justify-between gap-2 mb-1">
      <label class="text-[11px] font-bold text-slate-500">
        PIHAK ${index !== null ? index + 1 : container.children.length + 1}
      </label>

      <button
        type="button"
        data-action="hapus-pihak-kendaraan"
        class="text-red-500 text-[11px] font-semibold hover:text-red-700"
      >
        Hapus
      </button>
    </div>

    <div class="space-y-1.5">

      <select
        data-field="jenisPihak"
        class="w-full text-sm p-2 border border-slate-300 rounded-lg bg-white font-semibold"
      >
        <option
          value="Pengendara"
          ${jenisPihak === "Pengendara" ? "selected" : ""}
        >
          Pengendara
        </option>

        <option
          value="Pengemudi"
          ${jenisPihak === "Pengemudi" ? "selected" : ""}
        >
          Pengemudi
        </option>

        <option
          value="Pembonceng"
          ${jenisPihak === "Pembonceng" ? "selected" : ""}
        >
          Pembonceng
        </option>

        <option
          value="Pengayuh"
          ${jenisPihak === "Pengayuh" ? "selected" : ""}
        >
          Pengayuh
        </option>

        <option
          value="Pejalan Kaki"
          ${jenisPihak === "Pejalan Kaki" ? "selected" : ""}
        >
          Pejalan Kaki
        </option>
      </select>

      <input
        type="text"
        data-field="nama"
        value="${escapeHTML(nama)}"
        placeholder="Nama / identitas pihak"
        class="w-full text-sm p-2 border border-slate-300 rounded-lg bg-white"
      />

    </div>
  `;

  container.appendChild(item);
}

/* ============================================================
   19. SAKSI
   ============================================================ */

function buatDaftarPihakTerlibatDariKendaraan(kendaraanList = []) {
  if (!Array.isArray(kendaraanList)) {
    return [];
  }

  const hasil = [];

  console.log("[CEK PIHAK KENDARAAN]", JSON.stringify(kendaraanList, null, 2));

  kendaraanList.forEach(function (item) {
    if (!item || typeof item !== "object") {
      return;
    }

    const jenisKendaraan = String(item.kendaraan || "").toLowerCase();

    /*
     * SEPEDA MOTOR → PENGENDARA
     */
    if (jenisKendaraan.includes("sepeda motor")) {
      const pengendara = ambilNamaPihakDariKendaraan(item, "Pengendara");

      if (pengendara) {
        hasil.push({
          nama: pengendara,
          jenisPihak: "Pengendara",
        });
      }

      /*
       * SEPEDA MOTOR → PEMBONCENG
       */
      const pembonceng = ambilNamaPihakDariKendaraan(item, "Pembonceng");

      if (pembonceng) {
        hasil.push({
          nama: pembonceng,
          jenisPihak: "Pembonceng",
        });
      }

      return;
    }

    /*
     * SEPEDA PANCAL → PENGAYUH
     */
    if (jenisKendaraan.includes("sepeda pancal")) {
      const pengayuh = ambilNamaPihakDariKendaraan(item, "Pengayuh");

      if (pengayuh) {
        hasil.push({
          nama: pengayuh,
          jenisPihak: "Pengayuh",
        });
      }

      return;
    }

    /*
     * PEJALAN KAKI
     */
    if (jenisKendaraan.includes("pejalan kaki")) {
      const pejalanKaki = ambilNamaPihakDariKendaraan(item, "Pejalan Kaki");

      if (pejalanKaki) {
        hasil.push({
          nama: pejalanKaki,
          jenisPihak: "Pejalan Kaki",
        });
      }

      return;
    }

    /*
     * KENDARAAN LAIN → PENGEMUDI
     */
    const pengemudi = ambilNamaPihakDariKendaraan(item, "Pengemudi");

    if (pengemudi) {
      hasil.push({
        nama: pengemudi,
        jenisPihak: "Pengemudi",
      });
    }
  });

  return hasil;
}

function normalisasiNamaSaksi(value) {
  if (!value) {
    return "";
  }

  let nama = String(value).trim();

  // Hapus awalan "Nama :"
  nama = nama.replace(/^Nama\s*:\s*/i, "");

  // Hapus awalan "Sdr." / "Sdr"
  nama = nama.replace(/^Sdr\.?\s*/i, "");

  // Hapus awalan "An." / "An"
  nama = nama.replace(/^An\.?\s*/i, "");

  return nama.trim();
}

function tambahSaksi(data = "", index = null) {
  const container = InputLaporanElements.containerListSaksi;

  if (!container) {
    return;
  }

  const item = document.createElement("div");

  item.className = "dynamic-item-saksi";

  // const value = ambilDataItemString(data);
  const value = normalisasiNamaSaksi(ambilDataItemString(data));

  item.innerHTML = `
    <div class="flex items-center justify-between gap-2 mb-1">
      <label class="text-[12px] font-semibold text-slate-500">
        SAKSI ${index !== null ? index + 1 : container.children.length + 1}
      </label>

      <button
        type="button"
        data-action="hapus-saksi"
        class="text-red-500 text-[12px] font-semibold hover:text-red-700"
      >
        Hapus
      </button>
    </div>

    <input
      type="text"
      data-field="saksi"
      value="${escapeHTML(value)}"
      placeholder="Nama / identitas saksi"
      class="w-full text-sm p-2 border border-slate-300 rounded bg-white"
    />
  `;

  container.appendChild(item);
}

/* ============================================================
   RENDER DAFTAR SAKSI
   Digunakan saat mengisi form dari data laporan
   ============================================================ */
function renderListSaksi(list = []) {
  const container = InputLaporanElements.containerListSaksi;

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!Array.isArray(list)) {
    return;
  }

  list.forEach(function (item, index) {
    tambahSaksi(item, index);
  });
}

/* ============================================================
   20. NORMALISASI DATA ITEM
   ============================================================ */

function ambilDataItemString(item) {
  if (item === undefined || item === null) {
    return "";
  }

  /*
     Jika backend mengirim string.
  */
  if (typeof item === "string") {
    return item;
  }

  /*
     Jika backend mengirim object,
     cari property umum.
  */
  if (typeof item === "object") {
    return ambilNilai(
      item,
      [
        "nama",
        "name",
        "identitas",
        "keterangan",
        "data",
        "uraian",
        "value",
        "saksi",
      ],
      JSON.stringify(item),
    );
  }

  return String(item);
}

function ambilNamaPihakDariKendaraan(item, jenisPihak) {
  if (!item || typeof item !== "object") {
    return "";
  }

  // =====================================================
  // MULAI - Ambil pihak dari struktur array "pihak"
  // =====================================================
  if (Array.isArray(item.pihak)) {
    const pihakDitemukan = item.pihak.find(function (pihak) {
      return (
        pihak &&
        String(pihak.jenisPihak || "")
          .trim()
          .toLowerCase() ===
          String(jenisPihak || "")
            .trim()
            .toLowerCase()
      );
    });

    if (pihakDitemukan) {
      return String(pihakDitemukan.nama || "").trim();
    }
  }
  // =====================================================
  // SELESAI - Ambil pihak dari struktur array "pihak"
  // =====================================================

  // =====================================================
  // MULAI - Backup struktur lama
  // =====================================================
  if (jenisPihak === "Pengendara") {
    return String(item.pengendara || "").trim();
  }

  if (jenisPihak === "Pembonceng") {
    return String(item.pembonceng || "").trim();
  }

  if (jenisPihak === "Pengayuh") {
    return String(item.pengayuh || "").trim();
  }

  if (jenisPihak === "Pejalan Kaki") {
    return String(
      item.pejalanKaki || item["pejalan kaki"] || item.nama || "",
    ).trim();
  }

  if (jenisPihak === "Pengemudi") {
    return String(item.pengemudi || "").trim();
  }
  // =====================================================
  // SELESAI - Backup struktur lama
  // =====================================================

  return "";
}

/* ============================================================
   21. PETUGAS
   ============================================================ */

/*
   Ambil daftar petugas dari backend.
*/
// =====================================================
// MULAI: AMBIL DAFTAR PETUGAS INPUT LAPORAN VIA API
// =====================================================

async function ambilDaftarPetugas() {
  /*
     Jika sudah tersedia,
     tidak perlu meminta lagi.
  */
  if (InputLaporanState.daftarPetugas.length) {
    renderPetugasSelector();

    return;
  }

  try {
    const response = await apiRequest("AMBIL_PETUGAS_INPUT");

    console.log("[INPUT LAPORAN] Response daftar petugas:", response);

    handleGetPetugasSuccess(response);
  } catch (error) {
    console.error("[INPUT LAPORAN] Gagal mengambil daftar petugas:", error);

    handleGetPetugasError(error);
  }

  /*
     =====================================================
     BACKUP: Apps Script asli
     =====================================================

  if (typeof google === "undefined" || !google.script || !google.script.run) {
    handleGetPetugasError("google.script.run tidak tersedia.");

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

  */
}

// =====================================================
// SELESAI: AMBIL DAFTAR PETUGAS INPUT LAPORAN VIA API
// =====================================================
/*
   Response daftar petugas.
*/
function handleGetPetugasSuccess(response) {
  console.log("[DEBUG PETUGAS] Response API mentah:", response);

  const normalized = normalisasiResponseBackend(response);

  console.log("[DEBUG PETUGAS] Setelah normalisasi response:", normalized);

  if (!normalized.success) {
    handleGetPetugasError(
      normalized.message || "Daftar petugas gagal diambil.",
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
    : ambilArray(data, ["petugas", "daftarPetugas", "dataPetugas"]);

  InputLaporanState.daftarPetugas = normalizePetugasArray(petugasArray);

  // =====================================================
  // MULAI DEBUG: HASIL NORMALISASI DAFTAR PETUGAS
  // =====================================================

  console.log(
    "[INPUT LAPORAN] Jumlah petugas:",
    InputLaporanState.daftarPetugas.length,
  );

  console.log("[INPUT LAPORAN] Data petugas:", InputLaporanState.daftarPetugas);

  // =====================================================
  // SELESAI DEBUG: HASIL NORMALISASI DAFTAR PETUGAS
  // =====================================================

  // renderPetugasSelector();

  renderPetugasSelector();
}

/*
   Error daftar petugas.
*/
function handleGetPetugasError(error) {
  console.error("[InputLaporan] Gagal mengambil petugas:", error);

  /*
     Tidak menghapus form.

     Petugas tetap dapat mengisi data lain.
  */

  tampilkanAlert("warning", "Daftar petugas belum berhasil dimuat.");
}

/* ============================================================
   22. NORMALISASI PETUGAS
   ============================================================ */

function normalizePetugasArray(list = []) {
  if (!Array.isArray(list)) {
    return [];
  }

  return (
    list
      .map(function (item) {
        if (typeof item === "string") {
          return {
            id: item,
            nama: item,
          };
        }

        if (item && typeof item === "object") {
          // =====================================================
          // MULAI: NORMALISASI DATA PETUGAS
          // =====================================================

          return {
            id: ambilNilai(item, [
              "id",
              "idPetugas",
              "id_personil",
              "idPersonil",
            ]),

            nama: ambilNilai(item, [
              "nama",
              "namaPetugas",
              "namaPersonil",
              "name",
            ]),

            pangkat: ambilNilai(item, ["pangkat", "pangkatPetugas"]),
          };

          // =====================================================
          // SELESAI: NORMALISASI DATA PETUGAS
          // =====================================================
        }

        return null;
      })
      // .filter(function (item) {
      //   return item && item.id && item.nama;
      // });
      .filter(function (item) {
        return item && item.nama;
      })
  );
}

/* ============================================================
   23. RENDER SELECTOR PETUGAS
   ============================================================ */

// MULAI PERBAIKAN RENDER SELECTOR PETUGAS
function renderPetugasSelector() {
  const container = InputLaporanElements.containerTagsPetugas;

  if (!container) {
    return;
  }

  let selector = container.parentElement.querySelector(
    '[data-role="petugas-selector"]',
  );

  // =====================================================
  // BUAT SELECTOR JIKA BELUM ADA
  // =====================================================
  if (!selector) {
    selector = document.createElement("select");

    selector.dataset.role = "petugas-selector";

    selector.className =
      "w-full text-sm p-2 border border-slate-300 rounded bg-white mt-2";

    // selector.addEventListener("change", function () {
    //   const id = selector.value;

    //   if (!id) {
    //     return;
    //   }

    //   const petugas = InputLaporanState.daftarPetugas.find(function (item) {
    //     return item.id === id;
    //   });

    //   if (!petugas) {
    //     return;
    //   }

    //   const alreadySelected = InputLaporanState.selectedPetugas.some(
    //     function (item) {
    //       return item.id === id;
    //     },
    //   );

    selector.addEventListener("change", function () {
      const nama = selector.value;

      if (!nama) {
        return;
      }

      const petugas = InputLaporanState.daftarPetugas.find(function (item) {
        return item.nama === nama;
      });

      if (!petugas) {
        return;
      }

      const alreadySelected = InputLaporanState.selectedPetugas.some(
        function (item) {
          return item.nama === nama;
        },
      );

      if (!alreadySelected) {
        InputLaporanState.selectedPetugas.push(petugas);
        renderSelectedPetugas();

        // =====================================================
        // MULAI: SEMBUNYIKAN SELECTOR SETELAH PETUGAS DIPILIH
        // =====================================================

        selector.remove();

        // =====================================================
        // SELESAI: SEMBUNYIKAN SELECTOR SETELAH PETUGAS DIPILIH
        // =====================================================

        return;
      }

      selector.value = "";
    });

    container.parentElement.appendChild(selector);
  }

  // =====================================================
  // PERBARUI ISI OPTION SETIAP KALI DATA PETUGAS BERUBAH
  // =====================================================
  selector.innerHTML = "";

  const defaultOption = document.createElement("option");

  defaultOption.value = "";
  defaultOption.textContent = "-- Pilih Petugas --";

  selector.appendChild(defaultOption);

  InputLaporanState.daftarPetugas.forEach(function (petugas) {
    const option = document.createElement("option");

    // option.value = petugas.id;
    // option.textContent = petugas.nama;

    // =====================================================
    // MULAI: TAMPILKAN PANGKAT + NAMA PETUGAS
    // =====================================================

    option.value = petugas.nama;

    // const pangkat = petugas.pangkat
    //   ? petugas.pangkat.charAt(0).toUpperCase() +
    //     petugas.pangkat.slice(1).toLowerCase()
    //   : "";

    // option.textContent = pangkat ? `${pangkat} ${petugas.nama}` : petugas.nama;

    option.textContent = petugas.pangkat
      ? `${petugas.pangkat} ${petugas.nama}`
      : petugas.nama;

    // =====================================================
    // SELESAI: TAMPILKAN PANGKAT + NAMA PETUGAS
    // =====================================================

    selector.appendChild(option);
  });
}
// SELESAI PERBAIKAN RENDER SELECTOR PETUGAS

/* ============================================================
   24. RENDER CHIP PETUGAS
   ============================================================ */

function renderSelectedPetugas() {
  const container = InputLaporanElements.containerTagsPetugas;

  console.log(
    "[DEBUG PETUGAS] daftarPetugas:",
    InputLaporanState.daftarPetugas,
  );

  console.log(
    "[DEBUG PETUGAS] jumlah:",
    InputLaporanState.daftarPetugas.length,
  );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!InputLaporanState.selectedPetugas.length) {
    const empty = document.createElement("span");

    empty.className = "text-[12px] text-slate-400";

    empty.textContent = "Belum ada petugas dipilih";

    container.appendChild(empty);

    return;
  }

  InputLaporanState.selectedPetugas.forEach(function (petugas) {
    const chip = document.createElement("span");

    chip.className =
      "inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-2 py-1 text-[12px]";

    chip.innerHTML = `
        <span>${escapeHTML(
          petugas.pangkat ? petugas.pangkat + " " + petugas.nama : petugas.nama,
        )}</span>

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

// =====================================================
// MULAI DEBUG AMBIL DATA FORM
// =====================================================

function ambilDataForm() {
  const elements = InputLaporanElements;

  return {
    /*
       Data resmi dari backend.
    */
    idLaporan: elements.inputIdLaporan.value.trim(),
    nomorLP: elements.inputNomorLP.value.trim(),
    waktuInput: elements.inputWaktuInput.value.trim(),

    // =====================================================
    // MULAI: RAW LAPORAN
    // =====================================================

    rawLaporan: InputLaporanState.rawLaporan,

    // =====================================================
    // SELESAI: RAW LAPORAN
    // =====================================================

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
    // kendaraan: ambilListKendaraan(),

    kendaraan: ambilKendaraanDanPihak(),

    // pihakTerlibat: ambilListPihakTerlibat(),

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
      return value !== "";
    });
}

function ambilKendaraanDanPihak() {
  const container = InputLaporanElements.containerListKendaraan;

  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll(".dynamic-item-kendaraan"))
    .map(function (kendaraanItem) {
      const inputKendaraan = kendaraanItem.querySelector(
        '[data-field="kendaraan"]',
      );

      const namaKendaraan = inputKendaraan ? inputKendaraan.value.trim() : "";

      const containerPihak = kendaraanItem.querySelector(
        '[data-container="pihak-kendaraan"]',
      );

      const pihak = containerPihak
        ? Array.from(
            containerPihak.querySelectorAll(".dynamic-item-pihak-terlibat"),
          )
            .map(function (pihakItem) {
              const inputNama = pihakItem.querySelector('[data-field="nama"]');

              const selectJenis = pihakItem.querySelector(
                '[data-field="jenisPihak"]',
              );

              return {
                nama: inputNama ? inputNama.value.trim() : "",
                jenisPihak: selectJenis ? selectJenis.value : "Pengendara",
              };
            })
            .filter(function (item) {
              return item.nama !== "";
            })
        : [];

      return {
        kendaraan: namaKendaraan,
        pihak: pihak,
      };
    })
    .filter(function (item) {
      return item.kendaraan !== "";
    });
}

/* ============================================================
   27. AMBIL LIST PENGENDARA
   ============================================================ */

/* ============================================================
   27. AMBIL LIST PIHAK TERLIBAT
   ============================================================ */

function ambilListPihakTerlibat() {
  const container = InputLaporanElements.containerListPihakTerlibat;

  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll(".dynamic-item-pihak-terlibat"))
    .map(function (item) {
      const inputNama = item.querySelector('[data-field="nama"]');
      const selectJenis = item.querySelector('[data-field="jenisPihak"]');

      return {
        nama: inputNama ? inputNama.value.trim() : "",
        jenisPihak: selectJenis ? selectJenis.value : "Pengendara",
      };
    })
    .filter(function (item) {
      return item.nama !== "";
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
      return value !== "";
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
    errors.push("TKP belum diisi.");
  }

  if (!data.tanggalKejadian) {
    errors.push("Tanggal kejadian belum diisi.");
  }

  if (!data.jamKejadian) {
    errors.push("Jam kejadian belum diisi.");
  }

  if (!data.kronologi) {
    errors.push("Kronologi kejadian belum diisi.");
  }

  /*
     Petugas.
  */
  if (!data.petugas.length) {
    errors.push("Petugas yang menangani belum dipilih.");
  }

  /*
     Status.
  */
  if (!data.statusPenanganan) {
    errors.push("Status penanganan belum dipilih.");
  }

  return errors;
}

/* ============================================================
   30. KIRIM LAPORAN
   ============================================================ */

function kirimLaporan() {
  const button = InputLaporanElements.btnKirimLaporan;

  // =====================================================
  // MULAI TEST DATA FINAL FORM
  // =====================================================

  const data = ambilDataForm();

  // =====================================================
  // SELESAI TEST DATA FINAL FORM
  // =====================================================

  /*
     Validasi frontend.
  */
  const errors = validasiForm(data);

  if (errors.length) {
    tampilkanAlert("error", errors.join(" "));

    return;
  }

  /*
     Simpan state sementara.
  */
  InputLaporanState.currentReport = data;

  /*
     Kunci tombol.
  */
  setButtonLoading(button, true, "⏳ MENYIMPAN...");

  sembunyikanAlert();

  /*
     APPS SCRIPT ASLI
  */
  //   if (typeof google === "undefined" || !google.script || !google.script.run) {
  //     handleSaveReportError("google.script.run tidak tersedia.");

  //     setButtonLoading(button, false, "🚀 KIRIM LAPORAN");

  //     return;
  //   }

  //   google.script.run
  //     .withSuccessHandler(function (response) {
  //       handleSaveReportSuccess(response);

  //       setButtonLoading(button, false, "🚀 KIRIM LAPORAN");
  //     })
  //     .withFailureHandler(function (error) {
  //       handleSaveReportError(error);

  //       setButtonLoading(button, false, "🚀 KIRIM LAPORAN");
  //     })
  //     [InputLaporanConfig.BACKEND_FUNCTION.SIMPAN_LAPORAN](data);
  // }

  // =====================================================
  // MULAI SIMPAN LAPORAN MELALUI API
  // =====================================================

  apiRequest("SIMPAN_LAPORAN", data)
    .then(function (response) {
      handleSaveReportSuccess(response);
    })
    .catch(function (error) {
      handleSaveReportError(error);
    })
    .finally(function () {
      setButtonLoading(button, false, "🚀 KIRIM LAPORAN");
    });
}

// =====================================================
// SELESAI SIMPAN LAPORAN MELALUI API
// =====================================================

// =====================================================
// MULAI: HANDLE SAVE REPORT SUCCESS
// =====================================================

function handleSaveReportSuccess(response) {
  const normalized = normalisasiResponseBackend(response);

  if (!normalized.success) {
    handleSaveReportError(normalized.message || "Laporan gagal disimpan.");
    return;
  }

  tampilkanAlert("success", normalized.message || "Laporan berhasil disimpan.");

  // ===================================================
  // MULAI: RESET FORM SETELAH BERHASIL DISIMPAN
  // ===================================================

  resetFormLaporan();

  // ===================================================
  // SELESAI: RESET FORM SETELAH BERHASIL DISIMPAN
  // ===================================================
}

// =====================================================
// SELESAI: HANDLE SAVE REPORT SUCCESS
// =====================================================

/* ============================================================
   32. RESPONSE SAVE ERROR
   ============================================================ */

function handleSaveReportError(error) {
  console.error("[InputLaporan] Simpan laporan gagal:", error);

  let message = "Laporan gagal disimpan. Data form tetap dipertahankan.";

  if (typeof error === "string") {
    message = error;
  }

  if (error && typeof error === "object" && error.message) {
    message = error.message;
  }

  tampilkanAlert("error", message);
}

/* ============================================================
   33. RESET FORM
   ============================================================ */

function resetFormLaporan() {
  const elements = InputLaporanElements;

  /*
     Field informasi.
  */
  elements.inputIdLaporan.value = "";

  elements.inputNomorLP.value = "";

  elements.inputWaktuInput.value = "";

  /*
     Waktu & tempat.
  */
  elements.inputTKP.value = "";

  elements.inputTanggalKejadian.value = "";

  elements.inputJamKejadian.value = "";

  /*
     Hari.
  */
  if (elements.selectHariKejadian) {
    elements.selectHariKejadian.value = "Senin";
  }

  /*
     Array.
  */
  if (elements.containerListKendaraan) {
    elements.containerListKendaraan.innerHTML = "";
  }

  if (elements.containerListPihakTerlibat) {
    elements.containerListPihakTerlibat.innerHTML = "";
  }

  if (elements.containerListSaksi) {
    elements.containerListSaksi.innerHTML = "";
  }

  /*
     Tambahkan satu baris kosong.
  */
  tambahKendaraan();
  tambahPihakTerlibat();
  tambahSaksi();

  /*
     Kronologi.
  */
  elements.textareaKronologiFinal.value = "";

  /*
     Korban.
  */
  elements.inputKorbanLR.value = 0;

  elements.inputKorbanLB.value = 0;

  elements.inputKorbanMD.value = 0;

  /*
     Kermat.
  */
  elements.inputKermatRupiah.value = "";

  /*

   Status default.

*/

  elements.selectStatusPenanganan.value = "Pelimpahan";
  updateNomorLPBerdasarkanStatus();

  /*
     Petugas.
  */
  InputLaporanState.selectedPetugas = [];
  renderSelectedPetugas();

  // =====================================================
  // MULAI: RESET RAW LAPORAN
  // =====================================================

  InputLaporanState.rawLaporan = "";

  // =====================================================
  // SELESAI: RESET RAW LAPORAN
  // =====================================================

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

// function batalForm() {
//   /*
//      Jika sedang review dari WhatsApp,
//      kembali ke halaman WhatsApp.
//   */
//   if (
//     InputLaporanState.inputMethod === "whatsapp" &&
//     InputLaporanState.parsedFromWhatsApp
//   ) {
//     showInputView("whatsapp");

//     return;
//   }

//   /*
//      Manual kembali ke selection.
//   */
//   showInputView("selection");

//   updateInputMethodActiveState("whatsapp");

//   InputLaporanState.inputMethod = "whatsapp";

//   InputLaporanState.parsedFromWhatsApp = false;

//   resetFormLaporan();
// }

function batalForm() {
  window.location.href = "halLakaLantas.html";
}

/* ============================================================
   35. BANNER PARSING
   ============================================================ */

function showBannerSuccessParse() {
  if (InputLaporanElements.bannerSuccessParse) {
    InputLaporanElements.bannerSuccessParse.classList.remove("hidden");
  }
}

function hideBannerSuccessParse() {
  if (InputLaporanElements.bannerSuccessParse) {
    InputLaporanElements.bannerSuccessParse.classList.add("hidden");
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

  const existing = document.getElementById("input-laporan-alert");

  let alertElement = existing;

  if (!alertElement) {
    alertElement = document.createElement("div");

    alertElement.id = "input-laporan-alert";

    alertElement.className = "mb-4 p-3 rounded-xl text-xs border";

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
    "bg-emerald-50",
    "border-emerald-200",
    "text-emerald-800",
    "bg-red-50",
    "border-red-200",
    "text-red-800",
    "bg-amber-50",
    "border-amber-200",
    "text-amber-800",
  );

  if (type === "success") {
    alertElement.classList.add(
      "bg-emerald-50",
      "border-emerald-200",
      "text-emerald-800",
    );
  } else if (type === "error") {
    alertElement.classList.add("bg-red-50", "border-red-200", "text-red-800");
  } else {
    alertElement.classList.add(
      "bg-amber-50",
      "border-amber-200",
      "text-amber-800",
    );
  }

  alertElement.textContent = message || "";

  alertElement.classList.remove("hidden");
}

function sembunyikanAlert() {
  const alertElement = document.getElementById("input-laporan-alert");

  if (alertElement) {
    alertElement.classList.add("hidden");
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

    button.classList.add("opacity-70", "cursor-not-allowed");

    button.textContent = loadingText;
  } else {
    button.disabled = false;

    button.classList.remove("opacity-70", "cursor-not-allowed");

    button.textContent = button.dataset.originalText || loadingText || "";
  }
}

/* ============================================================
   38. EVENT DELEGATION ITEM DINAMIS
   ============================================================ */

function initializeDynamicItemEvents() {
  document.addEventListener("click", function (event) {
    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) return;

    const action = actionButton.dataset.action;

    if (action === "tambah-pihak-kendaraan") {
      const kendaraanItem = actionButton.closest(".dynamic-item-kendaraan");

      if (!kendaraanItem) {
        return;
      }

      const containerPihak = kendaraanItem.querySelector(
        '[data-container="pihak-kendaraan"]',
      );

      if (!containerPihak) {
        return;
      }

      tambahPihakTerlibat("", null, containerPihak);

      return;
    }

    if (!actionButton) {
      return;
    }

    /*
         Hapus kendaraan.
      */
    if (action === "hapus-kendaraan") {
      const item = actionButton.closest(".dynamic-item-kendaraan");

      if (item) {
        item.remove();
      }

      return;
    }

    /*
         Hapus pengendara.
      */
    if (action === "hapus-pihak-kendaraan") {
      const item = actionButton.closest(".dynamic-item-pihak-terlibat");

      if (item) {
        item.remove();
      }

      return;
    }

    /*
         Hapus saksi.
      */
    if (action === "hapus-saksi") {
      const item = actionButton.closest(".dynamic-item-saksi");

      if (item) {
        item.remove();
      }

      return;
    }

    /*
         Hapus petugas.
      */
    if (action === "hapus-petugas") {
      hapusPetugas(actionButton.dataset.id);

      return;
    }
  });
}

function cekModeEdit() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const id = params.get("id");

  if (mode !== "edit" || !id) {
    return false;
  }

  console.log("[InputLaporan] Mode Edit:", id);

  return true;
}

async function ambilLaporanUntukEdit() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const id = params.get("id");

  if (mode !== "edit" || !id) {
    return null;
  }

  try {
    const response = await apiRequest("AMBIL_DETAIL_LAPORAN", {
      id: id,
    });

    const laporan = response.data || null;

    if (!laporan) {
      console.error("[InputLaporan] Laporan tidak ditemukan:", id);
      return null;
    }

    console.log("[InputLaporan] Data laporan untuk edit:", laporan);

    return laporan;
  } catch (error) {
    console.error("[InputLaporan] Gagal mengambil laporan untuk edit:", error);

    tampilkanAlert(
      "error",
      error.message || "Data laporan untuk edit gagal diambil.",
    );

    return null;
  }
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
    elements.cardSelectWA.addEventListener("click", function () {
      pilihInputWhatsApp();
    });
  }

  /*
     Pilihan Manual.
  */
  if (elements.cardSelectManual) {
    elements.cardSelectManual.addEventListener("click", function () {
      pilihInputManual();
    });
  }

  /*
     Proses WhatsApp.
  */
  if (elements.btnProsesLaporan) {
    elements.btnProsesLaporan.addEventListener("click", function () {
      prosesLaporanWhatsApp();
    });
  }

  /*
     Kembali.
  */
  if (elements.btnBackPrevious) {
    elements.btnBackPrevious.addEventListener("click", function () {
      kembaliKeHalamanSebelumnya();
    });
  }

  // if (elements.selectStatusPenanganan) {
  //   elements.selectStatusPenanganan.addEventListener(
  //     "change",
  //     updateWarnaStatus,
  //   );
  // }

  // updateWarnaStatus();

  // =====================================================
  // MULAI EVENT STATUS PENANGANAN → NOMOR LP
  // =====================================================

  if (elements.selectStatusPenanganan) {
    elements.selectStatusPenanganan.addEventListener("change", function () {
      updateWarnaStatus();
      updateNomorLPBerdasarkanStatus();
    });
  }

  updateWarnaStatus();

  // =====================================================
  // SELESAI EVENT STATUS PENANGANAN → NOMOR LP
  // =====================================================

  /*
     Tambah kendaraan.
  */
  if (elements.btnAddKendaraan) {
    elements.btnAddKendaraan.addEventListener("click", function () {
      tambahKendaraan();
    });
  }

  /*
     Tambah pengendara.
  */

  /*
     Tambah saksi.
  */
  if (elements.btnAddSaksi) {
    elements.btnAddSaksi.addEventListener("click", function () {
      tambahSaksi();
    });
  }

  /*
     Tambah petugas.

     Selector petugas akan dibuat oleh
     renderPetugasSelector().
  */
  if (elements.btnAddPetugas) {
    elements.btnAddPetugas.addEventListener("click", function () {
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
    elements.btnKirimLaporan.addEventListener("click", function () {
      kirimLaporan();
    });
  }

  /*
     Batal.
  */
  if (elements.btnBatalForm) {
    elements.btnBatalForm.addEventListener("click", function () {
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
    elements.formLaporanUtama.addEventListener("submit", function (event) {
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
document.addEventListener("modeChanged", function (event) {
  const officer = Boolean(event.detail && event.detail.isOfficerMode);

  /*
       Saat halaman ini digunakan,
       input laporan seharusnya digunakan
       dalam Mode Petugas.

       Untuk sekarang kita tidak mengubah
       state global di sini.

       Hanya logging untuk debugging.
    */
  if (!officer) {
    window.location.href = "../index.html";
  }
});

/* ============================================================
   44. PUBLIC API INPUT LAPORAN
   ============================================================ */

window.InputLaporanComponent = {
  /*
     Buka halaman pilihan input.
  */
  showSelection: function () {
    showInputView("selection");
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

async function initializeInputLaporan() {
  initializeInputLaporanEvents();

  const laporanEdit = await ambilLaporanUntukEdit();

  /* ============================================================
     MODE EDIT — SIAPKAN DAN TAMPILKAN FORM
     ============================================================ */

  // if (laporanEdit) {
  //   InputLaporanState.inputMethod = "manual";
  //   InputLaporanState.parsedFromWhatsApp = false;

  //   updateInputMethodActiveState("manual");
  //   resetFormLaporan();
  //   isiFormDariJSON(laporanEdit);
  //   showInputView("form");

  //   return;
  // }

  if (laporanEdit) {
    InputLaporanState.inputMethod = "manual";
    InputLaporanState.parsedFromWhatsApp = false;

    updateInputMethodActiveState("manual");
    resetFormLaporan();

    console.log("[DEBUG PETUGAS] Sebelum ambilDaftarPetugas");

    await ambilDaftarPetugas();

    console.log(
      "[DEBUG PETUGAS] Sesudah ambilDaftarPetugas:",
      InputLaporanState.daftarPetugas,
    );

    isiFormDariJSON(laporanEdit);
    showInputView("form");

    return;
  }

  /* ============================================================
     MODE INPUT BARU — KODE LAMA DILANJUTKAN DI BAWAH
     ============================================================ */
  /*
     Default:
     WhatsApp aktif.
  */
  InputLaporanState.inputMethod = "whatsapp";
  InputLaporanState.parsedFromWhatsApp = false;
  updateInputMethodActiveState("whatsapp");
  showInputView("whatsapp");
  resetFormLaporan(); /*
     Jangan tampilkan banner parsing.
  */
  hideBannerSuccessParse();

  /*
     Render icon.
  */
  if (window.lucide) {
    lucide.createIcons();
  }

  console.log("[InputLaporan] Initialization selesai.");
}

/* ============================================================
   46. JALANKAN INITIALIZATION
   ============================================================ */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeInputLaporan);
} else {
  initializeInputLaporan();
}

document.addEventListener("DOMContentLoaded", function () {
  // Pastikan status default langsung diwarnai
  updateWarnaStatus();
});

/* ============================================================
   AKHIR JAVASCRIPT INPUT LAPORAN
   ============================================================ */
