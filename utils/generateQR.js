const QRCode = require('qrcode');

exports.generateQRCode = async (text) => {
    try {
        const dataURL = await QRCode.toDataURL(text);
        return dataURL;
    } catch (err) {
        console.error('QR Generation Error', err);
        return null;
    }
};