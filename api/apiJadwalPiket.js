// =====================================================
// API JADWAL PIKET
// =====================================================

// =====================================================
// MULAI: KONFIGURASI GOOGLE APPS SCRIPT
// =====================================================

const GAS_API_URL =
  "https://script.google.com/macros/s/AKfycbzg7AmEQz7qQeAlfogSfGNkyHOlcFYyuY2zkm5SmkQWJwUNN9qx1JV_DhUsziXIjfu_/exec";

// =====================================================
// SELESAI: KONFIGURASI GOOGLE APPS SCRIPT
// =====================================================

// =====================================================
// MULAI: AMBIL DETAIL JADWAL PIKET
// =====================================================

export async function ambilDetailJadwalPiket(tanggal) {
  const gasPayload = {
    modul: "jadwalpiket",
    aksi: "detailjadwal",
    tanggal,
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
        "Google Apps Script gagal mengambil detail jadwal piket.",
    );
  }

  return (
    gasResult.hasil || {
      tanggal: tanggal,
      piket: [],
      lepasDinas: [],
      cadangan: [],
    }
  );
}

// =====================================================
// SELESAI: AMBIL DETAIL JADWAL PIKET
// =====================================================
