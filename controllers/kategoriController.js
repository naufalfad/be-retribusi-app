const { kategoriRetribusi, jenisRetribusi } = require('../models');

exports.getAllKategori = async (req, res) => {
    try {
        const { id_jenis } = req.query;
        const where = id_jenis ? { id_jenis } : {};
        const data = await kategoriRetribusi.findAll({
            where,
            include: [
                {
                    model: jenisRetribusi,
                    attributes: ['id_jenis', 'jenis_wr', 'tarif_jenis']
                },
            ],
            attributes: ['id_kategori', 'kategori_wr', 'tarif_kategori', 'parameter_resiko', 'parameter_volume'],
            order: [['id_kategori', 'ASC']]
        });

        res.status(200).json({
            message: 'Data kategori berhasil di ambil',
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.getKategoriByJenis = async (req, res) => {
    try {
        const { id_jenis } = req.query;

        if (!id_jenis) {
            return res.status(400).json({
                message: 'id jenis tidak ada'
            });
        }

        const jenis = await jenisRetribusi.findByPk(id_jenis, {
            include: [
                {
                    model: kategoriRetribusi,
                    attributes: ['id_kategori', 'nama_kategori', 'tarif_kategori', 'parameter_resiko', 'parameter_volume'],
                },
            ],
        });

        if (!jenis) {
            return res.status(400).json({
                message: 'Jenis tidak ditemukan'
            });
        }

        res.status(200).json({
            message: 'Kategori berhasil di ambil',
            data: jenis
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};