var DataTypes = require("sequelize").DataTypes;
var _criteria_master = require("./criteria_master");
var _file_uploads = require("./file_uploads");
var _hdr = require("./hdr");
var _response_1_1_3 = require("./response_1_1_3");
var _response_1_2_1 = require("./response_1_2_1");
var _response_1_2_2 = require("./response_1_2_2");
var _response_1_2_3 = require("./response_1_2_3");
var _response_1_3_2 = require("./response_1_3_2");
var _response_1_3_3 = require("./response_1_3_3");
var _response_1_4_1 = require("./response_1_4_1");
var _response_1_4_2 = require("./response_1_4_2");
var _response_2_1_1 = require("./response_2_1_1");
var _response_2_1_2 = require("./response_2_1_2");
var _response_2_4_1and_2_4_3and2_2_2and2_3_3 = require("./response_2_4_1and_2_4_3and2_2_2and2_3_3");
var _response_2_4_2 = require("./response_2_4_2");
var _response_2_6_3 = require("./response_2_6_3");
var _response_2_7_1 = require("./response_2_7_1");
var _response_3_1_3 = require("./response_3_1_3");
var _response_3_2_1 = require("./response_3_2_1");
var _response_3_2_2 = require("./response_3_2_2");
var _response_3_3_2 = require("./response_3_3_2");
var _response_3_3_3 = require("./response_3_3_3");
var _response_3_4_1 = require("./response_3_4_1");
var _response_3_4_2 = require("./response_3_4_2");
var _response_4_1_3_data = require("./response_4_1_3_data");
var _response_4_1_4_data = require("./response_4_1_4_data");
var _response_4_2_2_4_2_3_data = require("./response_4_2_2_4_2_3_data");
var _response_4_2_4_data = require("./response_4_2_4_data");
var _response_4_3_2_data = require("./response_4_3_2_data");
var _response_4_4_1_data = require("./response_4_4_1_data");
var _response_5_1_1_5_1_2_data = require("./response_5_1_1_5_1_2_data");
var _response_5_1_3_data = require("./response_5_1_3_data");
var _response_5_1_4_data = require("./response_5_1_4_data");
var _response_5_2_1_data = require("./response_5_2_1_data");
var _response_5_2_2_data = require("./response_5_2_2_data");
var _response_5_2_3_data = require("./response_5_2_3_data");
var _response_5_3_1_data = require("./response_5_3_1_data");
var _response_5_3_3_data = require("./response_5_3_3_data");
var _response_6_2_3_data = require("./response_6_2_3_data");
var _response_6_3_2_data = require("./response_6_3_2_data");
var _response_6_3_3_data = require("./response_6_3_3_data");
var _response_6_3_4_data = require("./response_6_3_4_data");
var _response_6_4_2_data = require("./response_6_4_2_data");
var _response_6_5_3_data = require("./response_6_5_3_data");
var _response_7_1_10_data = require("./response_7_1_10_data");
var _response_7_1_2_data = require("./response_7_1_2_data");
var _response_7_1_4_data = require("./response_7_1_4_data");
var _response_7_1_5_data = require("./response_7_1_5_data");
var _response_7_1_6_data = require("./response_7_1_6_data");
var _response_7_1_7_data = require("./response_7_1_7_data");
var _roles = require("./roles");
var _scores = require("./scores");
var _user_roles = require("./user_roles");
var _users = require("./users");

function initModels(sequelize) {
  var criteria_master = _criteria_master(sequelize, DataTypes);
  var file_uploads = _file_uploads(sequelize, DataTypes);
  var hdr = _hdr(sequelize, DataTypes);
  var response_1_1_3 = _response_1_1_3(sequelize, DataTypes);
  var response_1_2_1 = _response_1_2_1(sequelize, DataTypes);
  var response_1_2_2 = _response_1_2_2(sequelize, DataTypes);
  var response_1_2_3 = _response_1_2_3(sequelize, DataTypes);
  var response_1_3_2 = _response_1_3_2(sequelize, DataTypes);
  var response_1_3_3 = _response_1_3_3(sequelize, DataTypes);
  var response_1_4_1 = _response_1_4_1(sequelize, DataTypes);
  var response_1_4_2 = _response_1_4_2(sequelize, DataTypes);
  var response_2_1_1 = _response_2_1_1(sequelize, DataTypes);
  var response_2_1_2 = _response_2_1_2(sequelize, DataTypes);
  var response_2_4_1and_2_4_3and2_2_2and2_3_3 = _response_2_4_1and_2_4_3and2_2_2and2_3_3(sequelize, DataTypes);
  var response_2_4_2 = _response_2_4_2(sequelize, DataTypes);
  var response_2_6_3 = _response_2_6_3(sequelize, DataTypes);
  var response_2_7_1 = _response_2_7_1(sequelize, DataTypes);
  var response_3_1_3 = _response_3_1_3(sequelize, DataTypes);
  var response_3_2_1 = _response_3_2_1(sequelize, DataTypes);
  var response_3_2_2 = _response_3_2_2(sequelize, DataTypes);
  var response_3_3_2 = _response_3_3_2(sequelize, DataTypes);
  var response_3_3_3 = _response_3_3_3(sequelize, DataTypes);
  var response_3_4_1 = _response_3_4_1(sequelize, DataTypes);
  var response_3_4_2 = _response_3_4_2(sequelize, DataTypes);
  var response_4_1_3_data = _response_4_1_3_data(sequelize, DataTypes);
  var response_4_1_4_data = _response_4_1_4_data(sequelize, DataTypes);
  var response_4_2_2_4_2_3_data = _response_4_2_2_4_2_3_data(sequelize, DataTypes);
  var response_4_2_4_data = _response_4_2_4_data(sequelize, DataTypes);
  var response_4_3_2_data = _response_4_3_2_data(sequelize, DataTypes);
  var response_4_4_1_data = _response_4_4_1_data(sequelize, DataTypes);
  var response_5_1_1_5_1_2_data = _response_5_1_1_5_1_2_data(sequelize, DataTypes);
  var response_5_1_3_data = _response_5_1_3_data(sequelize, DataTypes);
  var response_5_1_4_data = _response_5_1_4_data(sequelize, DataTypes);
  var response_5_2_1_data = _response_5_2_1_data(sequelize, DataTypes);
  var response_5_2_2_data = _response_5_2_2_data(sequelize, DataTypes);
  var response_5_2_3_data = _response_5_2_3_data(sequelize, DataTypes);
  var response_5_3_1_data = _response_5_3_1_data(sequelize, DataTypes);
  var response_5_3_3_data = _response_5_3_3_data(sequelize, DataTypes);
  var response_6_2_3_data = _response_6_2_3_data(sequelize, DataTypes);
  var response_6_3_2_data = _response_6_3_2_data(sequelize, DataTypes);
  var response_6_3_3_data = _response_6_3_3_data(sequelize, DataTypes);
  var response_6_3_4_data = _response_6_3_4_data(sequelize, DataTypes);
  var response_6_4_2_data = _response_6_4_2_data(sequelize, DataTypes);
  var response_6_5_3_data = _response_6_5_3_data(sequelize, DataTypes);
  var response_7_1_10_data = _response_7_1_10_data(sequelize, DataTypes);
  var response_7_1_2_data = _response_7_1_2_data(sequelize, DataTypes);
  var response_7_1_4_data = _response_7_1_4_data(sequelize, DataTypes);
  var response_7_1_5_data = _response_7_1_5_data(sequelize, DataTypes);
  var response_7_1_6_data = _response_7_1_6_data(sequelize, DataTypes);
  var response_7_1_7_data = _response_7_1_7_data(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var scores = _scores(sequelize, DataTypes);
  var user_roles = _user_roles(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  roles.belongsToMany(users, { as: 'user_id_users', through: user_roles, foreignKey: "role_name", otherKey: "user_id" });
  users.belongsToMany(roles, { as: 'role_name_roles', through: user_roles, foreignKey: "user_id", otherKey: "role_name" });
  file_uploads.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(file_uploads, { as: "file_uploads", foreignKey: "criteria_code"});
  file_uploads.belongsTo(criteria_master, { as: "criteria_master", foreignKey: "criteria_master_id"});
  criteria_master.hasMany(file_uploads, { as: "criteria_master_file_uploads", foreignKey: "criteria_master_id"});
  hdr.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(hdr, { as: "hdrs", foreignKey: "criteria_code"});
  hdr.belongsTo(criteria_master, { as: "criteria_master", foreignKey: "criteria_master_id"});
  criteria_master.hasMany(hdr, { as: "criteria_master_hdrs", foreignKey: "criteria_master_id"});
  response_1_1_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_1_1_3, { as: "response_1_1_3s", foreignKey: "criteria_code"});
  response_1_1_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_1_1_3, { as: "id_response_1_1_3s", foreignKey: "id"});
  response_1_2_1.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_1_2_1, { as: "response_1_2_1s", foreignKey: "criteria_code"});
  response_1_2_1.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_1_2_1, { as: "id_response_1_2_1s", foreignKey: "id"});
  response_1_2_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_1_2_2, { as: "response_1_2_2s", foreignKey: "criteria_code"});
  response_1_2_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_1_2_2, { as: "id_response_1_2_2s", foreignKey: "id"});
  response_1_2_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_1_2_3, { as: "response_1_2_3s", foreignKey: "criteria_code"});
  response_1_2_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_1_2_3, { as: "id_response_1_2_3s", foreignKey: "id"});
  response_1_3_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_1_3_2, { as: "response_1_3_2s", foreignKey: "criteria_code"});
  response_1_3_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_1_3_2, { as: "id_response_1_3_2s", foreignKey: "id"});
  response_1_3_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_1_3_3, { as: "response_1_3_3s", foreignKey: "criteria_code"});
  response_1_3_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_1_3_3, { as: "id_response_1_3_3s", foreignKey: "id"});
  response_1_4_1.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_1_4_1, { as: "response_1_4_1s", foreignKey: "criteria_code"});
  response_1_4_1.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_1_4_1, { as: "id_response_1_4_1s", foreignKey: "id"});
  response_1_4_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_1_4_2, { as: "response_1_4_2s", foreignKey: "criteria_code"});
  response_1_4_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_1_4_2, { as: "id_response_1_4_2s", foreignKey: "id"});
  response_2_1_1.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_2_1_1, { as: "response_2_1_1s", foreignKey: "criteria_code"});
  response_2_1_1.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_2_1_1, { as: "id_response_2_1_1s", foreignKey: "id"});
  response_2_1_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_2_1_2, { as: "response_2_1_2s", foreignKey: "criteria_code"});
  response_2_1_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_2_1_2, { as: "id_response_2_1_2s", foreignKey: "id"});
  response_2_4_1and_2_4_3and2_2_2and2_3_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_2_4_1and_2_4_3and2_2_2and2_3_3, { as: "response_2_4_1and_2_4_3and2_2_2and2_3_3s", foreignKey: "criteria_code"});
  response_2_4_1and_2_4_3and2_2_2and2_3_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_2_4_1and_2_4_3and2_2_2and2_3_3, { as: "id_response_2_4_1and_2_4_3and2_2_2and2_3_3s", foreignKey: "id"});
  response_2_4_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_2_4_2, { as: "response_2_4_2s", foreignKey: "criteria_code"});
  response_2_4_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_2_4_2, { as: "id_response_2_4_2s", foreignKey: "id"});
  response_2_6_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_2_6_3, { as: "response_2_6_3s", foreignKey: "criteria_code"});
  response_2_6_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_2_6_3, { as: "id_response_2_6_3s", foreignKey: "id"});
  response_2_7_1.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_2_7_1, { as: "response_2_7_1s", foreignKey: "criteria_code"});
  response_2_7_1.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_2_7_1, { as: "id_response_2_7_1s", foreignKey: "id"});
  response_3_1_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_3_1_3, { as: "response_3_1_3s", foreignKey: "criteria_code"});
  response_3_1_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_3_1_3, { as: "id_response_3_1_3s", foreignKey: "id"});
  response_3_2_1.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_3_2_1, { as: "response_3_2_1s", foreignKey: "criteria_code"});
  response_3_2_1.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_3_2_1, { as: "id_response_3_2_1s", foreignKey: "id"});
  response_3_2_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_3_2_2, { as: "response_3_2_2s", foreignKey: "criteria_code"});
  response_3_2_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_3_2_2, { as: "id_response_3_2_2s", foreignKey: "id"});
  response_3_3_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_3_3_2, { as: "response_3_3_2s", foreignKey: "criteria_code"});
  response_3_3_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_3_3_2, { as: "id_response_3_3_2s", foreignKey: "id"});
  response_3_3_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_3_3_3, { as: "response_3_3_3s", foreignKey: "criteria_code"});
  response_3_3_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_3_3_3, { as: "id_response_3_3_3s", foreignKey: "id"});
  response_3_4_1.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_3_4_1, { as: "response_3_4_1s", foreignKey: "criteria_code"});
  response_3_4_1.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_3_4_1, { as: "id_response_3_4_1s", foreignKey: "id"});
  response_3_4_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_3_4_2, { as: "response_3_4_2s", foreignKey: "criteria_code"});
  response_3_4_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_3_4_2, { as: "id_response_3_4_2s", foreignKey: "id"});
  response_4_1_3_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_4_1_3_data, { as: "response_4_1_3_data", foreignKey: "criteria_code"});
  response_4_1_3_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_4_1_3_data, { as: "id_response_4_1_3_data", foreignKey: "id"});
  response_4_1_4_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_4_1_4_data, { as: "response_4_1_4_data", foreignKey: "criteria_code"});
  response_4_1_4_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_4_1_4_data, { as: "id_response_4_1_4_data", foreignKey: "id"});
  response_4_2_2_4_2_3_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_4_2_2_4_2_3_data, { as: "response_4_2_2_4_2_3_data", foreignKey: "criteria_code"});
  response_4_2_2_4_2_3_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_4_2_2_4_2_3_data, { as: "id_response_4_2_2_4_2_3_data", foreignKey: "id"});
  response_4_2_4_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_4_2_4_data, { as: "response_4_2_4_data", foreignKey: "criteria_code"});
  response_4_2_4_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_4_2_4_data, { as: "id_response_4_2_4_data", foreignKey: "id"});
  response_4_3_2_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_4_3_2_data, { as: "response_4_3_2_data", foreignKey: "criteria_code"});
  response_4_3_2_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_4_3_2_data, { as: "id_response_4_3_2_data", foreignKey: "id"});
  response_4_4_1_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_4_4_1_data, { as: "response_4_4_1_data", foreignKey: "criteria_code"});
  response_4_4_1_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_4_4_1_data, { as: "id_response_4_4_1_data", foreignKey: "id"});
  response_5_1_1_5_1_2_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_1_1_5_1_2_data, { as: "response_5_1_1_5_1_2_data", foreignKey: "criteria_code"});
  response_5_1_1_5_1_2_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_1_1_5_1_2_data, { as: "id_response_5_1_1_5_1_2_data", foreignKey: "id"});
  response_5_1_3_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_1_3_data, { as: "response_5_1_3_data", foreignKey: "criteria_code"});
  response_5_1_3_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_1_3_data, { as: "id_response_5_1_3_data", foreignKey: "id"});
  response_5_1_4_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_1_4_data, { as: "response_5_1_4_data", foreignKey: "criteria_code"});
  response_5_1_4_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_1_4_data, { as: "id_response_5_1_4_data", foreignKey: "id"});
  response_5_2_1_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_2_1_data, { as: "response_5_2_1_data", foreignKey: "criteria_code"});
  response_5_2_1_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_2_1_data, { as: "id_response_5_2_1_data", foreignKey: "id"});
  response_5_2_2_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_2_2_data, { as: "response_5_2_2_data", foreignKey: "criteria_code"});
  response_5_2_2_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_2_2_data, { as: "id_response_5_2_2_data", foreignKey: "id"});
  response_5_2_3_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_2_3_data, { as: "response_5_2_3_data", foreignKey: "criteria_code"});
  response_5_2_3_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_2_3_data, { as: "id_response_5_2_3_data", foreignKey: "id"});
  response_5_3_1_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_3_1_data, { as: "response_5_3_1_data", foreignKey: "criteria_code"});
  response_5_3_1_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_3_1_data, { as: "id_response_5_3_1_data", foreignKey: "id"});
  response_5_3_3_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_3_3_data, { as: "response_5_3_3_data", foreignKey: "criteria_code"});
  response_5_3_3_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_3_3_data, { as: "id_response_5_3_3_data", foreignKey: "id"});
  response_6_2_3_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_6_2_3_data, { as: "response_6_2_3_data", foreignKey: "criteria_code"});
  response_6_2_3_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_6_2_3_data, { as: "id_response_6_2_3_data", foreignKey: "id"});
  response_6_3_2_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_6_3_2_data, { as: "response_6_3_2_data", foreignKey: "criteria_code"});
  response_6_3_2_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_6_3_2_data, { as: "id_response_6_3_2_data", foreignKey: "id"});
  response_6_3_3_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_6_3_3_data, { as: "response_6_3_3_data", foreignKey: "criteria_code"});
  response_6_3_3_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_6_3_3_data, { as: "id_response_6_3_3_data", foreignKey: "id"});
  response_6_3_4_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_6_3_4_data, { as: "response_6_3_4_data", foreignKey: "criteria_code"});
  response_6_3_4_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_6_3_4_data, { as: "id_response_6_3_4_data", foreignKey: "id"});
  response_6_4_2_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_6_4_2_data, { as: "response_6_4_2_data", foreignKey: "criteria_code"});
  response_6_4_2_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_6_4_2_data, { as: "id_response_6_4_2_data", foreignKey: "id"});
  response_6_5_3_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_6_5_3_data, { as: "response_6_5_3_data", foreignKey: "criteria_code"});
  response_6_5_3_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_6_5_3_data, { as: "id_response_6_5_3_data", foreignKey: "id"});
  response_7_1_10_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_7_1_10_data, { as: "response_7_1_10_data", foreignKey: "criteria_code"});
  response_7_1_10_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_7_1_10_data, { as: "id_response_7_1_10_data", foreignKey: "id"});
  response_7_1_2_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_7_1_2_data, { as: "response_7_1_2_data", foreignKey: "criteria_code"});
  response_7_1_2_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_7_1_2_data, { as: "id_response_7_1_2_data", foreignKey: "id"});
  response_7_1_4_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_7_1_4_data, { as: "response_7_1_4_data", foreignKey: "criteria_code"});
  response_7_1_4_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_7_1_4_data, { as: "id_response_7_1_4_data", foreignKey: "id"});
  response_7_1_5_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_7_1_5_data, { as: "response_7_1_5_data", foreignKey: "criteria_code"});
  response_7_1_5_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_7_1_5_data, { as: "id_response_7_1_5_data", foreignKey: "id"});
  response_7_1_6_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_7_1_6_data, { as: "response_7_1_6_data", foreignKey: "criteria_code"});
  response_7_1_6_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_7_1_6_data, { as: "id_response_7_1_6_data", foreignKey: "id"});
  response_7_1_7_data.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_7_1_7_data, { as: "response_7_1_7_data", foreignKey: "criteria_code"});
  response_7_1_7_data.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_7_1_7_data, { as: "id_response_7_1_7_data", foreignKey: "id"});
  scores.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(scores, { as: "scores", foreignKey: "criteria_code"});
  user_roles.belongsTo(roles, { as: "role_name_role", foreignKey: "role_name"});
  roles.hasMany(user_roles, { as: "user_roles", foreignKey: "role_name"});
  file_uploads.belongsTo(users, { as: "uploaded_by_user", foreignKey: "uploaded_by"});
  users.hasMany(file_uploads, { as: "file_uploads", foreignKey: "uploaded_by"});
  scores.belongsTo(users, { as: "computed_by_user", foreignKey: "computed_by"});
  users.hasMany(scores, { as: "scores", foreignKey: "computed_by"});
  user_roles.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(user_roles, { as: "user_roles", foreignKey: "user_id"});

  return {
    criteria_master,
    file_uploads,
    hdr,
    response_1_1_3,
    response_1_2_1,
    response_1_2_2,
    response_1_2_3,
    response_1_3_2,
    response_1_3_3,
    response_1_4_1,
    response_1_4_2,
    response_2_1_1,
    response_2_1_2,
    response_2_4_1and_2_4_3and2_2_2and2_3_3,
    response_2_4_2,
    response_2_6_3,
    response_2_7_1,
    response_3_1_3,
    response_3_2_1,
    response_3_2_2,
    response_3_3_2,
    response_3_3_3,
    response_3_4_1,
    response_3_4_2,
    response_4_1_3_data,
    response_4_1_4_data,
    response_4_2_2_4_2_3_data,
    response_4_2_4_data,
    response_4_3_2_data,
    response_4_4_1_data,
    response_5_1_1_5_1_2_data,
    response_5_1_3_data,
    response_5_1_4_data,
    response_5_2_1_data,
    response_5_2_2_data,
    response_5_2_3_data,
    response_5_3_1_data,
    response_5_3_3_data,
    response_6_2_3_data,
    response_6_3_2_data,
    response_6_3_3_data,
    response_6_3_4_data,
    response_6_4_2_data,
    response_6_5_3_data,
    response_7_1_10_data,
    response_7_1_2_data,
    response_7_1_4_data,
    response_7_1_5_data,
    response_7_1_6_data,
    response_7_1_7_data,
    roles,
    scores,
    user_roles,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
