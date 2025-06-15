import JadwalTanam from "../models/JadwalTanamModel.js";
import Lahan from "../models/LahanModel.js";
import Pengeluaran from "../models/PengeluaranModel.js";

export const getPengeluaran = async (req, res) => {
  try {
    const response = await Pengeluaran.findAll({
      attributes: [
        "uuid",
        "nama_pengeluaran",
        "jumlah_pengeluaran",
        "tanggal_pengeluaran",
        "deskripsi",
      ],
      include: [
        {
          model: JadwalTanam,
          attributes: ["jenis_tanaman"],
          include: [
              {
              model: Lahan,
              attributes: ["name", "luas", "alamat"],
            },
          ]
        },
      ],
    });

    const formatted = response.map((item) => ({
        uuid: item.uuid,
        jenis_tanaman: item.jadwalTanam?.jenis_tanaman || "-",
        nama_lahan:  item.jadwalTanam?.lahan?.name || "-",
        alamat: item.jadwalTanam?.lahan?.alamat || "-",
        nama_pengeluaran: item.nama_pengeluaran,
        tanggal_pengeluaran: item.tanggal_pengeluaran,
        jumlah_pengeluaran: item.jumlah_pengeluaran,
        deskripsi: item.deskripsi
    }))
    res.status(200).json(formatted);
  } catch {
    res.status(500).json({ message: error.message });
  }
};

export const getPengeluaranById = async (req, res) => {
  const pengeluaran = await Pengeluaran.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!pengeluaran)
    return res.status(404).json({ message: "Pengeluaran not found" });
  try {
    const response = await Pengeluaran.findOne({
      where: {
        id: pengeluaran.id,
      },
      attributes: [
        "uuid",
        "nama_pengeluaran",
        "jumlah_pengeluaran",
        "tanggal_pengeluaran",
        "deskripsi",
      ],
      include: [
        {
          model: JadwalTanam,
          attributes: ["uuid", "jenis_tanaman"],
          include: [
              {
                model: Lahan,
                attributes: ["name", "luas", "alamat"],
              },
          ]
        },
      ],
    });
    res.status(200).json(response);
  } catch {
    res.status(500).json({ message: error.message });
  }
};

export const createPengeluaran = async (req, res) => {
  try {
    const {
      nama_pengeluaran,
      jumlah_pengeluaran,
      tanggal_pengeluaran,
      deskripsi,
      jadwalId,
    } = req.body;

    const userId = req.userId;
    const targetJadwal = await JadwalTanam.findOne({
      where: {
        uuid: jadwalId,
      },
      include: [
        {
          model: Lahan,
          where: {
            userId: userId,
          },
        },
      ],
    });
    if (!targetJadwal)
      return res.status(404).json({ message: "Jadwal tanam tidak ditemukan" });

    await Pengeluaran.create({
      nama_pengeluaran,
      jumlah_pengeluaran,
      tanggal_pengeluaran,
      deskripsi,
      jadwalId: targetJadwal.id,
    });
    res.status(201).json({ message: "Pengeluaran created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePengeluaran = async (req, res) => {
  const pengeluaran = await Pengeluaran.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!pengeluaran) return res.status(404).json({ message: "Pengeluaran not found" });
   const {
    nama_pengeluaran,
    jumlah_pengeluaran,
    tanggal_pengeluaran,
    deskripsi,
    jadwalId,
  } = req.body;

  const userId = req.userId;
  const targetJadwal = await JadwalTanam.findOne({
    where: {
      uuid: jadwalId,
    },
    include: [
      {
        model: Lahan,
        where: {
          userId: userId,
        },
      },
    ]
  });
  if (!targetJadwal)
    return res.status(404).json({ message: "Jadwal tanam tidak ditemukan" });

  try {
    await Pengeluaran.update(
      {
        nama_pengeluaran,
        jumlah_pengeluaran,
        tanggal_pengeluaran,
        deskripsi,
        jadwalId: targetJadwal.id,
      },
      {
        where: {
          id: pengeluaran.id,
        },
      }
    );
    res.status(200).json({ message: "Pengeluaran updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePengeluaran = async (req, res) => {
  const pengeluaran = await Pengeluaran.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!pengeluaran)
    return res.status(404).json({ message: "Pengeluaran not found" });
  try {
    await Pengeluaran.destroy({
      where: {
        id: pengeluaran.id,
      },
    });
    res.status(200).json({ message: "Pengeluaran deleted" });
  } catch {
    res.status(500).json({ message: error.message });
  }
};

//dropdown form pengeluaran
export const getJadwalDropdown = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) return res.status(404).json({ message: "User not found" });
        const jadwalList = await JadwalTanam.findAll({
            include: {
                model: Lahan,
                where: {
                    userId: userId
                },
                attributes:["name", "luas", "alamat"]
            },
            attributes: ["uuid", "jenis_tanaman"]
        });

        const dropdown = jadwalList.map((item) => ({
            value: item.uuid,
            label: `${item.jenis_tanaman} - ${item.lahan.name}`,
            lokasi: item.lahan.alamat
        }))
        res.status(200).json({
           dropdown
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
