require('dotenv').config();
const { Users, wajibRetribusi } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const { Op } = require('sequelize');

const SECRET_KEY = process.env.SECRET_KEY;
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.registerAdmin = async (req, res) => {
    // const t = await sequelize.transation();
    try {
        const { email, password } = req.body;
        const user = await Users.create(
            { email, password },
            // { transation: t }
        );
        // const wr = await wajibRetribusi.create(
        //     {
        //         id_user: user.id_user,
        //         id_jenis,
        //         nama_wr,
        //         alamat_wr,
        //         nib_wr,
        //         nik_wr,
        //         lokasi,
        //     },
        //     { transation: t }
        // );

        // await t.commit();
        res.status(201).json({
            message: 'Register berhasil',
            user,
            // wajibRetribusi: wr,
        });
    } catch (error) {
        // await t.rollback();
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { no_hp_wr, code } = req.body;

        const phone = no_hp_wr.startsWith('+')
            ? no_hp_wr
            : `+62${no_hp_wr.replace(/^0/, '')}`;

        const verificationCheck = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
            .verificationChecks
            .create({ to: phone, code });

        if (verificationCheck.status === 'approved') {
            // Update status OTP di database (opsional)
            await wajibRetribusi.update(
                { otp_wr: true },
                { where: { no_hp_wr } }
            );

            res.status(200).json({
                message: 'OTP berhasil diverifikasi.',
                status: verificationCheck.status,
                OTP: phone.otp_wr, no_hp_wr
            });
        } else {
            res.status(400).json({
                message: 'Kode OTP salah atau sudah kedaluwarsa.',
                status: verificationCheck.status,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Password salah' });

        const token = jwt.sign(
            { id_user: user.id_user, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.json({ message: 'Login berhasil', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};

exports.loginWr = async (req, res) => {
    try {
        const { nikOrNib, password_wr } = req.body;

        if (!nikOrNib || !password_wr) {
            return res.status(400).json({
                message: 'NIK/NIB dan password wajib diisi',
            });
        }

        const wr = await wajibRetribusi.findOne({
            where: {
                [Op.or]: [{ nik_wr: nikOrNib }, { nib_wr: nikOrNib }]
            },
        });

        if (!wr) return res.status(404).json({ message: 'User tidak ditemukan' });

        const isPasswordValid = await bcrypt.compare(password_wr, wr.password_wr);
        if (!isPasswordValid) return res.status(401).json({ message: 'Password salah' });

        const token = jwt.sign(
            { id_retribusi: wr.id_retribusi, nik_wr: wr.nik_wr, nib_wr: wr.nib_wr },
            SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login berhasil',
            token,
            data: {
                nama_wr: wr.nama_wr,
                status_wr: wr.status_wr
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};