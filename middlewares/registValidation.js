const { body, validationResult } = require("express-validator");

exports.validateRegister = [
    body('email').isEmail().withMessage('Email tidak valid!'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password minimal delapan karakter!'),

    (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            const formatted = error.array().map(e => ({
                field: e.path,
                message: e.msg,
            }));
            return res.status(400).json({ error: formatted });
        }
        next();
    },
];

exports.validateWajibretribusi = [
    body('nama_wr').notEmpty().withMessage('Nama tidak boleh kosong!'),
    body('alamat_wr').notEmpty().withMessage('Alamat tidak boleh kosong!'),
    body('nik_wr').notEmpty().withMessage('NIK tidak boleh kosong!'),
    body('no_hp_wr').notEmpty().withMessage('Nomor telepon tidak boleh kosong!'),
    body('lokasi_wr').notEmpty().withMessage('Lokasi tidak boleh kosong!'),
    body('password_wr')
        .isLength({ min: 8 })
        .withMessage('Password minimal delapan karakter!'),

    (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            const formatted = error.array().map(e => ({
                field: e.path,
                message: e.msg,
            }));
            return res.status(400).json({ error: formatted });
        }
        next();
    },
];