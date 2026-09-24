// =====================================================
// MULAI: API DETAIL LAPORAN
// =====================================================

export async function ambilDetailLaporan(idLaporan) {
  if (!idLaporan) {
    return null;
  }

  const GAS_API_URL =
    "https://script.google.com/macros/s/AKfycbzg7AmEQz7qQeAlfogSfGNkyHOlcFYyuY2zkm5SmkQWJwUNN9qx1JV_DhUsziXIjfu_/exec";

  const gasPayload = {
    modul: "laka",
    aksi: "detail",
    idLaporan: idLaporan,
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
      gasResult.pesan || "Google Apps Script gagal mengambil detail laporan.",
    );
  }

  const laporan = gasResult.hasil;

  if (!laporan) {
    return null;
  }

  return {
    id: laporan.idLaporan || "",

    nomorLP: laporan.nomorLP || "",

    // tanggal: laporan.tanggal
    //   ? new Date(laporan.tanggal).toLocaleDateString("id-ID", {
    //       timeZone: "Asia/Jakarta",
    //       day: "2-digit",
    //       month: "2-digit",
    //       year: "numeric",
    //     })
    //   : "",

    hari: laporan.hari || "",

    tanggal: laporan.tanggal || "",

    jam: laporan.jam || "",

    // waktuInput: laporan.waktuInput
    //   ? new Date(laporan.waktuInput).toLocaleString("id-ID", {
    //       timeZone: "Asia/Jakarta",
    //       day: "2-digit",
    //       month: "2-digit",
    //       year: "numeric",
    //       hour: "2-digit",
    //       minute: "2-digit",
    //       second: "2-digit",
    //       hour12: false,
    //     })
    //   : "",

    waktuInput: laporan.waktuInput || "",

    status: laporan.statusPenanganan || "",

    jumlahLR: Number(laporan.lr) || 0,

    jumlahLB: Number(laporan.lb) || 0,

    jumlahMD: Number(laporan.md) || 0,

    kermat: Number(laporan.kermat) || 0,

    tkp: laporan.tkp || "",

    kronologi: laporan.kronologiSingkat || "",

    kendaraan: parseKendaraanDetail(laporan.kendaraan, laporan.pengendara),

    saksi: Array.isArray(laporan.saksi)
      ? laporan.saksi
      : typeof laporan.saksi === "string" && laporan.saksi.trim() !== ""
        ? laporan.saksi
            .split(/\r?\n/)
            .map(function (nama) {
              return nama.trim();
            })
            .filter(Boolean)
            .map(function (nama) {
              return {
                saksi: nama,
              };
            })
        : [],

    petugas: Array.isArray(laporan.petugas)
      ? laporan.petugas
      : typeof laporan.petugas === "string" && laporan.petugas.trim() !== ""
        ? laporan.petugas
            .split(/\r?\n/)
            .map(function (nama) {
              return nama.trim();
            })
            .filter(Boolean)
            .map(function (nama) {
              return {
                nama: nama,
              };
            })
        : [],

    dokumentasi:
      laporan.linkDokumenFoto && String(laporan.linkDokumenFoto).trim() !== ""
        ? {
            url: String(laporan.linkDokumenFoto).trim(),
            keterangan: "",
          }
        : null,
  };
}

// =====================================================
// SELESAI: API DETAIL LAPORAN
// =====================================================

// =====================================================
// MULAI: PARSER KENDARAAN DETAIL
// =====================================================

function parseKendaraanDetail(dataKendaraan, dataPihak) {
  if (!Array.isArray(dataPihak)) {
    return [];
  }

  return dataPihak.map(function (item) {
    const kendaraanMentah = item.kendaraan ? String(item.kendaraan).trim() : "";

    const peran = item.peran ? String(item.peran).trim().toLowerCase() : "";

    const nama = item.nama ? String(item.nama).trim() : "";

    const hasil = {
      kendaraan: kendaraanMentah,
      nopol: "",
      pengayuh: "",
      pejalanKaki: "",
      pengendara: "",
      pengemudi: "",
      pembonceng: "",
    };

    // =================================================
    // PECAH JENIS KENDARAAN DAN NOPOL
    // =================================================

    const cocokNopol = kendaraanMentah.match(
      /^(.*?)\s+No\.?\s*Pol\s*:\s*(.+)$/i,
    );

    if (cocokNopol) {
      hasil.kendaraan = cocokNopol[1].trim();
      hasil.nopol = cocokNopol[2].trim();
    }

    // =================================================
    // PEJALAN KAKI
    // =================================================

    if (hasil.kendaraan.toLowerCase().includes("pejalan kaki")) {
      hasil.kendaraan = "Pejalan Kaki";

      if (nama) {
        hasil.pejalanKaki = nama.replace(/^pejalan kaki\s*:\s*/i, "").trim();
      }
    }

    // =================================================
    // PENGAYUH
    // =================================================
    else if (peran === "pengayuh") {
      hasil.pengayuh = nama;
    }

    // =================================================
    // PENGENDARA
    // =================================================
    else if (peran === "pengendara") {
      hasil.pengendara = nama;
    }

    // =================================================
    // PENGEMUDI
    // =================================================
    else if (peran === "pengemudi") {
      hasil.pengemudi = nama;
    }

    // =================================================
    // PEMBONCENG
    // =================================================

    if (Array.isArray(item.pembonceng)) {
      hasil.pembonceng = item.pembonceng
        .map(function (orang) {
          if (typeof orang === "string") {
            return orang.trim();
          }

          return orang && orang.nama ? String(orang.nama).trim() : "";
        })
        .filter(Boolean)
        .join(", ");
    }

    return hasil;
  });
}

// =====================================================
// SELESAI: PARSER KENDARAAN DETAIL
// =====================================================
