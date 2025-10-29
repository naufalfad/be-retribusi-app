require('dotenv').config();
const { wajibRetribusi } = require('../models');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.tambahWajibRetribusi = async (req, res) => {
    try {
        const id_admin = req.user.id_user;
        const { id_jenis, nama_wr, alamat_wr, nib_wr, nik_wr, no_hp_wr, lokasi_wr, password_wr } = req.body;

        const wr = await wajibRetribusi.create({
            id_admin,
            id_jenis,
            nama_wr,
            nib_wr,
            nik_wr,
            no_hp_wr,
            alamat_wr,
            lokasi_wr,
            password_wr,
            otp_wr: 'true'
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