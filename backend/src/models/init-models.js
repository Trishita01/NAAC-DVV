import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _response_6_3_3 from  "./response_6_3_3.js";
import _response_6_3_4 from  "./response_6_3_4.js";

export default function initModels(sequelize) {
  const response_6_3_3 = _response_6_3_3.init(sequelize, DataTypes);
  const response_6_3_4 = _response_6_3_4.init(sequelize, DataTypes);

  response_6_3_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_6_3_3, { as: "response_6_3_3s", foreignKey: "criteria_code"});
  response_6_3_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_6_3_3, { as: "id_response_6_3_3s", foreignKey: "id"});
  response_6_3_4.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_6_3_4, { as: "response_6_3_4s", foreignKey: "criteria_code"});
  response_6_3_4.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_6_3_4, { as: "id_response_6_3_4s", foreignKey: "id"});

  return {
    response_6_3_3,
    response_6_3_4,
  };
}
