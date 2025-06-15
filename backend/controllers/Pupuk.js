import Pupuk from "../models/PupukModel.js";

export const getPupuk = async (req, res) => {
  try {
    const response = await Pupuk.findAll({
      attributes: [
        "uuid",
        "nama_pupuk",
        "kandungan",
        "kuantitas",
        "harga",
        "deskripsi",
      ],
    });
    res.status(200).json(response);
  } catch {
    res.status(500).json({ message: error.message });
  }
};

export const getPupukById = async (req, res) => {
  const pupuk = await Pupuk.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  try {
    const response = await Pupuk.findOne({
      where: {
        id: pupuk.id,
      },
      attributes: [
        "uuid",
        "nama_pupuk",
        "kandungan",
        "kuantitas",
        "harga",
        "deskripsi",
      ],
    });
    res.status(200).json(response);
  } catch {
    res.status(500).json({ message: error.message });
  }
};

export const createPupuk = async (req, res) => {
  try {
    const { nama_pupuk, kandungan, kuantitas, harga, deskripsi } = req.body;

    await Pupuk.create({
      nama_pupuk,
      kandungan,
      kuantitas,
      harga,
      deskripsi,
    });
    res.status(201).json({ message: "Pupuk created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePupuk = async (req, res) => {
  const pupuk = await Pupuk.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if(!pupuk) return res.status(404).json({ message: "Pupuk not found" });
  const { nama_pupuk, kandungan, kuantitas, harga, deskripsi } = req.body;

  try {
    await Pupuk.update(
      {
        nama_pupuk,
        kandungan,
        kuantitas,
        harga,
        deskripsi,
      },
      {
        where: {
          id: pupuk.id,
        },
      }
    );
    res.status(200).json({ message: "Pupuk updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePupuk = async (req, res) => {
  const pupuk = await Pupuk.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  try {
    await Pupuk.destroy({
      where: {
        id: pupuk.id,
      },
    });
    res.status(200).json({ message: "Pupuk deleted" });
  } catch {
    res.status(500).json({ message: error.message });
  }
};
