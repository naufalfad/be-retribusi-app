'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('kategori_retribusi', [
            {
                kategori: 'Rumahan',
                tarif: 10000,
                deskripsi: 'Kategori retribusi untuk rumah tangga',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                kategori: 'Komersil Kecil',
                tarif: 25000,
                deskripsi: 'Kategori retribusi untuk usaha kecil seperti warung, kios, dan toko kecil',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                kategori: 'Komersil Sedang',
                tarif: 50000,
                deskripsi: 'Kategori retribusi untuk usaha menengah seperti restoran atau toko sedang',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                kategori: 'Komersil Besar',
                tarif: 100000,
                deskripsi: 'Kategori retribusi untuk usaha besar seperti hotel, supermarket, atau pabrik',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('kategori_retribusi', null, {});
    }
};