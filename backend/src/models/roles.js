const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roles', {
    role_name: {
      type: DataTypes.ENUM('faculty','college_admin','mentor','naac_supervisor'),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'roles',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "role_name" },
        ]
      },
    ]
  });
};
