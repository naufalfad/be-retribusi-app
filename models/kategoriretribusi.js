'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kategoriRetribusi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      kategoriRetribusi.belongsTo(models.jenisRetribusi, { foreignKey: 'id_jenis' });
    }
  }
  kategoriRetribusi.init({
    id_kategori: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_jenis: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nama_kategori: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tarif_kategori: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    parameter_resiko: {
      type: DataTypes.ENUM('RENDAH', 'SEDANG', 'TINGGI', 'KHUSUS'),
      defaultValue: 'RENDAH'
    },
    parameter_volume: {
      type: DataTypes.ENUM('1-5Kg', '5-10Kg', 'lebih dari 10Kg'),
      defaultValue: '1-5Kg'
    }
  }, {
    sequelize,
    modelName: 'kategoriRetribusi',
    tableName: 'kategori_retribusi',
  });
  return kategoriRetribusi;
};