'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kategori_retribusi', {
      id_kategori: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_jenis: {
        type: Sequelize.INTEGER,
        references: {
          model: 'jenis_retribusi',
          key: 'id_jenis'
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      },
      nama_kategori: {
        type: Sequelize.STRING
      },
      tarif_kategori: {
        type: Sequelize.DECIMAL
      },
      parameter_resiko: {
        type: Sequelize.ENUM('RENDAH', 'SEDANG', 'TINGGI', 'KHUSUS'),
        defaultValue: 'RENDAH'
      },
      parameter_volume: {
        type: Sequelize.ENUM('1-5Kg', '5-10Kg', 'lebih dari 10Kg'),
        defaultValue: '1-5Kg'
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
    await queryInterface.dropTable('kategori_retribusi');
  }
};