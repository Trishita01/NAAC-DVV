import Sequelize from 'sequelize';
export default function(sequelize, DataTypes) { 
  return sequelize.define('response_3_4_1', {
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
    title_of_activity: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    collaborating_agency: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    participant_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    year_of_collaboration: {
      type: DataTypes.DATE,
      allowNull: true
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    document_link: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'response_3_4_1',
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
        name: "idx_r341_criteria",
        using: "BTREE",
        fields: [
          { name: "criteria_code" },
          { name: "id" },
        ]
      },
    ]
  });
};
