'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('kategori_retribusi', [
            {
                id_jenis: 1,
                nama_kategori: 'Rumah Tinggal',
                tarif_kategori: 10000,
                parameter_resiko: 'RENDAH',
                parameter_volume: '1-5Kg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id_jenis: 2,
                nama_kategori: 'Makanan/Minuman',
                tarif_kategori: 15000,
                parameter_resiko: 'RENDAH',
                parameter_volume: '1-5Kg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id_jenis: 3,
                nama_kategori: 'Toko Kue',
                tarif_kategori: 20000,
                parameter_resiko: 'SEDANG',
                parameter_volume: '5-10Kg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id_jenis: 4,
                nama_kategori: 'Klinik',
                tarif_kategori: 50000,
                parameter_resiko: 'TINGGI',
                parameter_volume: '5-10Kg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id_jenis: 5,
                nama_kategori: 'Barak',
                tarif_kategori: 100000,
                parameter_resiko: 'KHUSUS',
                parameter_volume: 'lebih dari 10Kg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('kategori_retribusi', null, {});
    }
};