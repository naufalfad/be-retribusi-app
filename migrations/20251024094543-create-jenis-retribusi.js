'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jenis_retribusi', {
      id_jenis: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_kategori: {
        type: Sequelize.INTEGER,
        references: {
          model: 'kategori_retribusi',
          key: 'id_kategori'
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      jenis_wr: {
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
    await queryInterface.dropTable('jenis_retribusi');
  }
};