// =====================================================
// MULAI: JAVASCRIPT JADWAL PIKET
// =====================================================

// =====================================================
// MULAI: STATE JADWAL PIKET
// =====================================================

let tanggalPiketTerpilih = new Date();

let dataPetugasPiketHariIni = {
  tanggal: "",
  petugas: [],
};

// =====================================================
// SELESAI: STATE JADWAL PIKET
// =====================================================

// =====================================================
// MULAI: AMBIL PETUGAS PIKET HARI INI
// =====================================================

async function ambilPetugasPiketHariIni() {
  const container = document.getElementById("petugasHariIni");

  if (!container) {
    return;
  }

  try {
    const response = await apiRequest("AMBIL_PETUGAS_PIKET_DASHBOARD");

    dataPetugasPiketHariIni = response.data || {
      tanggal: "",
      petugas: [],
    };

    renderPetugasPiketHariIni();
  } catch (error) {
    console.error("Gagal mengambil petugas piket hari ini:", error);

    container.innerHTML = `
      <div
        class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
      >
        Gagal mengambil data petugas piket.
      </div>
    `;
  }
}

// =====================================================
// SELESAI: AMBIL PETUGAS PIKET HARI INI
// =====================================================

// =====================================================
// MULAI: RENDER PETUGAS PIKET HARI INI
// =====================================================

function renderPetugasPiketHariIni() {
  const container = document.getElementById("petugasHariIni");
  const tanggalElement = document.getElementById("tanggalHariIni");

  if (!container) {
    return;
  }

  const petugas = dataPetugasPiketHariIni.petugas || [];

  if (tanggalElement) {
    tanggalElement.textContent = formatTanggalIndonesia(new Date());
  }

  if (petugas.length === 0) {
    container.innerHTML = `
      <div
        class="col-span-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500"
      >
        Data petugas piket belum tersedia.
      </div>
    `;

    return;
  }

  container.innerHTML = petugas
    .map(function (item, index) {
      return `
        <div
          class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
        >
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700"
          >
            <i data-lucide="user-round" class="h-5 w-5"></i>
          </div>

          <div class="min-w-0">
            <p class="truncate text-sm font-bold text-slate-800">
                ${escapeHtml(item.namaLengkap || "-")}
            </p>

            <p class="text-xs text-slate-500">
                Anggota Unit Lantas
            </p>

            <span
              class="mt-1 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700"
            >
              Piket
            </span>
          </div>
        </div>
      `;
    })
    .join("");

  if (window.lucide) {
    lucide.createIcons();
  }
}

// =====================================================
// SELESAI: RENDER PETUGAS PIKET HARI INI
// =====================================================

// =====================================================
// MULAI: FORMAT TANGGAL INDONESIA
// =====================================================

function formatTanggalIndonesia(tanggal) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(tanggal);
}

// =====================================================
// AKHIR: FORMAT TANGGAL INDONESIA
// =====================================================

// =====================================================
// MULAI: RENDER KALENDER PIKET
// =====================================================

function renderKalenderPiket() {
  const container = document.getElementById("kalenderPiket");

  if (!container) {
    return;
  }

  const sekarang = new Date();

  const tahun = sekarang.getFullYear();

  const bulan = sekarang.getMonth();

  const tanggalHariIni = sekarang.getDate();

  const tanggalTerpilih = tanggalPiketTerpilih.getDate();

  const bulanTerpilih = tanggalPiketTerpilih.getMonth();

  const tahunTerpilih = tanggalPiketTerpilih.getFullYear();

  const namaBulan = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(sekarang);

  const jumlahHari = new Date(tahun, bulan + 1, 0).getDate();

  const hariPertama = new Date(tahun, bulan, 1).getDay();

  // Senin = 0, Minggu = 6
  const posisiHariPertama = hariPertama === 0 ? 6 : hariPertama - 1;

  const namaHari = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  let html = `
    <div class="mb-4 text-center">
      <h4 class="text-base font-bold capitalize text-blue-950 sm:text-lg">
        ${namaBulan}
      </h4>
    </div>

    <div class="grid grid-cols-7 gap-1.5 sm:gap-2">
  `;

  namaHari.forEach(function (hari) {
    html += `
  <div
    class="py-1.5 text-center text-[10px] font-bold ${
      hari === "Min" ? "text-red-500" : "text-slate-500"
    } sm:text-xs"
  >
    ${hari}
  </div>
`;
  });

  for (let i = 0; i < posisiHariPertama; i++) {
    html += `
      <div class="aspect-square"></div>
    `;
  }

  for (let tanggal = 1; tanggal <= jumlahHari; tanggal++) {
    const adalahHariIni = tanggal === tanggalHariIni;

    const adalahTerpilih =
      tanggal === tanggalTerpilih &&
      bulan === bulanTerpilih &&
      tahun === tahunTerpilih;

    const tanggalKalender = new Date(tahun, bulan, tanggal);

    const adalahHariMinggu = tanggalKalender.getDay() === 0;

    let kelasTanggal =
      "relative flex aspect-square items-center justify-center rounded-xl border text-sm font-semibold transition sm:text-base";

    if (adalahTerpilih) {
      kelasTanggal += " border-blue-950 bg-blue-950 text-white shadow-md";
    } else if (adalahHariIni) {
      kelasTanggal += " border-blue-500 bg-blue-50 text-blue-700";
    } else {
      kelasTanggal += adalahHariMinggu
        ? " border-transparent bg-white text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        : " border-transparent bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700";
    }

    html += `
      <button
        type="button"
        class="${kelasTanggal}"
        data-tanggal="${tanggal}"
        onclick="pilihTanggalPiket(${tanggal})"
      >
        ${tanggal}

        ${
          adalahHariIni
            ? `
              <span
                class="absolute bottom-1 h-1 w-1 rounded-full ${
                  adalahTerpilih ? "bg-white" : "bg-blue-600"
                }"
              ></span>
            `
            : ""
        }
      </button>
    `;
  }

  html += `
    </div>

    <div class="mt-4 flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-500 sm:text-xs">
      <div class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded border border-blue-500 bg-blue-50"></span>
        <span>Hari ini</span>
      </div>

      <div class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded bg-blue-950"></span>
        <span>Tanggal dipilih</span>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// =====================================================
// SELESAI: RENDER KALENDER PIKET
// =====================================================

// =====================================================
// MULAI: PILIH TANGGAL PIKET
// =====================================================

function pilihTanggalPiket(tanggal) {
  tanggalPiketTerpilih = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    tanggal,
  );

  renderKalenderPiket();

  ambilDetailJadwalPiket();
}

// =====================================================
// SELESAI: PILIH TANGGAL PIKET
// =====================================================

// =====================================================
// MULAI: AMBIL DETAIL JADWAL PIKET
// =====================================================

async function ambilDetailJadwalPiket() {
  const container = document.getElementById("detailJadwalPiket");

  const tanggalElement = document.getElementById("tanggalTerpilih");

  if (!container) {
    return;
  }

  const tanggal = tanggalPiketTerpilih.getDate();

  try {
    const response = await apiRequest("AMBIL_DETAIL_JADWAL_PIKET", {
      tanggal: tanggal,
    });

    const data = response.data || {
      tanggal: tanggal,
      piket: [],
      lepasDinas: [],
      cadangan: [],
    };

    if (tanggalElement) {
      tanggalElement.textContent = formatTanggalIndonesia(tanggalPiketTerpilih);
    }

    renderDetailJadwalPiket(data);
    //   } catch (error) {
    //     console.error("Gagal mengambil detail jadwal piket:", error);

    //     if (tanggalElement) {
  } catch (error) {
    console.error("GAGAL DETAIL JADWAL PIKET:", error);

    container.innerHTML = `
    <div
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
    >
      ${escapeHtml(error.message || "Gagal mengambil detail jadwal.")}
    </div>
  `;

    if (tanggalElement) {
      tanggalElement.textContent = formatTanggalIndonesia(tanggalPiketTerpilih);
    }

    container.innerHTML = `
      <div
        class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
      >
        Gagal mengambil detail jadwal.
      </div>
    `;
  }
}

// =====================================================
// SELESAI: AMBIL DETAIL JADWAL PIKET
// =====================================================

// =====================================================
// MULAI: RENDER DETAIL JADWAL PIKET
// =====================================================

function renderDetailJadwalPiket(data) {
  const container = document.getElementById("detailJadwalPiket");

  if (!container) {
    return;
  }

  const daftarJadwal = [
    {
      kode: "P",
      label: "Piket",
      data: data.piket || [],
      warna: "green",
      icon: "user-check",
    },
    {
      kode: "LD",
      label: "Lepas Dinas",
      data: data.lepasDinas || [],
      warna: "red",
      icon: "user-check",
    },
    {
      kode: "C",
      label: "Cadangan",
      data: data.cadangan || [],
      warna: "amber",
      icon: "user-check",
    },
  ];

  container.innerHTML = daftarJadwal
    .map(function (item) {
      const daftarPetugas = item.data;

      return `
          <div
            class="rounded-xl border border-slate-100 bg-slate-50 p-3"
          >
            <div
              class="mb-2 flex items-center gap-2"
            >
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-${item.warna}-50 text-${item.warna}-600"
              >
                <i
                  data-lucide="${item.icon}"
                  class="h-5 w-5"
                ></i>
              </div>

              <div>
                <p
                  class="text-md font-bold text-slate-700"
                >
                  ${item.label}
                </p>

                <p
                  class="text-sm text-slate-400"
                >
                  ${item.kode}
                </p>
              </div>
            </div>

            ${
              daftarPetugas.length > 0
                ? `
                  <div class="space-y-1.5">
                    ${daftarPetugas
                      .map(function (nama) {
                        return `
                          <div
                            class="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                          >
                            ${escapeHtml(nama)}
                          </div>
                        `;
                      })
                      .join("")}
                  </div>
                `
                : `
                  <div
                    class="rounded-lg border border-dashed border-slate-200 bg-white px-3 py-2 text-xs text-slate-400"
                  >
                    Tidak ada petugas
                  </div>
                `
            }
          </div>
        `;
    })
    .join("");

  if (window.lucide) {
    lucide.createIcons();
  }
}

// =====================================================
// SELESAI: RENDER DETAIL JADWAL PIKET
// =====================================================

// =====================================================
// MULAI: ESCAPE HTML
// =====================================================

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// =====================================================
// SELESAI: ESCAPE HTML
// =====================================================

// =====================================================
// MULAI: INITIALIZATION JADWAL PIKET
// =====================================================

async function initializeJadwalPiket() {
  if (window.lucide) {
    lucide.createIcons();
  }

  await ambilPetugasPiketHariIni();

  renderKalenderPiket();

  await ambilDetailJadwalPiket();
}

// =====================================================
// SELESAI: INITIALIZATION JADWAL PIKET
// =====================================================

// =====================================================
// MULAI: JALANKAN INITIALIZATION
// =====================================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeJadwalPiket);
} else {
  initializeJadwalPiket();
}

// =====================================================
// SELESAI: JALANKAN INITIALIZATION
// =====================================================

// =====================================================
// SELESAI: JAVASCRIPT JADWAL PIKET
// =====================================================
