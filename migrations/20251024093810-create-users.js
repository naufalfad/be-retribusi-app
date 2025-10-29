'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id_user: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // nama: {
      //   type: Sequelize.STRING,
      //   allowNull: false
      // },
      // nik: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      //   unique: true
      // },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // no_hp: {
      //   type: Sequelize.STRING,
      //   allowNull: false
      // },
      // role: {
      //   type: Sequelize.ENUM('wajib_retribusi', 'admin'),
      //   defaultValue: 'wajib_retribusi'
      // },
      // otp: {
      //   type: Sequelize.STRING,
      //   allowNull: true
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};