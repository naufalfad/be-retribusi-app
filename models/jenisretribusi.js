'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jenisRetribusi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      jenisRetribusi.hasMany(models.wajibRetribusi, { foreignKey: 'id_jenis' });
      jenisRetribusi.belongsTo(models.kategoriRetribusi, { foreignKey: 'id_kategori' });
    }
  }
  jenisRetribusi.init({
    id_jenis: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_kategori: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jenis_wr: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'jenisRetribusi',
    tableName: 'jenis_retribusi',
  });
  return jenisRetribusi;
};