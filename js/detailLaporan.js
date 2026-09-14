/* =====================================================
         ELEMENT
      ====================================================== */

const detailLaporanOverlay = document.getElementById("detailLaporanOverlay");

const btnTutupDetail = document.getElementById("btnTutupDetail");

const btnTutupDetailBottom = document.getElementById("btnTutupDetailBottom");
/* =====================================================
         AWAL TAMBAHAN CODE
      ====================================================== */

const dataLakaDetail = typeof lakaData !== "undefined" ? lakaData : [];
/* =====================================================
   FUNGSI UTAMA: BUKA DETAIL LAPORAN BERDASARKAN ID
====================================================== */

function bukaDetailLaporan(idLaporan) {
  // 1. Cek apakah const lakaData sudah terisi
  if (!Array.isArray(dataLakaDetail) || dataLakaDetail.length === 0) {
    console.warn("Data lakaData belum dimuat atau kosong.");
    return;
  }

  // 2. Cari data yang cocok berdasarkan ID / Nomor Laporan
  const dataMentah = dataLakaDetail.find(
    (item) =>
      String(item.id || item.ID || item.nomorLaporan || "") ===
      String(idLaporan),
  );

  if (!dataMentah) {
    alert("Data laporan dengan ID " + idLaporan + " tidak ditemukan!");
    return;
  }

  // 3. Normalisasi data agar siap di-render
  const dataSiap = normalisasiData(dataMentah);

  // 4. Render seluruh komponen UI
  renderLaporan(dataSiap);

  // 5. Tampilkan Modal / Overlay Detail
  if (detailLaporanOverlay) {
    detailLaporanOverlay.classList.remove("hidden");
    detailLaporanOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
  }
}
/* =====================================================
         AKHIR TAMBAHAN CODE
      ====================================================== */

/* =====================================================
         TUTUP DETAIL
         HANYA MENYEMBUNYIKAN OVERLAY.
         TIDAK NAVIGASI.
      ====================================================== */

function tutupDetailLaporan() {
  detailLaporanOverlay.classList.add("hidden");

  detailLaporanOverlay.setAttribute("aria-hidden", "true");

  document.body.classList.remove("overflow-hidden");
}

btnTutupDetail?.addEventListener("click", tutupDetailLaporan);

btnTutupDetailBottom?.addEventListener("click", tutupDetailLaporan);

/* =====================================================
         STATUS
         3 NILAI TERKUNCI
      ====================================================== */

function setStatusLaporan(status) {
  const badge = document.getElementById("statusBadge");
  const dot = document.getElementById("statusBadgeDot");
  const text = document.getElementById("statusBadgeText");

  if (!badge || !dot || !text) return;

  const statusAsli = String(status || "")
    .trim()
    .toLowerCase();

  // =====================================================
  // NORMALISASI STATUS UNTUK TAMPILAN
  // =====================================================
  let statusTampil = status;

  if (
    statusAsli === "rj" ||
    statusAsli === "selesai" ||
    statusAsli === "selesai/rj" ||
    statusAsli === "selesai / rj"
  ) {
    statusTampil = "Selesai";
  } else if (statusAsli === "dalam penanganan") {
    statusTampil = "Dalam Penanganan";
  } else if (statusAsli === "limpah polres") {
    statusTampil = "Limpah Polres";
  }

  // =====================================================
  // TAMPILKAN TEXT STATUS
  // =====================================================
  text.textContent = safeText(statusTampil);

  // =====================================================
  // RESET CLASS
  // =====================================================
  badge.className =
    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold";

  dot.className = "h-2 w-2 rounded-full";

  // =====================================================
  // WARNA STATUS
  // =====================================================
  if (statusTampil === "Selesai") {
    badge.classList.add("bg-emerald-200", "text-emerald-700");

    dot.classList.add("bg-emerald-500");
  } else if (statusTampil === "Dalam Penanganan") {
    badge.classList.add("bg-amber-100", "text-amber-700");

    dot.classList.add("bg-amber-500");
  } else if (statusTampil === "Limpah Polres") {
    badge.classList.add("bg-rose-200", "text-rose-700");

    dot.classList.add("bg-rose-500");
  } else {
    badge.classList.add("bg-slate-100", "text-slate-600");

    dot.classList.add("bg-slate-400");
  }
}

/* =====================================================
         HELPER
      ====================================================== */

function safeText(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
}

function formatRupiah(value) {
  const number = Number(String(value || 0).replace(/[^\d]/g, ""));

  return "Rp " + number.toLocaleString("id-ID");
}

/* =====================================================
         RENDER HEADER
      ====================================================== */

function renderHeader(data) {
  const laporanId = document.getElementById("laporanId");
  const laporanIdSecondary = document.getElementById("laporanIdSecondary");
  const waktuInput = document.getElementById("waktuInput");

  if (laporanId) {
    laporanId.textContent = safeText(data.id);
  }

  if (laporanIdSecondary) {
    laporanIdSecondary.textContent = safeText(data.nomorLP);
  }

  if (waktuInput) {
    waktuInput.textContent = safeText(data.waktuInput);
  }

  setStatusLaporan(data.status);
}
/* =====================================================
         RENDER RINGKASAN
      ====================================================== */

function renderRingkasan(data) {
  document.getElementById("jumlahLR").textContent = safeText(data.jumlahLR);

  document.getElementById("jumlahLB").textContent = safeText(data.jumlahLB);

  document.getElementById("jumlahMD").textContent = safeText(data.jumlahMD);

  document.getElementById("jumlahKermat").textContent = formatRupiah(
    data.kermat,
  );
}

/* =====================================================
         RENDER WAKTU
      ====================================================== */

function renderWaktu(data) {
  document.getElementById("tanggalKejadian").textContent = safeText(
    data.tanggal,
  );

  document.getElementById("jamKejadian").textContent = safeText(data.jam);
}

/* =====================================================
         RENDER LOKASI
      ====================================================== */

function renderLokasi(data) {
  document.getElementById("tkp").textContent = safeText(data.tkp);
}

/* =====================================================
         RENDER KENDARAAN
         DATA KENDARAAN TETAP DIGABUNG.
         BELUM DIPECAH MENJADI FIELD TERPISAH.
      ====================================================== */

/* =====================================================
   RENDER KENDARAAN (TAILWIND CSS)
====================================================== */

function renderKendaraan(data) {
  const container = document.getElementById("kendaraanGrid");

  if (!container) return;

  const kendaraan = Array.isArray(data.kendaraan) ? data.kendaraan : [];

  // =====================================================
  // JIKA TIDAK ADA DATA KENDARAAN
  // =====================================================
  if (kendaraan.length === 0) {
    container.innerHTML = `
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-sm text-slate-500">
          Tidak ada data kendaraan.
        </p>
      </div>
    `;

    return;
  }

  // =====================================================
  // RENDER SETIAP KENDARAAN
  // =====================================================
  container.innerHTML = kendaraan
    .map((item, index) => {
      const jenisKendaraan = String(item.kendaraan || "").toLowerCase();

      // ---------------------------------------------------
      // NOMOR POLISI
      // ---------------------------------------------------
      const nopol = safeText(item.nopol);

      const nopolText =
        item.nopol && String(item.nopol).trim() !== ""
          ? `No. Pol: ${nopol}`
          : "No. Pol: - (tanpa Nopol)";

      // ---------------------------------------------------
      // TENTUKAN JENIS ORANG YANG DITAMPILKAN
      // ---------------------------------------------------
      let labelOrang = "Pengemudi";
      let dataOrang = "";

      if (jenisKendaraan.includes("sepeda pancal")) {
        labelOrang = "Pengayuh";
        dataOrang = item.pengayuh || "";
      } else if (jenisKendaraan.includes("pejalan kaki")) {
        labelOrang = "Pejalan Kaki";
        dataOrang = item.pejalanKaki || item["pejalan kaki"] || item.nama || "";
      } else if (jenisKendaraan.includes("sepeda motor")) {
        labelOrang = "Pengendara";
        dataOrang = item.pengendara || "";
      } else {
        labelOrang = "Pengemudi";
        dataOrang = item.pengemudi || "";
      }

      // ---------------------------------------------------
      // PEMBONCENG
      // Hanya ditampilkan kalau memang ada
      // ---------------------------------------------------
      const pemboncengAda =
        item.pembonceng !== undefined &&
        item.pembonceng !== null &&
        String(item.pembonceng).trim() !== "";

      return `
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

          <!-- NOMOR KENDARAAN -->
          <div class="mb-3 flex items-start gap-3">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-md font-bold text-blue-700"
            >
              ${index + 1}
            </div>

            <div class="min-w-0">
              <p class="break-words text-md font-bold text-blue-950">
                ${safeText(item.kendaraan)}
              </p>

              <p class="mt-1 break-words text-sm font-medium text-slate-500">
                ${nopolText}
              </p>
            </div>
          </div>

          <!-- PENGEMUDI / PENGENDARA / PENGAYUH / PEJALAN KAKI -->
          <div class="border-t border-slate-100 pt-3">
            <p class="text-[12px] font-semibold uppercase tracking-wide text-slate-400">
              ${labelOrang}
            </p>

            <p class="mt-1 whitespace-pre-line break-words text-sm font-bold text-blue-950">
              ${safeText(dataOrang)}
            </p>
          </div>

          ${
            pemboncengAda
              ? `
                <!-- PEMBONCENG -->
                <div class="mt-3 border-t border-slate-100 pt-3">
                  <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Pembonceng
                  </p>

                  <p class="mt-1 whitespace-pre-line break-words text-sm font-bold text-blue-950">
                    ${safeText(item.pembonceng)}
                  </p>
                </div>
              `
              : ""
          }

        </div>
      `;
    })
    .join("");
}

/* =====================================================
         RENDER SAKSI
      ====================================================== */

/* =====================================================
   RENDER SAKSI (TAILWIND CSS)
====================================================== */
function renderSaksi(data) {
  const container = document.getElementById("saksiGrid");

  if (!container) return;

  const saksi = Array.isArray(data.saksi) ? data.saksi : [];

  console.log("DATA SAKSI:", saksi);

  if (!saksi.length) {
    container.innerHTML = `
      <div class="md:col-span-2 rounded-xl border border-dashed border-blue-300/80 bg-blue-100/40 p-4 text-center text-xs font-semibold text-blue-800">
        Tidak ada data saksi yang tersedia.
      </div>
    `;
    return;
  }

  // Grid col 2 mulai breakpoint md (768px)
  container.className = "mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-2";

  container.innerHTML = saksi
    .map(
      (item, index) => `
        <article class="overflow-hidden rounded-xl border border-blue-300/60 bg-gradient-to-br from-blue-50/90 to-blue-100/75 shadow-sm">
          <!-- Header Card Saksi dengan Nomor (S1, S2, dst.) -->
          <div class="flex items-center gap-2.5 border-b border-blue-300/50 bg-gradient-to-r from-blue-100/90 to-blue-200/50 p-2.5">
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-400/40 bg-gradient-to-br from-blue-600 to-blue-800 text-[0.7rem] font-black text-white shadow-sm">
              S${index + 1}
            </div>
            <div class="min-w-0">
              <h3 class="text-xs sm:text-sm font-black text-blue-950 leading-tight">
                Saksi ${index + 1}
              </h3>
              <p class="mt-0.5 text-[0.65rem] font-medium text-blue-800/80 leading-tight">
                Pemberi keterangan
              </p>
            </div>
          </div>

          <!-- Detail Identitas Saksi -->
          <div class="p-2.5">
            <div class="rounded-lg border border-blue-300/40 bg-blue-50/60 p-2">
              <p class="mt-1 whitespace-pre-line break-words text-sm font-bold text-blue-950">
                ${safeText(item.saksi || item.nama || item)}
              </p>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

/* =====================================================
         RENDER KRONOLOGI
      ====================================================== */

function renderKronologi(data) {
  document.getElementById("kronologi").textContent = safeText(data.kronologi);
}

/* =====================================================
         RENDER PETUGAS
      ====================================================== */
/* =====================================================
   RENDER PETUGAS (TAILWIND CSS)
====================================================== */
function renderPetugas(data) {
  const container = document.getElementById("petugasList");

  if (!container) return;

  const petugas = Array.isArray(data.petugas) ? data.petugas : [];

  if (!petugas.length) {
    container.innerHTML = `
      <div class="rounded-xl border border-dashed border-blue-300/80 bg-blue-100/40 p-4 text-center text-xs font-semibold text-blue-800">
        Tidak ada data petugas yang tersedia.
      </div>
    `;
    return;
  }

  // Ubah wrapper container ke grid col 2 mulai breakpoint md (768px)
  container.className = "mt-2.5 grid grid-cols-1 gap-2.5 md:grid-cols-2";

  container.innerHTML = petugas
    .map(
      (item) => `
        <div class="flex items-center gap-2.5 rounded-xl border border-blue-300/60 bg-gradient-to-br from-blue-50/90 to-blue-100/75 p-2.5 shadow-sm">
          <!-- Icon Petugas (Tanpa Angka) -->
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-400/40 bg-gradient-to-br from-blue-100 to-blue-200/80 text-blue-700 shadow-sm">
            <i data-lucide="user-check" class="h-4 w-4"></i>
          </div>
          
          <div class="min-w-0 flex-1">
            <p class="text-[0.65rem] font-extrabold uppercase tracking-wider text-blue-700 leading-tight">
              Piket Lantas
            </p>
            <p class="mt-0.5 truncate text-sm font-bold text-blue-950">
              ${safeText(item.nama || item)}
            </p>
          </div>
        </div>
      `,
    )
    .join("");

  // Re-initialize Lucide Icons jika digunakan di project
  if (window.lucide) {
    lucide.createIcons();
  }
}

/* =====================================================
         RENDER DOKUMENTASI
      ====================================================== */

function renderDokumentasi(data) {
  const section = document.getElementById("sectionDokumentasi");
  const link = document.getElementById("linkDokumentasi");
  const nama = document.getElementById("namaDokumentasi");

  if (!section || !link || !nama) return;

  const dokumentasi = data.dokumentasi;

  // =====================================================
  // TIDAK ADA DOKUMENTASI
  // =====================================================
  if (!dokumentasi) {
    section.classList.add("hidden");
    return;
  }

  // =====================================================
  // JIKA DOKUMENTASI BERUPA STRING
  // =====================================================
  if (typeof dokumentasi === "string") {
    section.classList.remove("hidden");

    nama.textContent = "Buka Berkas Google Drive";
    link.href = dokumentasi;

    return;
  }

  // =====================================================
  // JIKA DOKUMENTASI BERUPA OBJECT
  // =====================================================
  const url = dokumentasi.url || "";
  const keterangan = dokumentasi.keterangan || "";

  // Kalau tidak ada URL, jangan tampilkan section
  if (!url) {
    section.classList.add("hidden");
    return;
  }

  section.classList.remove("hidden");

  link.href = url;

  nama.textContent =
    keterangan.trim() !== "" ? keterangan : "Buka Berkas Google Drive";
}

/* =====================================================
         RENDER SEMUA
      ====================================================== */

function renderLaporan(data) {
  renderHeader(data);

  renderRingkasan(data);

  renderWaktu(data);

  renderLokasi(data);

  renderKendaraan(data);

  renderSaksi(data);

  renderKronologi(data);

  renderPetugas(data);

  renderDokumentasi(data);

  /*
          Render ulang icon setelah elemen
          dinamis dibuat.
        */

  if (window.lucide) {
    lucide.createIcons();
  }
}

/* =====================================================
         AMBIL DATA DARI lakaData
         Jika lakaData sudah tersedia,
         cari berdasarkan ?id=...
      ====================================================== */

function ambilDataLaporan() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (Array.isArray(lakaData) && lakaData.length > 0) {
    if (id) {
      const laporan = lakaData.find(
        (item) => String(item.id || "") === String(id),
      );

      return normalisasiData(laporan);
    }

    return normalisasiData(lakaData[0]);
  }

  return normalisasiData(null);
}

/* =====================================================
   NORMALISASI DATA
   SESUAI STRUKTUR lakaData TERBARU
====================================================== */

function normalisasiData(data) {
  // =====================================================
  // JIKA DATA TIDAK DITEMUKAN
  // =====================================================
  if (!data) {
    return {
      id: "-",
      nomorLP: "-",
      tanggal: "-",
      jam: "-",
      waktuInput: "-",
      status: "-",
      jumlahLR: 0,
      jumlahLB: 0,
      jumlahMD: 0,
      kermat: 0,
      tkp: "-",
      kronologi: "-",
      kendaraan: [],
      saksi: [],
      petugas: [],
      dokumentasi: null,
    };
  }

  // =====================================================
  // NORMALISASI DATA YANG ADA
  // =====================================================

  const listKendaraan = Array.isArray(data.kendaraan) ? data.kendaraan : [];

  const listSaksi = Array.isArray(data.saksi) ? data.saksi : [];

  const listPetugas = Array.isArray(data.petugas) ? data.petugas : [];

  const dokumentasi = data.dokumentasi || null;

  return {
    id: data.id || "-",
    nomorLP:
      data.nomorLP !== undefined &&
      data.nomorLP !== null &&
      String(data.nomorLP).trim() !== ""
        ? String(data.nomorLP).trim()
        : "-",
    tanggal: data.tanggal || "-",
    jam: data.jam || "-",
    waktuInput: data.waktuInput || "-",
    status: data.status || "-",

    jumlahLR: data.jumlahLR ?? 0,
    jumlahLB: data.jumlahLB ?? 0,
    jumlahMD: data.jumlahMD ?? 0,
    kermat: data.kermat ?? 0,

    tkp: data.tkp || "-",
    kronologi: data.kronologi || "-",

    kendaraan: listKendaraan,
    saksi: listSaksi,
    petugas: listPetugas,
    dokumentasi: dokumentasi,
  };
}

/* =====================================================
   AWAL TAMBAHAN CODE
====================================================== */

/* =====================================================
   AKHIR TAMBAHAN CODE
====================================================== */

/* =====================================================
         INIT
      ====================================================== */

function initDetailLaporan() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  // Jika halaman dibuka langsung sebagai detailLaporan.html?id=...
  // maka tampilkan detail seperti sebelumnya.
  if (id) {
    const data = ambilDataLaporan();

    renderLaporan(data);

    if (detailLaporanOverlay) {
      detailLaporanOverlay.classList.remove("hidden");
      detailLaporanOverlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("overflow-hidden");
    }
  } else {
    // Jika detailLaporan.js dipakai sebagai overlay
    // di halLakaLantas.html, jangan tampilkan otomatis.
    if (detailLaporanOverlay) {
      detailLaporanOverlay.classList.add("hidden");
      detailLaporanOverlay.setAttribute("aria-hidden", "true");
    }

    document.body.classList.remove("overflow-hidden");
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}
/* =====================================================
         ESC UNTUK MENUTUP
      ====================================================== */

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    tutupDetailLaporan();
  }
});

/* =====================================================
         DOM READY
      ====================================================== */

document.addEventListener("DOMContentLoaded", initDetailLaporan);
