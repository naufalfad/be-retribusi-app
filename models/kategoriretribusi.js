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
      kategoriRetribusi.hasMany(models.wajibRetribusi, { foreignKey: 'id_kategori' });
    }
  }
  kategoriRetribusi.init({
    id_kategori: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama_kategori: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tarif_kategori: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'kategoriRetribusi',
    tableName: 'kategori_retribusi',
  });
  return kategoriRetribusi;
};