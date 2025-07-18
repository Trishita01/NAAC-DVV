import Sequelize from 'sequelize';
export default function(sequelize, DataTypes) {
  return sequelize.define('response_4_4_1', {
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
    budget_allocated_infra: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    expenditure_infra_lakhs: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    total_exp_infra_lakhs: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    exp_maintainance_acad: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    exp_maintainance_physical: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'response_4_4_1',
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
        name: "idx_r441_criteria",
        using: "BTREE",
        fields: [
          { name: "criteria_code" },
          { name: "id" },
        ]
      },
    ]
  });
};
