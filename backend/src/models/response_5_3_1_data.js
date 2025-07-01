const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('response_5_3_1_data', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'criteria_master',
        key: 'id'
      }
    },
    sl_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    criteria_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'criteria_master',
        key: 'criteria_code'
      }
    },
    session: {
      type: DataTypes.DATE,
      allowNull: false
    },
    year: {
      type: DataTypes.DATE,
      allowNull: false
    },
    award_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    team_or_individual: {
      type: DataTypes.ENUM('Team','Individual'),
      allowNull: false
    },
    level: {
      type: DataTypes.ENUM('University','State','National','International'),
      allowNull: false
    },
    activity_type: {
      type: DataTypes.ENUM('Sports','Cultural'),
      allowNull: false
    },
    student_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'response_5_3_1_data',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sl_no" },
        ]
      },
      {
        name: "fk_r531_master",
        using: "BTREE",
        fields: [
          { name: "criteria_code" },
          { name: "id" },
        ]
      },
    ]
  });
};
