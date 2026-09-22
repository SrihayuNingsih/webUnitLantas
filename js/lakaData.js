const lakaData = [
  // 01
  {
    id: "LKA-2026-001",
    tanggal: "23 Juli 2026",
    jam: "08:15",
    waktuInput: "23 Juli 2026 09:05",
    nomorLP: "LP-0101-BJN/I/2026",
    status: "Limpah Polres",
    jumlahLR: 2,
    jumlahLB: 1,
    jumlahMD: 0,
    kermat: 2500000,
    tkp: "Jl. Raya Bojonegoro - Babat turut wilayah Desa Baureno Kec. Baureno Kab. Bojonegoro",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Beat",
        nopol: "S 1234 AA",
        pengendara: "Agus, 32th, swasta, Desa Baureno Kec. Baureno",
        pembonceng: "Doni, 28th, pedagang, Desa Banjarjo Kec. Padangan",
      },
      {
        kendaraan: "Toyota Avanza",
        nopol: "S 4567 BB",
        pengemudi: "Hendra, 41th, wiraswasta, Desa Sraturejo Kec. Baureno",
      },
    ],
    saksi: [
      "Slamet, 45th, petani, Desa Baureno Kec. Baureno",
      "Joko, 38th, pedagang, Desa Gunungsari Kec. Baureno",
    ],
    kronologi:
      "Sepeda motor berjalan dari arah Bojonegoro menuju Babat kemudian terjadi benturan dengan kendaraan Toyota Avanza dari arah berlawanan.",
    petugas: [
      { id: "PTG001", nama: "Briptu Andika Perkasa" },
      { id: "PTG002", nama: "Aiptu Budi Prihatin" },
    ],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA001",
      keterangan: "Dokumentasi foto TKP dan kendaraan",
    },
  },

  // 02
  {
    id: "LKA-2026-002",
    tanggal: "12 Januari 2026",
    jam: "14:30",
    waktuInput: "12 Januari 2026 15:10",
    nomorLP: "Belum tersedia",
    status: "Limpah Polres",
    jumlahLR: 1,
    jumlahLB: 1,
    jumlahMD: 0,
    kermat: 5000000,
    tkp: "Jl. Raya Baureno - Babat Desa Tanggungan Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Yamaha NMAX",
        nopol: "S 2233 CC",
        pengendara: "Rudi, 36th, swasta, Desa Tanggungan Kec. Baureno",
      },
      {
        kendaraan: "Truk Mitsubishi",
        nopol: "S 8899 DD",
        pengemudi: "Sutrisno, 49th, sopir, Desa Kabunan Kec. Balen",
      },
    ],
    saksi: ["Maman, 40th, petani, Desa Tanggungan Kec. Baureno"],
    kronologi:
      "Sepeda motor melaju dari arah barat kemudian berpindah jalur dan bertabrakan dengan truk yang datang dari arah berlawanan.",
    petugas: [{ id: "PTG003", nama: "Briptu Rudi" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA002",
      keterangan: "Dokumentasi sementara TKP",
    },
  },

  // 03
  {
    id: "LKA-2026-003",
    tanggal: "20 Januari 2026",
    jam: "19:20",
    waktuInput: "20 Januari 2026 20:05",
    nomorLP: "Nihil",
    status: "Selesai",
    jumlahLR: 3,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 1800000,
    tkp: "Jl. Raya Bojonegoro - Babat Desa Sraturejo Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Vario",
        nopol: "S 7788 EE",
        pengendara: "Dimas, 24th, mahasiswa, Desa Sraturejo Kec. Baureno",
        pembonceng: "Rian, 23th, mahasiswa, Desa Sraturejo Kec. Baureno",
      },
    ],
    saksi: [
      "Yanto, 35th, swasta, Desa Sraturejo Kec. Baureno",
      "Wahyu, 29th, pedagang, Desa Banjarjo Kec. Baureno",
    ],
    kronologi:
      "Pengendara sepeda motor kehilangan kendali saat jalan licin sehingga terjatuh dan mengakibatkan korban mengalami luka ringan.",
    petugas: [{ id: "PTG004", nama: "Aiptu Seno" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA003",
      keterangan: "Dokumentasi penanganan kecelakaan",
    },
  },

  // 04
  {
    id: "LKA-2026-004",
    tanggal: "28 Januari 2026",
    jam: "06:45",
    waktuInput: "28 Januari 2026 07:30",
    nomorLP: "LP-0104-BJN/I/2026",
    status: "Limpah Polres",
    jumlahLR: 0,
    jumlahLB: 1,
    jumlahMD: 1,
    kermat: 12000000,
    tkp: "Jl. Raya Baureno Desa Gunungsari Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Supra",
        nopol: "S 1122 FF",
        pengendara: "Tono, 52th, petani, Desa Gunungsari Kec. Baureno",
      },
      {
        kendaraan: "Bus Dali Jaya",
        nopol: "S 6677 GG",
        pengemudi: "Suharto, 45th, sopir, Desa Pasinan Kec. Baureno",
      },
    ],
    saksi: [
      "Kasmadi, 50th, petani, Desa Gunungsari Kec. Baureno",
      "Sundari, 36th, wiraswasta, Desa Lamongrejo Kec. Pucuk",
      "Rokhim, 42th, pedagang, Desa Baureno Kec. Baureno",
    ],
    kronologi:
      "Sepeda motor berjalan di jalur kiri kemudian bertabrakan dengan bus yang melaju dari arah berlawanan dan mengakibatkan korban meninggal dunia.",
    petugas: [
      { id: "PTG003", nama: "Briptu Rudi" },
      { id: "PTG004", nama: "Aiptu Seno" },
    ],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA004",
      keterangan: "Dokumentasi lengkap TKP, kendaraan dan korban",
    },
  },

  // 05
  {
    id: "LKA-2026-005",
    tanggal: "05 Februari 2026",
    jam: "15:25",
    waktuInput: "05 Februari 2026 16:10",
    nomorLP: "Nihil",
    status: "Dalam Penanganan",
    jumlahLR: 3,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 3000000,
    tkp: "Desa Tanggungan Kec. Baureno Kab. Bojonegoro",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Scoopy",
        nopol: "S 3344 HH",
        pengendara: "Beni, 45th, tani, Desa Sumbergede",
        pembonceng: "Rendi, 57th, pedagang, Desa Kabunan Kec. Balen",
      },
    ],
    saksi: ["Kasmadi, Desa Gunungsari Kec. Baureno Kab. Bojonegoro"],
    kronologi:
      "Sepeda motor yang membawa pembonceng terlibat kecelakaan di jalan raya yang mengakibatkan pengendara dan pembonceng mengalami luka.",
    petugas: [{ id: "PTG001", nama: "Briptu Andi" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA005",
      keterangan: "Dokumentasi awal kejadian",
    },
  },

  // 06
  {
    id: "LKA-2026-006",
    tanggal: "14 Februari 2026",
    jam: "10:10",
    waktuInput: "14 Februari 2026 11:00",
    nomorLP: "Belum tersedia",
    status: "Limpah Polres",
    jumlahLR: 2,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 4200000,
    tkp: "Jl. Raya Bojonegoro - Babat Desa Banjarjo Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Beat",
        nopol: "S 5566 II",
        pengendara: "Arif, 31th, swasta, Desa Banjarjo Kec. Baureno",
        pembonceng: "Dedi, 30th, swasta, Desa Banjarjo Kec. Baureno",
      },
      {
        kendaraan: "Mobil Daihatsu Xenia",
        nopol: "S 7788 JJ",
        pengemudi: "Fajar, 39th, wiraswasta, Desa Tanggungan Kec. Baureno",
      },
    ],
    saksi: [
      "Suyanto, 46th, petani, Desa Banjarjo Kec. Baureno",
      "Hasan, 51th, pedagang, Desa Baureno Kec. Baureno",
    ],
    kronologi:
      "Sepeda motor berhenti mendadak di badan jalan kemudian ditabrak kendaraan yang berada di belakangnya.",
    petugas: [{ id: "PTG002", nama: "Aiptu Budi" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA006",
      keterangan: "Dokumentasi foto TKP",
    },
  },

  // 07
  {
    id: "LKA-2026-007",
    tanggal: "22 Februari 2026",
    jam: "21:40",
    waktuInput: "22 Februari 2026 22:15",
    nomorLP: "Nihil",
    status: "RJ",
    jumlahLR: 2,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 1000000,
    tkp: "Desa Sraturejo Kec. Baureno Kab. Bojonegoro",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Yamaha Mio",
        nopol: "S 9900 KK",
        pengendara: "Rizal, 22th, swasta, Desa Sraturejo",
      },
      {
        kendaraan: "Sepeda Motor Honda Revo",
        nopol: "S 2233 LL",
        pengendara: "Bagus, 27th, buruh, Desa Banjarjo",
      },
    ],
    saksi: ["Hadi, 33th, swasta, Desa Sraturejo"],
    kronologi:
      "Dua sepeda motor bersenggolan saat berpapasan di jalan desa dan kedua pengendara mengalami luka ringan.",
    petugas: [{ id: "PTG004", nama: "Aiptu Seno" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA007",
      keterangan: "Dokumentasi kejadian",
    },
  },

  // 08
  {
    id: "LKA-2026-008",
    tanggal: "01 Maret 2026",
    jam: "13:50",
    waktuInput: "01 Maret 2026 14:30",
    nomorLP: "LP-0108-BJN/III/2026",
    status: "Limpah Polres",
    jumlahLR: 1,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 6500000,
    tkp: "Jl. Raya Baureno Desa Kadungrejo Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Vario",
        nopol: "S 4455 MM",
        pengendara: "Doni, 35th, swasta, Desa Kadungrejo",
      },
      {
        kendaraan: "Toyota Kijang Innova",
        nopol: "S 6677 NN",
        pengemudi: "Yudi, 43th, wiraswasta, Desa Pasinan",
      },
    ],
    saksi: [
      "Mulyono, 55th, petani, Desa Kadungrejo",
      "Samsul, 47th, pedagang, Desa Baureno",
    ],
    kronologi:
      "Kendaraan sepeda motor keluar dari jalan desa menuju jalan raya dan bertabrakan dengan kendaraan yang melintas.",
    petugas: [
      { id: "PTG001", nama: "Briptu Andi" },
      { id: "PTG003", nama: "Briptu Rudi" },
    ],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA008",
      keterangan: "Dokumentasi TKP dan kendaraan",
    },
  },

  // 09
  {
    id: "LKA-2026-009",
    tanggal: "10 Maret 2026",
    jam: "17:35",
    waktuInput: "10 Maret 2026 18:20",
    nomorLP: "Nihil",
    status: "Selesai/RJ",
    jumlahLR: 1,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 900000,
    tkp: "Jl. Raya Baureno Desa Gunungsari",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Supra",
        nopol: "S 1122 OO",
        pengendara: "Taufik, 29th, swasta, Desa Gunungsari",
      },
    ],
    saksi: ["Wawan, 34th, pedagang, Desa Gunungsari"],
    kronologi:
      "Pengendara sepeda motor terjatuh sendiri setelah menghindari kendaraan yang berhenti di depannya.",
    petugas: [{ id: "PTG002", nama: "Aiptu Budi" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA009",
      keterangan: "Dokumentasi kejadian",
    },
  },

  // 10
  {
    id: "LKA-2026-010",
    tanggal: "18 Maret 2026",
    jam: "09:25",
    waktuInput: "18 Maret 2026 10:10",
    nomorLP: "Nihil",
    status: "Limpah Polres",
    jumlahLR: 0,
    jumlahLB: 2,
    jumlahMD: 0,
    kermat: 7500000,
    tkp: "Jl. Raya Bojonegoro - Babat Desa Pasinan Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Bus Dali Jaya",
        nopol: "S 8890 PP",
        pengemudi: "Suharto, 44th, sopir, Desa Pasinan",
      },
      {
        kendaraan: "Sepeda Motor Honda Beat",
        nopol: "S 3345 QQ",
        pengendara: "Feri, 26th, swasta, Desa Banjarjo",
        pembonceng: "Riko, 25th, swasta, Desa Banjarjo",
      },
    ],
    saksi: [
      "Sukardi, 60th, petani, Desa Pasinan",
      "Roni, 37th, pedagang, Desa Pasinan",
    ],
    kronologi:
      "Sepeda motor mendahului kendaraan lain kemudian bersenggolan dengan bus yang berjalan dari arah berlawanan.",
    petugas: [{ id: "PTG003", nama: "Briptu Rudi" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA010",
      keterangan: "Dokumentasi sementara sebelum pelimpahan",
    },
  },

  // 11
  {
    id: "LKA-2026-011",
    tanggal: "27 Maret 2026",
    jam: "12:15",
    waktuInput: "27 Maret 2026 13:00",
    nomorLP: "Nihil",
    status: "Dalam Penanganan",
    jumlahLR: 2,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 2100000,
    tkp: "Desa Kabunan Kec. Balen Kab. Bojonegoro",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Yamaha Aerox",
        nopol: "S 7788 RR",
        pengendara: "Iqbal, 30th, swasta, Desa Kabunan",
      },
    ],
    saksi: [
      "Darto, 48th, petani, Desa Kabunan",
      "Roni, 35th, pedagang, Desa Kabunan",
    ],
    kronologi:
      "Pengendara kehilangan kendali saat melewati jalan yang licin dan terjatuh.",
    petugas: [{ id: "PTG004", nama: "Aiptu Seno" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA011",
      keterangan: "Dokumentasi awal TKP",
    },
  },

  // 12
  {
    id: "LKA-2026-012",
    tanggal: "04 April 2026",
    jam: "18:10",
    waktuInput: "04 April 2026 19:00",
    nomorLP: "LP-0112-BJN/IV/2026",
    status: "Limpah Polres",
    jumlahLR: 2,
    jumlahLB: 1,
    jumlahMD: 0,
    kermat: 9000000,
    tkp: "Jl. Raya Baureno Desa Tanggungan Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda PCX",
        nopol: "S 5566 SS",
        pengendara: "Bayu, 33th, swasta, Desa Tanggungan",
        pembonceng: "Rangga, 31th, swasta, Desa Tanggungan",
      },
      {
        kendaraan: "Truk Isuzu",
        nopol: "S 9911 TT",
        pengemudi: "Suyono, 50th, sopir, Desa Balen",
      },
    ],
    saksi: ["Kusno, 45th, petani, Desa Tanggungan"],
    kronologi:
      "Sepeda motor berjalan dari arah timur dan bertabrakan dengan truk yang sedang keluar dari bahu jalan.",
    petugas: [
      { id: "PTG001", nama: "Briptu Andi" },
      { id: "PTG004", nama: "Aiptu Seno" },
    ],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA012",
      keterangan: "Dokumentasi lengkap kejadian dan kendaraan",
    },
  },

  // 13
  {
    id: "LKA-2026-013",
    tanggal: "13 April 2026",
    jam: "07:20",
    waktuInput: "13 April 2026 08:00",
    nomorLP: "Nihil",
    status: "Selesai",
    jumlahLR: 1,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 600000,
    tkp: "Desa Banjarjo Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Revo",
        nopol: "S 2233 UU",
        pengendara: "Wawan, 40th, petani, Desa Banjarjo",
      },
    ],
    saksi: ["Teguh, 42th, petani, Desa Banjarjo"],
    kronologi:
      "Pengendara sepeda motor terjatuh karena menghindari lubang di badan jalan.",
    petugas: [{ id: "PTG002", nama: "Aiptu Budi" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA013",
      keterangan: "Dokumentasi TKP",
    },
  },

  // 14
  {
    id: "LKA-2026-014",
    tanggal: "21 April 2026",
    jam: "20:45",
    waktuInput: "21 April 2026 21:30",
    nomorLP: "Belum tersedia",
    status: "Limpah Polres",
    jumlahLR: 1,
    jumlahLB: 0,
    jumlahMD: 1,
    kermat: 15000000,
    tkp: "Jl. Raya Bojonegoro - Babat Desa Sraturejo Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Supra",
        nopol: "S 4455 VV",
        pengendara: "Slamet, 55th, petani, Desa Sraturejo",
      },
      {
        kendaraan: "Mobil Toyota Avanza",
        nopol: "S 6677 WW",
        pengemudi: "Andi, 38th, swasta, Desa Tanggungan",
      },
    ],
    saksi: [
      "Kardi, 47th, petani, Desa Sraturejo",
      "Rudi, 35th, swasta, Desa Sraturejo",
    ],
    kronologi:
      "Sepeda motor bertabrakan dengan mobil pada saat kendaraan berjalan berlawanan arah dan mengakibatkan pengendara sepeda motor meninggal dunia.",
    petugas: [
      { id: "PTG003", nama: "Briptu Rudi" },
      { id: "PTG004", nama: "Aiptu Seno" },
    ],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA014",
      keterangan: "Dokumentasi TKP dan penanganan korban",
    },
  },

  // 15
  {
    id: "LKA-2026-015",
    tanggal: "30 April 2026",
    jam: "11:35",
    waktuInput: "30 April 2026 12:15",
    nomorLP: "Nihil",
    status: "RJ",
    jumlahLR: 2,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 1300000,
    tkp: "Desa Gunungsari Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Vario",
        nopol: "S 8899 XX",
        pengendara: "Fikri, 25th, swasta, Desa Gunungsari",
        pembonceng: "Rizky, 24th, swasta, Desa Gunungsari",
      },
    ],
    saksi: ["Darto, 45th, petani, Desa Gunungsari"],
    kronologi:
      "Sepeda motor terjatuh saat pengendara menghindari kendaraan yang berhenti mendadak.",
    petugas: [{ id: "PTG001", nama: "Briptu Andi" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA015",
      keterangan: "Dokumentasi kecelakaan",
    },
  },

  // 16
  {
    id: "LKA-2026-016",
    tanggal: "08 Mei 2026",
    jam: "16:25",
    waktuInput: "08 Mei 2026 17:10",
    nomorLP: "LP-0116-BJN/V/2026",
    status: "Limpah Polres",
    jumlahLR: 3,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 4000000,
    tkp: "Jl. Raya Bojonegoro - Babat Desa Baureno Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Beat",
        nopol: "S 1234 YY",
        pengendara: "Bambang, 37th, swasta, Desa Baureno",
        pembonceng: "Deni, 29th, pedagang, Desa Baureno",
      },
      {
        kendaraan: "Sepeda Motor Yamaha Mio",
        nopol: "S 5678 ZZ",
        pengendara: "Rama, 26th, swasta, Desa Tanggungan",
      },
    ],
    saksi: [
      "Suharno, 52th, petani, Desa Baureno",
      "Kholis, 39th, pedagang, Desa Baureno",
    ],
    kronologi:
      "Dua sepeda motor bertabrakan saat salah satu kendaraan berpindah jalur untuk mendahului kendaraan lain.",
    petugas: [
      { id: "PTG002", nama: "Aiptu Budi" },
      { id: "PTG003", nama: "Briptu Rudi" },
    ],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA016",
      keterangan: "Dokumentasi lengkap TKP",
    },
  },

  // 17
  {
    id: "LKA-2026-017",
    tanggal: "17 Mei 2026",
    jam: "05:50",
    waktuInput: "17 Mei 2026 06:40",
    nomorLP: "Nihil",
    status: "Dalam Penanganan",
    jumlahLR: 1,
    jumlahLB: 1,
    jumlahMD: 0,
    kermat: 3500000,
    tkp: "Jl. Raya Baureno Desa Kadungrejo",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Scoopy",
        nopol: "S 2468 AB",
        pengendara: "Roni, 34th, swasta, Desa Kadungrejo",
      },
      {
        kendaraan: "Mobil Daihatsu Sigra",
        nopol: "S 1357 AC",
        pengemudi: "Yusuf, 42th, wiraswasta, Desa Baureno",
      },
    ],
    saksi: ["Samin, 57th, petani, Desa Kadungrejo"],
    kronologi:
      "Sepeda motor keluar dari gang desa dan bertabrakan dengan kendaraan yang melintas di jalan utama.",
    petugas: [{ id: "PTG004", nama: "Aiptu Seno" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA017",
      keterangan: "Dokumentasi awal kejadian",
    },
  },

  // 18
  {
    id: "LKA-2026-018",
    tanggal: "26 Mei 2026",
    jam: "14:15",
    waktuInput: "26 Mei 2026 15:00",
    nomorLP: "Belum tersedia",
    status: "Limpah Polres",
    jumlahLR: 2,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 5800000,
    tkp: "Jl. Raya Bojonegoro - Babat Desa Gunungsari Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Yamaha NMAX",
        nopol: "S 4680 AD",
        pengendara: "Haris, 32th, swasta, Desa Gunungsari",
        pembonceng: "Ari, 30th, swasta, Desa Gunungsari",
      },
      {
        kendaraan: "Toyota Rush",
        nopol: "S 2468 AE",
        pengemudi: "Dedi, 45th, wiraswasta, Desa Baureno",
      },
    ],
    saksi: [
      "Sukir, 51th, petani, Desa Gunungsari",
      "Tono, 44th, pedagang, Desa Gunungsari",
    ],
    kronologi:
      "Sepeda motor berpindah jalur dan bersenggolan dengan kendaraan roda empat yang berjalan dari arah berlawanan.",
    petugas: [{ id: "PTG001", nama: "Briptu Andi" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA018",
      keterangan: "Dokumentasi sementara menunggu nomor LP",
    },
  },

  // 19
  {
    id: "LKA-2026-019",
    tanggal: "04 Juni 2026",
    jam: "22:10",
    waktuInput: "04 Juni 2026 23:00",
    nomorLP: "Nihil",
    status: "Selesai",
    jumlahLR: 2,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 1700000,
    tkp: "Desa Tanggungan Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Beat",
        nopol: "S 5791 AF",
        pengendara: "Eko, 28th, swasta, Desa Tanggungan",
      },
      {
        kendaraan: "Sepeda Motor Honda Revo",
        nopol: "S 6812 AG",
        pengendara: "Yoga, 31th, swasta, Desa Tanggungan",
      },
    ],
    saksi: ["Rudi, 40th, pedagang, Desa Tanggungan"],
    kronologi:
      "Kedua sepeda motor bersenggolan saat melintas di jalan desa pada malam hari.",
    petugas: [{ id: "PTG002", nama: "Aiptu Budi" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA019",
      keterangan: "Dokumentasi penanganan",
    },
  },

  // 20
  {
    id: "LKA-2026-020",
    tanggal: "13 Juni 2026",
    jam: "08:40",
    waktuInput: "13 Juni 2026 09:25",
    nomorLP: "LP-0120-BJN/VI/2026",
    status: "Limpah Polres",
    jumlahLR: 1,
    jumlahLB: 1,
    jumlahMD: 0,
    kermat: 6800000,
    tkp: "Jl. Raya Baureno Desa Sraturejo Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda PCX",
        nopol: "S 7913 AH",
        pengendara: "Beni, 45th, tani, Desa Sumbergede",
        pembonceng: "Rendi, 57th, pedagang, Desa Kabunan Kec. Balen",
      },
      {
        kendaraan: "Bus Dali Jaya",
        nopol: "S 8024 AI",
        pengemudi: "Suharto, 28th, swasta, Desa Pasinan",
      },
    ],
    saksi: [
      "Kasmadi, Desa Gunungsari Kec. Baureno Kab. Bojonegoro",
      "Sundari, 36th, wiraswasta, Desa Lamongrejo Kec. Pucuk",
    ],
    kronologi:
      "Sepeda motor yang membawa pembonceng terlibat kecelakaan dengan bus di jalan raya.",
    petugas: [
      { id: "PTG003", nama: "Briptu Rudi" },
      { id: "PTG004", nama: "Aiptu Seno" },
    ],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA020",
      keterangan: "Dokumentasi foto dan video kejadian",
    },
  },

  // 21
  {
    id: "LKA-2026-021",
    tanggal: "21 Juni 2025",
    jam: "16:55",
    waktuInput: "21 Juni 2026 17:35",
    nomorLP: "Nihil",
    status: "RJ",
    jumlahLR: 1,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 1100000,
    tkp: "Desa Banjarjo Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Yamaha Fazzio",
        nopol: "S 9135 AJ",
        pengendara: "Aldi, 23th, mahasiswa, Desa Banjarjo",
        pembonceng: "Fahmi, 22th, mahasiswa, Desa Banjarjo",
      },
    ],
    saksi: ["Joko, 39th, pedagang, Desa Banjarjo"],
    kronologi:
      "Sepeda motor tergelincir saat melewati jalan yang basah akibat hujan.",
    petugas: [{ id: "PTG001", nama: "Briptu Andi" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA021",
      keterangan: "Dokumentasi kejadian",
    },
  },

  // 22
  {
    id: "LKA-2026-022",
    tanggal: "29 Juni 2026",
    jam: "11:20",
    waktuInput: "29 Juni 2026 12:00",
    nomorLP: "Belum tersedia",
    status: "Limpah Polres",
    jumlahLR: 0,
    jumlahLB: 2,
    jumlahMD: 0,
    kermat: 10000000,
    tkp: "Jl. Raya Bojonegoro - Babat Desa Tanggungan Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Vario",
        nopol: "S 3579 AK",
        pengendara: "Rian, 29th, swasta, Desa Tanggungan",
      },
      {
        kendaraan: "Truk Mitsubishi Fuso",
        nopol: "S 4680 AL",
        pengemudi: "Suyono, 50th, sopir, Desa Kabunan",
      },
    ],
    saksi: [
      "Mulyadi, 48th, petani, Desa Tanggungan",
      "Heri, 37th, pedagang, Desa Tanggungan",
      "Slamet, 55th, swasta, Desa Baureno",
    ],
    kronologi:
      "Sepeda motor bertabrakan dengan truk yang sedang melintas di jalan utama dan mengakibatkan dua orang mengalami luka berat.",
    petugas: [
      { id: "PTG002", nama: "Aiptu Budi" },
      { id: "PTG003", nama: "Briptu Rudi" },
    ],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA022",
      keterangan: "Dokumentasi lengkap TKP",
    },
  },

  // 23
  {
    id: "LKA-2026-023",
    tanggal: "07 Juli 2026",
    jam: "09:45",
    waktuInput: "07 Juli 2026 10:30",
    nomorLP: "Nihil",
    status: "Selesai",
    jumlahLR: 2,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 2200000,
    tkp: "Desa Gunungsari Kec. Baureno",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Beat",
        nopol: "S 5791 AM",
        pengendara: "Deni, 30th, swasta, Desa Gunungsari",
        pembonceng: "Rizal, 28th, swasta, Desa Gunungsari",
      },
    ],
    saksi: [
      "Suroto, 44th, petani, Desa Gunungsari",
      "Hasan, 36th, pedagang, Desa Gunungsari",
    ],
    kronologi:
      "Pengendara sepeda motor kehilangan kendali saat menghindari kendaraan yang berhenti di depannya.",
    petugas: [{ id: "PTG004", nama: "Aiptu Seno" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA023",
      keterangan: "Dokumentasi TKP dan kendaraan",
    },
  },

  // 24
  {
    id: "LKA-2026-024",
    tanggal: "11 Juli 2026",
    jam: "16:25",
    waktuInput: "11 Juli 2026 17:15",
    nomorLP: "LP-2345-UJ87/RESBJN",
    status: "Limpah Polres",
    jumlahLR: 1,
    jumlahLB: 1,
    jumlahMD: 1,
    kermat: 8000000,
    tkp: "Jl. Raya Bojonegoro - Babat turut wilayah Desa Gunungsari Kec. Baureno Kab. Bojonegoro",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Beat",
        nopol: "S 3456 HU",
        pengendara: "Beni, 45th, Tani, Desa Sumbergede",
        pembonceng: "Rendi, 57th, Pedagang, Desa Kabunan Kec. Balen",
      },
      {
        kendaraan: "Bus Dali Jaya",
        nopol: "S 7666 UA",
        pengemudi: "Suharto, 28 th, swasta, Desa Pasinan Rt 05 rw 06",
      },
    ],
    saksi: [
      "Kasmadi, Desa Gunungsari Kec. Baureno Kab. Bojonegoro",
      "Sundari, 36th, wiraswasta, Desa Lamongrejo Kec. Pucuk",
    ],
    kronologi:
      "Semula Sepeda motor yang membawa pembonceng terlibat kecelakaan dengan bus di jalan raya, yang mengakibatkan pengendara sepeda motor mengalami luka dikepala sedangkan pembonceng luka tanda patah tulang.",
    petugas: [
      { id: "PTG003", nama: "Briptu Rudi" },
      { id: "PTG004", nama: "Aiptu Seno" },
    ],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohFolderDokumentasiLaka",
      keterangan: "Dokumentasi foto dan video kejadian Laka Lantas",
    },
  },

  // 25
  {
    id: "LKA-2025-025",
    tanggal: "15 Agustus 2025",
    jam: "08:30",
    waktuInput: "15 Agustus 2025 09:15",
    nomorLP: "LP-0825-BJN/VIII/2025",
    status: "Limpah Polres",
    jumlahLR: 2,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 4500000,
    tkp: "Jl. Raya Bojonegoro - Babat Desa Baureno Kec. Baureno Kab. Bojonegoro",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Beat",
        nopol: "S 1256 BA",
        pengendara: "Agus, 34th, swasta, Desa Baureno Kec. Baureno",
        pembonceng: "Rian, 29th, pedagang, Desa Baureno Kec. Baureno",
      },
      {
        kendaraan: "Mobil Toyota Avanza",
        nopol: "S 3478 BB",
        pengemudi: "Heri, 42th, wiraswasta, Desa Sraturejo Kec. Baureno",
      },
    ],
    saksi: [
      "Slamet, 48th, petani, Desa Baureno Kec. Baureno",
      "Joko, 39th, pedagang, Desa Sraturejo Kec. Baureno",
    ],
    kronologi:
      "Sepeda motor yang membawa pembonceng berjalan dari arah Bojonegoro menuju Babat kemudian bertabrakan dengan kendaraan Toyota Avanza.",
    petugas: [
      { id: "PTG001", nama: "Briptu Andi" },
      { id: "PTG002", nama: "Aiptu Budi" },
    ],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA2025A",
      keterangan: "Dokumentasi foto TKP dan kendaraan",
    },
  },

  // 26
  {
    id: "LKA-2025-026",
    tanggal: "22 Agustus 2025",
    jam: "14:20",
    waktuInput: "22 Agustus 2025 15:00",
    nomorLP: "Nihil",
    status: "Selesai",
    jumlahLR: 1,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 1200000,
    tkp: "Desa Tanggungan Kec. Baureno Kab. Bojonegoro",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Yamaha NMAX",
        nopol: "S 5678 BC",
        pengendara: "Dedi, 31th, swasta, Desa Tanggungan Kec. Baureno",
      },
    ],
    saksi: ["Mulyono, 45th, petani, Desa Tanggungan Kec. Baureno"],
    kronologi:
      "Pengendara sepeda motor kehilangan kendali saat menghindari lubang di badan jalan sehingga terjatuh.",
    petugas: [{ id: "PTG003", nama: "Briptu Rudi" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA2025B",
      keterangan: "Dokumentasi penanganan kecelakaan",
    },
  },

  // 27
  {
    id: "LKA-2025-027",
    tanggal: "05 September 2025",
    jam: "19:45",
    waktuInput: "05 September 2025 20:30",
    nomorLP: "Belum tersedia",
    status: "Limpah Polres",
    jumlahLR: 1,
    jumlahLB: 1,
    jumlahMD: 0,
    kermat: 7200000,
    tkp: "Jl. Raya Bojonegoro - Babat Desa Gunungsari Kec. Baureno Kab. Bojonegoro",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Vario",
        nopol: "S 7890 BD",
        pengendara: "Rudi, 37th, swasta, Desa Gunungsari Kec. Baureno",
        pembonceng: "Fahmi, 33th, pedagang, Desa Gunungsari Kec. Baureno",
      },
      {
        kendaraan: "Truk Mitsubishi",
        nopol: "S 9012 BE",
        pengemudi: "Suyono, 50th, sopir, Desa Pasinan Kec. Baureno",
      },
    ],
    saksi: [
      "Kasmadi, 51th, petani, Desa Gunungsari Kec. Baureno",
      "Sundari, 36th, wiraswasta, Desa Lamongrejo Kec. Pucuk",
      "Heri, 44th, pedagang, Desa Gunungsari Kec. Baureno",
    ],
    kronologi:
      "Sepeda motor yang membawa pembonceng bertabrakan dengan truk saat melintas di jalan raya pada malam hari.",
    petugas: [
      { id: "PTG001", nama: "Briptu Andi" },
      { id: "PTG004", nama: "Aiptu Seno" },
    ],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA2025C",
      keterangan: "Dokumentasi TKP dan kendaraan, nomor LP belum tersedia",
    },
  },

  // 28
  {
    id: "LKA-2025-028",
    tanggal: "18 Oktober 2025",
    jam: "11:10",
    waktuInput: "18 Oktober 2025 11:50",
    nomorLP: "Nihil",
    status: "RJ",
    jumlahLR: 2,
    jumlahLB: 0,
    jumlahMD: 0,
    kermat: 900000,
    tkp: "Desa Sraturejo Kec. Baureno Kab. Bojonegoro",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Scoopy",
        nopol: "S 3456 BF",
        pengendara: "Arif, 26th, swasta, Desa Sraturejo Kec. Baureno",
        pembonceng: "Doni, 25th, swasta, Desa Sraturejo Kec. Baureno",
      },
    ],
    saksi: ["Wawan, 38th, pedagang, Desa Sraturejo Kec. Baureno"],
    kronologi:
      "Sepeda motor tergelincir saat melintasi jalan yang basah dan pengendara bersama pembonceng mengalami luka ringan.",
    petugas: [{ id: "PTG002", nama: "Aiptu Budi" }],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA2025D",
      keterangan: "Dokumentasi kejadian",
    },
  },

  // 29
  {
    id: "LKA-2025-029",
    tanggal: "27 November 2025",
    jam: "16:40",
    waktuInput: "27 November 2025 17:25",
    nomorLP: "LP-1129-BJN/XI/2025",
    status: "Limpah Polres",
    jumlahLR: 0,
    jumlahLB: 1,
    jumlahMD: 1,
    kermat: 13500000,
    tkp: "Jl. Raya Bojonegoro - Babat Desa Baureno Kec. Baureno Kab. Bojonegoro",
    kendaraan: [
      {
        kendaraan: "Sepeda Motor Honda Supra",
        nopol: "S 6789 BG",
        pengendara: "Tono, 54th, petani, Desa Baureno Kec. Baureno",
      },
      {
        kendaraan: "Bus Dali Jaya",
        nopol: "S 7890 BH",
        pengemudi: "Suharto, 46th, sopir, Desa Pasinan Kec. Baureno",
      },
    ],
    saksi: [
      "Kardi, 49th, petani, Desa Baureno Kec. Baureno",
      "Rokhim, 42th, pedagang, Desa Baureno Kec. Baureno",
    ],
    kronologi:
      "Sepeda motor bertabrakan dengan bus yang datang dari arah berlawanan dan mengakibatkan pengendara mengalami luka berat serta satu korban meninggal dunia.",
    petugas: [
      { id: "PTG003", nama: "Briptu Rudi" },
      { id: "PTG004", nama: "Aiptu Seno" },
    ],
    dokumentasi: {
      url: "https://drive.google.com/drive/folders/1ContohLKA2025E",
      keterangan: "Dokumentasi lengkap TKP, kendaraan dan korban",
    },
  },
];
