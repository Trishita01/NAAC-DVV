import Sequelize from "sequelize";
import DataTypes from "sequelize";
export default function(sequelize, DataTypes) {
  return sequelize.define('scores', {
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
    criteria_id: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    score_criteria: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    sub_criteria_id: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    score_sub_criteria: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    sub_sub_criteria_id: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    score_sub_sub_criteria: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    session: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    cycle_year: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    computed_by: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    computed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'scores',
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
        name: "fk_scores_master",
        using: "BTREE",
        fields: [
          { name: "criteria_code" },
        ]
      },
      {
        name: "fk_scores_user",
        using: "BTREE",
        fields: [
          { name: "computed_by" },
        ]
      },
    ]
  });
};
