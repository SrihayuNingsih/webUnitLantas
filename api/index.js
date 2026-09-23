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

  // EKSPLISIT DESTRUCTURING ACTION DARI REQ.BODY
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
  // MULAI: ACTION AMBIL PETUGAS INPUT LAPORAN
  // =====================================================

  if (action === "AMBIL_PETUGAS_INPUT") {
    const GAS_API_URL =
      "https://script.google.com/macros/s/AKfycbzg7AmEQz7qQeAlfogSfGNkyHOlcFYyuY2zkm5SmkQWJwUNN9qx1JV_DhUsziXIjfu_/exec";

    const gasPayload = {
      modul: "laka",
      aksi: "ambilpetugas",
    };

    let gasResponse;
    let gasResult;

    try {
      gasResponse = await fetch(GAS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gasPayload),
      });

      const gasText = await gasResponse.text();

      console.log(
        "[API AMBIL PETUGAS INPUT] HTTP GAS:",
        gasResponse.status,
        gasResponse.statusText,
      );

      console.log("[API AMBIL PETUGAS INPUT] RAW RESPONSE GAS:", gasText);

      try {
        gasResult = JSON.parse(gasText);
      } catch (parseError) {
        console.error(
          "[API AMBIL PETUGAS INPUT] RESPONSE GAS BUKAN JSON:",
          parseError,
        );

        return res.status(500).json({
          success: false,
          message: "Response Google Apps Script bukan JSON.",
          detail: gasText.substring(0, 500),
        });
      }
    } catch (error) {
      console.error("[API AMBIL PETUGAS INPUT] ERROR FETCH GAS:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal menghubungi Google Apps Script.",
        detail: error.message,
      });
    }

    if (!gasResponse.ok || gasResult.sukses === false) {
      return res.status(500).json({
        success: false,
        message:
          gasResult.pesan ||
          "Google Apps Script gagal mengambil daftar petugas.",
      });
    }

    return res.status(200).json({
      success: true,
      data: gasResult.data || [],
    });
  }

  // =====================================================
  // SELESAI: ACTION AMBIL PETUGAS INPUT LAPORAN
  // =====================================================

  // =====================================================
  // MULAI: ACTION SIMPAN LAPORAN
  // =====================================================

  if (action === "SIMPAN_LAPORAN") {
    const data = { ...req.body };
    delete data.action;

    console.log("[API SIMPAN LAPORAN] Data final dari FE:", data);

    // =====================================================
    // MULAI: KIRIM DATA KE GOOGLE APPS SCRIPT
    // =====================================================

    const GAS_API_URL =
      "https://script.google.com/macros/s/AKfycbzg7AmEQz7qQeAlfogSfGNkyHOlcFYyuY2zkm5SmkQWJwUNN9qx1JV_DhUsziXIjfu_/exec";

    const gasPayload = {
      modul: "laka",
      aksi: "simpan",
      ...data,
    };

    // const gasResponse = await fetch(GAS_API_URL, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(gasPayload),
    // });

    // const gasResult = await gasResponse.json();

    // console.log("[API SIMPAN LAPORAN] Response GAS:", gasResult);

    // =====================================================
    // MULAI: FETCH GOOGLE APPS SCRIPT
    // =====================================================

    let gasResponse;
    let gasResult;

    try {
      gasResponse = await fetch(GAS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gasPayload),
      });

      const gasText = await gasResponse.text();

      console.log(
        "[API SIMPAN LAPORAN] HTTP GAS:",
        gasResponse.status,
        gasResponse.statusText,
      );

      console.log("[API SIMPAN LAPORAN] RAW RESPONSE GAS:", gasText);

      try {
        gasResult = JSON.parse(gasText);
      } catch (parseError) {
        console.error(
          "[API SIMPAN LAPORAN] RESPONSE GAS BUKAN JSON:",
          parseError,
        );

        return res.status(500).json({
          success: false,
          message: "Response Google Apps Script bukan JSON.",
          detail: gasText.substring(0, 500),
        });
      }

      console.log("[API SIMPAN LAPORAN] Response GAS:", gasResult);
    } catch (error) {
      console.error("[API SIMPAN LAPORAN] ERROR FETCH GAS:", error);

      return res.status(500).json({
        success: false,
        message: "Gagal menghubungi Google Apps Script.",
        detail: error.message,
      });
    }

    // =====================================================
    // SELESAI: FETCH GOOGLE APPS SCRIPT
    // =====================================================

    // =====================================================
    // SELESAI: KIRIM DATA KE GOOGLE APPS SCRIPT
    // =====================================================

    if (!gasResponse.ok || gasResult.sukses === false) {
      return res.status(500).json({
        success: false,
        message:
          gasResult.pesan || "Google Apps Script gagal menyimpan laporan.",
      });
    }

    return res.status(200).json({
      success: true,
      message: gasResult.pesan || "Laporan berhasil disimpan.",
      data: gasResult,
    });
  }

  // =====================================================
  // SELESAI: ACTION SIMPAN LAPORAN
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
