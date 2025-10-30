"use strict";
module.exports = {
  async up(q) {
    await q.bulkInsert("target_pendapatan", [
      {
        tahun: 2023,
        target: 100000000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        tahun: 2024,
        target: 120000000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        tahun: 2025,
        target: 150000000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    const base = new Date("2025-01-15T10:00:00Z");
    const rows = [];
    for (let m = 1; m <= 12; m++) {
      const d = new Date(base);
      d.setMonth(m - 1);
      rows.push({
        id_tagihan: null,
        id_billing: `SEED-${m}`,
        nominal: 18000000 + Math.round(Math.random() * 25000000),
        tanggal_pembayaran: d,
        metode_pembayaran: "VA",
        status_pembayaran: "settled",
        channel: "mandiri",
        id_setoran: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await q.bulkInsert("pembayaran", rows);
  },
  async down(q) {
    await q.bulkDelete("pembayaran", null, {});
    await q.bulkDelete("target_pendapatan", null, {});
  },
};
