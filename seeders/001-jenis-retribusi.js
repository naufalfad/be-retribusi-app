'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('jenis_retribusi', [
            {
                nama_jenis: 'Rumah Tangga',
                tarif_jenis: 10000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_jenis: 'Badan Usaha Kecil',
                tarif_jenis: 15000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_jenis: 'Badan Usaha Menengah',
                tarif_jenis: 20000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_jenis: 'Badan Usaha Besar',
                tarif_jenis: 30000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nama_jenis: 'Institusi',
                tarif_jenis: 50000,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('jenis_retribusi', null, {});
    }
};
