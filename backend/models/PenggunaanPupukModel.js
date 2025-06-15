import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Lahan from "./LahanModel.js";
import Pupuk from "./PupukModel.js";

const { DataTypes } = Sequelize;

const PenggunaanPupuk = db.define(
  "penggunaan_pupuk",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tanggal_penggunaan: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    usia_tanaman: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    jumlah: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lahanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    pupukId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    createdBy: {
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

Lahan.hasMany(PenggunaanPupuk);
PenggunaanPupuk.belongsTo(Lahan, { foreignKey: "lahanId" });
Pupuk.hasMany(PenggunaanPupuk);
PenggunaanPupuk.belongsTo(Pupuk, { foreignKey: "pupukId" });


export default PenggunaanPupuk;