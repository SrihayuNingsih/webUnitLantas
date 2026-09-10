// Master Data Laka
const lakaData = [
  // =====================================================
  // DATA TAHUN 2025
  // =====================================================

  {
    id: "L/01/I/2025",
    hariTanggal: "Rabu, 16 Januari 2025",
    waktu: "08.15 WIB",
    lokasi: "Jl. Raya Baureno - Bojonegoro, Desa Baureno, Kec. Baureno",
    lr: 2,
    lb: 0,
    md: 0,
    kermat: 2500000,
    kendaraanDanPengendara: [
      {
        kendaraan: "Sepeda motor Nopol S 3456 BG",
        nama: "Zaenal Abidin",
        alamat: "Desa Pasinan",
        keterangan: "Melihat kejadian dari arah timur.",
      },
    ],
    saksi: [
      {
        nama: "Budi Santoso",
        alamat: "Desa Baureno",
        keterangan: "Melihat kejadian dari arah timur.",
      },
    ],
    kronologi:
      "Sepeda motor melaju dari arah timur dan menabrak kendaraan yang berada di depannya.",
    status: "Selesai",
    petugas: ["Aipda Heri Susanto", "Briptu Susanto"],
  },

  {
    id: "L/02/II/2025",
    hariTanggal: "Jumat, 21 Februari 2025",
    waktu: "14.30 WIB",
    lokasi: "Jl. Raya Baureno - Dander, Depan Pasar Baureno",
    lr: 1,
    lb: 1,
    md: 0,
    kermat: 4750000,
    saksi: [],
    kronologi:
      "Sepeda motor keluar dari jalan desa dan bertabrakan dengan kendaraan yang melintas di jalan utama.",
    status: "Dalam Penanganan",
    petugas: "Bripka Agus Setiawan",
  },

  {
    id: "L/03/III/2025",
    hariTanggal: "Selasa, 18 Maret 2025",
    waktu: "16.45 WIB",
    lokasi: "Jl. Raya Baureno - Kanor, Desa Kedungsumber",
    lr: 0,
    lb: 1,
    md: 1,
    kermat: 12500000,
    saksi: [
      {
        nama: "Slamet Riyadi",
        alamat: "Desa Kedungsumber",
        keterangan: "Berada di warung dekat lokasi kejadian.",
      },
      {
        nama: "Dedi Kurniawan",
        alamat: "Desa Kedungsumber",
        keterangan: "Melihat kendaraan datang dari arah berlawanan.",
      },
    ],
    kronologi:
      "Dua kendaraan bertabrakan dari arah berlawanan sehingga mengakibatkan korban meninggal dunia.",
    status: "Limpah Polres",
    petugas: "Aiptu Bambang",
  },

  {
    id: "L/04/IV/2025",
    hariTanggal: "Minggu, 13 April 2025",
    waktu: "11.20 WIB",
    lokasi: "Jl. Raya Baureno - Sugihwaras, Depan Balai Desa Sugihwaras",
    lr: 1,
    lb: 0,
    md: 0,
    kermat: 1500000,
    saksi: null,
    kronologi:
      "Pengendara kehilangan kendali dan kendaraan terjatuh di badan jalan.",
    status: "Dalam Penanganan",
    petugas: "Bripka Rudi Hartono",
  },

  {
    id: "L/05/V/2025",
    hariTanggal: "Senin, 26 Mei 2025",
    waktu: "09.10 WIB",
    lokasi: "Jl. Raya Baureno, Desa Sraturejo",
    lr: 3,
    lb: 0,
    md: 0,
    kermat: 3250000,
    saksi: [
      {
        nama: "Hendra Wijaya",
        alamat: "Desa Sraturejo",
        keterangan: "Mengetahui kejadian setelah mendengar suara benturan.",
      },
    ],
    kronologi:
      "Kendaraan roda empat berhenti mendadak dan ditabrak kendaraan yang berada di belakangnya.",
    status: "Selesai",
    petugas: "Aipda Heri Susanto",
  },

  {
    id: "L/06/VI/2025",
    hariTanggal: "Kamis, 19 Juni 2025",
    waktu: "20.15 WIB",
    lokasi: "Jl. Raya Baureno - Bojonegoro, Desa Banjaranyar",
    lr: 0,
    lb: 2,
    md: 0,
    kermat: null,
    saksi: [],
    kronologi:
      "Pengendara sepeda motor terjatuh setelah menghindari kendaraan yang berhenti mendadak.",
    status: "Dalam Penanganan",
    petugas: "Bripka Agus Setiawan",
  },

  {
    id: "L/07/VII/2025",
    hariTanggal: "Sabtu, 12 Juli 2025",
    waktu: "07.40 WIB",
    lokasi: "Jl. Raya Baureno, Desa Karangdayu",
    lr: 1,
    lb: 0,
    md: 0,
    kermat: 750000,
    saksi: [
      {
        nama: "Wahyu Setiawan",
        alamat: "Desa Karangdayu",
        keterangan: "",
      },
    ],
    kronologi: "Pengendara kehilangan keseimbangan dan terjatuh di sisi jalan.",
    status: "Selesai",
    petugas: "Aiptu Bambang",
  },

  {
    id: "L/08/VIII/2025",
    hariTanggal: "Rabu, 20 Agustus 2025",
    waktu: "18.30 WIB",
    lokasi: "Jl. Raya Baureno - Kanor, Desa Baureno",
    lr: 2,
    lb: 1,
    md: 0,
    kermat: 6250000,
    saksi: [
      {
        nama: "Suyanto",
        alamat: "Desa Baureno",
        keterangan: "Melihat kendaraan melaju dari arah barat.",
      },
    ],
    kronologi:
      "Kendaraan sepeda motor bertabrakan dengan mobil pada saat kendaraan berpindah jalur.",
    status: "Limpah Polres",
    petugas: "Bripka Rudi Hartono",
  },

  {
    id: "L/09/IX/2025",
    hariTanggal: "Senin, 15 September 2025",
    waktu: "13.25 WIB",
    lokasi: "Jl. Raya Baureno, Depan SPBU Baureno",
    lr: 0,
    lb: 0,
    md: 0,
    kermat: 0,
    saksi: [],
    kronologi:
      "Terjadi kecelakaan ringan tanpa korban jiwa maupun korban luka. Kendaraan mengalami kerusakan ringan.",
    status: "Selesai",
    petugas: "Aipda Heri Susanto",
  },

  {
    id: "L/10/X/2025",
    hariTanggal: "Jumat, 10 Oktober 2025",
    waktu: "22.10 WIB",
    lokasi: "Jl. Raya Baureno - Dander, Desa Pasinan",
    lr: 1,
    lb: 0,
    md: 1,
    kermat: 8500000,
    saksi: [
      {
        nama: "Mulyono",
        alamat: "Desa Pasinan",
        keterangan: "Melihat kejadian dari depan rumah.",
      },
    ],
    kronologi:
      "Sepeda motor bertabrakan dengan kendaraan dari arah berlawanan.",
    status: "Dalam Penanganan",
    petugas: "Bripka Agus Setiawan",
  },

  {
    id: "L/11/XI/2025",
    hariTanggal: "Selasa, 18 November 2025",
    waktu: "10.45 WIB",
    lokasi: "Jl. Raya Baureno, Desa Gunungsari",
    lr: 2,
    lb: 0,
    md: 0,
    kermat: 1800000,
    saksi: [],
    kronologi: "",
    status: "",
    petugas: "",
  },

  {
    id: "L/12/XII/2025",
    hariTanggal: "Minggu, 14 Desember 2025",
    waktu: "15.50 WIB",
    lokasi: "Jl. Raya Baureno - Sugihwaras",
    lr: 0,
    lb: 1,
    md: 0,
    kermat: 2100000,
    saksi: [
      {
        nama: "Rizal",
        alamat: "",
        keterangan: "Melihat kendaraan setelah kejadian.",
      },
    ],
    kronologi:
      "Kendaraan mengalami kecelakaan pada saat melintas di jalan utama.",
    status: "Dalam Penanganan",
    petugas: "Bripka Rudi Hartono",
  },

  // =====================================================
  // DATA TAHUN 2026
  // =====================================================

  {
    id: "L/01/I/2026",
    hariTanggal: "Kamis, 8 Januari 2026",
    waktu: "08.30 WIB",
    lokasi: "Jl. Raya Baureno - Bojonegoro, Desa Baureno",
    lr: 2,
    lb: 0,
    md: 0,
    kermat: 2750000,
    saksi: [
      {
        nama: "Andi Prasetyo",
        alamat: "Desa Baureno",
        keterangan: "Melihat kejadian dari arah timur.",
      },
    ],
    kronologi:
      "Sepeda motor menabrak kendaraan yang sedang berhenti di badan jalan.",
    status: "Selesai",
    petugas: "Aipda Heri Susanto",
  },

  {
    id: "L/02/I/2026",
    hariTanggal: "Sabtu, 17 Januari 2026",
    waktu: "17.15 WIB",
    lokasi: "Jl. Raya Baureno - Dander, Depan Pasar Baureno",
    lr: 1,
    lb: 1,
    md: 0,
    kermat: 4500000,
    saksi: [],
    kronologi:
      "Kendaraan sepeda motor bertabrakan dengan kendaraan roda empat di sekitar pasar.",
    status: "Dalam Penanganan",
    petugas: "Bripka Agus Setiawan",
  },

  {
    id: "L/03/II/2026",
    hariTanggal: "Kamis, 5 Februari 2026",
    waktu: "12.40 WIB",
    lokasi: "Jl. Raya Baureno - Kanor, Desa Kedungsumber",
    lr: 0,
    lb: 0,
    md: 1,
    kermat: 11000000,
    saksi: [
      {
        nama: "Teguh",
        alamat: "Desa Kedungsumber",
        keterangan: "Melihat kejadian secara langsung.",
      },
    ],
    kronologi:
      "Terjadi kecelakaan antara dua kendaraan yang mengakibatkan satu korban meninggal dunia.",
    status: "Limpah Polres",
    petugas: "Aiptu Bambang",
  },

  {
    id: "L/04/II/2026",
    hariTanggal: "Kamis, 19 Februari 2026",
    waktu: "21.05 WIB",
    lokasi: "Jl. Raya Baureno, Desa Sraturejo",
    lr: 1,
    lb: 0,
    md: 0,
    kermat: 1250000,
    saksi: null,
    kronologi: "Pengendara kehilangan kendali saat melintas pada malam hari.",
    status: "Selesai",
    petugas: "Bripka Rudi Hartono",
  },

  {
    id: "L/05/III/2026",
    hariTanggal: "Kamis, 12 Maret 2026",
    waktu: "09.20 WIB",
    lokasi: "Jl. Raya Baureno - Bojonegoro, Desa Banjaranyar",
    lr: 2,
    lb: 1,
    md: 0,
    kermat: null,
    saksi: [
      {
        nama: "Fajar",
        alamat: "Desa Banjaranyar",
        keterangan: "Berada di sekitar lokasi kejadian.",
      },
    ],
    kronologi:
      "Kendaraan bertabrakan pada saat salah satu kendaraan hendak berbelok.",
    status: "Dalam Penanganan",
    petugas: "Aipda Heri Susanto",
  },

  {
    id: "L/06/IV/2026",
    hariTanggal: "Jumat, 3 April 2026",
    waktu: "16.10 WIB",
    lokasi: "Jl. Raya Baureno, Desa Karangdayu",
    lr: 0,
    lb: 1,
    md: 0,
    kermat: 900000,
    saksi: [],
    kronologi: "Sepeda motor tergelincir dan pengendara mengalami luka ringan.",
    status: "Selesai",
    petugas: "Aiptu Bambang",
  },

  {
    id: "L/07/IV/2026",
    hariTanggal: "Sabtu, 25 April 2026",
    waktu: "19.45 WIB",
    lokasi: "Jl. Raya Baureno - Sugihwaras",
    lr: 1,
    lb: 0,
    md: 0,
    kermat: 1750000,
    saksi: [
      {
        nama: "Samsul",
        alamat: "Desa Sugihwaras",
        keterangan: "Melihat kendaraan terjatuh di jalan.",
      },
    ],
    kronologi: "Pengendara sepeda motor kehilangan kendali dan terjatuh.",
    status: "Dalam Penanganan",
    petugas: "Bripka Agus Setiawan",
  },

  {
    id: "L/08/V/2026",
    hariTanggal: "Sabtu, 9 Mei 2026",
    waktu: "06.55 WIB",
    lokasi: "Jl. Raya Baureno, Desa Baureno",
    lr: 0,
    lb: 0,
    md: 0,
    kermat: 0,
    saksi: [],
    kronologi:
      "Kendaraan tergelincir namun tidak terdapat korban luka maupun meninggal dunia.",
    status: "Selesai",
    petugas: "Aipda Heri Susanto",
  },

  {
    id: "L/09/V/2026",
    hariTanggal: "Rabu, 27 Mei 2026",
    waktu: "14.25 WIB",
    lokasi: "",
    lr: 1,
    lb: 0,
    md: 0,
    kermat: 2300000,
    saksi: null,
    kronologi: "",
    status: "Dalam Penanganan",
    petugas: "",
  },

  {
    id: "L/10/VI/2026",
    hariTanggal: "Kamis, 4 Juni 2026",
    waktu: "11.35 WIB",
    lokasi: "Jl. Raya Baureno - Dander",
    lr: 2,
    lb: 0,
    md: 0,
    kermat: null,
    saksi: [],
    kronologi:
      "Sepeda motor menabrak kendaraan yang berhenti di pinggir jalan.",
    status: null,
    petugas: "Bripka Rudi Hartono",
  },

  {
    id: "L/11/VII/2026",
    hariTanggal: "Kamis, 16 Juli 2026",
    waktu: "20.30 WIB",
    lokasi: "Jl. Raya Baureno, Desa Gunungsari",
    lr: 0,
    lb: 1,
    md: 0,
    kermat: 3200000,
    saksi: [
      {
        nama: "Bayu",
        alamat: "Desa Gunungsari",
        keterangan: "Melihat kejadian dari arah selatan.",
      },
    ],
    kronologi:
      "Kendaraan roda empat bertabrakan dengan sepeda motor pada persimpangan jalan.",
    status: "Limpah Polres",
    petugas: "Aiptu Bambang",
  },

  {
    id: "L/12/IX/2026",
    hariTanggal: "Jumat, 4 September 2026",
    waktu: "09.15 WIB",
    lokasi: "Jl. Raya Baureno - Bojonegoro, Desa Baureno",
    lr: 1,
    lb: 1,
    md: 0,
    kermat: 4250000,
    saksi: [
      {
        nama: "Agus Setiawan",
        alamat: "Desa Baureno",
        keterangan: "Mengetahui kejadian setelah mendengar suara benturan.",
      },
    ],
    kronologi:
      "Kendaraan sepeda motor bertabrakan dengan mobil pada persimpangan Jalan Raya Baureno.",
    status: "Dalam Penanganan",
    petugas: "Aipda Heri Susanto",
  },
];

// export default lakaData;
