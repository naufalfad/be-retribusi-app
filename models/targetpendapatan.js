// models/targetpendapatan.js
module.exports = (sequelize, DataTypes) => {
  const TargetPendapatan = sequelize.define(
    "target_pendapatan",
    {
      id_target: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tahun: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      target: {
        // numeric(14,2)
        type: DataTypes.DECIMAL(14, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "target_pendapatan",
      underscored: true,
      timestamps: true,
    }
  );

  return TargetPendapatan;
};
