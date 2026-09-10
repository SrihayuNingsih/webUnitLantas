/* =====================================================
       AWAL JAVASCRIPT APLIKASI
  ====================================================== */

/* =====================================================
     =====================================================
     
       JAVASCRIPT TES GABUNG KOMPONEN
       
       Fungsi file ini:
       - Menggabungkan seluruh JavaScript komponen
       - Menjadi bahan pengujian di VS Code
       - Setelah stabil, script akan dipecah kembali
         menjadi file JavaScript masing-masing komponen
       
       STRUKTUR:
       1. Global / Application
       2. Element Global
       3. Navbar
       4. Sidebar
       5. Sidebar Dropdown
       6. Sidebar Responsive
       7. Logout Modal
       8. Data Laka
       9. Helper Status Laka
       10. Render Laka
       11. Mode Laka
       12. Action Menu Laka
       13. Action Laporan
       14. Tombol Lihat Semua
       15. Rekap & Status
       16. Initialization
       
     =====================================================
     ===================================================== */

/* =====================================================
     =====================================================
       AWAL SCRIPT GLOBAL / APPLICATION
       
       Bagian ini adalah pusat aplikasi.
       
       Hanya bagian ini yang memiliki state:
       isOfficerMode
       
       Komponen lain tidak membuat state mode sendiri.
       
       Nilai:
       true  = Petugas
       false = Pengunjung
     =====================================================
     ===================================================== */

let isOfficerMode = localStorage.getItem("isOfficerMode") === "true";

/*
    ID laporan yang sedang dipilih
    pada Action Menu.
  */

let activeMenuId = null;

/* =====================================================
     SET MODE APLIKASI
     
     Function ini adalah pusat perubahan mode.
     
     Komponen lain tidak perlu mengubah
     localStorage secara langsung.
  ===================================================== */

function setMode(mode) {
  isOfficerMode = mode === "officer";

  /*
      Simpan mode ke Local Storage.
    */

  localStorage.setItem("isOfficerMode", String(isOfficerMode));

  /*
      Update tampilan masing-masing komponen.
    */

  updateGlobalUI();

  /*
      Beritahu seluruh komponen bahwa mode berubah.
      
      Komponen yang membutuhkan event ini:
      - Navbar
      - Sidebar
      - Laka
      - Input Laporan
      - Petugas Piket
      - komponen lainnya nanti
    */

  document.dispatchEvent(
    new CustomEvent("modeChanged", {
      detail: {
        isOfficerMode: isOfficerMode,
      },
    }),
  );
}

/* =====================================================
     UPDATE UI GLOBAL
     
     Function ini hanya memastikan komponen-komponen
     yang sudah ada langsung mengikuti mode saat ini.
     
     Detail tampilan tetap ditangani oleh function
     masing-masing komponen.
  ===================================================== */

function updateGlobalUI() {
  /*
      Navbar
    */

  updateNavbarMode(isOfficerMode);

  /*
      Sidebar
    */

  updateSidebarMode(isOfficerMode);

  /*
      Laka Terbaru
    */

  updateLakaMode(isOfficerMode);
}

/* =====================================================
     AKHIR SCRIPT GLOBAL / APPLICATION
     =====================================================
  */

/* =====================================================
     =====================================================
       AWAL SCRIPT ELEMENT GLOBAL
       
       Semua element yang digunakan oleh JavaScript
       diambil di satu tempat.
     =====================================================
     ===================================================== */

const menuButton = document.getElementById("menuButton");

const closeMenuButton = document.getElementById("closeMenuButton");

const sidebar = document.getElementById("sidebar");

const menuOverlay = document.getElementById("menuOverlay");

const visitorMenu = document.getElementById("visitorMenu");

const officerMenu = document.getElementById("officerMenu");

const visitorStatus = document.getElementById("visitorStatus");

const adminStatus = document.getElementById("adminStatus");

const loginButton = document.getElementById("loginButton");

const logoutButton = document.getElementById("logoutButton");

const logoutModal = document.getElementById("logoutModal");

const cancelLogoutButton = document.getElementById("cancelLogoutButton");

const confirmLogoutButton = document.getElementById("confirmLogoutButton");

const actionMenu = document.getElementById("action-menu");

const actionEditButton = document.getElementById("actionEditButton");

const actionDeleteButton = document.getElementById("actionDeleteButton");

const searchInput = document.getElementById("searchInput");

const searchInputDesktop = document.getElementById("searchInputDesktop");

/* =====================================================
     AKHIR SCRIPT ELEMENT GLOBAL
     =====================================================
  */

/* =====================================================
     =====================================================
       AWAL SCRIPT NAVBAR
       
       Komponen:
       Navbar
       
       Tanggung jawab:
       - Menampilkan mode Visitor / Petugas
       - Login
       - Logout request
       - Hamburger request
       - Search
       
       Navbar TIDAK mengatur Sidebar secara langsung.
     =====================================================
     ===================================================== */
document.body.insertAdjacentHTML(
  "beforeend",
  `
  <div style="
    position:fixed;
    top:0;
    left:0;
    z-index:99999;
    background:red;
    color:white;
    padding:10px;
    font-size:14px;
  ">
    width: ${window.innerWidth}px<br>
    height: ${window.innerHeight}px<br>
    DPR: ${window.devicePixelRatio}
  </div>
  `,
);
/* Awal Tes Navbar ================================================================================== */

function initNavbarScrollHide() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  let lastY = window.scrollY;
  let turnPoint = lastY;
  let isFixedShowing = false;

  const scrollUpThreshold = 100; // Jarak Scroll ke atas (100px)

  window.addEventListener("scroll", () => {
    // Abaikan logika jika layar Dekstop (>= 768px)
    if (window.innerHeight >= 768) {
      resetToSticky();
      return;
    }

    const currentY = window.scrollY;
    const isScrollingDown = currentY > lastY;
    const pageOneHeight = window.innerHeight; // Batas tinggi halaman 1 (100vh)

    // Kondisi 1: Dihalaman Pertama
    if (currentY < pageOneHeight) {
      // Selalu kembalikan ke sticky alami
      resetToSticky();
      turnPoint = currentY;
    }

    // Kondisi 2: Di halaman kedua dan seterusnya
    else {
      if (isScrollingDown) {
        // Saat scroll kebawah, lepas mode fixed melayang, biarkan navbar naik dan hilang mengikuti sticky alami
        if (isFixedShowing) {
          resetToSticky();
        }
        // Catat posisi Y terdalam saat scroll ke bawah sebagai titik balik
        turnPoint = currentY;
      } else {
        // Saat scroll keatas: Cek apakah selisihnya sudah 100px dari titik balik
        if (turnPoint - currentY >= scrollUpThreshold) {
          if (isFixedShowing) {
            showFixedNavbar();
          }
        }
      }
    }

    lastY = currentY;
  });

  // Reset tampilan jika layar di resize ke dekstop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      resetToSticky;
    }
  });

  function showFixedNavbar() {
    // Ubah posisi jadi fixed alami melayang dan turunkan navbar ke layar
    navbar.classList.remove("sticky", "translate-y-full");
    navbar.classList.add("fixed", "top-0", "translate-y-0");
    isFixedShowing = true;
  }

  function resetToSticky() {
    // Kembalikan ke posisi sticky normal (ikut flow dokumen)
    navbar.classList.remove("fixed", "translate-y-full");
    navbar.classList.add("sticky", "translate-y-0");
    isFixedShowing = false;
  }
}
/* Akhir Tes Navbar ================================================================================= */

/* =====================================================
     UPDATE MODE NAVBAR
  ===================================================== */

function updateNavbarMode(isOfficer) {
  if (isOfficer) {
    /*
        MODE PETUGAS
      */

    if (visitorStatus) {
      visitorStatus.classList.add("hidden");
      visitorStatus.classList.remove("flex");
    }

    if (adminStatus) {
      adminStatus.classList.remove("hidden");
      adminStatus.classList.add("flex");
    }
  } else {
    /*
        MODE PENGUNJUNG
      */

    if (visitorStatus) {
      visitorStatus.classList.remove("hidden");
      visitorStatus.classList.add("flex");
    }

    if (adminStatus) {
      adminStatus.classList.add("hidden");
      adminStatus.classList.remove("flex");
    }
  }
}

/* =====================================================
     LOGIN PETUGAS
  ===================================================== */

if (loginButton) {
  loginButton.addEventListener("click", function () {
    /*
          Ubah mode menjadi Petugas.
        */

    setMode("officer");

    /*
          Minta Sidebar ditutup.
          
          Navbar tidak memanggil closeSidebar()
          secara langsung.
        */

    document.dispatchEvent(new CustomEvent("sidebarCloseRequest"));
  });
}

/* =====================================================
     LOGOUT REQUEST
     
     Navbar hanya mengirim request.
     
     Modal Logout yang menangani konfirmasi.
  ===================================================== */

if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    document.dispatchEvent(new CustomEvent("logoutRequest"));
  });
}

/* =====================================================
     HAMBURGER
     
     Navbar hanya mengirim request ke Sidebar.
  ===================================================== */

if (menuButton) {
  menuButton.addEventListener("click", function () {
    document.dispatchEvent(new CustomEvent("sidebarToggle"));
  });
}

/* =====================================================
     MODE DARI KOMPONEN LAIN
     
     Misalnya Logout Modal meminta:
     
     setApplicationMode
     
     Maka aplikasi mengubah mode melalui setMode().
  ===================================================== */

document.addEventListener("setApplicationMode", function (event) {
  const mode =
    event.detail && event.detail.mode ? event.detail.mode : "visitor";

  setMode(mode);
});

/* =====================================================
     SYNC SEARCH INPUT
     
     Search mobile dan desktop disinkronkan.
  ===================================================== */

function syncSearchInput(sourceInput, targetInput) {
  if (!sourceInput || !targetInput) {
    return;
  }

  sourceInput.addEventListener("input", function () {
    targetInput.value = sourceInput.value;

    /*
          Beritahu komponen yang membutuhkan
          data pencarian.
        */

    document.dispatchEvent(
      new CustomEvent("searchChanged", {
        detail: {
          keyword: sourceInput.value,
        },
      }),
    );
  });
}

/*
    Sinkronisasi dua arah.
  */

syncSearchInput(searchInput, searchInputDesktop);

syncSearchInput(searchInputDesktop, searchInput);

/* =====================================================
     PUBLIC API NAVBAR
     
     Dipertahankan supaya nanti komponen lain
     masih bisa berkomunikasi dengan Navbar.
  ===================================================== */

window.NavbarComponent = {
  setMode: function (mode) {
    setMode(mode);
  },

  getMode: function () {
    return isOfficerMode ? "officer" : "visitor";
  },

  isOfficerMode: function () {
    return isOfficerMode;
  },
};

/* =====================================================
     AKHIR SCRIPT NAVBAR
     =====================================================
  */

/* =====================================================
     =====================================================
       AWAL SCRIPT SIDEBAR
       
       Komponen:
       Sidebar
       
       Tanggung jawab:
       - Buka Sidebar mobile
       - Tutup Sidebar
       - Toggle Sidebar
       - Mode Visitor / Petugas
       - Overlay
       - Tombol close
       - Escape
     =====================================================
     ===================================================== */

/* =====================================================
     STATE SIDEBAR
  ===================================================== */

let isMenuOpen = false;

/* =====================================================
     OPEN SIDEBAR
  ===================================================== */

function openSidebar() {
  /*
      Sidebar mobile saja.
      
      Desktop tidak perlu membuka Sidebar
      karena Sidebar memang selalu tampil.
    */

  if (window.innerWidth >= 768) {
    return;
  }

  if (!sidebar || !menuOverlay) {
    return;
  }

  sidebar.classList.remove("-translate-x-full");

  menuOverlay.classList.remove("hidden");

  document.body.classList.add("overflow-hidden");

  isMenuOpen = true;

  document.dispatchEvent(new CustomEvent("sidebarOpened"));
}

/* =====================================================
     CLOSE SIDEBAR
  ===================================================== */

function closeSidebar() {
  if (!sidebar || !menuOverlay) {
    return;
  }

  sidebar.classList.add("-translate-x-full");

  menuOverlay.classList.add("hidden");

  document.body.classList.remove("overflow-hidden");

  isMenuOpen = false;

  document.dispatchEvent(new CustomEvent("sidebarClosed"));
}

/* =====================================================
     TOGGLE SIDEBAR
  ===================================================== */

function toggleSidebar() {
  if (isMenuOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

/* =====================================================
     EVENT DARI NAVBAR
  ===================================================== */

document.addEventListener("sidebarToggle", function () {
  toggleSidebar();
});

/* =====================================================
     EVENT TUTUP DARI NAVBAR
  ===================================================== */

document.addEventListener("sidebarCloseRequest", function () {
  closeSidebar();
});

/* =====================================================
     TOMBOL CLOSE SIDEBAR
  ===================================================== */

if (closeMenuButton) {
  closeMenuButton.addEventListener("click", function () {
    closeSidebar();
  });
}

/* =====================================================
     OVERLAY
  ===================================================== */

if (menuOverlay) {
  menuOverlay.addEventListener("click", function () {
    closeSidebar();
  });
}

/* =====================================================
     UPDATE MODE SIDEBAR
  ===================================================== */

function updateSidebarMode(isOfficer) {
  if (!visitorMenu || !officerMenu) {
    return;
  }

  if (isOfficer) {
    visitorMenu.classList.add("hidden");

    officerMenu.classList.remove("hidden");
  } else {
    visitorMenu.classList.remove("hidden");

    officerMenu.classList.add("hidden");
  }
}

/* =====================================================
     EVENT MODE CHANGED
  ===================================================== */

document.addEventListener("modeChanged", function (event) {
  const officer = Boolean(event.detail && event.detail.isOfficerMode);

  updateSidebarMode(officer);
});

/* =====================================================
     DROPDOWN SIDEBAR
     
     Functionality:
     - Membuka dropdown
     - Menutup dropdown lain
     - Memutar chevron
  ===================================================== */

function initializeSidebarDropdown() {
  const dropdownButtons = document.querySelectorAll(
    ".dropdown-button:not(.disabled-dropdown)",
  );

  dropdownButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const dropdownId = button.dataset.dropdown;

      if (!dropdownId) {
        return;
      }

      const dropdown = document.getElementById(dropdownId);

      if (!dropdown) {
        return;
      }

      const chevron = button.querySelector(".dropdown-chevron");

      const isHidden = dropdown.classList.contains("hidden");

      /*
              Tutup dropdown lain.
            */

      document
        .querySelectorAll(".dropdown-content")
        .forEach(function (otherDropdown) {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.add("hidden");
          }
        });

      /*
              Reset chevron lain.
            */

      document
        .querySelectorAll(".dropdown-chevron")
        .forEach(function (otherChevron) {
          if (otherChevron !== chevron) {
            otherChevron.classList.remove("rotate-180");
          }
        });

      /*
              Toggle dropdown.
            */

      if (isHidden) {
        dropdown.classList.remove("hidden");

        if (chevron) {
          chevron.classList.add("rotate-180");
        }
      } else {
        dropdown.classList.add("hidden");

        if (chevron) {
          chevron.classList.remove("rotate-180");
        }
      }
    });
  });
}

/* =====================================================
     LINK SIDEBAR
     
     Jika link dipilih pada mobile,
     Sidebar otomatis ditutup.
  ===================================================== */

function initializeSidebarLinks() {
  if (!sidebar) {
    return;
  }

  sidebar.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth < 768) {
        closeSidebar();
      }
    });
  });
}

/* =====================================================
     RESPONSIVE SIDEBAR
  ===================================================== */

window.addEventListener("resize", function () {
  if (window.innerWidth >= 768) {
    if (menuOverlay) {
      menuOverlay.classList.add("hidden");
    }

    document.body.classList.remove("overflow-hidden");

    isMenuOpen = false;
  } else {
    if (sidebar) {
      sidebar.classList.add("-translate-x-full");
    }

    if (menuOverlay) {
      menuOverlay.classList.add("hidden");
    }

    document.body.classList.remove("overflow-hidden");

    isMenuOpen = false;
  }
});

/* =====================================================
     ESCAPE SIDEBAR
  ===================================================== */

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && isMenuOpen) {
    closeSidebar();
  }
});

/* =====================================================
     PUBLIC API SIDEBAR
  ===================================================== */

window.SidebarComponent = {
  open: function () {
    openSidebar();
  },

  close: function () {
    closeSidebar();
  },

  toggle: function () {
    toggleSidebar();
  },

  setMode: function (isOfficer) {
    updateSidebarMode(Boolean(isOfficer));
  },
};

/* =====================================================
     AKHIR SCRIPT SIDEBAR
     =====================================================
  */

/* =====================================================
     =====================================================
       AWAL SCRIPT LOGOUT MODAL
       
       Komponen:
       Logout Modal
       
       Tanggung jawab:
       - Membuka modal
       - Menutup modal
       - Konfirmasi logout
       - Klik luar modal
       - Escape
       
       Modal TIDAK mengatur Navbar/Sidebar secara langsung.
     =====================================================
     ===================================================== */

/* =====================================================
     OPEN LOGOUT MODAL
  ===================================================== */

function openLogoutModal() {
  if (!logoutModal) {
    return;
  }

  logoutModal.classList.remove("hidden");

  logoutModal.classList.add("flex");

  document.body.classList.add("overflow-hidden");

  /*
      Fokus ke tombol Batal.
    */

  if (cancelLogoutButton) {
    setTimeout(function () {
      cancelLogoutButton.focus();
    }, 50);
  }
}

/* =====================================================
     CLOSE LOGOUT MODAL
  ===================================================== */

function closeLogoutModal() {
  if (!logoutModal) {
    return;
  }

  logoutModal.classList.add("hidden");

  logoutModal.classList.remove("flex");

  document.body.classList.remove("overflow-hidden");
}

/* =====================================================
     EVENT LOGOUT REQUEST
     
     Navbar mengirim:
     logoutRequest
  ===================================================== */

document.addEventListener("logoutRequest", function () {
  openLogoutModal();
});

/* =====================================================
     TOMBOL BATAL
  ===================================================== */

if (cancelLogoutButton) {
  cancelLogoutButton.addEventListener("click", function () {
    closeLogoutModal();
  });
}

/* =====================================================
     KONFIRMASI LOGOUT
     
     Modal meminta aplikasi kembali ke Visitor.
  ===================================================== */

if (confirmLogoutButton) {
  confirmLogoutButton.addEventListener("click", function () {
    document.dispatchEvent(
      new CustomEvent("setApplicationMode", {
        detail: {
          mode: "visitor",
        },
      }),
    );

    closeLogoutModal();

    /*
          Minta Sidebar ditutup.
        */

    document.dispatchEvent(new CustomEvent("sidebarCloseRequest"));
  });
}

/* =====================================================
     KLIK LUAR MODAL
  ===================================================== */

if (logoutModal) {
  logoutModal.addEventListener("click", function (event) {
    if (event.target === logoutModal) {
      closeLogoutModal();
    }
  });
}

/* =====================================================
     ESCAPE LOGOUT MODAL
  ===================================================== */

document.addEventListener("keydown", function (event) {
  if (
    event.key === "Escape" &&
    logoutModal &&
    !logoutModal.classList.contains("hidden")
  ) {
    closeLogoutModal();
  }
});

/* =====================================================
     PUBLIC API LOGOUT
  ===================================================== */

window.LogoutModalComponent = {
  open: function () {
    openLogoutModal();
  },

  close: function () {
    closeLogoutModal();
  },
};

/* =====================================================
     AKHIR SCRIPT LOGOUT MODAL
     =====================================================
  */

/* =====================================================
     =====================================================
       AWAL SCRIPT DATA LAKA
       
       Data sementara untuk pengujian di VS Code.
       
       Nanti diganti dengan data dari Apps Script /
       Google Sheets.
     =====================================================
     ===================================================== */

const lakaData = [
  {
    id: "L/03/VIII/2024",
    hariTanggal: "Selasa, 20 Agustus 2024",
    waktu: "14.30 WIB",
    lokasi: "Jl. Raya Baureno - Bojonegoro, Desa Baureno, Kec. Baureno",
    lr: 2,
    lb: 0,
    md: 0,
    status: "Dalam Penanganan",
  },
  {
    id: "L/02/VIII/2024",
    hariTanggal: "Senin, 19 Agustus 2024",
    waktu: "09.15 WIB",
    lokasi: "Jl. Raya Baureno - Dander, Depan Pasar Baureno",
    lr: 1,
    lb: 1,
    md: 0,
    status: "Selesai",
  },
  {
    id: "L/01/VIII/2024",
    hariTanggal: "Minggu, 18 Agustus 2024",
    waktu: "16.45 WIB",
    lokasi: "Jl. Raya Baureno - Kanor, Desa Kedungsumber",
    lr: 0,
    lb: 1,
    md: 1,
    status: "Limpah Polres",
  },
  {
    id: "L/31/VII/2024",
    hariTanggal: "Sabtu, 17 Agustus 2024",
    waktu: "11.20 WIB",
    lokasi: "Jl. Raya Baureno - Sugihwaras, Depan Balai Desa Sugihwaras",
    lr: 1,
    lb: 0,
    md: 0,
    status: "Dalam Penanganan",
  },
];

/* =====================================================
     AKHIR SCRIPT DATA LAKA
     =====================================================
  */

/* =====================================================
     =====================================================
       AWAL SCRIPT HELPER STATUS LAKA
     =====================================================
     ===================================================== */

function getStatusDot(statusText) {
  const status = (statusText || "").toLowerCase().trim();
  if (status === "selesai") return "bg-emerald-500";
  if (status === "dalam penanganan") return "bg-amber-600";
  if (status === "limpah polres") return "bg-rose-600";
  return "bg-slate-300";
}

function getStatusText(statusText) {
  const status = (statusText || "").toLowerCase().trim();
  if (status === "selesai") return "text-emerald-600";
  if (status === "dalam penanganan") return "text-amber-600";
  if (status === "limpah polres") return "text-rose-600";
  return "text-slate-500";
}

/* =====================================================
     AKHIR SCRIPT HELPER STATUS LAKA
     =====================================================
  */

/* =====================================================
     =====================================================
       AWAL SCRIPT RENDER LAKA TERBARU
       
       Komponen:
       Laka Lantas Terbaru
       
       Function:
       renderLakaList()
       
       Card Laka dibuat di sini.
     =====================================================
     ===================================================== */

function renderLakaList(data = lakaData) {
  const container = document.getElementById("laka-list");

  const emptyState = document.getElementById("empty-state");

  if (!container) {
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "";

    if (emptyState) {
      emptyState.classList.remove("hidden");
    }

    if (window.lucide) {
      lucide.createIcons();
    }

    return;
  }

  if (emptyState) {
    emptyState.classList.add("hidden");
  }

  container.innerHTML = data
    .map(function (item, index) {
      return `

              <article
                id="laka-card-${index}"
                data-id="${item.id}"
                class="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm transition-all hover:shadow-md"
              >

                <!-- =====================================
                     NOMOR LAPORAN
                ====================================== -->

                <div
                  class="mb-2.5 flex items-center gap-2"
                >

                  <i
                    data-lucide="file-text"
                    class="h-4 w-4 shrink-0 text-slate-400"
                  ></i>

                  <span
                    class="text-[15px] font-bold text-blue-500"
                  >
                    ${item.id}
                  </span>

                </div>


                <!-- =====================================
                     TANGGAL & JAM
                ====================================== -->

                <div
                  class="mb-2.5 flex items-center gap-2 text-sm text-slate-600"
                >

                  <i
                    data-lucide="calendar-days"
                    class="h-4 w-4 shrink-0 text-slate-400"
                  ></i>

                  <span>
                    ${item.hariTanggal}
                    |
                    ${item.waktu}
                  </span>

                </div>


                <!-- =====================================
                     LOKASI
                ====================================== -->

                <div
                  class="mb-2.5 flex items-start gap-2"
                >

                  <i
                    data-lucide="map-pin"
                    class="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                  ></i>

                  <p
                    class="text-sm leading-snug text-slate-600"
                  >
                    ${item.lokasi}
                  </p>

                </div>


                <!-- =====================================
                     KORBAN
                ====================================== -->

                <div
                  class="mb-2.5 flex items-center gap-3 text-sm font-medium"
                >

                  <span class="text-slate-600">
                    LR
                    <span
                      class="font-semibold text-blue-600"
                    >
                      ${item.lr}
                    </span>
                  </span>

                  <span class="text-slate-300">
                    |
                  </span>

                  <span class="text-slate-600">
                    LB
                    <span
                      class="font-semibold text-amber-600"
                    >
                      ${item.lb}
                    </span>
                  </span>

                  <span class="text-slate-300">
                    |
                  </span>

                  <span class="text-slate-600">
                    MD
                    <span
                      class="font-semibold text-rose-600"
                    >
                      ${item.md}
                    </span>
                  </span>

                </div>


                <!-- =====================================
                     STATUS
                ====================================== -->

                <div
                  class="mb-4 flex items-center gap-2"
                >

                  <span
                    class="h-2.5 w-2.5 rounded-full ${getStatusDot(item.status)}"
                  ></span>

                  <span
                    class="text-sm font-medium ${getStatusText(item.status)}"
                  >
                    ${item.status}
                  </span>

                </div>


                <!-- =====================================
                     ACTION
                ====================================== -->

                <div
                  class="flex items-center justify-end gap-2 border-t border-slate-100 pt-3"
                >

                  <!-- MODE PENGUNJUNG -->

                  <button
                    type="button"
                    data-action="detail-visitor"
                    data-id="${item.id}"
                    class="visitor-detail-button flex items-center gap-1.5 rounded-lg bg-blue-50 px-3.5 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                  >

                    Lihat Detail

                    <i
                      data-lucide="chevron-right"
                      class="h-4 w-4"
                    ></i>

                  </button>


                  <!-- MODE PETUGAS -->

                  <button
                    type="button"
                    data-action="detail-officer"
                    data-id="${item.id}"
                    class="officer-detail-button hidden rounded-lg bg-blue-50 px-3.5 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    Lihat Detail
                  </button>


                  <!-- MENU AKSI PETUGAS -->

                  <button
                    type="button"
                    data-action="menu"
                    data-id="${item.id}"
                    data-index="${index}"
                    class="officer-action-button hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-blue-50 text-slate-500 transition-colors hover:bg-blue-100"
                    aria-label="Menu aksi"
                  >

                    <i
                      data-lucide="more-vertical"
                      class="h-5 w-5"
                    ></i>

                  </button>

                </div>

              </article>

            `;
    })
    .join("");

  /*
      Render icon Lucide setelah HTML
      berhasil dimasukkan.
    */

  if (window.lucide) {
    lucide.createIcons();
  }

  /*
      Sesuaikan tombol berdasarkan mode.
    */

  updateLakaMode(isOfficerMode);
}

/* =====================================================
     AKHIR SCRIPT RENDER LAKA TERBARU
     =====================================================
  */

/* =====================================================
     =====================================================
       AWAL SCRIPT MODE LAKA TERBARU
       
       Mengatur tombol Laka berdasarkan mode:
       
       Pengunjung:
       - Lihat Detail + chevron
       
       Petugas:
       - Lihat Detail
       - Menu titik tiga
     =====================================================
     ===================================================== */

function updateLakaMode(isOfficer) {
  /*
      Tombol detail pengunjung.
    */

  document
    .querySelectorAll(".visitor-detail-button")
    .forEach(function (button) {
      button.classList.toggle("hidden", isOfficer);
    });

  /*
      Tombol detail petugas.
    */

  document
    .querySelectorAll(".officer-detail-button")
    .forEach(function (button) {
      button.classList.toggle("hidden", !isOfficer);
    });

  /*
      Tombol menu titik tiga.
    */

  document
    .querySelectorAll(".officer-action-button")
    .forEach(function (button) {
      button.classList.toggle("hidden", !isOfficer);
    });

  /*
      Jika kembali ke mode pengunjung,
      menu action yang sedang terbuka harus ditutup.
    */

  if (!isOfficer) {
    closeActionMenu();
  }
}

/*
    Dengarkan perubahan mode global.
  */

document.addEventListener("modeChanged", function (event) {
  const officer = Boolean(event.detail && event.detail.isOfficerMode);

  updateLakaMode(officer);
});

/* =====================================================
     AKHIR SCRIPT MODE LAKA TERBARU
     =====================================================
  */

/* =====================================================
     =====================================================
       AWAL SCRIPT ACTION MENU LAKA
       
       Function utama:
       toggleActionMenu()
       
       CATATAN PENTING:
       Kita menggunakan function:
       
       toggleActionMenu(event, id, button)
       
       BUKAN:
       
       openActionMenu()
       
       Ini mengikuti function komponen Laka
       yang sudah kita sepakati.
     =====================================================
     ===================================================== */

function toggleActionMenu(event, id, button) {
  event.stopPropagation();

  /*
      Menu hanya boleh digunakan
      pada mode Petugas.
    */

  if (!isOfficerMode) {
    return;
  }

  if (!actionMenu || !button) {
    return;
  }

  /*
      Jika menu yang sama diklik lagi,
      tutup menu.
    */

  if (activeMenuId === id && !actionMenu.classList.contains("hidden")) {
    closeActionMenu();

    return;
  }

  /*
      Simpan ID laporan aktif.
    */

  activeMenuId = id;

  /*
      Tampilkan menu terlebih dahulu
      agar ukurannya dapat dihitung.
    */

  actionMenu.classList.remove("hidden");

  const rect = button.getBoundingClientRect();

  const menuHeight = actionMenu.offsetHeight || 90;

  const menuWidth = actionMenu.offsetWidth || 160;

  const spaceBelow = window.innerHeight - rect.bottom;

  /*
      POSISI VERTIKAL
    */

  if (spaceBelow < menuHeight && rect.top > menuHeight) {
    /*
        Tampilkan di atas tombol.
      */

    actionMenu.style.top = `${rect.top - menuHeight - 6}px`;
  } else {
    /*
        Tampilkan di bawah tombol.
      */

    actionMenu.style.top = `${rect.bottom + 6}px`;
  }

  /*
      POSISI HORIZONTAL
      
      Mencegah menu keluar dari
      sisi kanan layar.
    */

  const leftPos = Math.min(
    rect.right - menuWidth,
    window.innerWidth - menuWidth - 10,
  );

  actionMenu.style.left = `${Math.max(10, leftPos)}px`;
}

/* =====================================================
     CLOSE ACTION MENU
  ===================================================== */

function closeActionMenu() {
  if (actionMenu) {
    actionMenu.classList.add("hidden");

    /*
        Bersihkan posisi lama.
      */

    actionMenu.style.top = "";
    actionMenu.style.left = "";
  }

  activeMenuId = null;
}

/* =====================================================
     EVENT KLIK ACTION MENU
     
     Event delegation digunakan supaya
     tombol yang dibuat oleh renderLakaList()
     tetap dapat bekerja.
  ===================================================== */

document.addEventListener("click", function (event) {
  /*
        Tombol titik tiga.
      */

  const menuButton = event.target.closest('[data-action="menu"]');

  if (menuButton) {
    toggleActionMenu(event, menuButton.dataset.id, menuButton);

    return;
  }

  /*
        Detail mode pengunjung.
      */

  const visitorDetail = event.target.closest('[data-action="detail-visitor"]');

  if (visitorDetail) {
    lihatDetail(visitorDetail.dataset.id);

    return;
  }

  /*
        Detail mode petugas.
      */

  const officerDetail = event.target.closest('[data-action="detail-officer"]');

  if (officerDetail) {
    lihatDetail(officerDetail.dataset.id);

    return;
  }

  /*
        Klik di luar Action Menu.
      */

  if (!event.target.closest("#action-menu")) {
    closeActionMenu();
  }
});

/* =====================================================
     TOMBOL EDIT
  ===================================================== */

if (actionEditButton) {
  actionEditButton.addEventListener("click", function () {
    handleEdit();
  });
}

/* =====================================================
     TOMBOL HAPUS
  ===================================================== */

if (actionDeleteButton) {
  actionDeleteButton.addEventListener("click", function () {
    handleDelete();
  });
}

/* =====================================================
     TUTUP ACTION MENU SAAT RESIZE
  ===================================================== */

window.addEventListener("resize", function () {
  closeActionMenu();
});

window.addEventListener("scroll", () => closeActionMenu(), true);

/* =====================================================
     AKHIR SCRIPT ACTION MENU LAKA
     =====================================================
  */

/* =====================================================
     =====================================================
       AWAL SCRIPT ACTION LAPORAN
       
       Function:
       - lihatDetail()
       - handleEdit()
       - handleDelete()
     =====================================================
     ===================================================== */

function lihatDetail(id) {
  alert(`Membuka detail laporan: ${id}`);
}

/* =====================================================
     EDIT LAPORAN
  ===================================================== */

function handleEdit() {
  if (!activeMenuId) {
    return;
  }

  const id = activeMenuId;

  /*
      Tutup menu terlebih dahulu.
    */

  closeActionMenu();

  /*
      Sementara untuk pengujian.
      
      Nanti diganti:
      membuka form Edit Laporan.
    */

  alert(`Edit laporan: ${id}`);
}

/* =====================================================
     HAPUS LAPORAN
  ===================================================== */

function handleDelete() {
  if (!activeMenuId) {
    return;
  }

  const id = activeMenuId;

  const confirmed = confirm(`Yakin ingin menghapus laporan ${id}?`);

  if (!confirmed) {
    closeActionMenu();

    return;
  }

  /*
      Cari data berdasarkan ID.
    */

  const index = lakaData.findIndex(function (item) {
    return item.id === id;
  });

  if (index !== -1) {
    lakaData.splice(index, 1);

    /*
        Render ulang daftar.
      */

    renderLakaList();
  }

  closeActionMenu();
}

/* =====================================================
     AKHIR SCRIPT ACTION LAPORAN
     =====================================================
  */

/* =====================================================
     =====================================================
       AWAL SCRIPT TOMBOL LIHAT SEMUA
     =====================================================
     ===================================================== */

const lihatSemuaButton = document.getElementById("btn-lihat-semua");

if (lihatSemuaButton) {
  lihatSemuaButton.addEventListener("click", function () {
    alert("Membuka seluruh daftar Laka Lantas.");
  });
}

/* =====================================================
     AKHIR SCRIPT TOMBOL LIHAT SEMUA
     =====================================================
  */

/* =====================================================
     =====================================================
       AWAL SCRIPT REKAP & STATUS
       
       Komponen:
       - Rekap
       - Status Penanganan
       
       Data sementara untuk pengujian.
       Nanti data berasal dari Apps Script.
     =====================================================
     ===================================================== */

const RekapStatusData = {
  totalKejadian: 12,

  korbanLR: 8,

  korbanLB: 3,

  korbanMD: 1,

  dalamPenanganan: 8,

  rj: 3,

  limpahPolres: 1,
};

/* =====================================================
     UPDATE DATA REKAP & STATUS
  ===================================================== */

function updateRekapStatus(data = RekapStatusData) {
  const elements = {
    totalKejadian: ["totalKejadian", "totalKejadianDesktop"],

    korbanLR: ["korbanLR", "korbanLRDesktop"],

    korbanLB: ["korbanLB", "korbanLBDesktop"],

    korbanMD: ["korbanMD", "korbanMDDesktop"],

    dalamPenanganan: ["statusDalamPenanganan", "statusDalamDesktop"],

    RJ: ["statusRJ", "statusRJDesktop"],

    limpahPolres: ["statusLimpahPolres", "statusLimpahDesktop"],
  };

  Object.keys(elements).forEach(function (key) {
    elements[key].forEach(function (id) {
      const element = document.getElementById(id);

      if (element) {
        element.textContent = data[key];
      }
    });
  });
}

/* =====================================================
     PUBLIC API REKAP STATUS
  ===================================================== */

window.RekapStatusComponent = {
  update: function (data) {
    updateRekapStatus(data);
  },

  getData: function () {
    return {
      ...RekapStatusData,
    };
  },
};

/* =====================================================
     AKHIR SCRIPT REKAP & STATUS
     =====================================================
  */

/* =====================================================
     =====================================================
       AWAL SCRIPT PUBLIC API LAKA
       
       Disiapkan supaya nanti komponen lain
       dapat berkomunikasi dengan Laka.
     =====================================================
     ===================================================== */

window.LakaComponent = {
  render: function (data) {
    renderLakaList(data || lakaData);
  },

  getData: function () {
    return [...lakaData];
  },

  refreshMode: function () {
    updateLakaMode(isOfficerMode);
  },

  closeActionMenu: function () {
    closeActionMenu();
  },
};

/* =====================================================
     AKHIR SCRIPT PUBLIC API LAKA
     =====================================================
  */

/* =====================================================
     =====================================================
       AWAL SCRIPT INITIALIZATION
       
       Hanya ada SATU proses initialization.
       
       Ini penting agar nanti saat script dipecah
       menjadi komponen, kita tahu titik awal aplikasi.
     =====================================================
     ===================================================== */

function initializeApplication() {
  /*
      1. Initialize icon.
    */

  if (window.lucide) {
    lucide.createIcons();
  }

  /*
  Initialize Tambahan (Scroll Hide Navbar).
  */

  initNavbarScrollHide();

  /*
      2. Initialize Sidebar dropdown.
    */

  initializeSidebarDropdown();

  /*
      3. Initialize link Sidebar.
    */

  initializeSidebarLinks();

  /*
      4. Render data Laka.
    */

  renderLakaList();

  /*
      5. Terapkan mode yang tersimpan.
      
      Ini akan mengatur:
      - Navbar
      - Sidebar
      - Laka
    */

  updateGlobalUI();

  /*
      6. Terapkan data Rekap.
    */

  updateRekapStatus();

  /*
      7. Pastikan Action Menu tertutup.
    */

  closeActionMenu();

  /*
      8. Pada mobile, Sidebar harus tertutup
         ketika aplikasi pertama kali dibuka.
    */

  if (window.innerWidth < 768) {
    closeSidebar();
  } else {
    /*
        Pada desktop Sidebar harus tampil.
      */

    if (sidebar) {
      sidebar.classList.remove("-translate-x-full");
    }
  }

  /*
      9. Render icon sekali lagi
         setelah seluruh komponen selesai.
    */

  if (window.lucide) {
    lucide.createIcons();
  }
}

/*
    Jalankan initialization
    setelah DOM siap.
  */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApplication);
} else {
  initializeApplication();
}

/* =====================================================
     AKHIR SCRIPT INITIALIZATION
     =====================================================
  */

/* =====================================================
     =====================================================
       AKHIR JAVASCRIPT TES GABUNG KOMPONEN
     =====================================================
     ===================================================== */

/* =====================================================
       AKHIR JAVASCRIPT APLIKASI
  ====================================================== */
