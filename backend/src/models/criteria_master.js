import Sequelize from "sequelize";
export default function criteria_master(sequelize, DataTypes) {
  return sequelize.define('criteria_master', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    criteria_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    criterion_id: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    sub_criterion_id: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    sub_sub_criterion_id: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    criterion_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sub_criterion_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sub_sub_criterion_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    criteria_type: {
      type: DataTypes.ENUM('Qn','Ql'),
      allowNull: false
    },
    requirements: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    last_reviewed: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'criteria_master',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "uq_criteria",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "criteria_code" },
          { name: "id" },
        ]
      },
    ]
  });
};
