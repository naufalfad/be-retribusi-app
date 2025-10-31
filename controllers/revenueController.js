// controllers/revenueController.js
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

exports.getRevenue = async (req, res) => {
  const year = Number(req.query.year) || 2025;

  try {
    // 1) target
    const targetRow = await sequelize.query(
      `
      SELECT target::float8 AS target
      FROM target_pendapatan
      WHERE tahun = :year
      LIMIT 1
      `,
      {
        replacements: { year },
        type: QueryTypes.SELECT,
      }
    );
    const targetYear =
      targetRow.length > 0 ? Number(targetRow[0].target || 0) : 0;

    // 2) pendapatan per bulan
    const rows = await sequelize.query(
      `
      SELECT
        EXTRACT(MONTH FROM tanggal_pembayaran)::int AS bulan,
        COALESCE(SUM(nominal),0)::float8 AS total
      FROM pembayaran
      WHERE EXTRACT(YEAR FROM tanggal_pembayaran) = :year
        AND (status_pembayaran IS NULL OR status_pembayaran IN ('settled','success','paid'))
      GROUP BY 1
      ORDER BY 1
      `,
      {
        replacements: { year },
        type: QueryTypes.SELECT,
      }
    );

    console.log("[revenue] rows from DB =", rows);

    // KALAU DB-MU MASIH KOSONG, kirim dummy dulu biar FE tampil
    if (rows.length === 0) {
      const dummy = [25, 42, 18, 53, 33, 29, 60, 45, 50, 39, 41, 30].map(
        (v, i) => ({
          month: MONTHS[i],
          value: v * 1_000_000,
        })
      );

      const yearRevenue = dummy.reduce((a, b) => a + b.value, 0);
      const monthRevenue =
        dummy[new Date().getMonth()]?.value ?? dummy[0].value;

      return res.json({
        series: dummy,
        monthRevenue,
        yearRevenue,
        totalRevenue: yearRevenue,
        targetYear,
      });
    }

    // 3) kalau DB ADA isinya
    const byMonth = new Map(rows.map((r) => [r.bulan, Number(r.total || 0)]));

    const series = MONTHS.map((name, idx) => {
      const n = idx + 1;
      return { month: name, value: byMonth.get(n) ?? 0 };
    });

    const now = new Date();
    const isCurrentYear = now.getFullYear() === year;
    const currentMonth = isCurrentYear ? now.getMonth() + 1 : null;
    const monthRevenue =
      currentMonth != null ? byMonth.get(currentMonth) ?? 0 : 0;

    const yearRevenue = series.reduce((a, b) => a + b.value, 0);

    return res.json({
      series,
      monthRevenue,
      yearRevenue,
      totalRevenue: yearRevenue,
      targetYear,
    });
  } catch (err) {
    console.error("[revenue] error", err);
    return res.status(500).json({ message: "Failed to fetch revenue" });
  }
};
