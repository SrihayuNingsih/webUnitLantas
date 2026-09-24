// =====================================================
// MULAI: API LAPORAN DAN REKAP
// =====================================================

import { ambilLakaLantas } from "./apiLakaLantas.js";

// =====================================================
// MULAI: PARSE TANGGAL INDONESIA
// =====================================================

const BULAN_INDONESIA = {
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

// function parseTanggalIndonesia(tanggal) {
//   if (!tanggal || typeof tanggal !== "string") {
//     return null;
//   }

//   const bagian = tanggal.trim().split(/\s+/);

//   if (bagian.length < 3) {
//     return null;
//   }

//   const tanggalAngka = Number(bagian[0]);
//   const namaBulan = bagian[1];
//   const tahun = Number(bagian[2]);

//   const bulan = BULAN_INDONESIA[namaBulan];

//   if (
//     !Number.isInteger(tanggalAngka) ||
//     !Number.isInteger(tahun) ||
//     bulan === undefined
//   ) {
//     return null;
//   }

//   const hasil = new Date(tahun, bulan, tanggalAngka);

//   if (Number.isNaN(hasil.getTime())) {
//     return null;
//   }

//   return hasil;
// }

function parseTanggalIndonesia(tanggal) {
  if (!tanggal || typeof tanggal !== "string") {
    return null;
  }

  const bagian = tanggal.trim().split("-");

  if (bagian.length !== 3) {
    return null;
  }

  const tahun = Number(bagian[0]);
  const bulan = Number(bagian[1]);
  const hari = Number(bagian[2]);

  if (
    !Number.isInteger(tahun) ||
    !Number.isInteger(bulan) ||
    !Number.isInteger(hari)
  ) {
    return null;
  }

  const hasil = new Date(tahun, bulan - 1, hari);

  if (Number.isNaN(hasil.getTime())) {
    return null;
  }

  return hasil;
}

// =====================================================
// SELESAI: PARSE TANGGAL INDONESIA
// =====================================================

// =====================================================
// MULAI: FORMAT TANGGAL
// =====================================================

function formatTanggalInput(tanggal) {
  if (!(tanggal instanceof Date) || Number.isNaN(tanggal.getTime())) {
    return null;
  }

  const tahun = tanggal.getFullYear();
  const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
  const hari = String(tanggal.getDate()).padStart(2, "0");

  return `${tahun}-${bulan}-${hari}`;
}

function parseTanggalInput(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const bagian = value.split("-");

  if (bagian.length !== 3) {
    return null;
  }

  const tahun = Number(bagian[0]);
  const bulan = Number(bagian[1]);
  const hari = Number(bagian[2]);

  if (
    !Number.isInteger(tahun) ||
    !Number.isInteger(bulan) ||
    !Number.isInteger(hari)
  ) {
    return null;
  }

  const hasil = new Date(tahun, bulan - 1, hari);

  if (Number.isNaN(hasil.getTime())) {
    return null;
  }

  return hasil;
}

// =====================================================
// SELESAI: FORMAT TANGGAL
// =====================================================

// =====================================================
// MULAI: LABEL PERIODE
// =====================================================

const NAMA_BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function buatLabelPeriode(type, startDate, endDate) {
  if (type === "semua") {
    return "Semua Data";
  }

  if (type === "bulanan" && startDate) {
    return `${NAMA_BULAN[startDate.getMonth()]} ${startDate.getFullYear()}`;
  }

  if (type === "tahunan" && startDate) {
    return `Tahun ${startDate.getFullYear()}`;
  }

  if (type === "rentang" && startDate && endDate) {
    return `${formatTanggalInput(startDate)} s/d ${formatTanggalInput(
      endDate,
    )}`;
  }

  return "Semua Data";
}

// =====================================================
// SELESAI: LABEL PERIODE
// =====================================================

// =====================================================
// MULAI: VALIDASI PERIODE
// =====================================================

function prosesPeriode(periode = {}) {
  const type = periode.type || "semua";

  if (!["semua", "bulanan", "tahunan", "rentang"].includes(type)) {
    throw new Error(`Jenis periode tidak valid: ${type}`);
  }

  if (type === "semua") {
    return {
      type,
      startDate: null,
      endDate: null,
      label: "Semua Data",
    };
  }

  const startDate = parseTanggalInput(periode.startDate);
  const endDate = parseTanggalInput(periode.endDate);

  if (!startDate || !endDate) {
    throw new Error("Tanggal periode tidak lengkap atau tidak valid.");
  }

  if (startDate > endDate) {
    throw new Error("Tanggal awal tidak boleh lebih besar dari tanggal akhir.");
  }

  return {
    type,
    startDate,
    endDate,
    label: buatLabelPeriode(type, startDate, endDate),
  };
}

// =====================================================
// SELESAI: VALIDASI PERIODE
// =====================================================

// =====================================================
// MULAI: FILTER DATA BERDASARKAN PERIODE
// =====================================================

function filterDataPeriode(data, periode) {
  if (periode.type === "semua") {
    return data;
  }

  return data.filter((item) => {
    const tanggalKejadian = parseTanggalIndonesia(item.tanggal);

    if (!tanggalKejadian) {
      return false;
    }

    return (
      tanggalKejadian >= periode.startDate && tanggalKejadian <= periode.endDate
    );
  });
}

// =====================================================
// SELESAI: FILTER DATA BERDASARKAN PERIODE
// =====================================================

// =====================================================
// MULAI: HITUNG REKAP
// =====================================================

function hitungRekap(data) {
  return data.reduce(
    (hasil, item) => {
      hasil.totalKejadian += 1;

      hasil.korbanLR += Number(item.jumlahLR) || 0;
      hasil.korbanLB += Number(item.jumlahLB) || 0;
      hasil.korbanMD += Number(item.jumlahMD) || 0;
      hasil.kerugianMaterial += Number(item.kermat) || 0;

      return hasil;
    },
    {
      totalKejadian: 0,
      korbanLR: 0,
      korbanLB: 0,
      korbanMD: 0,
      kerugianMaterial: 0,
    },
  );
}

// =====================================================
// SELESAI: HITUNG REKAP
// =====================================================

// =====================================================
// MULAI: HITUNG STATUS
// =====================================================

function hitungStatus(data) {
  return data.reduce(
    (hasil, item) => {
      const status = String(item.status || "").trim();

      if (status === "Dalam Penanganan") {
        hasil.dalamPenanganan += 1;
      }

      if (status === "Selesai" || status === "Selesai/RJ" || status === "RJ") {
        hasil.selesai += 1;
      }

      if (status === "Limpah Polres") {
        hasil.limpahPolres += 1;
      }

      return hasil;
    },
    {
      dalamPenanganan: 0,
      selesai: 0,
      limpahPolres: 0,
    },
  );
}

// =====================================================
// SELESAI: HITUNG STATUS
// =====================================================

// =====================================================
// MULAI: AMBIL LAPORAN DAN REKAP
// =====================================================

export async function ambilLaporanDanRekap(periodeInput = {}) {
  const periode = prosesPeriode(periodeInput);

  // Mengambil SEMUA data Laka Lantas.
  // Berbeda dengan Dashboard yang hanya menggunakan
  // laporan terbaru.
  const semuaData = await ambilLakaLantas();

  const dataTerfilter = filterDataPeriode(semuaData, periode);

  const summary = hitungRekap(dataTerfilter);
  const status = hitungStatus(dataTerfilter);

  const reports = dataTerfilter.map((item) => ({
    ...item,
    tanggalKejadian: formatTanggalInput(parseTanggalIndonesia(item.tanggal)),
  }));

  return {
    success: true,
    message: "Data laporan dan rekap berhasil diambil.",
    periode: {
      type: periode.type,
      label: periode.label,
      startDate: periode.startDate
        ? formatTanggalInput(periode.startDate)
        : null,
      endDate: periode.endDate ? formatTanggalInput(periode.endDate) : null,
    },
    summary,
    status,
    reports,
    updatedAt: new Date().toISOString(),
  };
}

// =====================================================
// SELESAI: AMBIL LAPORAN DAN REKAP
// =====================================================
