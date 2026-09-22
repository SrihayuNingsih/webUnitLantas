// =====================================================
// MULAI: BACKEND API ENTRY POINT
// =====================================================

import { ambilLakaLantas } from "./apiLakaLantas.js";
import { ambilLaporanDanRekap } from "./apiLaporanDanRekap.js";

function ambilLakaTerbaruDashboard() {
  const dataLaka = [
    {
      id: "LKA-2026-001",
      tanggal: "23 Juli 2026",
      jam: "08:15",
      nomorLP: "LP-0101-BJN/I/2026",
      status: "Limpah Polres",
      jumlahLR: 2,
      jumlahLB: 1,
      jumlahMD: 0,
      tkp: "Jl. Raya Bojonegoro - Babat turut wilayah Desa Baureno Kec. Baureno Kab. Bojonegoro",
    },

    {
      id: "LKA-2026-002",
      tanggal: "12 Januari 2026",
      jam: "14:30",
      nomorLP: "Belum tersedia",
      status: "Limpah Polres",
      jumlahLR: 1,
      jumlahLB: 1,
      jumlahMD: 0,
      tkp: "Jl. Raya Baureno - Babat Desa Tanggungan Kec. Baureno",
    },

    {
      id: "LKA-2026-003",
      tanggal: "20 Januari 2026",
      jam: "19:20",
      nomorLP: "Nihil",
      status: "Selesai",
      jumlahLR: 3,
      jumlahLB: 0,
      jumlahMD: 0,
      tkp: "Jl. Raya Bojonegoro - Babat Desa Sraturejo Kec. Baureno",
    },

    {
      id: "LKA-2026-004",
      tanggal: "28 Januari 2026",
      jam: "06:45",
      nomorLP: "LP-0104-BJN/I/2026",
      status: "Limpah Polres",
      jumlahLR: 0,
      jumlahLB: 1,
      jumlahMD: 1,
      tkp: "Jl. Raya Baureno Desa Gunungsari Kec. Baureno",
    },
  ];

  return dataLaka;
}

// =====================================================
// MULAI: REKAP DASHBOARD
// =====================================================

function ambilRekapDashboard() {
  return {
    totalKejadian: 4,
    jumlahLR: 6,
    jumlahLB: 3,
    jumlahMD: 1,
    dalamPenanganan: 0,
    selesai: 1,
    limpahPolres: 3,
  };
}

// =====================================================
// SELESAI: REKAP DASHBOARD
// =====================================================

// =====================================================
// MULAI: PETUGAS PIKET DASHBOARD
// =====================================================

function ambilPetugasPiketDashboard() {
  return {
    tanggal: "17 September 2026",
    petugas: [
      {
        namaLengkap: "Bripka Cahyo Tri H",
      },
      {
        namaLengkap: "Briptu Nugroho",
      },
    ],
  };
}

// =====================================================
// SELESAI: PETUGAS PIKET DASHBOARD
// =====================================================

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan.",
    });
  }

  const { action } = req.body || {};

  if (!action) {
    return res.status(400).json({
      success: false,
      message: "Action API belum ditentukan.",
    });
  }

  if (action === "AMBIL_LAKA_LANTAS") {
    const data = ambilLakaLantas();

    return res.status(200).json({
      success: true,
      data,
    });
  }

  // =====================================================
  // MULAI AMBIL DETAIL LAPORAN
  // =====================================================

  if (action === "AMBIL_DETAIL_LAPORAN") {
    const { id } = req.body;

    const data = ambilLakaLantas();

    const laporan = data.find((item) => String(item.id) === String(id));

    if (!laporan) {
      return res.status(404).json({
        success: false,
        message: "Data laporan tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: laporan,
    });
  }

  // =====================================================
  // SELESAI AMBIL DETAIL LAPORAN
  // =====================================================

  if (action === "AMBIL_LAKA_TERBARU_DASHBOARD") {
    const data = ambilLakaTerbaruDashboard();

    return res.status(200).json({
      success: true,
      data,
    });
  }

  // =====================================================
  // MULAI: ACTION REKAP DASHBOARD
  // =====================================================

  if (action === "AMBIL_REKAP_DASHBOARD") {
    const data = ambilRekapDashboard();

    return res.status(200).json({
      success: true,
      data,
    });
  }

  // =====================================================
  // SELESAI: ACTION REKAP DASHBOARD
  // =====================================================

  // =====================================================
  // MULAI: ACTION PETUGAS PIKET DASHBOARD
  // =====================================================

  if (action === "AMBIL_PETUGAS_PIKET_DASHBOARD") {
    const data = ambilPetugasPiketDashboard();

    return res.status(200).json({
      success: true,
      data,
    });
  }

  // =====================================================
  // SELESAI: ACTION PETUGAS PIKET DASHBOARD
  // =====================================================

  // =====================================================
  // MULAI: ACTION AMBIL LAPORAN DAN REKAP
  // =====================================================

  if (action === "AMBIL_LAPORAN_DAN_REKAP") {
    const data = ambilLaporanDanRekap(req.body?.periode);

    return res.status(200).json(data);
  }

  // =====================================================
  // SELESAI: ACTION AMBIL LAPORAN DAN REKAP
  // =====================================================

  return res.status(400).json({
    success: false,
    message: `Action tidak dikenali: ${action}`,
  });
}

// =====================================================
// SELESAI: BACKEND API ENTRY POINT
// =====================================================
