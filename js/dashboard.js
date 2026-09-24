/* =====================================================
   JAVASCRIPT APLIKASI DASHBOARD
   ===================================================== */

/* =====================================================
   GLOBAL / APPLICATION
   ===================================================== */

let isOfficerMode = localStorage.getItem("isOfficerMode") === "true";

// let activeMenuId = null;

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
  // updateLakaMode(isOfficerMode);
}

/* =====================================================
   ELEMENT GLOBAL
   ===================================================== */

const menuButton = document.getElementById("menuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const sidebar = document.getElementById("sidebar");
const menuOverlay = document.getElementById("menuOverlay");

const visitorMenu = document.getElementById("visitorMenu");
const officerMenu = document.getElementById("officerMenu");

const visitorStatus = document.getElementById("visitorStatus");
const adminStatus = document.getElementById("adminStatus");

const loginStatus = document.getElementById("loginStatus");
const logoutStatus = document.getElementById("logoutStatus");

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");

const logoutModal = document.getElementById("logoutModal");
const cancelLogoutButton = document.getElementById("cancelLogoutButton");
const confirmLogoutButton = document.getElementById("confirmLogoutButton");

// const actionMenu = document.getElementById("action-menu");
// const actionEditButton = document.getElementById("actionEditButton");
// const actionDeleteButton = document.getElementById("actionDeleteButton");

const searchInput = document.getElementById("searchInput");
const searchInputDesktop = document.getElementById("searchInputDesktop");

/* =====================================================
   NAVBAR
   ===================================================== */

function initNavbarScrollHide() {
  const navbar = document.getElementById("navbar");

  if (!navbar) return;

  let lastY = window.scrollY;
  let turnPoint = lastY;
  let isFixedShowing = false;

  const scrollUpThreshold = 100;

  window.addEventListener("scroll", () => {
    if (window.innerHeight >= 768) {
      resetToSticky();
      return;
    }

    const currentY = window.scrollY;
    const isScrollingDown = currentY > lastY;
    const pageOneHeight = window.innerHeight;

    if (currentY < pageOneHeight) {
      resetToSticky();
      turnPoint = currentY;
    } else {
      if (isScrollingDown) {
        if (isFixedShowing) {
          resetToSticky();
        }

        turnPoint = currentY;
      } else {
        if (turnPoint - currentY >= scrollUpThreshold) {
          if (isFixedShowing) {
            showFixedNavbar();
          }
        }
      }
    }

    lastY = currentY;
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      resetToSticky();
    }
  });

  function showFixedNavbar() {
    navbar.classList.remove("sticky", "translate-y-full");
    navbar.classList.add("fixed", "top-0", "translate-y-0");

    isFixedShowing = true;
  }

  function resetToSticky() {
    navbar.classList.remove("fixed", "translate-y-full");
    navbar.classList.add("sticky", "translate-y-0");

    isFixedShowing = false;
  }
}

/* =====================================================
   UPDATE MODE NAVBAR
   ===================================================== */

function updateNavbarMode(isOfficer) {
  if (isOfficer) {
    if (visitorStatus) {
      visitorStatus.classList.add("hidden");
      visitorStatus.classList.remove("flex");
    }

    if (adminStatus) {
      adminStatus.classList.remove("hidden");
      adminStatus.classList.add("flex");
    }
  } else {
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
    setMode("officer");

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
   SYNC SEARCH INPUT
   ===================================================== */

function syncSearchInput(sourceInput, targetInput) {
  if (!sourceInput || !targetInput) {
    return;
  }

  sourceInput.addEventListener("input", function () {
    targetInput.value = sourceInput.value;

    document.dispatchEvent(
      new CustomEvent("searchChanged", {
        detail: {
          keyword: sourceInput.value,
        },
      }),
    );
  });
}

syncSearchInput(searchInput, searchInputDesktop);
syncSearchInput(searchInputDesktop, searchInput);

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
   SIDEBAR
   ===================================================== */

let isMenuOpen = false;

function openSidebar() {
  if (window.innerWidth < 768) {
    const scrollY = window.scrollY;

    document.body.style.top = `${scrollY}px`;

    document.body.classList.add("overflow-hidden", "fixed", "w-full");
  }

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

function closeSidebar() {
  if (!sidebar || !menuOverlay) {
    return;
  }

  document.body.style.top = "";

  sidebar.classList.add("-translate-x-full");
  menuOverlay.classList.add("hidden");

  document.body.classList.remove("overflow-hidden", "fixed", "w-full");

  isMenuOpen = false;

  document.dispatchEvent(new CustomEvent("sidebarClosed"));
}

function toggleSidebar() {
  if (isMenuOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

/* =====================================================
   EVENT SIDEBAR
   ===================================================== */

document.addEventListener("sidebarToggle", function () {
  toggleSidebar();
});

document.addEventListener("sidebarCloseRequest", function () {
  closeSidebar();
});

if (closeMenuButton) {
  closeMenuButton.addEventListener("click", function () {
    closeSidebar();
  });
}

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

    if (loginStatus) {
      loginStatus.classList.add("hidden");
    }

    if (logoutStatus) {
      logoutStatus.classList.remove("hidden");
    }
  } else {
    visitorMenu.classList.remove("hidden");
    officerMenu.classList.add("hidden");

    if (loginStatus) {
      loginStatus.classList.remove("hidden");
    }

    if (logoutStatus) {
      logoutStatus.classList.add("hidden");
    }
  }
}

document.addEventListener("modeChanged", function (event) {
  const officer = Boolean(event.detail && event.detail.isOfficerMode);

  updateSidebarMode(officer);
});

/* =====================================================
   SIDEBAR DROPDOWN
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

      document
        .querySelectorAll(".dropdown-content")
        .forEach(function (otherDropdown) {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.add("hidden");
          }
        });

      document
        .querySelectorAll(".dropdown-chevron")
        .forEach(function (otherChevron) {
          if (otherChevron !== chevron) {
            otherChevron.classList.remove("rotate-180");
          }
        });

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
   LOGOUT MODAL
   ===================================================== */

function openLogoutModal() {
  if (!logoutModal) {
    return;
  }

  logoutModal.classList.remove("hidden");
  logoutModal.classList.add("flex");

  document.body.classList.add("overflow-hidden");

  if (cancelLogoutButton) {
    setTimeout(function () {
      cancelLogoutButton.focus();
    }, 50);
  }
}

function closeLogoutModal() {
  if (!logoutModal) {
    return;
  }

  logoutModal.classList.add("hidden");
  logoutModal.classList.remove("flex");

  document.body.classList.remove("overflow-hidden");
}

document.addEventListener("logoutRequest", function () {
  openLogoutModal();
});

if (cancelLogoutButton) {
  cancelLogoutButton.addEventListener("click", function () {
    closeLogoutModal();
  });
}

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

    document.dispatchEvent(new CustomEvent("sidebarCloseRequest"));
  });
}

if (logoutModal) {
  logoutModal.addEventListener("click", function (event) {
    if (event.target === logoutModal) {
      closeLogoutModal();
    }
  });
}

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
   HELPER STATUS LAKA
   Mengikuti halLakaLantas.js
   ===================================================== */

function getStatusBadge(statusTampil) {
  const status = String(statusTampil || "")
    .toLowerCase()
    .trim();

  if (["selesai", "selesai/rj", "rj", "selesai/damai"].includes(status)) {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "dalam penanganan") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (status === "limpah polres") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

function getStatusDot(statusTampil) {
  const status = String(statusTampil || "")
    .toLowerCase()
    .trim();

  if (["selesai", "selesai/rj", "rj"].includes(status)) {
    return "bg-green-700";
  }

  if (status === "dalam penanganan") {
    return "bg-amber-400";
  }

  if (status === "limpah polres") {
    return "bg-red-700";
  }

  return "bg-slate-300";
}

function getStatusText(statusTampil) {
  const status = String(statusTampil || "")
    .toLowerCase()
    .trim();

  if (["selesai", "selesai/rj", "rj"].includes(status)) {
    return "text-green-700";
  }

  if (status === "dalam penanganan") {
    return "text-amber-400";
  }

  if (status === "limpah polres") {
    return "text-red-700";
  }

  return "text-slate-500";
}

// function getWaktuKejadian(item) {
//   const bulan = {
//     januari: 0,
//     februari: 1,
//     maret: 2,
//     april: 3,
//     mei: 4,
//     juni: 5,
//     juli: 6,
//     agustus: 7,
//     september: 8,
//     oktober: 9,
//     november: 10,
//     desember: 11,
//   };

//   const tanggalText = String(item.tanggal || "").trim();
//   const waktuText = String(item.jam || "").trim();

//   const matchTanggal = tanggalText.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/i);

//   const matchWaktu = waktuText.match(/(\d{1,2})[.:](\d{2})/);

//   if (!matchTanggal || !matchWaktu) return 0;

//   const tanggal = Number(matchTanggal[1]);
//   const bulanIndex = bulan[matchTanggal[2].toLowerCase()];
//   const tahun = Number(matchTanggal[3]);
//   const jam = Number(matchWaktu[1]);
//   const menit = Number(matchWaktu[2]);

//   if (bulanIndex === undefined) return 0;

//   return new Date(tahun, bulanIndex, tanggal, jam, menit).getTime();
// }

/* =====================================================
   RENDER LAKA DASHBOARD

   SUMBER DATA:
   lakaData.js

   Tidak ada data Laka lain di dashboard.js.
   ===================================================== */

function renderLakaList(data = []) {
  const container = document.getElementById("laka-list");
  const emptyState = document.getElementById("empty-state");

  if (!container) return;

  const dataLaka = Array.isArray(data) ? data : [];

  // const dataTerbaru = [...dataLaka]
  //   .sort((a, b) => getWaktuKejadian(b) - getWaktuKejadian(a))
  //   .slice(0, 4);

  const dataTerbaru = dataLaka;

  if (dataTerbaru.length === 0) {
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

  container.innerHTML = dataTerbaru
    .map(function (item, index) {
      const status = String(item.status || "").trim();

      const statusTampil = ["RJ", "Selesai/RJ", "Selesai"].includes(status)
        ? "Selesai"
        : status;

      const nomorLP = String(item.nomorLP || "").trim();

      const noLp = nomorLP
        ? nomorLP
        : status === "Limpah Polres"
          ? "Belum tersedia"
          : "Nihil";

      return `
        <article
          id="laka-card-${index}"
          data-id="${item.id || index}"
          class="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >

          <!-- ID LAPORAN + STATUS -->
<div class="grid grid-cols-2 items-start gap-4">

  <!-- ID LAPORAN -->
  <div class="flex min-w-0 items-start gap-2">

    <i
      data-lucide="file-text"
      class="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
    ></i>

    <span
      class="min-w-0 break-all text-[15px] font-bold leading-snug text-blue-700"
    >
      ${item.id || "-"}
    </span>

  </div>

  <!-- STATUS -->
  <div class="min-w-0 text-right">

    <div
      class="inline-flex max-w-full items-center justify-end gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 ${getStatusBadge(statusTampil)}"
    >

      <span
        class="h-2.5 w-2.5 shrink-0 rounded-full ${getStatusDot(statusTampil)}"
      ></span>

      <span
        class="whitespace-nowrap text-sm font-medium ${getStatusText(statusTampil)}"
      >
        ${statusTampil}
      </span>

    </div>

  </div>

</div>

            </div>

          </div>


          <!-- NO. LP -->
          <div class="ml-6 mt-2.5 flex items-center gap-2">

            <i
              data-lucide="file-text"
              class="h-3.5 w-3.5 shrink-0 text-slate-400"
            ></i>

            <span class="text-xs font-medium text-slate-500">
              No. LP :
            </span>

            <span class="text-sm font-semibold text-slate-700">
              ${noLp}
            </span>

          </div>


          <!-- WAKTU KEJADIAN -->
          <div class="mt-5 flex items-center gap-2 text-sm text-slate-600">

            <i
              data-lucide="calendar-days"
              class="h-4 w-4 shrink-0 text-blue-400"
            ></i>

            <span>
  ${
    item.tanggal
      ? `${new Date(item.tanggal + "T00:00:00").toLocaleDateString("id-ID", {
          weekday: "long",
        })}, ${item.tanggal.split("-").reverse().join("-")}`
      : "-"
  } | ${item.jam || "-"}
</span>

          </div>


          <!-- TKP -->
          <div class="mt-2.5 flex items-start gap-2">

            <i
              data-lucide="map-pin"
              class="mt-0.5 h-4 w-4 shrink-0 text-blue-400"
            ></i>

            <p class="text-sm leading-snug text-slate-600">
              ${item.tkp || "-"}
            </p>

          </div>


          <!-- KORBAN + ACTION -->
          <div
            class="mt-5 flex flex-wrap items-center justify-between gap-3"
          >

            <!-- LR / LB / MD -->
            <div
              class="flex items-center gap-3 text-sm font-medium"
            >

              <span class="text-slate-600">
                LR
                <span class="font-semibold text-green-700">
                  ${item.jumlahLR ?? 0}
                </span>
              </span>

              <span class="text-blue-200">|</span>

              <span class="text-slate-600">
                LB
                <span class="font-semibold text-amber-400">
                  ${item.jumlahLB ?? 0}
                </span>
              </span>

              <span class="text-blue-200">|</span>

              <span class="text-slate-600">
                MD
                <span class="font-semibold text-red-700">
                  ${item.jumlahMD ?? 0}
                </span>
              </span>

            </div>




          </div>

        </article>
      `;
    })
    .join("");

  if (window.lucide) {
    lucide.createIcons();
  }

  // updateLakaMode(isOfficerMode);
}

/* =====================================================
   MODE LAKA
   ===================================================== */

// function updateLakaMode(isOfficer) {
//   // Dashboard sekarang hanya menampilkan Lihat Detail.
//   // Tombol detail selalu tampil pada semua mode.

//   closeActionMenu();
// }

// document.addEventListener("modeChanged", function (event) {
//   const officer = Boolean(event.detail && event.detail.isOfficerMode);

//   updateLakaMode(officer);
// });

/* =====================================================
   ACTION MENU LAKA
   ===================================================== */

// function toggleActionMenu(event, id, button) {
//   event.stopPropagation();

//   if (!isOfficerMode) {
//     return;
//   }

//   if (!actionMenu || !button) {
//     return;
//   }

//   if (activeMenuId === id && !actionMenu.classList.contains("hidden")) {
//     closeActionMenu();
//     return;
//   }

//   activeMenuId = id;

//   actionMenu.classList.remove("hidden");

//   const rect = button.getBoundingClientRect();

//   const menuHeight = actionMenu.offsetHeight || 90;

//   const menuWidth = actionMenu.offsetWidth || 160;

//   const spaceBelow = window.innerHeight - rect.bottom;

//   if (spaceBelow < menuHeight && rect.top > menuHeight) {
//     actionMenu.style.top = `${rect.top - menuHeight - 6}px`;
//   } else {
//     actionMenu.style.top = `${rect.bottom + 6}px`;
//   }

//   const leftPos = Math.min(
//     rect.right - menuWidth,
//     window.innerWidth - menuWidth - 10,
//   );

//   actionMenu.style.left = `${Math.max(10, leftPos)}px`;
// }

// function closeActionMenu() {
//   if (actionMenu) {
//     actionMenu.classList.add("hidden");

//     actionMenu.style.top = "";
//     actionMenu.style.left = "";
//   }

//   activeMenuId = null;
// }

/* =====================================================
   EVENT KLIK ACTION MENU
   ===================================================== */

// document.addEventListener("click", function (event) {
//   /* MENU PETUGAS */
//   // const menuButton = event.target.closest('[data-action="menu-page"]');

//   // if (menuButton) {
//   //   toggleActionMenu(event, menuButton.dataset.id, menuButton);

//   //   return;
//   // }

//   /* DETAIL VISITOR */
//   // const visitorDetail = event.target.closest(
//   //   '[data-action="detail-visitor-page"]',
//   // );

//   // if (visitorDetail) {
//   //   lihatDetail(visitorDetail.dataset.id);

//   //   return;
//   // }

//   // /* DETAIL OFFICER */
//   // const officerDetail = event.target.closest(
//   //   '[data-action="detail-officer-page"]',
//   // );

//   // if (officerDetail) {
//   //   lihatDetail(officerDetail.dataset.id);

//   //   return;
//   // }

//   document.addEventListener("click", function (event) {
//     /* DETAIL LAPORAN */
//     const detailButton = event.target.closest('[data-action="detail-page"]');

//     if (detailButton) {
//       lihatDetail(detailButton.dataset.id);

//       return;
//     }

//     /* KLIK DI LUAR ACTION MENU */
//     if (!event.target.closest("#action-menu")) {
//       closeActionMenu();
//     }
//   });

//   /* KLIK DI LUAR ACTION MENU */
//   if (!event.target.closest("#action-menu")) {
//     closeActionMenu();
//   }
// });

/* =====================================================
   TOMBOL EDIT
   ===================================================== */

// if (actionEditButton) {
//   actionEditButton.addEventListener("click", function () {
//     handleEdit();
//   });
// }

/* =====================================================
   TOMBOL HAPUS
   ===================================================== */

// if (actionDeleteButton) {
//   actionDeleteButton.addEventListener("click", function () {
//     handleDelete();
//   });
// }

/* =====================================================
   TUTUP ACTION MENU
   ===================================================== */

// window.addEventListener("resize", function () {
//   closeActionMenu();
// });

// window.addEventListener("scroll", () => closeActionMenu(), true);

/* =====================================================
   ACTION LAPORAN
   ===================================================== */

// function lihatDetail() {
//   if (!activeMenuId) {
//     return;
//   }

//   const id = activeMenuId;

//   closeActionMenu();

//   window.location.href = `detailLaporan.html?id=${encodeURIComponent(id)}`;
// }

// function lihatDetail(id) {
//   if (!id) {
//     return;
//   }

//   window.location.href = `pages/detailLaporan.html?id=${encodeURIComponent(id)}`;
// }

// function handleEdit() {
//   if (!activeMenuId) {
//     return;
//   }

//   const id = activeMenuId;

//   closeActionMenu();

//   window.location.href = `pages/inputLaporan.html?id=${encodeURIComponent(id)}&mode=edit`;
// }

// function handleDelete() {
//   if (!activeMenuId) {
//     return;
//   }

//   const id = activeMenuId;

//   const confirmed = confirm(`Yakin ingin menghapus laporan ${id}?`);

//   if (!confirmed) {
//     closeActionMenu();
//     return;
//   }

//   const index = lakaData.findIndex(function (item) {
//     return item.id === id;
//   });

//   if (index !== -1) {
//     lakaData.splice(index, 1);

//     renderLakaList();
//     updateRekapStatus();
//   }

//   closeActionMenu();
// }

/* =====================================================
   TOMBOL LIHAT SEMUA
   ===================================================== */

const lihatSemuaButton = document.getElementById("btn-lihat-semua");

if (lihatSemuaButton) {
  lihatSemuaButton.addEventListener("click", function () {
    window.location.href = "pages/halLakaLantas.html";
  });
}

/* =====================================================
   REKAP & STATUS

   DATA LANGSUNG DARI lakaData
   Tidak ada RekapStatusData.
   ===================================================== */

// function updateRekapStatus(data = lakaData) {
//   const dataLaka = Array.isArray(data) ? data : [];

//   const tahunSekarang = new Date().getFullYear();

//   const dataTahunBerjalan = dataLaka.filter(function (item) {
//     const tanggal = String(item.tanggal || "").trim();

//     const match = tanggal.match(/(\d{4})$/);

//     if (!match) return false;

//     return Number(match[1]) === tahunSekarang;
//   });

//   const totalKejadian = dataTahunBerjalan.length;

//   const korbanLR = dataTahunBerjalan.reduce(function (total, item) {
//     return total + Number(item.jumlahLR || 0);
//   }, 0);

//   const korbanLB = dataTahunBerjalan.reduce(function (total, item) {
//     return total + Number(item.jumlahLB || 0);
//   }, 0);

//   const korbanMD = dataTahunBerjalan.reduce(function (total, item) {
//     return total + Number(item.jumlahMD || 0);
//   }, 0);

//   /*
//    * Selesai mencakup:
//    * - Selesai
//    * - Selesai/RJ
//    * - RJ
//    */
//   // const rj = dataLaka.filter(function (item) {
//   //   return ["Selesai/RJ", "RJ"].includes(String(item.status || "").trim());
//   // }).length;

//   const selesai = dataTahunBerjalan.filter(function (item) {
//     return ["Selesai", "Selesai/RJ", "RJ"].includes(
//       String(item.status || "").trim(),
//     );
//   }).length;

//   const dalamPenanganan = dataTahunBerjalan.filter(function (item) {
//     return String(item.status || "").trim() === "Dalam Penanganan";
//   }).length;

//   const limpahPolres = dataTahunBerjalan.filter(function (item) {
//     return String(item.status || "").trim() === "Limpah Polres";
//   }).length;

//   const elements = {
//     totalKejadian: ["totalKejadian", "totalKejadianDesktop"],

//     korbanLR: ["korbanLR", "korbanLRDesktop"],

//     korbanLB: ["korbanLB", "korbanLBDesktop"],

//     korbanMD: ["korbanMD", "korbanMDDesktop"],

//     dalamPenanganan: ["statusDalamPenanganan", "statusDalamDesktop"],

//     rj: ["statusRJ", "statusRJDesktop"],

//     limpahPolres: ["statusLimpahPolres", "statusLimpahDesktop"],
//   };

//   const values = {
//     totalKejadian: totalKejadian,

//     korbanLR: korbanLR,

//     korbanLB: korbanLB,

//     korbanMD: korbanMD,

//     dalamPenanganan: dalamPenanganan,

//     rj: selesai,

//     limpahPolres: limpahPolres,
//   };

//   Object.keys(elements).forEach(function (key) {
//     elements[key].forEach(function (id) {
//       const element = document.getElementById(id);

//       if (element) {
//         element.textContent = values[key];
//       }
//     });
//   });
// }

/* =====================================================
   PUBLIC API REKAP STATUS
   ===================================================== */

// window.RekapStatusComponent = {
//   update: function (data) {
//     updateRekapStatus(data || lakaData);
//   },

//   getData: function () {
//     const dataLaka = Array.isArray(lakaData) ? lakaData : [];

//     return {
//       totalKejadian: dataLaka.length,

//       korbanLR: dataLaka.reduce(
//         (total, item) => total + Number(item.lr || 0),
//         0,
//       ),

//       korbanLB: dataLaka.reduce(
//         (total, item) => total + Number(item.lb || 0),
//         0,
//       ),

//       korbanMD: dataLaka.reduce(
//         (total, item) => total + Number(item.md || 0),
//         0,
//       ),

//       dalamPenanganan: dataLaka.filter(
//         (item) => String(item.status || "").trim() === "Dalam Penanganan",
//       ).length,

//       rj: dataLaka.filter((item) =>
//         ["Selesai/RJ", "RJ"].includes(String(item.status || "").trim()),
//       ).length,

//       limpahPolres: dataLaka.filter(
//         (item) => String(item.status || "").trim() === "Limpah Polres",
//       ).length,
//     };
//   },
// };

/* =====================================================
   PUBLIC API LAKA
   ===================================================== */

// window.LakaComponent = {
//   render: function (data) {
//     renderLakaList(data || lakaData);
//   },

//   getData: function () {
//     return [...lakaData];
//   },

//   // refreshMode: function () {
//   //   updateLakaMode(isOfficerMode);
//   // },

//   // closeActionMenu: function () {
//   //   closeActionMenu();
//   // },
// };

// =====================================================
// MULAI: AMBIL LAKA TERBARU DASHBOARD DARI BACKEND
// =====================================================

async function ambilLakaTerbaru() {
  try {
    const response = await apiRequest("AMBIL_LAKA_TERBARU_DASHBOARD");

    console.log("DATA LAKA TERBARU DARI BACKEND:", response.data);

    return response.data || [];
  } catch (error) {
    console.error("Gagal mengambil data laka terbaru:", error);

    return [];
  }
}

// =====================================================
// SELESAI: AMBIL LAKA TERBARU DASHBOARD DARI BACKEND
// =====================================================

// =====================================================
// MULAI: AMBIL REKAP DASHBOARD DARI BACKEND
// =====================================================

async function ambilRekapDashboard() {
  try {
    const response = await apiRequest("AMBIL_REKAP_DASHBOARD");

    console.log("REKAP DASHBOARD DARI BACKEND:", response.data);

    return response.data || {};
  } catch (error) {
    console.error("Gagal mengambil rekap dashboard:", error);

    return {};
  }
}

// =====================================================
// SELESAI: AMBIL REKAP DASHBOARD DARI BACKEND
// =====================================================

// =====================================================
// MULAI: RENDER REKAP DASHBOARD DARI BACKEND
// =====================================================

function renderRekapDashboard(data) {
  document.getElementById("totalKejadian").textContent =
    data.totalKejadian ?? 0;

  document.getElementById("totalKejadianDesktop").textContent =
    data.totalKejadian ?? 0;

  document.getElementById("korbanLR").textContent = data.jumlahLR ?? 0;

  document.getElementById("korbanLRDesktop").textContent = data.jumlahLR ?? 0;

  document.getElementById("korbanLB").textContent = data.jumlahLB ?? 0;

  document.getElementById("korbanLBDesktop").textContent = data.jumlahLB ?? 0;

  document.getElementById("korbanMD").textContent = data.jumlahMD ?? 0;

  document.getElementById("korbanMDDesktop").textContent = data.jumlahMD ?? 0;

  document.getElementById("statusDalamPenanganan").textContent =
    data.dalamPenanganan ?? 0;

  document.getElementById("statusDalamDesktop").textContent =
    data.dalamPenanganan ?? 0;

  document.getElementById("statusRJ").textContent = data.selesai ?? 0;

  document.getElementById("statusRJDesktop").textContent = data.selesai ?? 0;

  document.getElementById("statusLimpahPolres").textContent =
    data.limpahPolres ?? 0;

  document.getElementById("statusLimpahDesktop").textContent =
    data.limpahPolres ?? 0;
}

// =====================================================
// SELESAI: RENDER REKAP DASHBOARD DARI BACKEND
// =====================================================

// =====================================================
// MULAI: AMBIL PETUGAS PIKET DASHBOARD DARI BACKEND
// =====================================================

async function ambilPetugasPiketDashboard() {
  try {
    const response = await apiRequest("AMBIL_PETUGAS_PIKET_DASHBOARD");

    console.log("PETUGAS PIKET DARI BACKEND:", response.data);

    return (
      response.data || {
        tanggal: "",
        petugas: [],
      }
    );
  } catch (error) {
    console.error("Gagal mengambil petugas piket:", error);

    return {
      tanggal: "",
      petugas: [],
    };
  }
}

// =====================================================
// SELESAI: AMBIL PETUGAS PIKET DASHBOARD DARI BACKEND
// =====================================================

// =====================================================
// MULAI: RENDER PETUGAS PIKET DASHBOARD
// =====================================================

function renderPetugasPiketDashboard(data) {
  const petugas = data?.petugas || [];

  const petugas1 = document.getElementById("petugasPiket1");
  const petugas2 = document.getElementById("petugasPiket2");

  if (petugas1) {
    petugas1.textContent = petugas[0]?.namaLengkap || "-";
  }

  if (petugas2) {
    petugas2.textContent = petugas[1]?.namaLengkap || "-";
  }
}

// =====================================================
// SELESAI: RENDER PETUGAS PIKET DASHBOARD
// =====================================================

/* =====================================================
   INITIALIZATION
   ===================================================== */

function initializeApplication() {
  /* 1. Lucide */
  if (window.lucide) {
    lucide.createIcons();
  }

  /* 2. Navbar scroll */
  initNavbarScrollHide();

  /* 3. Sidebar dropdown */
  initializeSidebarDropdown();

  /* 4. Sidebar links */
  initializeSidebarLinks();

  /* 5. Render Laka */
  // renderLakaList();

  /* 5. Ambil dan Render Laka dari Backend */
  ambilLakaTerbaru().then((data) => {
    renderLakaList(data);
  });

  /* 6. Ambil Rekap dari Backend */
  // ambilRekapDashboard();

  /* 6. Ambil dan Render Rekap dari Backend */
  ambilRekapDashboard().then((data) => {
    renderRekapDashboard(data);
  });

  /* 7. Ambil dan Render Petugas Piket dari Backend */
  ambilPetugasPiketDashboard().then((data) => {
    renderPetugasPiketDashboard(data);
  });

  /* 6. Terapkan mode */
  updateGlobalUI();

  /* 7. Rekap langsung dari lakaData */
  // updateRekapStatus();

  /* 8. Tutup Action Menu */
  // closeActionMenu();

  /* 9. Kondisi Sidebar awal */
  if (window.innerWidth < 768) {
    closeSidebar();
  } else {
    if (sidebar) {
      sidebar.classList.remove("-translate-x-full");
    }
  }

  /* 10. Render icon */
  if (window.lucide) {
    lucide.createIcons();
  }
}

/* =====================================================
   DOM READY
   ===================================================== */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApplication);
} else {
  initializeApplication();
}
