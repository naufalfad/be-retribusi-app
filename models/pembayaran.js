"use strict";
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "pembayaran",
    {
      id_pembayaran: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_tagihan: DataTypes.INTEGER,
      id_billing: DataTypes.STRING,
      nominal: DataTypes.DECIMAL(14, 2),
      tanggal_pembayaran: DataTypes.DATE,
      metode_pembayaran: DataTypes.STRING,
      status_pembayaran: DataTypes.STRING,
      channel: DataTypes.STRING,
      id_setoran: DataTypes.INTEGER,
    },
    { tableName: "pembayaran", underscored: true }
  );
};
