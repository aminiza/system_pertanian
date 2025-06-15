import JadwalTanam from "../models/JadwalTanamModel.js";
import Lahan from "../models/LahanModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const getJadwalTanam = async (req, res) => {
  try {
    let response;
    if (req.role === "Admin") {
      response = await JadwalTanam.findAll({
        attributes: ["uuid", "jenis_tanaman", "tanggal_tanam", "tanggal_panen"],
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
          {
            model: Lahan,
            attributes: ["name", "luas", "alamat"],
          },
        ],
      });
    } else {
      response = await JadwalTanam.findAll({
        attributes: ["uuid", "jenis_tanaman", "tanggal_tanam", "tanggal_panen"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
          {
            model: Lahan,
            attributes: ["name", "luas", "alamat"],
          },
        ],
      });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJadwalTanamById = async (req, res) => {
  try {
    const jadwal = await JadwalTanam.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!jadwal)
      return res.status(404).json({ message: "Jadwal tanam not found" });

    let response;
    if (req.role === "Admin") {
      response = await JadwalTanam.findOne({
        attributes: ["uuid", "jenis_tanaman", "tanggal_tanam", "tanggal_panen"],
        where: {
          id: jadwal.id,
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
          {
            model: Lahan,
            attributes: ["name", "luas", "alamat"],
          },
        ],
      });
    } else {
      response = await JadwalTanam.findOne({
        attributes: ["uuid", "jenis_tanaman", "tanggal_tanam", "tanggal_panen"],
        where: {
          [Op.and]: [{ id: jadwal.id }, { userId: req.userId }],
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
          {
            model: Lahan,
            attributes: ["name", "luas", "alamat"],
          },
        ],
      });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJadwalTanam = async (req, res) => {
  const { jenis_tanaman, tanggal_tanam, tanggal_panen, lahanId } = req.body;
  try {
    const targetLahan = await Lahan.findOne({
      where: { uuid: lahanId },
    });

    if (!targetLahan)
      return res.status(404).json({ message: "Lahan tidak ditemukan" });
    await JadwalTanam.create({
      jenis_tanaman: jenis_tanaman,
      tanggal_tanam: tanggal_tanam,
      tanggal_panen: tanggal_panen,
      lahanId: targetLahan.id,
      userId: req.userId,
    });
    res.status(201).json({ message: "Jadwal tanam created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJadwalTanam = async (req, res) => {
  try {
    const jadwal = await JadwalTanam.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!jadwal)
      return res.status(404).json({ message: "Jadwal tanam not found" });
    const { jenis_tanaman, tanggal_tanam, tanggal_panen, lahanId } = req.body;

    const lahan = await Lahan.findOne({
      where: {
        uuid: lahanId,
      },
    });
    if (!lahan) return res.status(404).json({ message: "Lahan not found" });

    const updateData = {
      jenis_tanaman,
      tanggal_tanam,
      tanggal_panen,
      lahanId: lahan.id,
    };
    if (req.role === "Admin") {
      await JadwalTanam.update(updateData, {
        where: {
          id: jadwal.id,
        },
      });
    } else {
      if (req.userId !== jadwal.userId)
        return res.status(403).json({ message: "Access denied" });
      await JadwalTanam.update(updateData, {
        where: {
          [Op.and]: [{ id: jadwal.id }, { userId: req.userId }],
        },
      });
    }

    res.status(200).json({ message: "Jadwal tanam updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJadwalTanam = async (req, res) => {
  try {
    const jadwal = await JadwalTanam.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!jadwal)
      return res.status(404).json({ message: "Jadwal tanam not found" });

    if (req.role === "Admin") {
      await JadwalTanam.destroy({
        where: {
          id: jadwal.id,
        },
      });
    } else {
      if (req.userId !== jadwal.userId)
        return res.status(403).json({ message: "Access denied" });
      await JadwalTanam.destroy({
        where: {
          [Op.and]: [{ id: jadwal.id }, { userId: req.userId }],
        },
      });
    }

    res.status(200).json({ message: "Jadwal tanam deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDropdownLahan = async (req, res) => {
  try {
    let lahanList;
    if(req.role == "Admin") {
      lahanList = await Lahan.findAll({
        attributes: ["uuid", "name", "luas", "alamat"],
      })
    } else {
      lahanList = await Lahan.findAll({
        attributes: ["uuid", "name", "luas", "alamat"],
        where: {
          userId: req.userId,
        },
      })
    }

    const dropdown = lahanList.map((item) => ({
      value: item.uuid,
      label: item.name,
      alamat: item.alamat
    }))
    res.status(200).json({
      dropdown
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
