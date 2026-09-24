// =====================================================
// MULAI: BACKEND API ENTRY POINT
// =====================================================

import { ambilLakaLantas } from "./apiLakaLantas.js";
import { ambilLaporanDanRekap } from "./apiLaporanDanRekap.js";

// =====================================================
// MULAI: KONFIGURASI GOOGLE APPS SCRIPT DASHBOARD
// =====================================================

const GAS_API_URL =
  "https://script.google.com/macros/s/AKfycbzg7AmEQz7qQeAlfogSfGNkyHOlcFYyuY2zkm5SmkQWJwUNN9qx1JV_DhUsziXIjfu_/exec";

// =====================================================
// SELESAI: KONFIGURASI GOOGLE APPS SCRIPT DASHBOARD
// =====================================================

// =====================================================
// MULAI: AMBIL LAKA TERBARU DASHBOARD
// Sumber : DATA_LAKA melalui Google Apps Script
// =====================================================

async function ambilLakaTerbaruDashboard() {
  const gasPayload = {
    modul: "dashboard",
    aksi: "laporanterbaru",
  };

  const gasResponse = await fetch(GAS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gasPayload),
  });

  const gasResult = await gasResponse.json();

  if (!gasResponse.ok || gasResult.sukses === false) {
    throw new Error(
      gasResult.pesan ||
        "Google Apps Script gagal mengambil laporan terbaru Dashboard.",
    );
  }

  const hasil = gasResult.hasil || [];

  // ---------------------------------------------------
  // Sesuaikan hasil GAS dengan kontrak Dashboard
  // ---------------------------------------------------

  return hasil.map(function (laporan) {
    return {
      id: laporan.idLaporan || "",

      tanggal: laporan.tanggal || "",

      jam: laporan.jam || "",

      nomorLP: laporan.nomorLP || "",

      status: laporan.statusPenanganan || "",

      jumlahLR: Number(laporan.korbanLR) || 0,

      jumlahLB: Number(laporan.korbanLB) || 0,

      jumlahMD: Number(laporan.korbanMD) || 0,

      tkp: laporan.tkp || "",
    };
  });
}

// =====================================================
// SELESAI: AMBIL LAKA TERBARU DASHBOARD
// =====================================================

// =====================================================
// MULAI: AMBIL REKAP DASHBOARD
// Sumber : DATA_LAKA melalui Google Apps Script
// =====================================================

async function ambilRekapDashboard() {
  const gasPayload = {
    modul: "dashboard",
    aksi: "rekap",
  };

  const gasResponse = await fetch(GAS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gasPayload),
  });

  const gasResult = await gasResponse.json();

  if (!gasResponse.ok || gasResult.sukses === false) {
    throw new Error(
      gasResult.pesan || "Google Apps Script gagal mengambil rekap Dashboard.",
    );
  }

  const hasil = gasResult.hasil || {};

  // ---------------------------------------------------
  // Sesuaikan hasil GAS dengan kontrak Dashboard
  // ---------------------------------------------------

  return {
    totalKejadian: Number(hasil.totalKejadian) || 0,

    jumlahLR: Number(hasil.jumlahLR) || 0,

    jumlahLB: Number(hasil.jumlahLB) || 0,

    jumlahMD: Number(hasil.jumlahMD) || 0,

    dalamPenanganan: Number(hasil.statusDalamPenanganan) || 0,

    selesai: Number(hasil.statusSelesai) || 0,

    limpahPolres: Number(hasil.statusLimpahPolres) || 0,
  };
}

// =====================================================
// SELESAI: AMBIL REKAP DASHBOARD
// =====================================================

// =====================================================
// MULAI: AMBIL PETUGAS PIKET DASHBOARD
// Sumber : JADWAL_PIKET melalui Google Apps Script
// =====================================================

async function ambilPetugasPiketDashboard() {
  const gasPayload = {
    modul: "dashboard",
    aksi: "petugaspiket",
  };

  const gasResponse = await fetch(GAS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gasPayload),
  });

  const gasResult = await gasResponse.json();

  if (!gasResponse.ok || gasResult.sukses === false) {
    throw new Error(
      gasResult.pesan ||
        "Google Apps Script gagal mengambil petugas piket Dashboard.",
    );
  }

  const hasil = gasResult.hasil || {};

  // ---------------------------------------------------
  // Sesuaikan hasil GAS dengan kontrak Dashboard
  // ---------------------------------------------------

  const petugas = [];

  if (hasil.petugas1) {
    petugas.push({
      namaLengkap: hasil.petugas1,
    });
  }

  if (hasil.petugas2) {
    petugas.push({
      namaLengkap: hasil.petugas2,
    });
  }

  return {
    tanggal: hasil.tanggal || "",

    petugas: petugas,
  };
}

// =====================================================
// SELESAI: AMBIL PETUGAS PIKET DASHBOARD
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
    const data = await ambilLakaLantas();

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

    const data = await ambilLakaLantas();

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
    const data = await ambilLakaTerbaruDashboard();

    return res.status(200).json({
      success: true,
      data,
    });
  }

  // =====================================================
  // MULAI: ACTION REKAP DASHBOARD
  // =====================================================

  if (action === "AMBIL_REKAP_DASHBOARD") {
    const data = await ambilRekapDashboard();

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
    const data = await ambilPetugasPiketDashboard();

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
