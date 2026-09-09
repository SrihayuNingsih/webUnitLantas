/* =====================================================
       AWAL JAVASCRIPT NAVBAR + SIDEBAR
  ====================================================== */

/* =====================================================
       AWAL SCRIPT GLOBAL / APPLICATION
  ====================================================== */

let isOfficerMode = localStorage.getItem("isOfficerMode") === "true";

/* =====================================================
     SET MODE APLIKASI
  ===================================================== */

function setMode(mode) {
  isOfficerMode = mode === "officer";

  localStorage.setItem("isOfficerMode", String(isOfficerMode));

  updateGlobalUI();

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
  ===================================================== */

function updateGlobalUI() {
  updateNavbarMode(isOfficerMode);

  updateSidebarMode(isOfficerMode);
}

/* =====================================================
     JAM NAVBAR, MUNCUL SAAT DEKSTOP > 1024PX
  ===================================================== */

function startNavbarClock() {
  const clockEl = document.getElementById("realtime-clock-navbar");
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const options = {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    clockEl.textContent = now.toLocaleDateString("id-ID", options) + " WIB";
  }

  updateClock();
  setInterval(updateClock, 1000); // Update setiap detik
}

/* =====================================================
     AKHIR JAM NAVBAR, MUNCUL SAAT DEKSTOP > 1024PX
  ===================================================== */

/* =====================================================
       AKHIR SCRIPT GLOBAL / APPLICATION
  ====================================================== */

/* =====================================================
       AWAL SCRIPT ELEMENT GLOBAL
  ====================================================== */

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

/* =====================================================
       AKHIR SCRIPT ELEMENT GLOBAL
  ====================================================== */

/* =====================================================
       AWAL SCRIPT NAVBAR
  ====================================================== */

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
        */

    document.dispatchEvent(new CustomEvent("sidebarCloseRequest"));
  });
}

/* =====================================================
     LOGOUT REQUEST
  ===================================================== */

if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    document.dispatchEvent(new CustomEvent("logoutRequest"));
  });
}

/* =====================================================
       AWAL SCRIPT MODAL LOGOUT
  ===================================================== */

/* =====================================================
     ELEMENT MODAL LOGOUT
  ===================================================== */

const logoutModal = document.getElementById("logoutModal");

const cancelLogoutButton = document.getElementById("cancelLogoutButton");

const confirmLogoutButton = document.getElementById("confirmLogoutButton");

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
     ESCAPE
  ===================================================== */

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    if (logoutModal && !logoutModal.classList.contains("hidden")) {
      closeLogoutModal();
    }
  }
});

/* =====================================================
       AKHIR SCRIPT MODAL LOGOUT
  ===================================================== */

/* =====================================================
     HAMBURGER
  ===================================================== */

if (menuButton) {
  menuButton.addEventListener("click", function () {
    document.dispatchEvent(new CustomEvent("sidebarToggle"));
  });
}

/* =====================================================
     MODE DARI KOMPONEN LAIN
  ===================================================== */

document.addEventListener("setApplicationMode", function (event) {
  const mode =
    event.detail && event.detail.mode ? event.detail.mode : "visitor";

  setMode(mode);
});

/* =====================================================
     PUBLIC API NAVBAR
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
  ====================================================== */

/* =====================================================
       AWAL SCRIPT SIDEBAR
  ====================================================== */

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
  ====================================================== */

/* =====================================================
       INITIALIZATION
  ====================================================== */

function initializeApplication() {
  /*
      1. Initialize icon.
    */

  if (window.lucide) {
    lucide.createIcons();
  }

  /*
      2. Initialize Sidebar dropdown.
    */

  initializeSidebarDropdown();

  /*
      3. Initialize link Sidebar.
    */

  initializeSidebarLinks();

  /*
      4. Terapkan mode yang tersimpan.
    */

  updateGlobalUI();

  /*
      5. Pada mobile, Sidebar harus tertutup
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
      6. Render icon sekali lagi
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

// Panggil di akhir initLakaPage()
startNavbarClock();

/* =====================================================
       AKHIR JAVASCRIPT NAVBAR + SIDEBAR
  ====================================================== */
