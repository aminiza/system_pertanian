import { Op } from "sequelize";
import Lahan from "../models/LahanModel.js";
import PenggunaanPupuk from "../models/PenggunaanPupukModel.js";
import Pupuk from "../models/PupukModel.js";
import Users from "../models/UserModel.js";

export const getPenggunaanPupuk = async (req, res) => {
  try {
    const { status } = req.query;
    const { userId, role } = req.session;

    const whereClause = {};
    if (status) whereClause.status = status;

    let response;
    if (role === "Admin") {
       response = await PenggunaanPupuk.findAll({
        where: whereClause,
        attributes: ["uuid", "tanggal_penggunaan", "usia_tanaman", "jumlah", "status"],
        include: [
          {
            model: Lahan,
            attributes: ["name", "luas", "alamat"],
            include: [
              {
                model: Users,
                attributes: ["name"],
              },
            ],
          },
          {
            model: Pupuk,
            attributes: ["nama_pupuk", "kandungan"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } else {
      response = await PenggunaanPupuk.findAll({
        where: {
          [Op.or]: [{...whereClause, createdBy: userId},
            {
              ...whereClause,
              status: "approve",
              '$Lahan.userId$': userId
            }
          ]
        }, 
        attributes: ["uuid", "tanggal_penggunaan", "usia_tanaman", "jumlah", "status"],
        include: [
          {
            model: Lahan,
            attributes: ["name", "luas", "alamat"],
            include: [
              {
                model: Users,
                attributes: ["name"],
              },
            ],
          },
          {
            model: Pupuk,
            attributes: ["nama_pupuk", "kandungan"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPenggunaanPupukById = async (req, res) => {
  try {
    const penggunaan = await PenggunaanPupuk.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!penggunaan)
      return res
        .status(404)
        .json({ message: "Penggunaan pupuk tanam not found" });

    const response = await PenggunaanPupuk.findOne({
      where: {
        id: penggunaan.id,
      },
      attributes: ["uuid", "tanggal_penggunaan", "usia_tanaman", "jumlah"],
      include: [
        {
          model: Lahan,
          attributes: ["uuid", "name", "luas", "alamat"],
          include: [
            {
              model: Users,
              attributes: ["name"],
            },
          ],
        },
        {
          model: Pupuk,
          attributes: ["uuid", "nama_pupuk", "kandungan"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPenggunaanPupuk = async (req, res) => {
  const { tanggal_penggunaan, usia_tanaman, jumlah, lahanId, pupukId } =
    req.body;
  try {
    const targetLahan = await Lahan.findOne({
      where: { uuid: lahanId },
    });

    const targetPupuk = await Pupuk.findOne({
      where: { uuid: pupukId },
    });
    if (!targetLahan)
      return res.status(404).json({ message: "Lahan tidak ditemukan" });

    if (!targetPupuk)
      return res.status(404).json({ message: "Pupuk tidak ditemukan" });

    if (targetPupuk.kuantitas < jumlah) {
      return res.status(404).json({ message: "Stok pupuk tidak mencukupi" });
    }

    const response = await PenggunaanPupuk.create({
      tanggal_penggunaan: tanggal_penggunaan,
      usia_tanaman: usia_tanaman,
      jumlah: jumlah,
      lahanId: targetLahan.id,
      pupukId: targetPupuk.id,
      status: req.role === "Admin" ? "approve" : "pending",
      createdBy: req.session.userId,
    });

    await targetPupuk.update({
      kuantitas: targetPupuk.kuantitas - jumlah,
    });
    res.status(201).json({
      message: "Penggunaan pupuk created, dan stok pupuk berkurang",
      response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePenggunaanPupuk = async (req, res) => {
  try {
    const penggunaan = await PenggunaanPupuk.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!penggunaan)
      return res
        .status(404)
        .json({ message: "Penggunaan pupuk tanam not found" });

    const { tanggal_penggunaan, usia_tanaman, jumlah, lahanId, pupukId } =
      req.body;

    const targetLahan = await Lahan.findOne({
      where: { uuid: lahanId },
    });

    const targetPupuk = await Pupuk.findOne({
      where: { uuid: pupukId },
    });
    if (!targetLahan)
      return res.status(404).json({ message: "Lahan tidak ditemukan" });

    if (!targetPupuk)
      return res.status(404).json({ message: "Pupuk tidak ditemukan" });

    if (targetPupuk.kuantitas < jumlah) {
      return res.status(404).json({ message: "Stok pupuk tidak mencukupi" });
    }

    //jika jumlah pupuk yang ditambahkan lebih banyak dari jumlah yang sebelum update, maka stok dari pupuk dikurangi lagi dan jika stok pupuk tidak mencukupi maka muncul pesan stok todak cukup, tapi kalau stok sebelum update dengan sesudah update lebih sedikit maka sisa stok akan dikembalikan ke stok sebelum update

    await PenggunaanPupuk.update(
      {
        tanggal_penggunaan: tanggal_penggunaan,
        usia_tanaman: usia_tanaman,
        jumlah: jumlah,
        lahanId: targetLahan.id,
        pupukId: targetPupuk.id,
      },
      {
        where: {
          id: penggunaan.id,
        },
      }
    );

    if (penggunaan.jumlah > jumlah) {
      await targetPupuk.update({
        kuantitas: targetPupuk.kuantitas + penggunaan.jumlah - jumlah,
      });
    } else {
      await targetPupuk.update({
        kuantitas: targetPupuk.kuantitas - jumlah,
      });
    }

    res.status(200).json({ message: "Penggunaan pupuk updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePenggunaanPupuk = async (req, res) => {
  try {
    const penggunaan = await PenggunaanPupuk.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!penggunaan)
      return res
        .status(404)
        .json({ message: "Penggunaan pupuk tanam not found" });
    await PenggunaanPupuk.destroy({
      where: {
        id: penggunaan.id,
      },
    });
    res.status(200).json({ message: "Penggunaan pupuk deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const validasiPenggunaan = async (req, res) => {
  const penggunaan = await PenggunaanPupuk.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  if (!penggunaan) {
    return res.status(404).json({ message: "Penggunaan not found" });
  }

  try {
    const { status } = req.body;

    penggunaan.status = status;
    await penggunaan.save();

    res
      .status(200)
      .json({
        message: `Pengajuan berhasil di${
          status == "approve" ? "validasi" : "tolak"
        }`,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cekValidasiPenggunaan = async (req, res) => {
  try {
    const penggunaan = await PenggunaanPupuk.findOne({
      where: {
        createdBy: req.session.userId,
        status: ["pending", "approve", "rejected"]
      },
      order: [["createdAt", "DESC"]],
      limit: 1
    });

    if (!penggunaan) {
      return res.status(404).json({ message: "Belum ada pengajuan" });
    }

    return res.status(200).json({ status: penggunaan.status });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
