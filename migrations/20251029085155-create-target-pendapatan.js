"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable("target_pendapatan", {
      id_target: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
      tahun: { type: S.INTEGER, allowNull: false, unique: true },
      target: { type: S.DECIMAL(14, 2), allowNull: false },
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.fn("NOW") },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.fn("NOW") },
    });
  },
  async down(q) {
    await q.dropTable("target_pendapatan");
  },
};
