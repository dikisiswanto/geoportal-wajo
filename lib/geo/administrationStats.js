import { getWajoKecamatanByKemendagri, getWajoVillageByKemendagriCode } from "./adminMaster.mjs";

// Statistik wilayah dihitung dari data yang sudah dipetakan berdasarkan kode administrasi.
export const ADMIN_STATS = {
  "kabupaten": {
    "wajo": {
      "name": "Wajo",
      "code": "73.13",
      "metrics": [
        {
          "label": "Kecamatan",
          "value": 14
        },
        {
          "label": "Desa / Kelurahan",
          "value": 190
        },
        {
          "label": "Jenis data tersedia",
          "value": 16
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 2492
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 298
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 425
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 2136
        },
        {
          "layerId": "opd",
          "label": "Kantor Pemerintah",
          "count": 27
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 44
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 21
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 852
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 22
        },
        {
          "layerId": "sarana-energi",
          "label": "Sarana Energi",
          "count": 8
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 94
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 55
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 58
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 257
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 806
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 340
        }
      ],
      "notes": [
        "243 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta.",
        "1 data puskesmas belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    }
  },
  "kecamatan": {
    "73.13.01": {
      "name": "Sabangparu",
      "code": "73.13.01",
      "metrics": [
        {
          "label": "Desa / Kelurahan",
          "value": 15
        },
        {
          "label": "Jenis data tersedia",
          "value": 13
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 114
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 19
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 24
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 99
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 2
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 33
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 8
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 4
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 15
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 54
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 44
        }
      ],
      "notes": [
        "14 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.02": {
      "name": "Pammana",
      "code": "73.13.02",
      "metrics": [
        {
          "label": "Desa / Kelurahan",
          "value": 16
        },
        {
          "label": "Jenis data tersedia",
          "value": 13
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 185
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 17
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 20
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 133
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 54
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 2
        },
        {
          "layerId": "sarana-energi",
          "label": "Sarana Energi",
          "count": 4
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 6
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 16
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 78
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 20
        }
      ],
      "notes": [
        "13 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.03": {
      "name": "Takkalalla",
      "code": "73.13.03",
      "metrics": [
        {
          "label": "Desa / Kelurahan",
          "value": 13
        },
        {
          "label": "Jenis data tersedia",
          "value": 13
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 142
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 22
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 26
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 145
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 3
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 2
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 28
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 2
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 14
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 39
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 12
        }
      ],
      "notes": [
        "17 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.04": {
      "name": "Sajoanging",
      "code": "73.13.04",
      "metrics": [
        {
          "label": "Desa / Kelurahan",
          "value": 9
        },
        {
          "label": "Jenis data tersedia",
          "value": 14
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 108
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 14
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 15
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 89
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 5
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 35
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 2
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 6
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 12
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 37
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 10
        }
      ],
      "notes": [
        "11 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.05": {
      "name": "Majauleng",
      "code": "73.13.05",
      "metrics": [
        {
          "label": "Desa / Kelurahan",
          "value": 18
        },
        {
          "label": "Jenis data tersedia",
          "value": 13
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 265
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 22
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 25
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 208
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 4
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 44
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 3
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 4
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 22
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 71
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 76
        }
      ],
      "notes": [
        "21 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.06": {
      "name": "Tempe",
      "code": "73.13.06",
      "metrics": [
        {
          "label": "Desa / Kelurahan",
          "value": 16
        },
        {
          "label": "Jenis data tersedia",
          "value": 15
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 578
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 131
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 235
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 490
        },
        {
          "layerId": "opd",
          "label": "Kantor Pemerintah",
          "count": 25
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 2
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 8
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 288
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 3
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 12
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 2
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 33
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 107
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": [
        "34 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.07": {
      "name": "Belawa",
      "code": "73.13.07",
      "metrics": [
        {
          "label": "Desa / Kelurahan",
          "value": 9
        },
        {
          "label": "Jenis data tersedia",
          "value": 13
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 168
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 11
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 10
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 155
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 3
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 2
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 69
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 2
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 27
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 88
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 52
        }
      ],
      "notes": [
        "12 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.08": {
      "name": "Tanasitolo",
      "code": "73.13.08",
      "metrics": [
        {
          "label": "Desa / Kelurahan",
          "value": 19
        },
        {
          "label": "Jenis data tersedia",
          "value": 14
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 364
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 19
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 23
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 266
        },
        {
          "layerId": "opd",
          "label": "Kantor Pemerintah",
          "count": 1
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 6
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 2
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 82
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 2
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 18
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 67
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 14
        }
      ],
      "notes": [
        "17 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.09": {
      "name": "Maniangpajo",
      "code": "73.13.09",
      "metrics": [
        {
          "label": "Desa / Kelurahan",
          "value": 8
        },
        {
          "label": "Jenis data tersedia",
          "value": 14
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 112
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 17
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 20
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 103
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 5
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 2
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 67
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 11
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 10
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 33
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 25
        }
      ],
      "notes": [
        "15 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10": {
      "name": "Pitumpanua",
      "code": "73.13.10",
      "metrics": [
        {
          "label": "Desa / Kelurahan",
          "value": 27
        },
        {
          "label": "Jenis data tersedia",
          "value": 16
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 192
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 22
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 24
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 177
        },
        {
          "layerId": "opd",
          "label": "Kantor Pemerintah",
          "count": 1
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 5
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 4
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 183
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-energi",
          "label": "Sarana Energi",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 11
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 5
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 7
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 28
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 82
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 37
        }
      ],
      "notes": [
        "27 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.11": {
      "name": "Bola",
      "code": "73.13.11",
      "metrics": [
        {
          "label": "Desa / Kelurahan",
          "value": 11
        },
        {
          "label": "Jenis data tersedia",
          "value": 12
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 129
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 16
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 17
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 118
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 4
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 38
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 4
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 15
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 46
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 22
        }
      ],
      "notes": [
        "19 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta.",
        "1 data puskesmas belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.12": {
      "name": "Penrang",
      "code": "73.13.12",
      "metrics": [
        {
          "label": "Desa / Kelurahan",
          "value": 10
        },
        {
          "label": "Jenis data tersedia",
          "value": 13
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 75
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 14
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 15
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 69
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 2
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 35
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 12
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 33
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 11
        }
      ],
      "notes": [
        "13 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.13": {
      "name": "Gilireng",
      "code": "73.13.13",
      "metrics": [
        {
          "label": "Desa / Kelurahan",
          "value": 9
        },
        {
          "label": "Jenis data tersedia",
          "value": 14
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 93
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 14
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 14
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 83
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 19
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-energi",
          "label": "Sarana Energi",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 10
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 13
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 30
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 7
        }
      ],
      "notes": [
        "14 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.14": {
      "name": "Keera",
      "code": "73.13.14",
      "metrics": [
        {
          "label": "Desa / Kelurahan",
          "value": 10
        },
        {
          "label": "Jenis data tersedia",
          "value": 14
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 107
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 17
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 17
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 86
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 2
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 28
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-energi",
          "label": "Sarana Energi",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 7
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 21
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 41
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 23
        }
      ],
      "notes": [
        "16 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    }
  },
  "desa": {
    "73.13.03.2007": {
      "name": "Leweng",
      "code": "73.13.03.2007",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 14
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 9
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.14.2002": {
      "name": "Awota",
      "code": "73.13.14.2002",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 24
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 8
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 8
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 15
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 12
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 11
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 8
        }
      ],
      "notes": [
        "3 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.09.2005": {
      "name": "Kalola",
      "code": "73.13.09.2005",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 7
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 15
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": [
        "3 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.08.2007": {
      "name": "Inalipue",
      "code": "73.13.08.2007",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 34
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 28
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 11
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 7
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.01.2008": {
      "name": "Worongnge",
      "code": "73.13.01.2008",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 7
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 6
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.10.1002": {
      "name": "Siwa",
      "code": "73.13.10.1002",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 14
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 23
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 24
        },
        {
          "layerId": "opd",
          "label": "Kantor Pemerintah",
          "count": 1
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 68
        },
        {
          "layerId": "sarana-energi",
          "label": "Sarana Energi",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 4
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.08.1003": {
      "name": "Pincengpute",
      "code": "73.13.08.1003",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 19
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 13
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 8
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        }
      ],
      "notes": []
    },
    "73.13.10.2005": {
      "name": "Batu",
      "code": "73.13.10.2005",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 8
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 12
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 13
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 9
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.06.1011": {
      "name": "Teddaopu",
      "code": "73.13.06.1011",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 58
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 28
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 34
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 47
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 35
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 5
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 8
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.06.1006": {
      "name": "Mattiro Tappareng",
      "code": "73.13.06.1006",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 45
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 10
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 11
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 36
        },
        {
          "layerId": "opd",
          "label": "Kantor Pemerintah",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 27
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 7
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.06.1002": {
      "name": "Pattirosompe",
      "code": "73.13.06.1002",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 12
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 32
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 6
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 6
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 33
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 3
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 11
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 8
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.01.2015": {
      "name": "Bila",
      "code": "73.13.01.2015",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 6
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 10
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 15
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.03.2012": {
      "name": "Lamarua",
      "code": "73.13.03.2012",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 8
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 6
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.05.2011": {
      "name": "Bottotanre",
      "code": "73.13.05.2011",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 10
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 7
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.02.2015": {
      "name": "Abbanuangnge",
      "code": "73.13.02.2015",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 10
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 3
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.02.2009": {
      "name": "Wecudai",
      "code": "73.13.02.2009",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 4
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 4
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.05.2015": {
      "name": "Liu",
      "code": "73.13.05.2015",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 10
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 12
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 14
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.04.2006": {
      "name": "Barangmamase",
      "code": "73.13.04.2006",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 25
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 15
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 21
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "3 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.2019": {
      "name": "Ale Lebbae",
      "code": "73.13.10.2019",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 6
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 5
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 2
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        }
      ],
      "notes": []
    },
    "73.13.06.1010": {
      "name": "Lapongkoda",
      "code": "73.13.06.1010",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 56
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 22
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 44
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 48
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 2
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 35
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 9
        }
      ],
      "notes": []
    },
    "73.13.14.1001": {
      "name": "Ballaere",
      "code": "73.13.14.1001",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 12
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 14
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 12
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 6
        }
      ],
      "notes": []
    },
    "73.13.01.1001": {
      "name": "Walennae",
      "code": "73.13.01.1001",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 9
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 4
        }
      ],
      "notes": []
    },
    "73.13.10.2014": {
      "name": "Alesilurengnge",
      "code": "73.13.10.2014",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 16
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 11
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 41
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.08.2015": {
      "name": "Mario",
      "code": "73.13.08.2015",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 14
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        }
      ],
      "notes": []
    },
    "73.13.10.2008": {
      "name": "Lompoloang",
      "code": "73.13.10.2008",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 11
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 4
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 7
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.11.2009": {
      "name": "Lattimu",
      "code": "73.13.11.2009",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 12
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 8
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.14.2009": {
      "name": "Ciromanie",
      "code": "73.13.14.2009",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 11
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 15
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 12
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 9
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 2
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": []
    },
    "73.13.05.2005": {
      "name": "Tosora",
      "code": "73.13.05.2005",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 43
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 5
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 39
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 6
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 33
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.09.2007": {
      "name": "Abbanuangnge",
      "code": "73.13.09.2007",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 11
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 10
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 7
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 6
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 10
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 2
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 9
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.01.2011": {
      "name": "Mallusesalo",
      "code": "73.13.01.2011",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 3
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 2
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.01.2005": {
      "name": "Ugi",
      "code": "73.13.01.2005",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 14
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 14
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 5
        }
      ],
      "notes": []
    },
    "73.13.13.2003": {
      "name": "Poleonro",
      "code": "73.13.13.2003",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 14
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 5
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 10
        },
        {
          "layerId": "sarana-energi",
          "label": "Sarana Energi",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.04.2009": {
      "name": "Alewadeng",
      "code": "73.13.04.2009",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 13
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 7
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 9
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.05.2014": {
      "name": "Tengnga",
      "code": "73.13.05.2014",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 9
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 7
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.06.1008": {
      "name": "Salo Menraleng",
      "code": "73.13.06.1008",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 15
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 14
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.02.2010": {
      "name": "Lampulung",
      "code": "73.13.02.2010",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 10
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 3
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 12
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 7
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.04.1001": {
      "name": "Akkajeng",
      "code": "73.13.04.1001",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 12
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 23
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 22
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.04.1002": {
      "name": "Assorajang",
      "code": "73.13.04.1002",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 4
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 3
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": []
    },
    "73.13.03.2005": {
      "name": "Soro",
      "code": "73.13.03.2005",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 22
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 22
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.06.1015": {
      "name": "Sitampae",
      "code": "73.13.06.1015",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 9
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 5
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 16
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        }
      ],
      "notes": []
    },
    "73.13.11.2007": {
      "name": "Balielo",
      "code": "73.13.11.2007",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 7
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 5
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.01.2013": {
      "name": "Tadangpalie",
      "code": "73.13.01.2013",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 6
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 8
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 6
        }
      ],
      "notes": []
    },
    "73.13.11.2003": {
      "name": "Ujungtanah",
      "code": "73.13.11.2003",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 21
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 7
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 17
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 16
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 4
        }
      ],
      "notes": [
        "3 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.08.1001": {
      "name": "Tancung",
      "code": "73.13.08.1001",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 17
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 12
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 12
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 5
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.02.2005": {
      "name": "Kampiri",
      "code": "73.13.02.2005",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 27
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 27
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 9
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.2006": {
      "name": "Lauwa",
      "code": "73.13.10.2006",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 17
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 16
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 25
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": []
    },
    "73.13.11.2002": {
      "name": "Bola",
      "code": "73.13.11.2002",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 11
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 36
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 33
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 7
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 4
        }
      ],
      "notes": [
        "4 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.06.1009": {
      "name": "Campalagi",
      "code": "73.13.06.1009",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 25
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 5
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 6
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 23
        },
        {
          "layerId": "opd",
          "label": "Kantor Pemerintah",
          "count": 1
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 16
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 8
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        }
      ],
      "notes": []
    },
    "73.13.08.2006": {
      "name": "Lowa",
      "code": "73.13.08.2006",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 7
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 7
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.03.2006": {
      "name": "Ceppaga",
      "code": "73.13.03.2006",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 14
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 11
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.08.2009": {
      "name": "Wajoriaja",
      "code": "73.13.08.2009",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 21
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 17
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.03.1002": {
      "name": "Bocco",
      "code": "73.13.03.1002",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 19
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 6
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 7
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 11
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.02.1001": {
      "name": "Pammana",
      "code": "73.13.02.1001",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 21
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 21
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 10
        }
      ],
      "notes": []
    },
    "73.13.07.1002": {
      "name": "Malangke",
      "code": "73.13.07.1002",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 14
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 11
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 18
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 7
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.13.2005": {
      "name": "Lamata",
      "code": "73.13.13.2005",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 12
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 8
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 8
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.07.2008": {
      "name": "Sappa",
      "code": "73.13.07.2008",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 10
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 11
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 8
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": []
    },
    "73.13.10.2015": {
      "name": "Jauh Pandang",
      "code": "73.13.10.2015",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 1
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.13.2006": {
      "name": "Paselloreng",
      "code": "73.13.13.2006",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 35
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 33
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 7
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.05.2010": {
      "name": "Bottobenteng",
      "code": "73.13.05.2010",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 13
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 5
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 9
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.05.2017": {
      "name": "Bottopenno",
      "code": "73.13.05.2017",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 6
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 9
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.12.2007": {
      "name": "Walanga",
      "code": "73.13.12.2007",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 14
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 8
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": []
    },
    "73.13.08.2016": {
      "name": "Palippu",
      "code": "73.13.08.2016",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 12
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        }
      ],
      "notes": []
    },
    "73.13.01.2014": {
      "name": "Benteng Lompoe",
      "code": "73.13.01.2014",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 5
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.04.2007": {
      "name": "Salobulo",
      "code": "73.13.04.2007",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 11
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 29
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 5
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 6
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 26
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 14
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 5
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.08.2017": {
      "name": "Tonralipue",
      "code": "73.13.08.2017",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 21
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 9
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.12.2003": {
      "name": "Temmabarang",
      "code": "73.13.12.2003",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 12
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": []
    },
    "73.13.07.2006": {
      "name": "Wele",
      "code": "73.13.07.2006",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 22
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 11
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 2
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 10
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 11
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 21
        }
      ],
      "notes": []
    },
    "73.13.11.2004": {
      "name": "Lempong",
      "code": "73.13.11.2004",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 24
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 6
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 6
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 21
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.12.1001": {
      "name": "Doping",
      "code": "73.13.12.1001",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 16
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 18
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 16
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 9
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.1004": {
      "name": "Benteng",
      "code": "73.13.10.1004",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 12
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 11
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 4
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.06.1007": {
      "name": "Laelo",
      "code": "73.13.06.1007",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 5
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 23
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 23
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        }
      ],
      "notes": []
    },
    "73.13.06.1016": {
      "name": "Bulu Pabbulu",
      "code": "73.13.06.1016",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 73
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 20
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 37
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 73
        },
        {
          "layerId": "opd",
          "label": "Kantor Pemerintah",
          "count": 7
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 2
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 29
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 6
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 10
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.2018": {
      "name": "Bau-Bau",
      "code": "73.13.10.2018",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 9
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 7
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        }
      ],
      "notes": []
    },
    "73.13.07.2007": {
      "name": "Limporilau",
      "code": "73.13.07.2007",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 23
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 22
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 8
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 11
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.12.2002": {
      "name": "Padaelo",
      "code": "73.13.12.2002",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 7
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 6
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.08.2012": {
      "name": "Assorajang",
      "code": "73.13.08.2012",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 43
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 34
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 32
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.06.1005": {
      "name": "Watallipue",
      "code": "73.13.06.1005",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 36
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 6
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 7
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 36
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 12
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        }
      ],
      "notes": []
    },
    "73.13.13.2007": {
      "name": "Alausalo",
      "code": "73.13.13.2007",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 6
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.05.2018": {
      "name": "Watanrumpia",
      "code": "73.13.05.2018",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 9
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 7
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 4
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.08.2011": {
      "name": "Wae Tuwo",
      "code": "73.13.08.2011",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 17
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 12
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 9
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.02.2013": {
      "name": "Simpursia",
      "code": "73.13.02.2013",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 20
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 11
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 8
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.12.2006": {
      "name": "Benteng",
      "code": "73.13.12.2006",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 11
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 7
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 12
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.07.1003": {
      "name": "Belawa",
      "code": "73.13.07.1003",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 11
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 17
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 26
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 15
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 12
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.05.2008": {
      "name": "Laerung",
      "code": "73.13.05.2008",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 18
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 12
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 8
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.2024": {
      "name": "Maccolli Loloe",
      "code": "73.13.10.2024",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 3
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.01.2012": {
      "name": "Pasaka",
      "code": "73.13.01.2012",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 15
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 10
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 14
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.2021": {
      "name": "Botto Tengnga",
      "code": "73.13.10.2021",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 6
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 1
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.07.2009": {
      "name": "Lautang",
      "code": "73.13.07.2009",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 20
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 18
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 8
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 8
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.2007": {
      "name": "Tanrongi",
      "code": "73.13.10.2007",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 18
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 17
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.05.1002": {
      "name": "Limpomajang",
      "code": "73.13.05.1002",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 34
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 19
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 12
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.04.2005": {
      "name": "Sakkoli",
      "code": "73.13.04.2005",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 19
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 15
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 8
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 5
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.04.2008": {
      "name": "Towalida",
      "code": "73.13.04.2008",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 4
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 3
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.03.2004": {
      "name": "Manyili",
      "code": "73.13.03.2004",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 12
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 8
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.05.1004": {
      "name": "Uraiyang",
      "code": "73.13.05.1004",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 18
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 6
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 11
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 9
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.03.2009": {
      "name": "Botto",
      "code": "73.13.03.2009",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 16
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 18
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.08.2018": {
      "name": "Ujungbaru",
      "code": "73.13.08.2018",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 17
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 12
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.01.2009": {
      "name": "Salotengnga",
      "code": "73.13.01.2009",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 6
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 3
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 5
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.2017": {
      "name": "Buriko",
      "code": "73.13.10.2017",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 6
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 11
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 14
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 9
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.08.2014": {
      "name": "Pajalele",
      "code": "73.13.08.2014",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 14
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 6
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 11
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.13.2008": {
      "name": "Polewalie",
      "code": "73.13.13.2008",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 4
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 1
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        }
      ],
      "notes": [
        "3 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.12.2010": {
      "name": "Raddae",
      "code": "73.13.12.2010",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 5
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.14.2006": {
      "name": "Inrello",
      "code": "73.13.14.2006",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 18
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 17
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.02.2016": {
      "name": "Tonrong Tengnga",
      "code": "73.13.02.2016",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 2
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.10.2013": {
      "name": "Simpellu",
      "code": "73.13.10.2013",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 8
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 8
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 4
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.08.2010": {
      "name": "Wewangrewu",
      "code": "73.13.08.2010",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 25
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 19
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 8
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 4
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.03.2011": {
      "name": "Aluppang",
      "code": "73.13.03.2011",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 20
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 26
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.2026": {
      "name": "Padang Loang",
      "code": "73.13.10.2026",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 21
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.11.1001": {
      "name": "Solo",
      "code": "73.13.11.1001",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 3
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 2
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 13
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 8
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta.",
        "1 data puskesmas belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.02.2014": {
      "name": "Tobatang",
      "code": "73.13.02.2014",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 7
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 5
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        }
      ],
      "notes": []
    },
    "73.13.14.2005": {
      "name": "Paojepe",
      "code": "73.13.14.2005",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 9
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 11
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.09.1003": {
      "name": "Tangkoli",
      "code": "73.13.09.1003",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 16
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 7
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 8
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 7
        }
      ],
      "notes": []
    },
    "73.13.05.2016": {
      "name": "Tellulimpoe",
      "code": "73.13.05.2016",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 32
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 25
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.08.1004": {
      "name": "Barutancung",
      "code": "73.13.08.1004",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 29
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 23
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 9
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.2016": {
      "name": "Lacinde",
      "code": "73.13.10.2016",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 10
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 11
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 5
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.2023": {
      "name": "Mattiro Walie",
      "code": "73.13.10.2023",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 3
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 6
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 4
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.05.1003": {
      "name": "Macanang",
      "code": "73.13.05.1003",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 18
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 16
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.09.2006": {
      "name": "Sogi",
      "code": "73.13.09.2006",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 11
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 8
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 6
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 6
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 7
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 15
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.08.2005": {
      "name": "Nepo",
      "code": "73.13.08.2005",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 58
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 41
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        }
      ],
      "notes": []
    },
    "73.13.13.2001": {
      "name": "Mamminasae",
      "code": "73.13.13.2001",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 14
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 13
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 11
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 4
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 4
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.14.2004": {
      "name": "Lalliseng",
      "code": "73.13.14.2004",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 17
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 15
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 9
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": []
    },
    "73.13.13.1002": {
      "name": "Gilireng",
      "code": "73.13.13.1002",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 11
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 9
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 14
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.07.2005": {
      "name": "Leppangeng",
      "code": "73.13.07.2005",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 45
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 42
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 28
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 10
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 13
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.05.2007": {
      "name": "Rumpia",
      "code": "73.13.05.2007",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 22
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 23
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 11
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.09.1002": {
      "name": "Dualimpoe",
      "code": "73.13.09.1002",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 41
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 29
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        }
      ],
      "notes": []
    },
    "73.13.11.2008": {
      "name": "Manurung",
      "code": "73.13.11.2008",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 6
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": []
    },
    "73.13.05.1001": {
      "name": "Paria",
      "code": "73.13.05.1001",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 11
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 19
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 13
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 13
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 8
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.01.2004": {
      "name": "Liu",
      "code": "73.13.01.2004",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 16
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 14
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 5
        }
      ],
      "notes": []
    },
    "73.13.13.2004": {
      "name": "Arajang",
      "code": "73.13.13.2004",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 20
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 6
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 6
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 14
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 3
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.08.2013": {
      "name": "Ujungnge",
      "code": "73.13.08.2013",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 23
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 17
        },
        {
          "layerId": "opd",
          "label": "Kantor Pemerintah",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.05.2013": {
      "name": "Tajo",
      "code": "73.13.05.2013",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 13
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 11
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 9
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.1001": {
      "name": "Bulete",
      "code": "73.13.10.1001",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 11
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 13
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 14
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 27
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 12
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.06.1012": {
      "name": "Paddupa",
      "code": "73.13.06.1012",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 57
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 23
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 43
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 42
        },
        {
          "layerId": "opd",
          "label": "Kantor Pemerintah",
          "count": 1
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 59
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 7
        }
      ],
      "notes": []
    },
    "73.13.02.2003": {
      "name": "Lempa",
      "code": "73.13.02.2003",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 11
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 28
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 13
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 18
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 2
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 7
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.09.1001": {
      "name": "Anabanua",
      "code": "73.13.09.1001",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 16
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 6
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 18
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 36
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 8
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 4
        }
      ],
      "notes": [
        "5 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.05.2009": {
      "name": "Lamiku",
      "code": "73.13.05.2009",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 16
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 14
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.12.2004": {
      "name": "Penrang",
      "code": "73.13.12.2004",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 6
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 10
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": [
        "3 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.1003": {
      "name": "Tobarakka",
      "code": "73.13.10.1003",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 10
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 10
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 9
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 8
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 4
        }
      ],
      "notes": []
    },
    "73.13.10.2025": {
      "name": "Lompo Bulo",
      "code": "73.13.10.2025",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 6
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 1
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.11.2005": {
      "name": "Sanreseng Ade",
      "code": "73.13.11.2005",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 7
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 5
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.02.1002": {
      "name": "Cina",
      "code": "73.13.02.1002",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 24
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 6
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 20
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 13
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.02.2011": {
      "name": "Watampanua",
      "code": "73.13.02.2011",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 7
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 6
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.08.2019": {
      "name": "Mannagae",
      "code": "73.13.08.2019",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 19
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 6
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.10.2012": {
      "name": "Abbanderangnge",
      "code": "73.13.10.2012",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 12
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 10
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 7
        }
      ],
      "notes": []
    },
    "73.13.01.2007": {
      "name": "Wage",
      "code": "73.13.01.2007",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 10
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 5
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 6
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 6
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 17
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 5
        }
      ],
      "notes": []
    },
    "73.13.06.1001": {
      "name": "Siengkang",
      "code": "73.13.06.1001",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 13
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 55
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 25
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 44
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 31
        },
        {
          "layerId": "opd",
          "label": "Kantor Pemerintah",
          "count": 5
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 78
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        }
      ],
      "notes": []
    },
    "73.13.03.2013": {
      "name": "Pantai Timur",
      "code": "73.13.03.2013",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 19
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 17
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.10.2022": {
      "name": "Kaluku",
      "code": "73.13.10.2022",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 8
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 12
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 16
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.08.2008": {
      "name": "Pakkana",
      "code": "73.13.08.2008",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 6
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 62
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 7
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 46
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 29
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        }
      ],
      "notes": []
    },
    "73.13.08.1002": {
      "name": "Mappadaelo",
      "code": "73.13.08.1002",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 23
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 11
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.10.2011": {
      "name": "Marannu",
      "code": "73.13.10.2011",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 18
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.09.2004": {
      "name": "Mattirowalie",
      "code": "73.13.09.2004",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 11
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 38
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 5
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 8
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 32
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 20
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 7
        }
      ],
      "notes": []
    },
    "73.13.02.2007": {
      "name": "Lagosi",
      "code": "73.13.02.2007",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 7
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 5
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.07.2004": {
      "name": "Ongkoe",
      "code": "73.13.07.2004",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 12
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 49
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 41
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 21
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 6
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 12
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 24
        }
      ],
      "notes": []
    },
    "73.13.10.2020": {
      "name": "Bulu Siwa",
      "code": "73.13.10.2020",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 3
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.03.2010": {
      "name": "Lagoari",
      "code": "73.13.03.2010",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 7
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 6
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 6
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.03.2008": {
      "name": "Ajuraja",
      "code": "73.13.03.2008",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 14
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 12
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 10
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.12.2005": {
      "name": "Lawesso",
      "code": "73.13.12.2005",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 6
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 12
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 10
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 7
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.14.2010": {
      "name": "Labawang",
      "code": "73.13.14.2010",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 5
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 5
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.05.2006": {
      "name": "Cinnong Tabi",
      "code": "73.13.05.2006",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 12
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 5
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 4
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.11.2011": {
      "name": "Rajamawellang",
      "code": "73.13.11.2011",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 6
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 14
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 10
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.06.1013": {
      "name": "Wiring Palenae",
      "code": "73.13.06.1013",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 22
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 7
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 8
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 15
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 17
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.01.1003": {
      "name": "Sompe",
      "code": "73.13.01.1003",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 12
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 27
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 18
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 10
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 9
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.04.1003": {
      "name": "Minangae",
      "code": "73.13.04.1003",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 8
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 7
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.02.2012": {
      "name": "Tadangpalie",
      "code": "73.13.02.2012",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 9
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 5
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.13.2009": {
      "name": "Abbatireng",
      "code": "73.13.13.2009",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 10
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 6
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 6
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 11
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.01.2006": {
      "name": "Ujungpero",
      "code": "73.13.01.2006",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 2
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.06.1014": {
      "name": "Attakkae",
      "code": "73.13.06.1014",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 61
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 5
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 8
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 61
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 22
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 7
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.04.2004": {
      "name": "Akkotengeng",
      "code": "73.13.04.2004",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 6
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 6
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.12.2008": {
      "name": "Makmur",
      "code": "73.13.12.2008",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 3
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 2
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        }
      ],
      "notes": [
        "3 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.2009": {
      "name": "Tellesang",
      "code": "73.13.10.2009",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 21
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 16
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 15
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.11.2010": {
      "name": "Pasir Putih",
      "code": "73.13.11.2010",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 13
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 12
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 1
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 3
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.14.2007": {
      "name": "Pattirolokka",
      "code": "73.13.14.2007",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 13
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 5
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        }
      ],
      "notes": []
    },
    "73.13.07.1001": {
      "name": "Macero",
      "code": "73.13.07.1001",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 18
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 17
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 7
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 6
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 8
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.10.2010": {
      "name": "Tangkoro",
      "code": "73.13.10.2010",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 6
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 3
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.03.2003": {
      "name": "Parigi",
      "code": "73.13.03.2003",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 6
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 4
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.06.1004": {
      "name": "Maddukelleng",
      "code": "73.13.06.1004",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 54
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 20
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 25
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 43
        },
        {
          "layerId": "opd",
          "label": "Kantor Pemerintah",
          "count": 2
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 62
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 10
        }
      ],
      "notes": []
    },
    "73.13.11.2006": {
      "name": "Pattangngae",
      "code": "73.13.11.2006",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 15
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 14
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        }
      ],
      "notes": []
    },
    "73.13.14.2008": {
      "name": "Awo",
      "code": "73.13.14.2008",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 6
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 5
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 5
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 5
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": [
        "3 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.03.1001": {
      "name": "Peneki",
      "code": "73.13.03.1001",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 11
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 20
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 22
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 12
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 2
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 7
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 4
        }
      ],
      "notes": []
    },
    "73.13.02.2006": {
      "name": "Lapaukke",
      "code": "73.13.02.2006",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 13
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 12
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 5
        }
      ],
      "notes": []
    },
    "73.13.02.2008": {
      "name": "Pallawarukka",
      "code": "73.13.02.2008",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 6
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 8
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 8
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.05.2012": {
      "name": "Tua",
      "code": "73.13.05.2012",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 42
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 30
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.01.2010": {
      "name": "Pallimae",
      "code": "73.13.01.2010",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 9
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 8
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 2
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 2
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 6
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 5
        }
      ],
      "notes": [
        "1 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.09.2008": {
      "name": "Minagatellue",
      "code": "73.13.09.2008",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 11
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 3
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "potensi-pertanian",
          "label": "Potensi Pertanian",
          "count": 1
        },
        {
          "layerId": "potensi-peternakan",
          "label": "Potensi Peternakan",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 1
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 2
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.02.2004": {
      "name": "Patila",
      "code": "73.13.02.2004",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 8
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 42
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 3
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 3
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 19
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 10
        },
        {
          "layerId": "sarana-energi",
          "label": "Sarana Energi",
          "count": 4
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 7
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 9
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    },
    "73.13.01.1002": {
      "name": "Tolotenreng",
      "code": "73.13.01.1002",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 29
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 5
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 9
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 17
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 14
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 4
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 2
        },
        {
          "layerId": "sarana-telekomunikasi",
          "label": "Sarana Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 4
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.14.2003": {
      "name": "Keera",
      "code": "73.13.14.2003",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 10
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 9
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 9
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-energi",
          "label": "Sarana Energi",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 1
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 5
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 4
        }
      ],
      "notes": []
    },
    "73.13.12.2009": {
      "name": "Tadangpalie",
      "code": "73.13.12.2009",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 7
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 8
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 4
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 4
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 4
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 2
        }
      ],
      "notes": []
    },
    "73.13.10.2027": {
      "name": "Kompong",
      "code": "73.13.10.2027",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 6
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 1
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 1
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 1
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 1
        },
        {
          "layerId": "jaringan-sumber-daya-air",
          "label": "Sumber Daya Air",
          "count": 1
        }
      ],
      "notes": []
    },
    "73.13.06.1003": {
      "name": "Tempe",
      "code": "73.13.06.1003",
      "metrics": [
        {
          "label": "Jenis data tersedia",
          "value": 11
        }
      ],
      "layers": [
        {
          "layerId": "jaringan-energi",
          "label": "Jaringan Energi",
          "count": 89
        },
        {
          "layerId": "jalan",
          "label": "Jaringan Jalan",
          "count": 24
        },
        {
          "layerId": "jaringan-telekomunikasi",
          "label": "Jaringan Telekomunikasi",
          "count": 37
        },
        {
          "layerId": "jaringan-transportasi",
          "label": "Jaringan Transportasi",
          "count": 77
        },
        {
          "layerId": "opd",
          "label": "Kantor Pemerintah",
          "count": 8
        },
        {
          "layerId": "jaringan-prasarana-lainnya",
          "label": "Prasarana Lainnya",
          "count": 36
        },
        {
          "layerId": "puskesmas",
          "label": "Puskesmas",
          "count": 1
        },
        {
          "layerId": "sarana-prasarana-lainnya",
          "label": "Sarana Prasarana Lainnya",
          "count": 3
        },
        {
          "layerId": "sarana-sumber-daya-air",
          "label": "Sarana Sumber Daya Air",
          "count": 2
        },
        {
          "layerId": "sarana-transportasi",
          "label": "Sarana Transportasi",
          "count": 3
        },
        {
          "layerId": "satuan-pendidikan",
          "label": "Satuan Pendidikan",
          "count": 7
        }
      ],
      "notes": [
        "2 data satuan pendidikan belum memiliki lokasi yang dapat ditampilkan di peta."
      ]
    }
  }
};

export function getAdministrativeType(layerId) {
  if (layerId === "adm-kabupaten") return "kabupaten";
  if (layerId === "adm-kecamatan") return "kecamatan";
  if (layerId === "adm-desa") return "desa";
  return null;
}

function keyPart(value) { return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, ""); }

export function getAdministrativeStats(layer, feature) {
  const type = getAdministrativeType(layer?.id);
  if (!type) return null;
  const p = feature?.properties ?? {};
  const code = type === "kecamatan"
    ? String(p.kode_kecamatan_kemendagri ?? p.kode_kecamatan ?? p.KDCPUM ?? "").trim()
    : type === "desa"
      ? String(p.kode_desa ?? p.KDEPUM ?? "").trim()
      : String(p.kode_kabupaten ?? p.KDPKAB ?? "").trim();
  if (code && ADMIN_STATS[type]?.[code]) return ADMIN_STATS[type][code];
  const kecamatan = String(p.Kecamatan ?? p.WADMKC ?? p.nama_kecamatan ?? "").trim();
  const desa = String(p.Desa ?? p.WADMKD ?? p.nama_desa ?? "").trim();
  const name = type === "kabupaten" ? String(p.nama_kabupaten ?? p.WADMKK ?? p.NAMOBJ ?? "Wajo").trim() : type === "kecamatan" ? kecamatan : desa;
  const keys = new Set();
  if (type === "kabupaten") keys.add(keyPart(name) || "wajo");
  else keys.add(type === "desa" ? `${keyPart(kecamatan)}::${keyPart(desa)}` : keyPart(name));
  if (type === "kecamatan") {
    const master = getWajoKecamatanByKemendagri(code || name);
    if (master) { keys.add(keyPart(master.nameKemendagri)); keys.add(keyPart(master.nameBps)); }
  }
  if (type === "desa") {
    const master = getWajoVillageByKemendagriCode(code, p.nama_desa_kemendagri ?? p.nama_kemendagri ?? desa);
    if (master) {
      keys.add(`${keyPart(master.kecamatan.nameKemendagri)}::${keyPart(master.nameBps)}`);
      keys.add(`${keyPart(master.kecamatan.nameKemendagri)}::${keyPart(master.nameKemendagri)}`);
      keys.add(`${keyPart(master.kecamatan.nameBps)}::${keyPart(master.nameBps)}`);
    }
  }
  for (const key of keys) { if (ADMIN_STATS[type]?.[key]) return ADMIN_STATS[type][key]; }
  return null;
}
