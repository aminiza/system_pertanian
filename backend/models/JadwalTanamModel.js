import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Lahan from "./LahanModel.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const JadwalTanam = db.define(
  "jadwalTanam",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    jenis_tanaman: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tanggal_tanam: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tanggal_panen: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
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
    }
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(JadwalTanam);
JadwalTanam.belongsTo(Users, { foreignKey: "userId" })
Lahan.hasMany(JadwalTanam);
JadwalTanam.belongsTo(Lahan, { foreignKey: "lahanId" })


export default JadwalTanam;
