import Sequelize from 'sequelize';
export default function(sequelize, DataTypes) {
  return sequelize.define('response_3_2_1', {
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
    paper_title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    author_names: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    journal_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    year_of_publication: {
      type: DataTypes.DATE,
      allowNull: true
    },
    issn_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    indexation_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'response_3_2_1',
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
        name: "idx_r321_criteria",
        using: "BTREE",
        fields: [
          { name: "criteria_code" },
          { name: "id" },
        ]
      },
    ]
  });
};
