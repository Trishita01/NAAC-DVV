const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_roles', {
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    role_name: {
      type: DataTypes.ENUM('faculty','college_admin','mentor','naac_supervisor'),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'roles',
        key: 'role_name'
      }
    }
  }, {
    sequelize,
    tableName: 'user_roles',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "role_name" },
        ]
      },
      {
        name: "role_name",
        using: "BTREE",
        fields: [
          { name: "role_name" },
        ]
      },
    ]
  });
};
