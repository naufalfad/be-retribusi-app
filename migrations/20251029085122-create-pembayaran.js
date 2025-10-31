"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable("pembayaran", {
      id_pembayaran: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
      id_tagihan: { type: S.INTEGER, allowNull: true },
      id_billing: { type: S.STRING(80) },
      nominal: { type: S.DECIMAL(14, 2), allowNull: false },
      tanggal_pembayaran: { type: S.DATE, allowNull: false },
      metode_pembayaran: { type: S.STRING(30), allowNull: false },
      status_pembayaran: {
        type: S.STRING(20),
        allowNull: false,
        defaultValue: "settled",
      },
      channel: {
        type: S.STRING(20),
        allowNull: false,
        defaultValue: "mandiri",
      }, // 'mandiri'|'setoran_rt'
      id_setoran: { type: S.INTEGER, allowNull: true },
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.fn("NOW") },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.fn("NOW") },
    });
    await q.addIndex("pembayaran", ["tanggal_pembayaran"]);
    await q.addIndex("pembayaran", ["status_pembayaran"]);
    await q.addIndex("pembayaran", ["channel"]);
  },
  async down(q) {
    await q.dropTable("pembayaran");
  },
};
