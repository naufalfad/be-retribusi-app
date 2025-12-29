'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tagihan', {
      id_tagihan: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_retribusi: {
        type: Sequelize.INTEGER,
        references: {
          model: 'wajib_retribusi',
          key: 'id_retribusi'
        },
      },
      skrd: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tanggal_terbit: {
        type: Sequelize.DATE
      },
      tanggal_jatuh_tempo: {
        type: Sequelize.DATE
      },
      periode_mulai: {
        type: Sequelize.DATE,
        allowNull: false
      },
      periode_selesai: {
        type: Sequelize.DATE,
        allowNull: false
      },
      masa_berlaku_mulai: {
        type: Sequelize.DATE,
        allowNull: false
      },
      masa_berlaku_selesai: {
        type: Sequelize.DATE,
        allowNull: false
      },
      jumlah_bulan: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total_tarif: {
        type: Sequelize.DECIMAL
      },
      total_denda: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      total_tagihan: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('belum bayar', 'sudah bayar', 'kedaluwarsa'),
        defaultValue: 'belum bayar'
      },
      no_rekening: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('tagihan');
  }
};