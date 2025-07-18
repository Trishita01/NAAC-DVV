import Sequelize from 'sequelize';
export default function(sequelize, DataTypes) {
  return sequelize.define('file_uploads', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    criteria_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      references: {
        model: 'criteria_master',
        key: 'criteria_code'
      }
    },
    criteria_master_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'criteria_master',
        key: 'id'
      }
    },
    session: {
      type: DataTypes.DATE,
      allowNull: false
    },
    file_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    uploaded_by: {
      type: DataTypes.CHAR(36),
      allowNull: true
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'file_uploads',
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
        name: "idx_file_criteria",
        using: "BTREE",
        fields: [
          { name: "criteria_code" },
          { name: "criteria_master_id" },
        ]
      },
    ]
  });
};
