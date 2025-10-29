require('dotenv').config();
const { Users, wajibRetribusi, sequelize } = require('../models');
const bcrypt = require('bcrypt');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
//const axios = require('axios');

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

exports.registerWr = async (req, res) => {
    try {
        const { id_jenis, nama_wr, alamat_wr, nib_wr, nik_wr, no_hp_wr, lokasi_wr, password_wr } = req.body;
        //const otp_wr = Math.floor(100000 + Math.random() * 900000);

        const wr = await wajibRetribusi.create(
            {
                id_jenis,
                nama_wr,
                alamat_wr,
                nib_wr,
                nik_wr,
                no_hp_wr,
                lokasi_wr,
                password_wr,
                //otp_wr
            },
        );

        const phone = no_hp_wr.startsWith('+')
            ? no_hp_wr
            : `+62${no_hp_wr.replace(/^0/, '')}`;

        const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
            .verifications
            .create({ to: phone, channel: 'sms' });

        // const fonnteToken = 'RQT92qTN9grBjqQQFjzF'

        // const formattedNumber = no_hp_wr.startsWith('+')
        //     ? no_hp_wr : `62${no_hp_wr.replace(/^0/, '')}`;

        // const message = `Halo ${nama_wr},\n\nKode OTP Anda adalah *${otp_wr}*.\nJangan bagikan kode ini kepada siapapun.`;
        // await axios.post('https://api.fonnte.com/send', {
        //     target: formattedNumber,
        //     message: message,
        //     delay: 0,
        //     countryCode: '62',
        // }, {
        //     headers: {
        //         'Authorization': fonnteToken,
        //     },
        // });

        res.status(201).json({
            message: 'Register Wajib Retribusi Berhasil. OTP telah dikirim via sms',
            wr,
        });
    } catch (error) {
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
        const { nik_wr, password_wr } = req.body;

        const wr = await wajibRetribusi.findOne({ where: { nik_wr } });
        if (!wr) return res.status(404).json({ message: 'User tidak ditemukan' });

        const isPasswordValid = await bcrypt.compare(password_wr, wr.password_wr);
        if (!isPasswordValid) return res.status(401).json({ message: 'Password salah' });

        const token = jwt.sign(
            { id_retribusi: wr.id_retribusi, nik_wr: wr.nik_wr },
            SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.json({ message: 'Login berhasil', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};