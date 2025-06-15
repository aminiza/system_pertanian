import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import JadwalTanam from "./JadwalTanamModel.js";

const { DataTypes } = Sequelize;

const Pengeluaran = db.define(
  "pengeluaran",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nama_pengeluaran: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    jumlah_pengeluaran: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tanggal_pengeluaran: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    deskripsi: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    jadwalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  },
  {
    freezeTableName: true,
  }
);


JadwalTanam.hasMany(Pengeluaran);
Pengeluaran.belongsTo(JadwalTanam, { foreignKey: "jadwalId" })


export default Pengeluaran;