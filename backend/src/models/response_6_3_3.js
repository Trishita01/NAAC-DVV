import Sequelize from 'sequelize';
export default function(sequelize, DataTypes) {
  return sequelize.define('response_6_3_3', {
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
    from_to_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true
    },
    title_of_prof_dev: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    title_of_add_training: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'response_6_3_3',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sl_no" },
          { name: "from_to_date" },
        ]
      },
      {
        name: "fk_r633_master",
        using: "BTREE",
        fields: [
          { name: "criteria_code" },
          { name: "id" },
        ]
      },
    ]
  });
};
