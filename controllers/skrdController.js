const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const { skrd, wajibRetribusi, jenisRetribusi, kategoriRetribusi, pembayaran } = require('../models');
//const { generateQRCode } = require('../utils/generateQR');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { snap } = require('../config/midtrans');
const qrcode = require('qrcode');

async function generateQRCodeImage(url) {
    try {
        const qrDataUrl = await qrcode.toDataURL(url, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            margin: 1,
            color: {
                dark: '#000000FF',
                light: '#FFFFFFFF'
            }
        });
        return qrDataUrl;
    } catch (err) {
        console.error("Error generating QR Code:", err);
        return null;
    }
}

exports.generateSKRD = async (req, res) => {
    let browser;
    try {
        const { nik_wr, periode_mulai, periode_selesai } = req.body;
        if (!nik_wr || !periode_mulai || !periode_selesai) {
            return res.status(400).json({ message: 'NIK, Periode mulai, dan Periode selesai wajib diisi ' });
        }

        const wr = await wajibRetribusi.findOne({
            where: { nik_wr },
            include: [
                { model: jenisRetribusi, attributes: ['nama_jenis'] },
                { model: kategoriRetribusi, attributes: ['nama_kategori'] },
            ],
        });
        if (!wr)
            return res.status(404).json({ message: 'Data wajib retribusi tidak ditemukan' });

        const today = moment();
        const tanggal_terbit = today.toDate();
        const tanggal_jatuh_tempo = moment(tanggal_terbit).add(14, 'days').toDate();

        const startPeriod = moment(periode_mulai, 'YYYY-MM-DD').startOf('month');
        const endPeriod = moment(periode_selesai, 'YYYY-MM-DD').endOf('month');
        const jumlah_bulan = endPeriod.diff(startPeriod, 'month') + 1;

        const lastSkrd = await skrd.findOne({
            where: { id_retribusi: wr.id_retribusi },
            order: [['masa_berlaku_selesai', 'DESC']],
        });

        let hari_telat = 0;
        let total_denda = 0;

        if (lastSkrd && today.isSameOrBefore(moment(lastSkrd.masa_berlaku_selesai))) {
            total_denda = 0;
        } else {
            const batas_tanggal_bayar = moment().date(8);
            if (today.isAfter(batas_tanggal_bayar)) {
                hari_telat = today.diff(batas_tanggal_bayar, 'days');
                total_denda = hari_telat * 200;
            }
        }

        const tarif_perbulan = parseFloat(wr.total_tarif_wr);
        const total_retribusi = tarif_perbulan * jumlah_bulan;
        const total_tagihan = total_retribusi + total_denda;

        const masa_berlaku_mulai = startPeriod;
        const masa_berlaku_selesai = endPeriod;

        const id_skrd = uuidv4();
        const nomor_skrd = `SKRD-${moment().format('YYYYMMDDHHmmss')}--${Math.floor(Math.random() * 1000)}`;
        const no_rekening = `7211${Math.floor(Math.random() * 1000000000)}`;

        const id_pembayaran = uuidv4();
        const newPembayaran = await pembayaran.create({
            id_pembayaran: id_pembayaran,
            id_skrd: id_skrd,
            id_retribusi: wr.id_retribusi,
            tanggal_bayar: null,
            jumlah_bayar: total_tagihan,
            metode_bayar: null,
            status_pembayaran: 'pending',
            keterengan: 'Menunggu pembayaran dari Midtrans',
        });

        const newSKRD = await skrd.create({
            id_skrd,
            id_retribusi: wr.id_retribusi,
            nomor_skrd,
            tanggal_terbit,
            tanggal_jatuh_tempo,
            jumlah_bulan,
            total_tarif: wr.total_tarif_wr,
            total_denda,
            total_tagihan,
            periode_mulai: startPeriod.toDate(),
            periode_selesai: endPeriod.toDate(),
            masa_berlaku_mulai: masa_berlaku_mulai.toDate(),
            masa_berlaku_selesai: masa_berlaku_selesai.toDate(),
            status_skrd: 'belum bayar',
            no_rekening
        });

        const parameter = {
            transaction_details: {
                order_id: newPembayaran.id_pembayaran,
                gross_amount: total_tagihan,
            },
            item_details: [
                {
                    id: newSKRD.id_skrd,
                    price: total_tagihan,
                    quantity: 1,
                    name: 'pembayaran retribusi'
                    // `Retribusi Sampah ${wr.jenisRetribusi.nama_jenis} - 
                    // ${wr.kategoriRetribusi.nama_kategori} Periode ${startPeriod.format('MM/YYYY')}
                    // -${endPeriod.format('MM/YYYY')}`
                }
            ],
            customer_details: {
                first_name: wr.nama_wr,
                email: 'customer@example.com',
                phone: wr.no_hp_wr,
                billing_address: {
                    first_name: wr.nama_wr,
                    address: wr.alamat_wr,
                    city: wr.kabupaten_wr,
                    postal_code: '16911',
                    phone: wr.no_hp_wr,
                    country_code: 'IDN'
                }
            },
            enabled_payments: [
                'qris',
                'bca_va',
                'bri_va'
            ],
            callbacks: {
                finish: `${process.env.APP_BASE_URL}/api/midtrans-notifications`,
                error: `${process.env.APP_BASE_URL}/api/midtrans-notifications`,
                pending: `${process.env.APP_BASE_URL}/api/midtrans-notifications`
            },
            expiry: {
                unit: 'days',
                duration: 7
            }
        };

        //transaction ini masih error .find
        const transaction = await snap.createTransaction(parameter);

        let midtransPaymentDetails = {
            qris: null,
            virtualAccounts: []
        };

        if (transaction.actions && Array.isArray(transaction.actions)) {
            const qrisAction = transaction.actions.find(action => action.name === 'generate-qr-code');
            if (qrisAction) {
                midtransPaymentDetails.qris = {
                    url: qrisAction.url,
                    expiry: moment(transaction.expiry_time).format('DD-MM-YYYY HH:mm:ss')
                };

                midtransPaymentDetails.qris.qr_image_base64 = await generateQRCodeImage(qrisAction.url);
            }
        } else {
            console.warn("Properti 'actions' tidak ditemukan atau bukan array di objek transaksi Midtrans.");
        }

        if (transaction.va_numbers && transaction.va_numbers.length > 0) {
            midtransPaymentDetails.virtualAccounts = transaction.va_numbers.map(va => ({
                bank: va.bank.toUpperCase(),
                va_number: va.va_number,
                expiry: moment(transaction.expiry_time).format('DD-MM-YYYY HH:mm:ss')
            }));
        }

        //const qr_image = await generateQRCode(no_rekening);
        const logoPath = path.join(__dirname, '../views/kab-bogor.png');
        const logoBase64 = fs.existsSync(logoPath)
            ? `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}` : null;
        const templatePath = path.join(__dirname, '../views/skrdTemplate.html');
        const html = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(html);

        const htmlResult = template({
            nama_wr: wr.nama_wr,
            alamat_wr: wr.alamat_wr,
            nik_wr: wr.nik_wr,
            periode: `${startPeriod.format('YYYY-MM-DD')} - ${endPeriod.format('YYYY-MM-DD')}`,
            masa_berlaku: `${masa_berlaku_mulai.format('YYYY-DD-MM')} s/d ${masa_berlaku_selesai.format('YYYY-DD-MM')}`,
            total_retribusi: Number(total_retribusi).toLocaleString('id-ID'),
            total_denda: total_denda > 0 ? `${total_denda.toLocaleString('id-ID')} (Telat ${hari_telat} hari)` : 'Tidak ada',
            total_tagihan: Number(total_tagihan).toLocaleString('id-ID'),
            // no_rekening,
            // qr_image,
            midtrans_qris: midtransPaymentDetails.qris,
            midtrans_virtual_accounts: midtransPaymentDetails.virtualAccounts,
            logo_image: logoBase64,
            jenis: wr.jenisRetribusi ? wr.jenisRetribusi.nama_jenis : '-',
            kategori: wr.kategoriRetribusi ? wr.kategoriRetribusi.nama_kategori : '-',
            tgl_terbit: moment(tanggal_terbit).format('DD-MM-YYYY'),
            tgl_jatuh_tempo: moment(tanggal_jatuh_tempo).format('DD-MM-YYYY'),
        });

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ],
            timeout: 0,
        });
        const page = await browser.newPage();
        await page.setContent(htmlResult, {
            waitUntil: ['domcontentloaded'],
            timeout: 0,
        });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=${nomor_skrd}.pdf`);
        res.send(pdfBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal generate SKRD', error: err.message });
    } finally {
        if (browser) await browser.close();
    }
};