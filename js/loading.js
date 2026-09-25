// =====================================================
// MULAI: RESET POSISI SCROLL HALAMAN
// =====================================================

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

// =====================================================
// SELESAI: RESET POSISI SCROLL HALAMAN
// =====================================================

// =====================================================
// LOADING GLOBAL WEBSITE UNIT LANTAS
// =====================================================

// =====================================================
// MULAI: KONFIGURASI LOADING
// =====================================================

const LoadingGlobal = {
  // ===================================================
  // MULAI: TAMPILKAN LOADING
  // ===================================================

  show: function () {
    // =================================================
    // CARI AREA KONTEN
    // =================================================

    // const content = document.querySelector(
    //   "#main-content, #laporanRekapMain, #detailLaporanContent, #inputLaporan",
    // );

    // if (!content) {
    //   return;
    // }

    // =================================================
    // CEK LOADING SUDAH ADA
    // =================================================

    let loading = document.getElementById("globalLoadingOverlay");

    if (loading) {
      loading.classList.remove("hidden");
      return;
    }

    // =================================================
    // BUAT LOADING
    // =================================================

    loading = document.createElement("div");

    loading.id = "globalLoadingOverlay";

    loading.className =
      "fixed inset-0 z-[999] flex items-center justify-center bg-blue-50/80 backdrop-blur-sm";

    loading.innerHTML = `
      <div
        class="flex flex-col items-center justify-center"
      >

        <!-- =================================================
             LOGO LANTAS
        ================================================== -->

        <div
          class="relative flex items-center justify-center"
        >

          <img
            src="/assets/images/logo/logoLantas.png"
            alt="Logo Lantas"
            class="h-20 w-20 object-contain"
          />

          <!-- GARIS SCANNING -->

          <span
            class="absolute left-1/2 top-0 h-0.5 w-16 -translate-x-1/2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
            style="animation: loadingScan 1.8s ease-in-out infinite;"
          ></span>

        </div>

        <!-- =================================================
             NAMA UNIT
        ================================================== -->

        <div
          class="mt-3 text-sm font-bold tracking-widest text-blue-950"
        >
          UNIT LANTAS BAURENO
        </div>

        <!-- =================================================
             TEKS LOADING
        ================================================== -->

        <div
          class="mt-1 flex items-center text-xs font-medium text-slate-500"
        >
          <span>Memuat data</span>

          <span
            id="globalLoadingDots"
            class="ml-1 inline-block w-5 text-left"
          >
            ...
          </span>
        </div>

      </div>
    `;

    // =================================================
    // PASTIKAN AREA KONTEN MENJADI REFERENSI POSISI
    // =================================================

    // const currentPosition = window.getComputedStyle(content).position;

    // if (currentPosition === "static") {
    //   content.style.position = "relative";
    // }

    // content.appendChild(loading);

    // =================================================
    // PASANG LOADING KE BODY / VIEWPORT
    // =================================================

    document.body.appendChild(loading);

    // =================================================
    // ANIMASI TITIK
    // =================================================

    LoadingGlobal.startDots();

    // =================================================
    // ANIMASI SCANNING
    // =================================================

    LoadingGlobal.addStyles();
  },

  // ===================================================
  // SELESAI: TAMPILKAN LOADING
  // ===================================================

  // ===================================================
  // MULAI: SEMBUNYIKAN LOADING
  // ===================================================

  hide: function () {
    const loading = document.getElementById("globalLoadingOverlay");

    if (!loading) {
      return;
    }

    loading.classList.add("hidden");

    LoadingGlobal.stopDots();
  },

  // ===================================================
  // SELESAI: SEMBUNYIKAN LOADING
  // ===================================================

  // ===================================================
  // MULAI: ANIMASI TITIK
  // ===================================================

  dotsInterval: null,

  startDots: function () {
    const dots = document.getElementById("globalLoadingDots");

    if (!dots) {
      return;
    }

    let jumlahTitik = 0;

    LoadingGlobal.stopDots();

    LoadingGlobal.dotsInterval = setInterval(function () {
      jumlahTitik++;

      if (jumlahTitik > 3) {
        jumlahTitik = 0;
      }

      dots.textContent = ".".repeat(jumlahTitik);
    }, 500);
  },

  stopDots: function () {
    if (LoadingGlobal.dotsInterval) {
      clearInterval(LoadingGlobal.dotsInterval);

      LoadingGlobal.dotsInterval = null;
    }
  },

  // ===================================================
  // SELESAI: ANIMASI TITIK
  // ===================================================

  // ===================================================
  // MULAI: STYLE ANIMASI SCANNING
  // ===================================================

  addStyles: function () {
    if (document.getElementById("globalLoadingStyles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "globalLoadingStyles";

    style.textContent = `
      @keyframes loadingScan {

        0% {
          top: 0;
          opacity: 0;
        }

        10% {
          opacity: 1;
        }

        50% {
          top: 100%;
          opacity: 1;
        }

        90% {
          opacity: 1;
        }

        100% {
          top: 0;
          opacity: 0;
        }

      }
    `;

    document.head.appendChild(style);
  },

  // ===================================================
  // SELESAI: STYLE ANIMASI SCANNING
  // ===================================================
};

// =====================================================
// SELESAI: KONFIGURASI LOADING
// =====================================================

// =====================================================
// MULAI: TEST LOADING
// =====================================================

// document.addEventListener("DOMContentLoaded", function () {
//   LoadingGlobal.show();

//   setTimeout(function () {
//     LoadingGlobal.hide();
//   }, 3000);
// });

// =====================================================
// SELESAI: TEST LOADING
// =====================================================
