'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wajib_retribusi', {
      id_retribusi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_admin: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id_user'
        },
        allowNull: true
      },
      id_jenis: {
        type: Sequelize.INTEGER,
        references: {
          model: 'jenis_retribusi',
          key: 'id_jenis'
        }
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
      nama_wr: {
        type: Sequelize.STRING,
        allowNull: false
      },
      provinsi_wr: {
        type: Sequelize.STRING,
        defaultValue: 'Jawa Barat'
      },
      kabupaten_wr: {
        type: Sequelize.STRING,
        allowNull: false
      },
      kecamatan_wr: {
        type: Sequelize.STRING,
        allowNull: false
      },
      kelurahan_wr: {
        type: Sequelize.STRING,
        allowNull: false
      },
      alamat_wr: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nib_wr: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nik_wr: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      no_hp_wr: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lokasi_wr: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      password_wr: {
        type: Sequelize.STRING,
        allowNull: false
      },
      total_tarif_wr: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      otp_wr: {
        type: Sequelize.STRING,
        defaultValue: 'false',
        allowNull: true
      },
      status_wr: {
        type: Sequelize.ENUM('aktif', 'non_aktif', 'menunggu_verifikasi', 'verifikasi_ditolak'),
        defaultValue: 'menunggu_verifikasi'
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
    await queryInterface.dropTable('wajib_retribusi');
  }
};