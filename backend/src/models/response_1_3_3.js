import Sequelize from 'sequelize';
export default function(sequelize, DataTypes) {
  return sequelize.define('response_1_3_3', {
    sl_no: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'criteria_master',
        key: 'id'
      }
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
    program_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    program_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    student_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'response_1_3_3',
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
        name: "idx_r133_criteria",
        using: "BTREE",
        fields: [
          { name: "criteria_code" },
          { name: "id" },
        ]
      },
    ]
  });
};
