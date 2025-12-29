'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pembayaran', {
      // id: {
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true,
      //   type: Sequelize.INTEGER
      // },
      id_pembayaran: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      id_tagihan: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id_retribusi: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tanggal_bayar: {
        type: Sequelize.DATE,
      },
      jumlah_bayar: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      metode_bayar: {
        type: Sequelize.STRING
      },
      status_pembayaran: {
        type: Sequelize.ENUM('pending', 'lunas', 'gagal'),
        defaultValue: 'pending'
      },
      keterangan: {
        type: Sequelize.TEXT
      },
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
    await queryInterface.dropTable('pembayaran');
  }
};