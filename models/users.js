'use strict';
const { Model } = require('sequelize');
const wajibretribusi = require('./wajibretribusi');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.wajibRetribusi, { foreignKey: 'id_admin', sourceKey: 'id_user', as: 'admin_retribusi' });
    }
  }
  Users.init({
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // nama: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    // nik: {
    //   type: DataTypes.STRING,
    //   unique: true,
    //   allowNull: false
    // },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // no_hp: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    // role: {
    //   type: DataTypes.ENUM('admin', 'wajib_retribusi'),
    //   allowNull: false,
    //   defaultValue: 'wajib_retribusi'
    // },
    // otp: {
    //   type: DataTypes.STRING,
    //   allowNull: true
    // },
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
  });

  Users.beforeCreate(async (users) => {
    users.password = await bcrypt.hash(users.password, 10);
  });

  return Users;
};