import Sequelize from 'sequelize';
export default function(sequelize, DataTypes) {
  return sequelize.define('response_5_1_1', {
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
    scheme_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    gov_students_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    gov_amount: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: true,
      defaultValue: 0.00
    },
    inst_students_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    inst_amount: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: true,
      defaultValue: 0.00
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'response_5_1_1',
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
        name: "fk_r511_master",
        using: "BTREE",
        fields: [
          { name: "criteria_code" },
          { name: "id" },
        ]
      },
    ]
  });
};
