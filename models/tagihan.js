'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tagihan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tagihan.belongsTo(models.wajibRetribusi, { foreignKey: 'id_retribusi' });
    }
  }
  tagihan.init({
    id_tagihan: {
      type: DataTypes.STRING,
      primaryKey: true,
      //autoIncrement: true
    },
    id_retribusi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    skrd: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tanggal_terbit: {
      type: DataTypes.DATE,
    },
    tanggal_jatuh_tempo: {
      type: DataTypes.DATE,
    },
    periode_mulai: {
      type: DataTypes.DATE,
      allowNull: false
    },
    periode_selesai: {
      type: DataTypes.DATE,
      allowNull: false
    },
    masa_berlaku_mulai: {
      type: DataTypes.DATE,
      allowNull: false
    },
    masa_berlaku_selesai: {
      type: DataTypes.DATE,
      allowNull: false
    },
    jumlah_bulan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_tarif: {
      type: DataTypes.DECIMAL,
    },
    total_denda: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    total_tagihan: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('belum bayar', 'sudah bayar', 'kedaluwarsa'),
      defaultValue: 'belum bayar'
    },
    no_rekening: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'tagihan',
    tableName: 'tagihan',
  });
  return tagihan;
};