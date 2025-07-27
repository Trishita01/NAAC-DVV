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
  

  
// (if > 80) = 4, (if 60-80)= 3, (if 40-60) =2 , (if 30-40)= 1, if(<30 )= 0
 // grade calculation

 
   // if (score >= 80) return 4;
    //if (score >= 60) return 3;
    //if (score >= 40) return 2;
    //if (score >= 30) return 1;
    //return 0;

});

export { grade211 };
