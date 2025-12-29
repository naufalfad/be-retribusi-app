'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pembayaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      pembayaran.belongsTo(models.skrd, { foreignKey: 'id_skrd' });
      pembayaran.belongsTo(models.wajibRetribusi, { foreignKey: 'id_retribusi' });
    }
  }
  pembayaran.init({
    id_pembayaran: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    id_skrd: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_retribusi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tanggal_bayar: {
      type: DataTypes.DATE,
    },
    jumlah_bayar: {
      type: DataTypes.DECIMAL,
    },
    metode_bayar: {
      type: DataTypes.STRING,
    },
    status_pembayaran: {
      type: DataTypes.ENUM('pending', 'lunas', 'gagal'),
      defaultValue: 'pending'
    },
    keterangan: {
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'pembayaran',
    tableName: 'pembayaran'
  });
  return pembayaran;
};