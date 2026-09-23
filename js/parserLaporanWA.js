const JUDUL_LAPORAN = [
  "TKP",
  "WAKTU KEJADIAN",
  "DILAPORKAN",
  "KENDARAAN YANG TERLIBAT KECELAKAAN",
  "IDENTITAS SAKSI-SAKSI",
  "IDENTITAS PENGENDARA",
  "KRONOLOGI KEJADIAN",
  "KORBAN",
  "KERMAT",
  "YANG MENDATANGI TKP",
  "TINDAKAN YANG TELAH DILAKSANAKAN",
];

function normalisasiJudul(teks) {
  return teks
    .replace(/\*/g, "")
    .trim()
    .replace(/\s*:\s*$/, "")
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function ambilTKP(laporan) {
  const baris = laporan.split(/\r?\n/);

  let posisiTKP = -1;

  // Cari judul TKP
  for (let i = 0; i < baris.length; i++) {
    if (normalisasiJudul(baris[i]) === "TKP") {
      posisiTKP = i;
      break;
    }
  }

  // Kalau TKP tidak ditemukan
  if (posisiTKP === -1) {
    return "";
  }

  const hasil = [];

  // Ambil data setelah judul TKP
  for (let i = posisiTKP + 1; i < baris.length; i++) {
    const teks = baris[i].trim();

    // Abaikan baris kosong
    if (teks === "") {
      continue;
    }

    // Jika baris merupakan salah satu judul laporan, berhenti
    if (JUDUL_LAPORAN.includes(normalisasiJudul(teks))) {
      break;
    }

    hasil.push(teks);
  }

  return hasil.join(" ").trim();
}

function ambilKendaraan(laporan) {
  const baris = laporan.split(/\r?\n/);

  const judul = "KENDARAAN YANG TERLIBAT KECELAKAAN";

  // Cari baris judul kendaraan
  const index = baris.findIndex((barisLaporan) => {
    const teks = barisLaporan
      .replace(/\*/g, "")
      .trim()
      .replace(/\s*:\s*$/, "")
      .toUpperCase();

    return teks === judul;
  });

  // Kalau judul tidak ditemukan
  if (index === -1) {
    return [];
  }

  const hasil = [];
  let dataSekarang = "";

  for (let i = index + 1; i < baris.length; i++) {
    const teks = baris[i].replace(/\*/g, "").trim();

    // Abaikan baris kosong
    if (teks === "") {
      continue;
    }

    // Kalau ketemu judul bagian berikutnya, berhenti
    const teksJudul = teks.replace(/\s*:\s*$/, "").toUpperCase();

    if (JUDUL_LAPORAN.includes(teksJudul)) {
      break;
    }

    // Cek apakah ini awal data baru
    const dataBaru = /^(-|\d+[.)])\s+/.test(teks);

    if (dataBaru) {
      // Simpan data sebelumnya
      if (dataSekarang !== "") {
        hasil.push(dataSekarang.trim());
      }

      // Buang tanda "-" atau "1." dari awal data
      dataSekarang = teks.replace(/^(-|\d+[.)])\s+/, "").trim();
    } else {
      // Bukan data baru → berarti lanjutan data sebelumnya
      if (dataSekarang !== "") {
        dataSekarang += " " + teks.replace(/,+\s*$/, "");
      }

      // tambahan else untuk data yang tidak ada penanda, menjadi satu kesatuan.
      else {
        dataSekarang = teks.replace(/,+\s*$/, "");
      }
    }
  }

  // Simpan data terakhir
  if (dataSekarang !== "") {
    hasil.push(dataSekarang.trim());
  }

  return hasil;
}

function ambilNopol(teks) {
  if (!teks) return "";

  let data = teks.toUpperCase().trim();

  const setelahLabel = data.match(
    /(?:NOPOL|NO\.?\s*POL)\s*[:\-]?\s*([A-Z0-9\s\-]+)/,
  );

  if (setelahLabel) {
    data = setelahLabel[1];
  }

  const hasil = data.match(
    /\b([A-Z]{1,2})[\s\-]*(\d{1,4})[\s\-]*([A-Z]{1,3})\b/,
  );

  if (!hasil) return "";

  return (hasil[1] + " " + hasil[2] + " " + hasil[3]).trim();
}

function ambilWaktuKejadian(laporan) {
  const baris = laporan.split(/\r?\n/);

  let posisiWaktu = -1;

  // Cari judul WAKTU KEJADIAN
  for (let i = 0; i < baris.length; i++) {
    if (normalisasiJudul(baris[i]) === "WAKTU KEJADIAN") {
      posisiWaktu = i;
      break;
    }
  }

  // Kalau tidak ditemukan
  if (posisiWaktu === -1) {
    return "";
  }

  const hasil = [];

  // Ambil data setelah judul WAKTU KEJADIAN
  for (let i = posisiWaktu + 1; i < baris.length; i++) {
    const teks = baris[i].replace(/\*/g, "").trim();

    // Abaikan baris kosong
    if (teks === "") {
      continue;
    }

    // Semua judul laporan menjadi batas
    if (JUDUL_LAPORAN.includes(normalisasiJudul(teks))) {
      break;
    }

    hasil.push(teks);
  }

  return hasil
    .join(" ")
    .replace(/,+\s*$/, "")
    .trim();
}

function splitWaktuKejadian(teks) {
  const hasil = {
    hari: "",
    tanggal: "",
    jam: "",
  };

  // Kalau tidak ada teks
  if (!teks) {
    return hasil;
  }

  // Bersihkan tanda *
  const teksBersih = teks.replace(/\*/g, "").trim();

  // =========================
  // AMBIL HARI
  // =========================

  const cocokHari = teksBersih.match(
    /\b(Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu)\b/i,
  );

  if (cocokHari) {
    hasil.hari = cocokHari[1];
  }

  // =========================
  // AMBIL TANGGAL
  // =========================

  const cocokTanggal = teksBersih.match(
    /\b(\d{1,2}\s*(?:[-/.]\s*|\s+)(?:\d{1,2}|Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s*(?:[-/.]\s*|\s+)\d{4})\b/i,
  );

  if (cocokTanggal) {
    hasil.tanggal = cocokTanggal[1].replace(/\s*([-.\/])\s*/g, "$1").trim();
  }

  // =========================
  // AMBIL JAM
  // =========================

  const cocokJam = teksBersih.match(
    /\b(\d{1,2}\s*[:.]\s*\d{2})\s*(?:WIB|WITA|WIT)?\b/i,
  );

  if (cocokJam) {
    hasil.jam = cocokJam[1].replace(/\s*[:.]\s*/g, ":").trim();
  }

  return {
    hari: hasil.hari || "",
    tanggal: hasil.tanggal || "",
    jam: hasil.jam || "",
  };
}

// ==========================================================
// MULAI AMBIL SAKSI
// ==========================================================

function ambilSaksi(laporan) {
  const baris = laporan.split(/\r?\n/);

  const judul = "IDENTITAS SAKSI-SAKSI";

  // ========================================================
  // CARI BARIS JUDUL SAKSI
  // ========================================================

  const index = baris.findIndex((barisLaporan) => {
    const teks = barisLaporan
      .replace(/\*+/g, "")
      .trim()
      .replace(/\s*:\s*$/, "")
      .replace(/\s*-\s*/g, "-")
      .toUpperCase();

    return teks === judul;
  });

  // ========================================================
  // KALAU JUDUL TIDAK DITEMUKAN
  // ========================================================

  if (index === -1) {
    return [];
  }

  const hasil = [];
  let dataSekarang = "";

  // ========================================================
  // AMBIL DATA SETELAH JUDUL SAKSI
  // ========================================================

  for (let i = index + 1; i < baris.length; i++) {
    const teks = baris[i].replace(/\*+/g, "").trim();

    // Abaikan baris kosong
    if (teks === "") {
      continue;
    }

    // ======================================================
    // KALAU KETEMU JUDUL BAGIAN BERIKUTNYA, BERHENTI
    // ======================================================

    const teksJudul = teks.replace(/\s*:\s*$/, "").toUpperCase();

    if (JUDUL_LAPORAN.includes(teksJudul)) {
      break;
    }

    // ======================================================
    // CEK APAKAH INI AWAL DATA SAKSI BARU
    // Contoh:
    // 1. Nama : Sdr. Ahmad Rofik...
    // 2. Nama : Sdr. Anto...
    // ======================================================

    const dataBaru = /^(-|\d+[.)])\s+/.test(teks);

    if (dataBaru) {
      // Simpan data saksi sebelumnya
      if (dataSekarang !== "") {
        hasil.push(dataSekarang.trim());
      }

      // Buang tanda "-" atau "1." dari awal data
      dataSekarang = teks.replace(/^(-|\d+[.)])\s+/, "").trim();
    } else {
      // ====================================================
      // BARIS LANJUTAN DARI DATA SAKSI SEBELUMNYA
      // ====================================================

      if (dataSekarang !== "") {
        dataSekarang += " " + teks.replace(/,+\s*$/, "");
      } else {
        // Tidak ada penanda → dianggap sebagai data pertama
        dataSekarang = teks.replace(/,+\s*$/, "");
      }
    }
  }

  // ========================================================
  // SIMPAN DATA SAKSI TERAKHIR
  // ========================================================

  if (dataSekarang !== "") {
    hasil.push(dataSekarang.trim());
  }

  return hasil;
}

// ==========================================================
// SELESAI AMBIL SAKSI
// ==========================================================

// ==========================================================
// MULAI - Khusus identifikasi Sepeda Pancal
// ==========================================================
function cocokSepedaPancal(teks) {
  if (!teks) {
    return false;
  }

  const teksNormal = String(teks)
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^sepedah\b/i, "sepeda");

  return /^sepeda pancal\b/i.test(teksNormal);
}
// ==========================================================
// SELESAI - Khusus identifikasi Sepeda Pancal
// ==========================================================

function ambilKunciKendaraan(teks) {
  if (!teks) {
    return "";
  }

  // ==========================================
  // 1. KALAU ADA NOPOL
  // ==========================================

  const nopol = ambilNopol(teks);

  if (nopol) {
    return nopol;
  }

  // ==========================================
  // 2. KALAU TANPA NOPOL
  // Ambil teks sebelum "tanpa Nopol"
  // ==========================================

  const data = teks.replace(/\*/g, "").trim();

  // ==========================================================
  // MULAI - Khusus identifikasi Sepeda Pancal
  // ==========================================================
  const dataNormal = data.replace(/\s+/g, " ").trim();

  if (/\bsepedah?\s+pancal\b/i.test(dataNormal)) {
    return "Sepeda pancal";
  }
  // ==========================================================
  // SELESAI - Khusus identifikasi Sepeda Pancal
  // ==========================================================

  const tanpaNopol = data.match(/^(.+?)\s+tanpa\s+nopol\b/i);

  if (tanpaNopol) {
    return tanpaNopol[1]
      .trim()
      .replace(/^(pengemudi|pengendara)\s+/i, "")
      .trim();
  }

  // ==========================================
  // 3. FORMAT BAKU
  // ==========================================

  if (/^pejalan kaki$/i.test(data)) {
    return "Pejalan kaki";
  }

  // ==========================================================
  // MULAI - Khusus identifikasi Sepeda Pancal
  // ==========================================================
  if (cocokSepedaPancal(data)) {
    return "Sepeda pancal";
  }
  // ==========================================================
  // SELESAI - Khusus identifikasi Sepeda Pancal
  // ==========================================================

  return "";
}

function ambilPengendara(laporan, kendaraan) {
  console.log("=== AMBIL PENGENDARA TERPANGGIL ===");

  const baris = laporan.split(/\r?\n/);

  const judul = "IDENTITAS PENGENDARA";

  // ==========================================
  // CARI JUDUL IDENTITAS PENGENDARA
  // ==========================================

  const index = baris.findIndex(function (barisLaporan) {
    const teks = barisLaporan
      .replace(/\*/g, "")
      .trim()
      .replace(/\s*:\s*$/, "")
      .toUpperCase();

    return teks === judul;
  });

  if (index === -1) {
    return ["", "", "", "", ""];
  }

  // ==========================================
  // SIAPKAN 5 SLOT
  // ==========================================

  const hasil = ["", "", "", "", ""];

  // ==========================================
  // BUAT KUNCI KENDARAAN
  // ==========================================

  const kunciKendaraan = kendaraan.map(function (dataKendaraan) {
    return ambilKunciKendaraan(dataKendaraan);
  });

  // ==========================================
  // BACA DATA PENGENDARA
  // ==========================================

  const daftarPengendara = [];

  let dataSekarang = "";

  for (let i = index + 1; i < baris.length; i++) {
    const teks = baris[i].replace(/\*/g, "").trim();

    if (teks === "") {
      continue;
    }

    // ==========================================
    // CEK JUDUL BAGIAN BERIKUTNYA
    // ==========================================

    const teksJudul = teks.replace(/\s*:\s*$/, "").toUpperCase();

    if (JUDUL_LAPORAN.includes(teksJudul)) {
      break;
    }

    // ==========================================
    // BERBONCENGAN BUKAN PENGENDARA
    // ==========================================

    if (/^berboncengan\s+dengan\b/i.test(teks)) {
      continue;
    }

    // ==========================================
    // PEMBONCENG BUKAN PENGENDARA
    // ==========================================

    if (/^(?:-|\d+[.)]|•|◦)?\s*Pembonceng\b/i.test(teks)) {
      continue;
    }

    // ==========================================
    // CEK DATA BARU
    // ==========================================
    // ==========================================================
    // MULAI - Deteksi data baru Pengemudi / Pengendara / Sepeda Pancal
    // ==========================================================

    const dataBaru =
      /^(-|\d+[.)]|•|◦)\s+/.test(teks) ||
      /^Pengemudi\b/i.test(teks) ||
      /^Pengendara\b/i.test(teks) ||
      /^Pengayuh\s+sepedah?\s+pancal\b/i.test(teks) ||
      /^Sepeda\s+pancal\b/i.test(teks);

    // ==========================================================
    // SELESAI - Deteksi data baru Pengemudi / Pengendara / Sepeda Pancal
    // ==========================================================

    // ==========================================
    // DATA BARU
    // ==========================================

    if (dataBaru) {
      // Simpan data sebelumnya
      if (dataSekarang !== "") {
        daftarPengendara.push(dataSekarang.trim());
      }

      // Buang nomor / bullet
      dataSekarang = teks.replace(/^(-|\d+[.)]|•|◦)\s*/, "").trim();
    }

    // ==========================================
    // BARIS LANJUTAN
    // ==========================================
    else {
      if (dataSekarang !== "") {
        dataSekarang += " " + teks.replace(/,+\s*$/, "");
      }
    }
  }

  // ==========================================
  // SIMPAN DATA TERAKHIR
  // ==========================================

  if (dataSekarang !== "") {
    daftarPengendara.push(dataSekarang.trim());
  }

  // ==========================================
  // COCOKKAN PENGENDARA DENGAN KENDARAAN
  // ==========================================

  daftarPengendara.forEach(function (dataPengendara) {
    // ------------------------------------------
    // BUAT TEKS KHUSUS UNTUK MENCARI KUNCI
    // ------------------------------------------

    // let teksKunci = dataPengendara.replace(/^(-|\d+[.)]|•|◦)\s*/, "").trim();

    // // Buang kata Pengemudi / Pengendara
    // teksKunci = teksKunci.replace(/^(pengemudi|pengendara)\s+/i, "").trim();

    // // Ambil hanya bagian kendaraan sebelum Nama
    // teksKunci = teksKunci.split(/\bNama\s*:/i)[0].trim();

    // ------------------------------------------
    // BUAT TEKS KHUSUS UNTUK MENCARI KUNCI
    // ------------------------------------------

    let teksKunci = dataPengendara.replace(/^(-|\d+[.)]|•|◦)\s\*/, "").trim();

    // Buang kata Pengemudi / Pengendara
    teksKunci = teksKunci.replace(/^(pengemudi|pengendara)\s+/i, "").trim();

    // ------------------------------------------
    // KHUSUS PEJALAN KAKI / SEPEDA PANCAL
    // ------------------------------------------

    // if (/^pejala(?:n)?\s+kaki\b/i.test(teksKunci)) {
    //   teksKunci = "Pejalan kaki";
    // } else if (/^sepeda\s+pancal\b/i.test(teksKunci)) {
    //   teksKunci = "Sepeda pancal";
    // } else {
    //   // ------------------------------------------
    //   // KENDARAAN BIASA
    //   // Ambil hanya bagian kendaraan sebelum Nama
    //   // ------------------------------------------

    //   teksKunci = teksKunci.split(/\bNama\s\*:/i)[0].trim();
    // }

    // ==========================================================
    // MULAI - KHUSUS PEJALAN KAKI / SEPEDA PANCAL
    // ==========================================================

    if (/^pejala(?:n)?\s+kaki\b/i.test(teksKunci)) {
      teksKunci = "Pejalan kaki";
    } else if (/^pengayuh\s+sepedah?\s+pancal\b/i.test(teksKunci)) {
      // Pengayuh adalah label orang.
      // Kunci kendaraan tetap "Sepeda pancal".
      teksKunci = "Sepeda pancal";
    } else if (/^sepedah?\s+pancal\b/i.test(teksKunci)) {
      teksKunci = "Sepeda pancal";
    } else {
      // ------------------------------------------
      // KENDARAAN BIASA
      // Ambil hanya bagian kendaraan sebelum Nama
      // ------------------------------------------

      teksKunci = teksKunci.split(/\bNama\s*:\s*/i)[0].trim();
    }

    console.log("[DEBUG PENGAYUH] dataPengendara:", dataPengendara);
    console.log("[DEBUG PENGAYUH] teksKunci:", teksKunci);
    console.log(
      "[DEBUG PENGAYUH] hasil ambilKunciKendaraan:",
      ambilKunciKendaraan(teksKunci),
    );

    // ==========================================================
    // SELESAI - KHUSUS PEJALAN KAKI / SEPEDA PANCAL
    // ==========================================================

    // ------------------------------------------
    // AMBIL KUNCI KENDARAAN
    // ------------------------------------------

    const kunciPengendara = ambilKunciKendaraan(teksKunci);

    if (!kunciPengendara) {
      return;
    }

    // ------------------------------------------
    // CARI POSISI KENDARAAN
    // ------------------------------------------

    const posisiKendaraan = kunciKendaraan.findIndex(function (kunci) {
      return kunci === kunciPengendara;
    });

    // ------------------------------------------
    // SIMPAN PENGENDARA
    // ------------------------------------------

    if (posisiKendaraan !== -1) {
      const identitas = ambilIdentitasPengendara(dataPengendara);

      if (identitas) {
        hasil[posisiKendaraan] = identitas;
      }
    }
  });

  return hasil;
}

// function ambilIdentitasPengendara(teks) {
//   if (!teks) return "";

//   // ==========================================
//   // PRIORITAS 1 : NAMA
//   // ==========================================

//   let hasil = teks.match(/\bNama\s*:\s*(.+)$/i);

//   if (hasil) {
//     return hasil[1].trim();
//   }

//   // ==========================================
//   // PRIORITAS 2 : AN
//   // ==========================================

//   hasil = teks.match(/\bAn\s*:\s*(.+)$/i);

//   if (hasil) {
//     return hasil[1].trim();
//   }

//   // ==========================================
//   // PRIORITAS 3 : SDR
//   // ==========================================

//   hasil = teks.match(/\bSdr\s*:\s*(.+)$/i);

//   if (hasil) {
//     return hasil[1].trim();
//   }

//   // ==========================================
//   // PRIORITAS 4 : SETELAH NOPOL
//   // ==========================================

//   hasil = teks.match(
//     /\b(?:Nopol|No\.?\s*Pol)\s*[:\-]?\s*[A-Z]{1,2}[\s\-]*\d{1,4}[\s\-]*[A-Z]{1,3}\b\s*(.+)$/i,
//   );

//   if (hasil) {
//     return hasil[1].trim();
//   }

//   return "";
// }

// ============================================================
// MULAI: AMBIL IDENTITAS PENGENDARA
// ============================================================

function ambilIdentitasPengendara(teks) {
  if (!teks) return "";

  let hasil = "";

  // ==========================================================
  // MULAI - Khusus identitas Pengayuh Sepeda Pancal
  // ==========================================================

  if (/\bsepedah?\s+pancal\b/i.test(teks)) {
    // Normalisasi whitespace hanya pada teks yang sedang diperiksa.
    const teksNormal = String(teks).replace(/\s+/g, " ").trim();

    // =====================================================
    // PRIORITAS 1
    // Jika ada "Nama :", ambil semua teks setelah "Nama :"
    // =====================================================

    let cocokPancal = teksNormal.match(/\bNama\s*:\s*(.+)$/i);

    if (cocokPancal) {
      hasil = cocokPancal[1].replace(/\*/g, "").trim();

      // Buang identitas pembuka jika masih ikut.
      hasil = hasil.replace(/^(?:Sdr\.?|Sdri\.?|a\.n\.?)\s*/i, "").trim();

      return hasil;
    }

    // =====================================================
    // PRIORITAS 2
    // Jika tidak ada "Nama :", cari Sdr / Sdri / a.n
    // =====================================================

    cocokPancal = teksNormal.match(/(?:Sdr\.?|Sdri\.?|a\.n\.?)\s*(.+)$/i);

    if (cocokPancal) {
      hasil = cocokPancal[1].replace(/\*/g, "").trim();

      // Antisipasi jika ada marker identitas berlapis.
      hasil = hasil.replace(/^(?:Sdr\.?|Sdri\.?|a\.n\.?)\s*/i, "").trim();

      return hasil;
    }

    // =====================================================
    // PRIORITAS 3
    // Tidak ada Nama / Sdr / Sdri / a.n
    // → ambil teks setelah "Sepeda pancal"
    // =====================================================

    cocokPancal = teksNormal.match(
      /\bsepedah?\s+pancal\b\s*(?:[:\-])?\s*(.+)$/i,
    );

    if (cocokPancal) {
      hasil = cocokPancal[1].replace(/\*/g, "").trim();

      hasil = hasil.replace(/^(?:Sdr\.?|Sdri\.?|a\.n\.?)\s*/i, "").trim();

      return hasil;
    }
  }
  // ==========================================================
  // SELESAI - Khusus identitas Pengayuh Sepeda Pancal
  // ==========================================================

  // ==========================================================
  // 1. PRIORITAS: ADA "NAMA :"
  //    Ambil setelah Nama :
  //    Jika diawali Sdr./Sdri./a.n, hapus penandanya.
  // ==========================================================

  let cocok = teks.match(/\bNama\s*:\s*(.+)$/i);

  if (cocok) {
    hasil = cocok[1].trim();

    hasil = hasil.replace(/^\*+|\*+$/g, "").trim();

    hasil = hasil.replace(/^(?:Sdr\.|Sdri\.|a\.n)\s*/i, "").trim();

    return hasil;
  }

  // ==========================================================
  // 2. JIKA TIDAK ADA "NAMA :"
  //    Cari Sdr. / Sdri. / a.n
  //    Ambil teks setelah penanda tersebut.
  // ==========================================================

  cocok = teks.match(/(?:Sdr\.|Sdri\.|a\.n)\s*\*?\s*(.+?)(?:\*)?$/i);

  if (cocok) {
    hasil = cocok[1].trim();

    // Hapus tanda *
    hasil = hasil.replace(/^\*+|\*+$/g, "").trim();

    // Jika masih diawali a.n / Sdr. / Sdri.,
    // hapus semuanya
    hasil = hasil.replace(/^(?:a\.n|Sdr\.|Sdri\.)\s*/i, "").trim();

    return hasil;
  }

  // ==========================================================
  // 3. JIKA TIDAK ADA NAMA DAN TIDAK ADA
  //    Sdr./Sdri./a.n, gunakan identitas setelah NOPOL
  // ==========================================================

  // cocok = teks.match(
  //   /\b(?:Nopol|No\.?\s*Pol)\s*[:\-]?\s*[A-Z]{1,2}\s*[- ]\s*\d{1,4}\s*[- ]\s*[A-Z]{1,3}\b\s*\*?(.+?)\*?$/i,
  // );

  // if (cocok) {
  //   hasil = cocok[1].trim();

  //   hasil = hasil.replace(/^\*+|\*+$/g, "").trim();

  //   hasil = hasil.replace(/^(?:Sdr\.|Sdri\.|a\.n)\s*/i, "").trim();

  //   return hasil;
  // }

  // ==========================================================
  // 3. FALLBACK KHUSUS SEPEDA PANCAL
  //    Jika tidak ada Nama dan tidak ada Sdr./Sdri./a.n,
  //    ambil identitas setelah "Sepeda pancal".
  // ==========================================================
  if (/sepeda\s+pancal/i.test(teks)) {
    cocok = teks.match(/sepeda\s+pancal\b\s*(?:[:\-])?\s*(.+)$/i);

    if (cocok) {
      hasil = cocok[1].trim();

      // Hapus tanda * jika ada
      hasil = hasil.replace(/^\*+|\*+$/g, "").trim();

      // Jika ternyata masih diawali penanda identitas,
      // hapus penandanya.
      hasil = hasil.replace(/^(?:Sdr\.|Sdri\.|a\.n)\s*/i, "").trim();

      return hasil;
    }
  }

  // ==========================================================
  // 4. BACKUP UNTUK KENDARAAN LAIN
  //    Jika tidak ada Nama dan tidak ada Sdr./Sdri./a.n,
  //    tetap gunakan identitas setelah NOPOL.
  // ==========================================================
  cocok = teks.match(
    /\b(?:Nopol|No\.?\s*Pol)\s*[:\-]?\s*[A-Z]{1,2}\s*[- ]\s*\d{1,4}\s*[- ]\s*[A-Z]{1,3}\b\s*\*?(.+?)\*?$/i,
  );

  if (cocok) {
    hasil = cocok[1].trim();
    hasil = hasil.replace(/^\*+|\*+$/g, "").trim();
    hasil = hasil.replace(/^(?:Sdr\.|Sdri\.|a\.n)\s*/i, "").trim();
    return hasil;
  }

  return "";
}

// ============================================================
// SELESAI: AMBIL IDENTITAS PENGENDARA
// ============================================================

function ambilPembonceng(laporan, kendaraan, pengendara) {
  const baris = laporan.split(/\r?\n/);

  // ==========================================
  // SIAPKAN 5 SLOT PEMBONCENG
  // ==========================================

  const hasil = ["", "", "", "", ""];

  // ==========================================
  // BUAT KUNCI KENDARAAN
  // ==========================================

  const kunciKendaraan = kendaraan.map(function (dataKendaraan) {
    return ambilKunciKendaraan(dataKendaraan);
  });

  // ==========================================
  // CARI JUDUL IDENTITAS PENGENDARA
  // ==========================================

  const index = baris.findIndex(function (barisLaporan) {
    const teks = barisLaporan
      .replace(/\*/g, "")
      .trim()
      .replace(/\s*:\s*$/, "")
      .toUpperCase();

    return teks === "IDENTITAS PENGENDARA";
  });

  if (index === -1) {
    return hasil;
  }

  // ==========================================
  // KUNCI KENDARAAN SEBELUMNYA
  // ==========================================

  let kunciSebelumnya = "";

  // ==========================================
  // BACA DATA SATU PER SATU
  // ==========================================

  for (let i = index + 1; i < baris.length; i++) {
    const teks = baris[i].replace(/\*/g, "").trim();

    if (teks === "") {
      continue;
    }

    // ==========================================
    // CEK JUDUL BAGIAN BERIKUTNYA
    // ==========================================

    const teksJudul = teks.replace(/\s*:\s*$/, "").toUpperCase();

    if (JUDUL_LAPORAN.includes(teksJudul)) {
      break;
    }

    // ==========================================
    // 1. PEMBONCENG DENGAN KENDARAAN
    //
    // Contoh:
    // 6. Pembonceng Sepeda motor tanpa Nopol
    //    Nama : ANDI, 20 tahun, pelajar.
    // ==========================================

    if (/^(?:-|\d+[.)]|•|◦)?\s*Pembonceng\b/i.test(teks)) {
      let teksKunci = teks
        .replace(/^(?:-|\d+[.)]|•|◦)\s*/i, "")
        .replace(/^Pembonceng\s+/i, "")
        .trim();

      // ------------------------------------------
      // AMBIL BAGIAN KENDARAAN
      // ------------------------------------------

      teksKunci = teksKunci.split(/\bNama\s*:/i)[0].trim();

      // ------------------------------------------
      // BUAT KUNCI
      // ------------------------------------------

      const kunciPembonceng = ambilKunciKendaraan(teksKunci);

      if (!kunciPembonceng) {
        continue;
      }

      // ------------------------------------------
      // CARI POSISI KENDARAAN
      // ------------------------------------------

      const posisiKendaraan = kunciKendaraan.findIndex(function (kunci) {
        return kunci === kunciPembonceng;
      });

      if (posisiKendaraan !== -1) {
        const namaPembonceng = ambilNamaPembonceng(teks);

        if (namaPembonceng) {
          hasil[posisiKendaraan] = gabungPembonceng(
            hasil[posisiKendaraan],
            namaPembonceng,
          );
        }
      }

      continue;
    }

    // ==========================================
    // 2. BERBONCENGAN DENGAN
    //
    // Contoh:
    // berboncengan dengan RUDI, 25 tahun.
    //
    // Menggunakan kendaraan sebelumnya.
    // ==========================================

    if (/^berboncengan\s+dengan\b/i.test(teks)) {
      if (kunciSebelumnya) {
        const posisiKendaraan = kunciKendaraan.findIndex(function (kunci) {
          return kunci === kunciSebelumnya;
        });

        if (posisiKendaraan !== -1) {
          const namaPembonceng = ambilNamaBerboncengan(teks);

          if (namaPembonceng) {
            hasil[posisiKendaraan] = gabungPembonceng(
              hasil[posisiKendaraan],
              namaPembonceng,
            );
          }
        }
      }

      continue;
    }

    // ==========================================
    // 3. PENGENDARA
    //
    // Simpan kendaraan dari baris pengendara
    // sebagai kendaraan sebelumnya.
    // ==========================================

    if (/^(?:-|\d+[.)]|•|◦)?\s*(Pengemudi|Pengendara)\b/i.test(teks)) {
      let teksKunci = teks
        .replace(/^(?:-|\d+[.)]|•|◦)\s*/i, "")
        .replace(/^(Pengemudi|Pengendara)\s+/i, "")
        .trim();

      // ------------------------------------------
      // AMBIL BAGIAN KENDARAAN
      // ------------------------------------------

      teksKunci = teksKunci.split(/\bNama\s*:/i)[0].trim();

      // ------------------------------------------
      // BUAT KUNCI
      // ------------------------------------------

      const kunciBaris = ambilKunciKendaraan(teksKunci);

      if (kunciBaris) {
        kunciSebelumnya = kunciBaris;
      }

      continue;
    }
  }

  return hasil;
}

// ============================================================
// MULAI: AMBIL NAMA PEMBONCENG
// ============================================================

function ambilNamaPembonceng(teks) {
  let hasil = "";

  // ==========================================================
  // 1. JIKA ADA "NAMA :"
  //    Ambil SEMUA teks setelah "Nama :"
  // ==========================================================

  const hasilNama = teks.match(/\bNama\s*:\s*(.+)$/i);

  if (hasilNama) {
    hasil = hasilNama[1].trim();

    // Hapus tanda * pembungkus jika ada
    hasil = hasil.replace(/^\*+|\*+$/g, "").trim();

    // Jika setelah Nama : masih ada Sdr. / Sdri. / a.n,
    // hapus penandanya.
    hasil = hasil.replace(/^(?:Sdr\.|Sdri\.|a\.n)\s*/i, "").trim();

    return hasil;
  }

  // ==========================================================
  // 2. JIKA TIDAK ADA "NAMA :"
  //    Cari Sdr. / Sdri. / a.n
  // ==========================================================

  const hasilIdentitas = teks.match(
    /(?:Sdr\.|Sdri\.|a\.n)\s*\*?\s*(.+?)(?:\*)?$/i,
  );

  if (hasilIdentitas) {
    hasil = hasilIdentitas[1].trim();

    // Bersihkan tanda * jika masih ada
    hasil = hasil.replace(/^\*+|\*+$/g, "").trim();

    return hasil;
  }

  return "";
}

// ============================================================
// SELESAI: AMBIL NAMA PEMBONCENG
// ============================================================

// function ambilNamaBerboncengan(teks) {
//   const hasil = teks.match(/berboncengan\s+dengan\s+(.+)$/i);

//   if (!hasil) {
//     return "";
//   }

//   return hasil[1].trim();
// }

// ============================================================
// MULAI: AMBIL NAMA BERBONCENGAN
// ============================================================

function ambilNamaBerboncengan(teks) {
  if (!teks) return "";

  let hasil = "";

  // ==========================================================
  // 1. JIKA ADA "NAMA :"
  // ==========================================================

  let cocok = teks.match(/\bNama\s*:\s*(.+)$/i);

  if (cocok) {
    hasil = cocok[1].trim();

    hasil = hasil.replace(/^\*+|\*+$/g, "").trim();

    hasil = hasil.replace(/^(?:Sdr\.|Sdri\.|a\.n)\s*/i, "").trim();

    return hasil;
  }

  // ==========================================================
  // 2. AMBIL SETELAH "BERBONCENGAN DENGAN"
  // ==========================================================

  cocok = teks.match(/berboncengan\s+dengan\s+(.+)$/i);

  if (!cocok) {
    return "";
  }

  hasil = cocok[1].trim();

  // ==========================================================
  // 3. BERSIHKAN TANDA *
  // ==========================================================

  hasil = hasil.replace(/^\*+|\*+$/g, "").trim();

  // ==========================================================
  // 4. HAPUS Sdr. / Sdri. / a.n
  // ==========================================================

  hasil = hasil.replace(/^(?:Sdr\.|Sdri\.|a\.n)\s*/i, "").trim();

  return hasil;
}

// ============================================================
// SELESAI: AMBIL NAMA BERBONCENGAN
// ============================================================

function gabungPembonceng(lama, baru) {
  if (!lama) {
    return baru;
  }

  return lama + "\n" + baru;
}

function formatKendaraan(kendaraan) {
  return kendaraan
    .map(function (dataKendaraan, index) {
      return index + 1 + ". " + dataKendaraan;
    })
    .join("\n\n");
}

function formatPengendara(kendaraan, pengendara, pembonceng) {
  const hasil = [];

  kendaraan.forEach(function (dataKendaraan, index) {
    let blok = index + 1 + ". " + dataKendaraan;

    // =========================
    // PENGENDARA
    // =========================

    if (pengendara[index]) {
      const jenisKendaraan = dataKendaraan.trim();

      if (/^pejalan kaki$/i.test(jenisKendaraan)) {
        // Pejalan kaki tanpa label
        blok += "\n   " + pengendara[index];
      } else if (/^sepeda pancal$/i.test(jenisKendaraan)) {
        // Sepeda pancal
        blok += "\n   Pengayuh : " + pengendara[index];
      } else if (/^sepeda motor\b/i.test(jenisKendaraan)) {
        // Sepeda motor
        blok += "\n   Pengendara : " + pengendara[index];
      } else {
        // Semua kendaraan lainnya
        blok += "\n   Pengemudi : " + pengendara[index];
      }
    }

    // =========================
    // PEMBONCENG
    // =========================

    if (pembonceng[index]) {
      const daftarPembonceng = pembonceng[index].split(/\r?\n/);

      daftarPembonceng.forEach(function (nama) {
        if (nama.trim()) {
          blok += "\n   Pembonceng : " + nama.trim();
        }
      });
    }

    hasil.push(blok);
  });

  return hasil.join("\n\n");
}

// function ambilKronologi(laporan) {

//   const baris = laporan.split(/\r?\n/);

//   let posisiKronologi = -1;

//   // Cari judul KRONOLOGI KEJADIAN
//   for (let i = 0; i < baris.length; i++) {

//     if (normalisasiJudul(baris[i]) === "KRONOLOGI KEJADIAN") {
//       posisiKronologi = i;
//       break;
//     }
//   }

//   // Kalau tidak ditemukan
//   if (posisiKronologi === -1) {
//     return "";
//   }

//   const hasil = [];

//   // Ambil semua data setelah judul
//   for (let i = posisiKronologi + 1; i < baris.length; i++) {

//     const teks = baris[i]
//       .replace(/\*/g, "")
//       .trim();

//     // Abaikan baris kosong
//     if (teks === "") {
//       continue;
//     }

//     // Kalau ketemu judul bagian berikutnya, berhenti
//     if (JUDUL_LAPORAN.includes(normalisasiJudul(teks))) {
//       break;
//     }

//     hasil.push(teks);
//   }

//   // Gabungkan menjadi satu string
//   return hasil.join(" ").trim();
// }

function ambilKronologi(laporan) {
  const baris = laporan.split(/\r?\n/);

  let posisiKronologi = -1;

  // Cari judul KRONOLOGI KEJADIAN
  for (let i = 0; i < baris.length; i++) {
    if (normalisasiJudul(baris[i]) === "KRONOLOGI KEJADIAN") {
      posisiKronologi = i;
      break;
    }
  }

  // Kalau tidak ditemukan
  if (posisiKronologi === -1) {
    return "";
  }

  const hasil = [];

  // Ambil semua data setelah judul
  for (let i = posisiKronologi + 1; i < baris.length; i++) {
    const teks = baris[i].replace(/\*/g, "").trim();

    // Abaikan baris kosong
    if (teks === "") {
      continue;
    }

    // Kalau ketemu judul bagian berikutnya, berhenti
    if (JUDUL_LAPORAN.includes(normalisasiJudul(teks))) {
      break;
    }

    hasil.push(teks);
  }

  // Gabungkan menjadi satu string
  return hasil.join(" ").trim();
}

function ambilKorban(laporan) {
  const baris = laporan.split(/\r?\n/);

  let posisiKorban = -1;

  // Cari judul KORBAN
  for (let i = 0; i < baris.length; i++) {
    if (normalisasiJudul(baris[i]) === "KORBAN") {
      posisiKorban = i;
      break;
    }
  }

  // Kalau KORBAN tidak ditemukan
  if (posisiKorban === -1) {
    return {
      LR: "",
      LB: "",
      MD: "",
    };
  }

  const dataKorban = [];

  // Ambil isi bagian KORBAN
  for (let i = posisiKorban + 1; i < baris.length; i++) {
    const teks = baris[i].replace(/\*/g, "").trim();

    if (teks === "") {
      continue;
    }

    // Berhenti ketika ketemu judul berikutnya
    if (JUDUL_LAPORAN.includes(normalisasiJudul(teks))) {
      break;
    }

    dataKorban.push(teks);
  }

  // Gabungkan isi KORBAN
  const teksKorban = dataKorban.join(" ");

  const hasil = {
    LR: "",
    LB: "",
    MD: "",
  };

  // Cari LR
  const lr = teksKorban.match(/LR\s*:\s*([0-9]+)/i);
  if (lr) {
    hasil.LR = lr[1];
  }

  // Cari LB
  const lb = teksKorban.match(/LB\s*:\s*([0-9]+)/i);
  if (lb) {
    hasil.LB = lb[1];
  }

  // Cari MD
  const md = teksKorban.match(/MD\s*:\s*([0-9]+)/i);
  if (md) {
    hasil.MD = md[1];
  }

  return hasil;
}

function ambilKermat(laporan) {
  const baris = laporan.split(/\r?\n/);

  let posisiKermat = -1;

  // Cari judul KERMAT
  for (let i = 0; i < baris.length; i++) {
    if (normalisasiJudul(baris[i]) === "KERMAT") {
      posisiKermat = i;
      break;
    }
  }

  // Kalau judul KERMAT tidak ditemukan
  if (posisiKermat === -1) {
    return 0;
  }

  const dataKermat = [];

  // Ambil isi KERMAT
  for (let i = posisiKermat + 1; i < baris.length; i++) {
    const teks = baris[i].replace(/\*/g, "").trim();

    // Abaikan baris kosong
    if (teks === "") {
      continue;
    }

    // Berhenti ketika ketemu judul berikutnya
    if (JUDUL_LAPORAN.includes(normalisasiJudul(teks))) {
      break;
    }

    dataKermat.push(teks);
  }

  // Gabungkan isi KERMAT
  const teksKermat = dataKermat.join(" ");

  // Ambil semua angka
  const angka = teksKermat.replace(/\D/g, "");

  // Kalau tidak ada angka
  if (angka === "") {
    return 0;
  }

  return Number(angka);
}

function ambilYangMendatangiTKP(laporan) {
  const baris = laporan.split(/\r?\n/);

  let posisi = -1;

  // Cari judul YANG MENDATANGI TKP
  for (let i = 0; i < baris.length; i++) {
    if (normalisasiJudul(baris[i]) === "YANG MENDATANGI TKP") {
      posisi = i;
      break;
    }
  }

  // Kalau judul tidak ditemukan
  if (posisi === -1) {
    return "";
  }

  const hasil = [];

  // Ambil semua isi setelah judul
  for (let i = posisi + 1; i < baris.length; i++) {
    const teks = baris[i].replace(/\*/g, "").trim();

    // Abaikan baris kosong
    if (teks === "") {
      continue;
    }

    // Berhenti ketika ketemu judul berikutnya
    if (JUDUL_LAPORAN.includes(normalisasiJudul(teks))) {
      break;
    }

    // Pertahankan isi apa adanya
    hasil.push(teks);
  }

  // Gabungkan dengan ENTER
  return hasil;
}

// ============================================================
// MULAI: PARSER UTAMA LAPORAN WHATSAPP
// ============================================================

function parseLaporanWA(laporan) {
  console.log("=== PARSERLAPORANWA.JS YANG DIEKSEKUSI ===");

  if (!laporan || typeof laporan !== "string") {
    return null;
  }

  const teksLaporan = laporan.trim();

  if (!teksLaporan) {
    return null;
  }

  // ==========================================================
  // 1. TKP
  // ==========================================================

  const tkp = ambilTKP(teksLaporan);

  // ==========================================================
  // 2. WAKTU KEJADIAN
  // ==========================================================

  const waktuKejadian = ambilWaktuKejadian(teksLaporan);

  const waktu = splitWaktuKejadian(waktuKejadian);

  // ==========================================================
  // 3. KENDARAAN
  // ==========================================================

  const daftarKendaraan = ambilKendaraan(teksLaporan);

  // ==========================================================
  // 4. PENGENDARA
  // ==========================================================

  const daftarPengendara = ambilPengendara(teksLaporan, daftarKendaraan);

  // ==========================================================
  // 5. PEMBONCENG
  // ==========================================================

  const daftarPembonceng = ambilPembonceng(
    teksLaporan,
    daftarKendaraan,
    daftarPengendara,
  );

  // ==========================================================
  // 6. GABUNGKAN KENDARAAN + NOPOL + PIHAK TERLIBAT
  // ==========================================================

  const kendaraan = daftarKendaraan.map(function (dataKendaraan, index) {
    const teksKendaraan = String(dataKendaraan || "").trim();

    const nopol = ambilNopol(teksKendaraan);

    const item = {
      kendaraan: teksKendaraan,
      nopol: nopol,
    };

    const identitasPengendara = daftarPengendara[index] || "";

    const identitasPembonceng = daftarPembonceng[index] || "";

    const jenisKendaraan = teksKendaraan.toLowerCase();

    // --------------------------------------------------------
    // SEPEDA MOTOR
    // --------------------------------------------------------

    if (jenisKendaraan.includes("sepeda motor")) {
      item.pengendara = identitasPengendara;
      item.pembonceng = identitasPembonceng;
    }

    // --------------------------------------------------------
    // SEPEDA PANCAL
    // --------------------------------------------------------
    else if (jenisKendaraan.includes("sepeda pancal")) {
      item.pengayuh = identitasPengendara;
    }

    // --------------------------------------------------------
    // PEJALAN KAKI
    // --------------------------------------------------------
    else if (jenisKendaraan.includes("pejalan kaki")) {
      item.pejalanKaki = identitasPengendara;
    }

    // --------------------------------------------------------
    // KENDARAAN LAIN
    // --------------------------------------------------------
    else {
      item.pengemudi = identitasPengendara;
    }

    return item;
  });

  // ==========================================================
  // 7. SAKSI
  // ==========================================================

  const saksi = ambilSaksi(teksLaporan);

  // ==========================================================
  // 8. KRONOLOGI
  // ==========================================================

  const kronologi = ambilKronologi(teksLaporan);

  // ==========================================================
  // 9. KORBAN
  // ==========================================================

  const korban = ambilKorban(teksLaporan);

  // ==========================================================
  // 10. KERMAT
  // ==========================================================

  const kermat = ambilKermat(teksLaporan);

  // ==========================================================
  // 11. YANG MENDATANGI TKP
  // ==========================================================

  const yangMendatangiTKP = ambilYangMendatangiTKP(teksLaporan);

  // ==========================================================
  // 12. HASIL JSON
  // ==========================================================

  return {
    idLaporan: "",
    nomorLP: "",
    waktuInput: "",

    tkp: tkp,

    tanggalKejadian: waktu.tanggal,
    hariKejadian: waktu.hari,
    jamKejadian: waktu.jam,

    kronologi: kronologi,

    korbanLR: korban.LR,
    korbanLB: korban.LB,
    korbanMD: korban.MD,

    kermat: kermat,

    kendaraan: kendaraan,

    saksi: saksi,

    // Yang Mendatangi TKP disimpan sebagai data petugas
    petugas: yangMendatangiTKP,

    statusPenanganan: "",
  };
}

// ============================================================
// SELESAI: PARSER UTAMA LAPORAN WHATSAPP
// ============================================================
