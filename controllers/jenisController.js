const { jenisRetribusi, kategoriRetribusi } = require('../models');

exports.getAllJenis = async (req, res) => {
    try {
        // const { id_kategori } = req.query;
        // const where = id_kategori ? { id_kategori } : {};
        const data = await jenisRetribusi.findAll({
            // where,
            // include: [
            //     {
            //         model: kategoriRetribusi,
            //         attributes: ['id_kategori', 'kategori_wr', 'tarif_kategori'],
            //     },
            // ],
            attributes: ['id_jenis', 'nama_jenis', 'tarif_jenis'],
            order: [['id_jenis', 'ASC']],
        });

        res.status(200).json({
            message: 'Data jenis berhasil di ambil',
            data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};