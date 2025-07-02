const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('response_5_2_3_data', {
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
      type: DataTypes.STRING(20),
      allowNull: true,
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
    registeration_number: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    exam_net: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    exam_slet: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    exam_gate: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    exam_gmat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    exam_cat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    exam_gre: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    exam_jam: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    exam_ielts: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    exam_toefl: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    exam_civil_services: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    exam_state_services: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    exam_other: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'response_5_2_3_data',
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
        name: "fk_r523_master",
        using: "BTREE",
        fields: [
          { name: "criteria_code" },
          { name: "id" },
        ]
      },
    ]
  });
};
