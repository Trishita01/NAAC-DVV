import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import Sequelize from "sequelize";
import CriteriaMaster from "../models/criteria_master.js";

// Helper function to convert criteria code to padded format
const convertToPaddedFormat = (code) => {
    // First remove any dots, then split into individual characters
    const parts = code.replace(/\./g, '').split('');
    // Pad each part to 2 digits and join
    return parts.map(part => part.padStart(2, '0')).join('');
  };
  
// import Score from "../models/scores.js";

const Score = db.scores;

//grade211
const grade211 = asyncHandler(async (req, res) => {
   
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("2.1.1");
  
  const criteria = await CriteriaMaster.findOne({
    where: { sub_sub_criterion_id: criteria_code }
  });
  
  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }
  const score = await Score.findAll({
    attributes: ['score_sub_sub_criteria'],
    where: {
      criteria_code: criteria.criteria_code,
      session
    }
  });
  console.log(score); 
//(if > 80) = 4, (if 60-80)= 3, (if 40-60) =2 , (if 30-40)= 1, if(<30 )= 0
 //grade calculation

    if (score >= 80) return 4;
    if (score >= 60) return 3;
    if (score >= 40) return 2;
    if (score >= 30) return 1;
    return 0;

    let [entry, created] = await score.findOrCreate({
      where: {
        criteria_code: criteria.criteria_code,
        session
      },
      defaults: {
        criteria_code: criteria.criteria_code,
        criteria_id: criteria.criterion_id,
        sub_criteria_id: criteria.sub_criterion_id,
        sub_sub_criteria_id: criteria.sub_sub_criterion_id,
        score_criteria: 0,
        score_sub_criteria: 0,
        score_sub_sub_criteria: criteria.score_sub_sub_criteria,
        grade_sub_sub_criteria: grade,
        session
      }
    });
  
    if (!created) {
      await Score.update({
        grade_sub_sub_criteria: grade,
        session
      }, {
        where: {
          criteria_code: criteria.criteria_code,
          session
        }
      });
  
      entry = await Score.findOne({
        where: {
          criteria_code: criteria.criteria_code,
          session
        }
      });
    }
  
    return res.status(200).json(
      new apiResponse(200, entry, created ? "Score created successfully" : "Score updated successfully")
    );
});

//grade212
const grade212 = asyncHandler(async (req, res) => {
   
    const session = new Date().getFullYear();
    const criteria_code = convertToPaddedFormat("2.1.2");
    
    const criteria = await CriteriaMaster.findOne({
      where: { sub_sub_criterion_id: criteria_code }
    });
    
    if (!criteria) {
      throw new apiError(404, "Criteria not found");
    }
    const score = await Score.findAll({
      attributes: ['score_sub_sub_criteria'],
      where: {
        criteria_code: criteria.criteria_code,
        session
      }
    });
    console.log(score); 
  //(if > 80) = 4, (if 60-80)= 3, (if 40-60) =2 , (if 30-40)= 1, if(<30 )= 0
   //grade calculation
  
      if (score >= 80) return 4;
      if (score >= 60) return 3;
      if (score >= 40) return 2;
      if (score >= 30) return 1;
      return 0;
  });

//grade222
const grade222 = asyncHandler(async (req, res) => {
   
    const session = new Date().getFullYear();
    const criteria_code = convertToPaddedFormat("2.2.2");
    
    const criteria = await CriteriaMaster.findOne({
      where: { sub_sub_criterion_id: criteria_code }
    });
    
    if (!criteria) {
      throw new apiError(404, "Criteria not found");
    }
    const score = await Score.findAll({
      attributes: ['score_sub_sub_criteria'],
      where: {
        criteria_code: criteria.criteria_code,
        session
      }
    });
    console.log(score); 
  //(if <= 20) = 4, (if <= 30)= 3, (if <= 40) =2 , (if <= 50)= 1, if(<60 )= 0
   //grade calculation
  
      if (score <= 20) return 4;
      if (score <= 30) return 3;
      if (score <= 40) return 2;
      if (score <= 50) return 1;
      else return 0;
  });

//grade233
const grade233 = asyncHandler(async (req, res) => {
   
    const session = new Date().getFullYear();
    const criteria_code = convertToPaddedFormat("2.3.3");
    
    const criteria = await CriteriaMaster.findOne({
      where: { sub_sub_criterion_id: criteria_code }
    });
    
    if (!criteria) {
      throw new apiError(404, "Criteria not found");
    }
    const score = await Score.findAll({
      attributes: ['score_sub_sub_criteria'],
      where: {
        criteria_code: criteria.criteria_code,
        session
      }
    });
    console.log(score); 
  //(if <= 20) = 4, (if <= 30)= 3, (if <= 40) =2 , (if <= 50)= 1, if(<60 )= 0
   //grade calculation
  
   if (score <= 20) return 4;
   if (score <= 30) return 3;
   if (score <= 40) return 2;
   if (score <= 50) return 1;
   else return 0;
  });

//grade241
const grade241 = asyncHandler(async (req, res) => {
   
    const session = new Date().getFullYear();
    const criteria_code = convertToPaddedFormat("2.4.1");
    
    const criteria = await CriteriaMaster.findOne({
      where: { sub_sub_criterion_id: criteria_code }
    });
    
    if (!criteria) {
      throw new apiError(404, "Criteria not found");
    }
    const score = await Score.findAll({
      attributes: ['score_sub_sub_criteria'],
      where: {
        criteria_code: criteria.criteria_code,
        session
      }
    });
    console.log(score); 
  //(if <= 20) = 4, (if <= 30)= 3, (if <= 40) =2 , (if <= 50)= 1, if(<60 )= 0
   //grade calculation
  
   if (score >= 75) return 4;
   if (score >= 65) return 3;
   if (score >= 50) return 2;
   if (score >= 40) return 1;
   else return 0;
  });

//grade242
const grade242 = asyncHandler(async (req, res) => {
   
    const session = new Date().getFullYear();
    const criteria_code = convertToPaddedFormat("2.4.2");
    
    const criteria = await CriteriaMaster.findOne({
      where: { sub_sub_criterion_id: criteria_code }
    });
    
    if (!criteria) {
      throw new apiError(404, "Criteria not found");
    }
    const score = await Score.findAll({
      attributes: ['score_sub_sub_criteria'],
      where: {
        criteria_code: criteria.criteria_code,
        session
      }
    });
    console.log(score); 
  //(if <= 20) = 4, (if <= 30)= 3, (if <= 40) =2 , (if <= 50)= 1, if(<60 )= 0
   //grade calculation
  
   if (score >= 75) return 4;
   if (score >= 60) return 3;
   if (score >= 50) return 2;
   if (score >= 30) return 1;
   else return 0;
  });

//grade243
const grade243 = asyncHandler(async (req, res) => {
   
    const session = new Date().getFullYear();
    const criteria_code = convertToPaddedFormat("2.4.3");
    
    const criteria = await CriteriaMaster.findOne({
      where: { sub_sub_criterion_id: criteria_code }
    });
    
    if (!criteria) {
      throw new apiError(404, "Criteria not found");
    }
    const score = await Score.findAll({
      attributes: ['score_sub_sub_criteria'],
      where: {
        criteria_code: criteria.criteria_code,
        session
      }
    });
    console.log(score); 
  //(if <= 20) = 4, (if <= 30)= 3, (if <= 40) =2 , (if <= 50)= 1, if(<60 )= 0
   //grade calculation
  
   if (score >= 15) return 4;
   if (score >= 12) return 3;
   if (score >= 9) return 2;
   if (score >= 6) return 1;
   else return 0;
  });

//grade263
const grade263 = asyncHandler(async (req, res) => {
   
    const session = new Date().getFullYear();
    const criteria_code = convertToPaddedFormat("2.6.3");
    
    const criteria = await CriteriaMaster.findOne({
      where: { sub_sub_criterion_id: criteria_code }
    });
    
    if (!criteria) {
      throw new apiError(404, "Criteria not found");
    }
    const score = await Score.findAll({
      attributes: ['score_sub_sub_criteria'],
      where: {
        criteria_code: criteria.criteria_code,
        session
      }
    });
    console.log(score); 
  //(if <= 20) = 4, (if <= 30)= 3, (if <= 40) =2 , (if <= 50)= 1, if(<60 )= 0
   //grade calculation
  
   if (score >= 90) return 4;
   if (score >= 80) return 3;
   if (score >= 70) return 2;
   if (score >= 60) return 1;
   else return 0;
  });

//score2.15

export { grade211, grade212,grade222,grade233,grade241,grade242,grade243,grade263 };
