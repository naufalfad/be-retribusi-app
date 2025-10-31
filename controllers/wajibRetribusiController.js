require('dotenv').config();
const { wajibRetribusi, jenisRetribusi, kategoriRetribusi } = require('../models');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function hitungTotalTarif(kategori, jenis) {
    const baseTarif = parseFloat(kategori.tarif_kategori || 0);
    const jenisTarif = parseFloat(jenis.tarif_jenis || 0);

    const faktorResiko = {
        'RENDAH': 1,
        'SEDANG': 1.5,
        'TINGGI': 2,
        'KHUSUS': 3
    }[kategori.parameter_resiko || 1];

    const faktorVolume = {
        '1-5Kg': 1,
        '5-10Kg': 1.3,
        'lebih dari 10Kg': 1.7
    }[kategori.parameter_volume || 1];

    const total = (baseTarif * faktorResiko * faktorVolume) + jenisTarif;
    return total;
}

exports.tambahWajibRetribusi = async (req, res) => {
    try {
        const id_admin = req.user.id_user;
        const {
            id_jenis, id_kategori, nama_wr, provinsi_wr, kabupaten_wr, kecamatan_wr, kelurahan_wr,
            alamat_wr, nib_wr, nik_wr, no_hp_wr, lokasi_wr, password_wr
        } = req.body;

        const kategori = await kategoriRetribusi.findByPk(id_kategori);
        const jenis = await jenisRetribusi.findByPk(id_jenis);

        if (!kategori || !jenis) {
            return res.status(400).json({ message: 'Kategori atau Jenis tidak valid' });
        }

        const total_tarif = hitungTotalTarif(kategori, jenis);

        const wr = await wajibRetribusi.create({
            id_admin,
            id_jenis,
            id_kategori,
            nama_wr,
            provinsi_wr,
            kabupaten_wr,
            kecamatan_wr,
            kelurahan_wr,
            alamat_wr,
            nib_wr,
            nik_wr,
            no_hp_wr,
            lokasi_wr,
            password_wr,
            otp_wr: 'true',
            total_tarif_wr: total_tarif
        });

        res.status(201).json({
            message: 'Wajib retribusi berhasil ditambahkan',
            data: wr,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.registerWr = async (req, res) => {
    try {
        const {
            id_jenis, id_kategori, nama_wr, provinsi_wr, kabupaten_wr, kecamatan_wr, kelurahan_wr,
            alamat_wr, nib_wr, nik_wr, no_hp_wr, lokasi_wr, password_wr
        } = req.body;

        const kategori = await kategoriRetribusi.findByPk(id_kategori);
        const jenis = await jenisRetribusi.findByPk(id_jenis);

        if (!kategori || !jenis) {
            return res.status(400).json({ message: 'Kategori atau Jenis tidak valid' });
        }

        const total_tarif = hitungTotalTarif(kategori, jenis);

        const wr = await wajibRetribusi.create(
            {
                id_jenis,
                id_kategori,
                nama_wr,
                provinsi_wr,
                kabupaten_wr,
                kecamatan_wr,
                kelurahan_wr,
                alamat_wr,
                nib_wr,
                nik_wr,
                no_hp_wr,
                lokasi_wr,
                password_wr,
                total_tarif_wr: total_tarif
            },
        );

        const phone = no_hp_wr.startsWith('+')
            ? no_hp_wr
            : `+62${no_hp_wr.replace(/^0/, '')}`;

        const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
            .verifications
            .create({ to: phone, channel: 'sms' });

        res.status(201).json({
            message: 'Register Wajib Retribusi Berhasil. OTP telah dikirim via sms',
            data: wr,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.getTarif = async (req, res) => {
    try {
        const { id_kategori, id_jenis } = req.query;

        if (!id_kategori || !id_jenis) {
            return res.status(400).json({
                message: 'Kategori dan Jenis wajib diisi'
            });
        }

        const kategori = await kategoriRetribusi.findByPk(id_kategori);
        const jenis = await jenisRetribusi.findByPk(id_jenis);

        if (!kategori || !jenis) {
            return res.status(400).json({
                message: 'Kategori atau Jenis tidak ditemukan'
            });
        }

        const total_tarif = hitungTotalTarif(kategori, jenis);

        res.status(200).json({
            message: 'Tarif berhasil di hitung',
            data: {
                kategori: kategori.kategori_wr,
                jenis: jenis.jenis_wr,
                total_tarif
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });

    }
};

exports.getAllWr = async (req, res) => {
    try {
        const data = await wajibRetribusi.findAll({
            attributes: ['id_retribusi', 'nama_wr', 'alamat_wr', 'nib_wr', 'nik_wr', 'total_tarif_wr', 'status_wr'],
            order: [['id_retribusi', 'ASC']]
        });

        res.status(200).json({
            message: 'Data wajib retribusi berhasil di ambil',
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};