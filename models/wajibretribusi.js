'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class wajibRetribusi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //wajibRetribusi.hasMany(models.tagihanRetribusi, {foreignKey: id_retribusi});
      //wajibRetribusi.belongsTo(models.Users, { foreignKey: 'id_user' });
      wajibRetribusi.belongsTo(models.jenisRetribusi, { foreignKey: 'id_jenis' });
      //wajibRetribusi.belongsTo(models.Users, {foreignKey: nik});
    }
  }
  wajibRetribusi.init({
    id_retribusi: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true
    },
    id_admin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_jenis: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nama_wr: {
      type: DataTypes.STRING,
      allowNull: false
    },
    alamat_wr: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nib_wr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nik_wr: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    no_hp_wr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lokasi_wr: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    password_wr: {
      type: DataTypes.STRING
    },
    otp_wr: {
      type: DataTypes.STRING,
      defaultValue: 'false',
      allowNull: true,
    },
    status_wr: {
      type: DataTypes.ENUM('aktif', 'non_aktif', 'menunggu_verifikasi', 'verifikasi_ditolak'),
      defaultValue: 'menunggu_verifikasi',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'wajibRetribusi',
    tableName: 'wajib_retribusi',
  });

  wajibRetribusi.beforeCreate(async (wr) => {
    wr.password_wr = await bcrypt.hash(wr.password_wr, 10);
  });

  // wajibRetribusi.beforeCreate(async (WajibRetribusi, options) => {
  //   const { Users } = sequelize.models;

  //   const users = await Users.findByPk(WajibRetribusi.id_user);
  //   if (users && users.nik) {
  //     WajibRetribusi.nik_wr = users.nik;
  //   } else {
  //     throw new Error('NIK user tidak ditemukan');
  //   }
  //   if (users && users.nama_wr) {
  //     WajibRetribusi.nama_wr = users.nama;
  //   } else {
  //     throw new Error('Nama user tidak ditemukan!');
  //   }
  // });

  return wajibRetribusi;
};