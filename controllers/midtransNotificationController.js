require('dotenv').config();
const midtransClient = require('midtrans-client');
const { pembayaran, skrd } = require('../models');
const moment = require('moment');

exports.handleMidtransNotification = async (req, res) => {
    try {
        const notificationJSON = req.body;

        let apiClient = new midtransClient.Notification({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY
        });

        const statusResponse = await apiClient.handleNotification(notificationJSON);

        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;
        let paymentType = statusResponse.payment_type;
        let grossAmount = parseFloat(statusResponse.gross_amount);
        let transactionTime = statusResponse.transaction_time;

        const currentPembayaran = await pembayaran.findOne({
            where: { id_pembayaran: orderId }
        });

        if (!currentPembayaran) {
            console.warn(`[Midtrans Notification] Payment with order_id ${orderId} not found.`);
            return res.status(404).json({ message: 'Order not found in database' });
        }

        if (currentPembayaran.jumlah_bayar.toNumber() !== grossAmount) {
            console.warn(`[Midtrans Notification] Gross amount mismatch for order_id ${orderId}.
                Expected ${currentPembayaran.jumlah_bayar}, got ${grossAmount}`);
            return res.status(404).json({ message: 'Gross amount mismatch' });
        }

        let updatedStatusPembayaran = currentPembayaran.status_pembayaran;
        let updatedStatusSkrd = currentPembayaran.skrd ? currentPembayaran.skrd.status_skrd : 'belum bayar';
        let updatedKeterangan = currentPembayaran.keterangan;
        let updatedTanggalBayar = currentPembayaran.tanggal_bayar;
        let updatedMetodeBayar = currentPembayaran.metode_bayar;

        if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
            if (fraudStatus == 'challange') {
                updatedStatusPembayaran = 'pending';
                updatedKeterangan = 'Challange: Perlu verifikasi lebih lanjut oleh midtrans';
            } else if (fraudStatus == 'accept') {
                updatedStatusPembayaran = 'lunas',
                    updatedKeterangan = 'pembayaran berhasil',
                    updatedTanggalBayar = moment(transactionTime).toDate();
                updatedMetodeBayar = paymentType;
                updatedStatusSkrd = 'sudah bayar';
            }
        } else if (transactionStatus == 'pending') {
            updatedStatusPembayaran = 'pending';
            updatedKeterangan = 'Menunggu pembayaran dari pengguna';
        } else if (transactionStatus == 'deny' || transactionStatus == 'cancel') {
            updatedStatusPembayaran = 'gagal';
            updatedKeterangan = `Pembayaran ${transactionStatus == 'deny' ? 'ditolak' : 'dibatalkan'}`;
        } else if (transactionStatus == 'expire') {
            updatedStatusPembayaran = 'gagal';
            updatedKeterangan = 'Pembayaran telah kedaluwarsa';
            updatedStatusSkrd = 'kedaluwarsa';
        }

        await currentPembayaran.update({
            status_pembayaran: updatedStatusPembayaran,
            keterangan: updatedKeterangan,
            tanggal_bayar: updatedTanggalBayar,
            metode_bayar: updatedMetodeBayar,
        });

        const currentSkrd = await skrd.findByPk(currentPembayaran.id_skrd);
        if (currentSkrd && currentSkrd.status_skrd !== updatedStatusSkrd) {
            await currentSkrd.update({ status_skrd: updatedStatusSkrd });
        }

        res.status(200).json({ message: 'Midtrans notification processed successfully' });
    } catch (err) {
        console.error('Error processing midtrans notification', err);
        res.status(500).json({ message: 'Error processing notification', err: err.message });
    }
};