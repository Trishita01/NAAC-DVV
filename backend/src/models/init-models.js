var DataTypes = require("sequelize").DataTypes;
var _criteria_master = require("./criteria_master");
var _file_uploads = require("./file_uploads");
var _hdr = require("./hdr");
var _iqac_supervision = require("./iqac_supervision");
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
var _response_2_2_2 = require("./response_2_2_2");
var _response_2_3_3 = require("./response_2_3_3");
var _response_2_4_1 = require("./response_2_4_1");
var _response_2_4_2 = require("./response_2_4_2");
var _response_2_4_3 = require("./response_2_4_3");
var _response_2_6_3 = require("./response_2_6_3");
var _response_2_7_1 = require("./response_2_7_1");
var _response_3_1_3 = require("./response_3_1_3");
var _response_3_2_1 = require("./response_3_2_1");
var _response_3_2_2 = require("./response_3_2_2");
var _response_3_3_2 = require("./response_3_3_2");
var _response_3_3_3 = require("./response_3_3_3");
var _response_3_4_1 = require("./response_3_4_1");
var _response_3_4_2 = require("./response_3_4_2");
var _response_4_1_3 = require("./response_4_1_3");
var _response_4_2_2 = require("./response_4_2_2");
var _response_4_2_3 = require("./response_4_2_3");
var _response_4_2_4 = require("./response_4_2_4");
var _response_4_3_2 = require("./response_4_3_2");
var _response_4_4_1 = require("./response_4_4_1");
var _response_5_1_1 = require("./response_5_1_1");
var _response_5_1_2 = require("./response_5_1_2");
var _response_5_1_3 = require("./response_5_1_3");
var _response_5_1_4 = require("./response_5_1_4");
var _response_5_2_1 = require("./response_5_2_1");
var _response_5_2_2 = require("./response_5_2_2");
var _response_5_2_3 = require("./response_5_2_3");
var _response_5_3_1 = require("./response_5_3_1");
var _response_5_3_3 = require("./response_5_3_3");
var _response_6_2_3 = require("./response_6_2_3");
var _response_6_3_2 = require("./response_6_3_2");
var _response_6_3_3 = require("./response_6_3_3");
var _response_6_3_4 = require("./response_6_3_4");
var _response_6_4_2 = require("./response_6_4_2");
var _response_6_5_3 = require("./response_6_5_3");
var _response_7_1_10 = require("./response_7_1_10");
var _response_7_1_2 = require("./response_7_1_2");
var _response_7_1_4 = require("./response_7_1_4");
var _response_7_1_5 = require("./response_7_1_5");
var _response_7_1_6 = require("./response_7_1_6");
var _response_7_1_7 = require("./response_7_1_7");
var _scores = require("./scores");
var _users = require("./users");

function initModels(sequelize) {
  var criteria_master = _criteria_master(sequelize, DataTypes);
  var file_uploads = _file_uploads(sequelize, DataTypes);
  var hdr = _hdr(sequelize, DataTypes);
  var iqac_supervision = _iqac_supervision(sequelize, DataTypes);
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
  var response_2_2_2 = _response_2_2_2(sequelize, DataTypes);
  var response_2_3_3 = _response_2_3_3(sequelize, DataTypes);
  var response_2_4_1 = _response_2_4_1(sequelize, DataTypes);
  var response_2_4_2 = _response_2_4_2(sequelize, DataTypes);
  var response_2_4_3 = _response_2_4_3(sequelize, DataTypes);
  var response_2_6_3 = _response_2_6_3(sequelize, DataTypes);
  var response_2_7_1 = _response_2_7_1(sequelize, DataTypes);
  var response_3_1_3 = _response_3_1_3(sequelize, DataTypes);
  var response_3_2_1 = _response_3_2_1(sequelize, DataTypes);
  var response_3_2_2 = _response_3_2_2(sequelize, DataTypes);
  var response_3_3_2 = _response_3_3_2(sequelize, DataTypes);
  var response_3_3_3 = _response_3_3_3(sequelize, DataTypes);
  var response_3_4_1 = _response_3_4_1(sequelize, DataTypes);
  var response_3_4_2 = _response_3_4_2(sequelize, DataTypes);
  var response_4_1_3 = _response_4_1_3(sequelize, DataTypes);
  var response_4_2_2 = _response_4_2_2(sequelize, DataTypes);
  var response_4_2_3 = _response_4_2_3(sequelize, DataTypes);
  var response_4_2_4 = _response_4_2_4(sequelize, DataTypes);
  var response_4_3_2 = _response_4_3_2(sequelize, DataTypes);
  var response_4_4_1 = _response_4_4_1(sequelize, DataTypes);
  var response_5_1_1 = _response_5_1_1(sequelize, DataTypes);
  var response_5_1_2 = _response_5_1_2(sequelize, DataTypes);
  var response_5_1_3 = _response_5_1_3(sequelize, DataTypes);
  var response_5_1_4 = _response_5_1_4(sequelize, DataTypes);
  var response_5_2_1 = _response_5_2_1(sequelize, DataTypes);
  var response_5_2_2 = _response_5_2_2(sequelize, DataTypes);
  var response_5_2_3 = _response_5_2_3(sequelize, DataTypes);
  var response_5_3_1 = _response_5_3_1(sequelize, DataTypes);
  var response_5_3_3 = _response_5_3_3(sequelize, DataTypes);
  var response_6_2_3 = _response_6_2_3(sequelize, DataTypes);
  var response_6_3_2 = _response_6_3_2(sequelize, DataTypes);
  var response_6_3_3 = _response_6_3_3(sequelize, DataTypes);
  var response_6_3_4 = _response_6_3_4(sequelize, DataTypes);
  var response_6_4_2 = _response_6_4_2(sequelize, DataTypes);
  var response_6_5_3 = _response_6_5_3(sequelize, DataTypes);
  var response_7_1_10 = _response_7_1_10(sequelize, DataTypes);
  var response_7_1_2 = _response_7_1_2(sequelize, DataTypes);
  var response_7_1_4 = _response_7_1_4(sequelize, DataTypes);
  var response_7_1_5 = _response_7_1_5(sequelize, DataTypes);
  var response_7_1_6 = _response_7_1_6(sequelize, DataTypes);
  var response_7_1_7 = _response_7_1_7(sequelize, DataTypes);
  var scores = _scores(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

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
  response_2_2_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_2_2_2, { as: "response_2_2_2s", foreignKey: "criteria_code"});
  response_2_2_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_2_2_2, { as: "id_response_2_2_2s", foreignKey: "id"});
  response_2_3_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_2_3_3, { as: "response_2_3_3s", foreignKey: "criteria_code"});
  response_2_3_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_2_3_3, { as: "id_response_2_3_3s", foreignKey: "id"});
  response_2_4_1.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_2_4_1, { as: "response_2_4_1s", foreignKey: "criteria_code"});
  response_2_4_1.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_2_4_1, { as: "id_response_2_4_1s", foreignKey: "id"});
  response_2_4_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_2_4_2, { as: "response_2_4_2s", foreignKey: "criteria_code"});
  response_2_4_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_2_4_2, { as: "id_response_2_4_2s", foreignKey: "id"});
  response_2_4_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_2_4_3, { as: "response_2_4_3s", foreignKey: "criteria_code"});
  response_2_4_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_2_4_3, { as: "id_response_2_4_3s", foreignKey: "id"});
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
  response_4_1_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_4_1_3, { as: "response_4_1_3s", foreignKey: "criteria_code"});
  response_4_1_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_4_1_3, { as: "id_response_4_1_3s", foreignKey: "id"});
  response_4_2_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_4_2_2, { as: "response_4_2_2s", foreignKey: "criteria_code"});
  response_4_2_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_4_2_2, { as: "id_response_4_2_2s", foreignKey: "id"});
  response_4_2_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_4_2_3, { as: "response_4_2_3s", foreignKey: "criteria_code"});
  response_4_2_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_4_2_3, { as: "id_response_4_2_3s", foreignKey: "id"});
  response_4_2_4.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_4_2_4, { as: "response_4_2_4s", foreignKey: "criteria_code"});
  response_4_2_4.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_4_2_4, { as: "id_response_4_2_4s", foreignKey: "id"});
  response_4_3_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_4_3_2, { as: "response_4_3_2s", foreignKey: "criteria_code"});
  response_4_3_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_4_3_2, { as: "id_response_4_3_2s", foreignKey: "id"});
  response_4_4_1.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_4_4_1, { as: "response_4_4_1s", foreignKey: "criteria_code"});
  response_4_4_1.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_4_4_1, { as: "id_response_4_4_1s", foreignKey: "id"});
  response_5_1_1.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_1_1, { as: "response_5_1_1s", foreignKey: "criteria_code"});
  response_5_1_1.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_1_1, { as: "id_response_5_1_1s", foreignKey: "id"});
  response_5_1_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_1_2, { as: "response_5_1_2s", foreignKey: "criteria_code"});
  response_5_1_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_1_2, { as: "id_response_5_1_2s", foreignKey: "id"});
  response_5_1_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_1_3, { as: "response_5_1_3s", foreignKey: "criteria_code"});
  response_5_1_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_1_3, { as: "id_response_5_1_3s", foreignKey: "id"});
  response_5_1_4.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_1_4, { as: "response_5_1_4s", foreignKey: "criteria_code"});
  response_5_1_4.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_1_4, { as: "id_response_5_1_4s", foreignKey: "id"});
  response_5_2_1.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_2_1, { as: "response_5_2_1s", foreignKey: "criteria_code"});
  response_5_2_1.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_2_1, { as: "id_response_5_2_1s", foreignKey: "id"});
  response_5_2_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_2_2, { as: "response_5_2_2s", foreignKey: "criteria_code"});
  response_5_2_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_2_2, { as: "id_response_5_2_2s", foreignKey: "id"});
  response_5_2_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_2_3, { as: "response_5_2_3s", foreignKey: "criteria_code"});
  response_5_2_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_2_3, { as: "id_response_5_2_3s", foreignKey: "id"});
  response_5_3_1.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_3_1, { as: "response_5_3_1s", foreignKey: "criteria_code"});
  response_5_3_1.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_3_1, { as: "id_response_5_3_1s", foreignKey: "id"});
  response_5_3_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_5_3_3, { as: "response_5_3_3s", foreignKey: "criteria_code"});
  response_5_3_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_5_3_3, { as: "id_response_5_3_3s", foreignKey: "id"});
  response_6_2_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_6_2_3, { as: "response_6_2_3s", foreignKey: "criteria_code"});
  response_6_2_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_6_2_3, { as: "id_response_6_2_3s", foreignKey: "id"});
  response_6_3_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_6_3_2, { as: "response_6_3_2s", foreignKey: "criteria_code"});
  response_6_3_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_6_3_2, { as: "id_response_6_3_2s", foreignKey: "id"});
  response_6_3_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_6_3_3, { as: "response_6_3_3s", foreignKey: "criteria_code"});
  response_6_3_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_6_3_3, { as: "id_response_6_3_3s", foreignKey: "id"});
  response_6_3_4.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_6_3_4, { as: "response_6_3_4s", foreignKey: "criteria_code"});
  response_6_3_4.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_6_3_4, { as: "id_response_6_3_4s", foreignKey: "id"});
  response_6_4_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_6_4_2, { as: "response_6_4_2s", foreignKey: "criteria_code"});
  response_6_4_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_6_4_2, { as: "id_response_6_4_2s", foreignKey: "id"});
  response_6_5_3.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_6_5_3, { as: "response_6_5_3s", foreignKey: "criteria_code"});
  response_6_5_3.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_6_5_3, { as: "id_response_6_5_3s", foreignKey: "id"});
  response_7_1_10.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_7_1_10, { as: "response_7_1_10s", foreignKey: "criteria_code"});
  response_7_1_10.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_7_1_10, { as: "id_response_7_1_10s", foreignKey: "id"});
  response_7_1_2.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_7_1_2, { as: "response_7_1_2s", foreignKey: "criteria_code"});
  response_7_1_2.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_7_1_2, { as: "id_response_7_1_2s", foreignKey: "id"});
  response_7_1_4.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_7_1_4, { as: "response_7_1_4s", foreignKey: "criteria_code"});
  response_7_1_4.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_7_1_4, { as: "id_response_7_1_4s", foreignKey: "id"});
  response_7_1_5.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_7_1_5, { as: "response_7_1_5s", foreignKey: "criteria_code"});
  response_7_1_5.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_7_1_5, { as: "id_response_7_1_5s", foreignKey: "id"});
  response_7_1_6.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_7_1_6, { as: "response_7_1_6s", foreignKey: "criteria_code"});
  response_7_1_6.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_7_1_6, { as: "id_response_7_1_6s", foreignKey: "id"});
  response_7_1_7.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(response_7_1_7, { as: "response_7_1_7s", foreignKey: "criteria_code"});
  response_7_1_7.belongsTo(criteria_master, { as: "id_criteria_master", foreignKey: "id"});
  criteria_master.hasMany(response_7_1_7, { as: "id_response_7_1_7s", foreignKey: "id"});
  scores.belongsTo(criteria_master, { as: "criteria_code_criteria_master", foreignKey: "criteria_code"});
  criteria_master.hasMany(scores, { as: "scores", foreignKey: "criteria_code"});

  return {
    criteria_master,
    file_uploads,
    hdr,
    iqac_supervision,
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
    response_2_2_2,
    response_2_3_3,
    response_2_4_1,
    response_2_4_2,
    response_2_4_3,
    response_2_6_3,
    response_2_7_1,
    response_3_1_3,
    response_3_2_1,
    response_3_2_2,
    response_3_3_2,
    response_3_3_3,
    response_3_4_1,
    response_3_4_2,
    response_4_1_3,
    response_4_2_2,
    response_4_2_3,
    response_4_2_4,
    response_4_3_2,
    response_4_4_1,
    response_5_1_1,
    response_5_1_2,
    response_5_1_3,
    response_5_1_4,
    response_5_2_1,
    response_5_2_2,
    response_5_2_3,
    response_5_3_1,
    response_5_3_3,
    response_6_2_3,
    response_6_3_2,
    response_6_3_3,
    response_6_3_4,
    response_6_4_2,
    response_6_5_3,
    response_7_1_10,
    response_7_1_2,
    response_7_1_4,
    response_7_1_5,
    response_7_1_6,
    response_7_1_7,
    scores,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
