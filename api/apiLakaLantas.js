// =====================================================
// MULAI: API LAKA LANTAS
// =====================================================

export async function ambilLakaLantas() {
  const GAS_API_URL =
    "https://script.google.com/macros/s/AKfycbzg7AmEQz7qQeAlfogSfGNkyHOlcFYyuY2zkm5SmkQWJwUNN9qx1JV_DhUsziXIjfu_/exec";

  const gasPayload = {
    modul: "lakalantas",
    aksi: "daftar",
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
      gasResult.pesan || "Google Apps Script gagal mengambil data Laka Lantas.",
    );
  }

  return (gasResult.hasil || []).map(function (laporan) {
    return {
      id: laporan.idLaporan || "",

      tanggal: laporan.tanggal || "",

      jam: laporan.jam || "",

      waktuInput: laporan.waktuInput || "",

      nomorLP: laporan.nomorLP || "",

      status: laporan.statusPenanganan || "",

      jumlahLR: Number(laporan.korbanLR) || 0,

      jumlahLB: Number(laporan.korbanLB) || 0,

      jumlahMD: Number(laporan.korbanMD) || 0,

      kermat: Number(laporan.kermat) || 0,

      tkp: laporan.tkp || "",

      kendaraan: laporan.kendaraan || "",

      saksi: laporan.saksi || [],

      kronologi: laporan.kronologi || "",

      petugas: laporan.petugas || [],

      dokumentasi: laporan.dokumentasi || {},
    };
  });
}
