'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('jenis_retribusi', [
            {
                id_kategori: 1,
                jenis_wr: 'Rumah Tangga Mandiri',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id_kategori: 1,
                jenis_wr: 'Rumah Tangga RT (kolektif)',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id_kategori: 2,
                jenis_wr: 'Warung atau Kios',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id_kategori: 3,
                jenis_wr: 'Restoran atau Toko Sedang',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id_kategori: 4,
                jenis_wr: 'Hotel atau Supermarket',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('jenis_retribusi', null, {});
    }
};
