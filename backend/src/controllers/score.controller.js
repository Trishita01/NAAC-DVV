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


//score2.1
const score21 = asyncHandler(async (req, res) => {
    const session = new Date().getFullYear();
    const criteria_code = convertToPaddedFormat("2.1");
    console.log(criteria_code);
    const criteria = await CriteriaMaster.findOne({
      where: { sub_criterion_id: criteria_code }
    });
    console.log(criteria);
    if (!criteria) {
      throw new apiError(404, "Criteria not found");
    }
    const score = await Score.findAll({
      attributes: ['score_sub_sub_criteria', 'sub_sub_criteria_code'],
      where: {
        criteria_code: criteria.criteria_code,
        session,
        sub_sub_criteria_code: {
          [Sequelize.Op.in]: [convertToPaddedFormat("2.1.1"), convertToPaddedFormat("2.1.2")]
        }
      }
    });

    // Create key-value pairs for the sub_sub_criteria_grade
    const subSubCriteriaGrades = {};
    score.forEach(item => {
      subSubCriteriaGrades[item.sub_sub_criteria_code] = item.score_sub_sub_criteria;
    });

    // Now you can access grades like this:
    // const grade211 = subSubCriteriaGrades[convertToPaddedFormat("2.1.1")];
    // const grade212 = subSubCriteriaGrades[convertToPaddedFormat("2.1.2")];
    
    console.log('Sub Sub Criteria Grades:', subSubCriteriaGrades);
    
    const values = Object.values(subSubCriteriaGrades); // [80, 70, 90, 60]
    console.log(values);
    console.log(typeof values);

    const sum = values.reduce((total, value) => total + value, 0);
    const average = sum / values.length;

    sub_score= average*40;

    console.log("Average:", average);
    console.log("sub_score:", sub_score);
    let [entry, created] = await Score.findOrCreate({
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
        score_sub_criteria: sub_score,
        score_sub_sub_criteria: criteria.score_sub_sub_criteria,
        sub_sub_cr_grade: criteria.sub_sub_cr_grade,
        session
      }
    });
  
    if (!created) {
      await Score.update({
        score_sub_criteria: sub_score,
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

//score2.2
const score22 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("2.2");
  console.log(criteria_code);
  const criteria = await CriteriaMaster.findOne({
    where: { sub_criterion_id: criteria_code }
  });
  console.log(criteria);
  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }
  const score = await Score.findAll({
    attributes: ['score_sub_sub_criteria', 'sub_sub_criteria_code'],
    where: {
      criteria_code: criteria.criteria_code,
      session,
      sub_sub_criteria_code: {
        [Sequelize.Op.in]: [convertToPaddedFormat("2.2.2")]
      }
    }
  });

  // Create key-value pairs for the sub_sub_criteria_grade
  const subSubCriteriaGrades = {};
  score.forEach(item => {
    subSubCriteriaGrades[item.sub_sub_criteria_code] = item.score_sub_sub_criteria;
  });

  // Now you can access grades like this:
  // const grade211 = subSubCriteriaGrades[convertToPaddedFormat("2.1.1")];
  // const grade222 = subSubCriteriaGrades[convertToPaddedFormat("2.2.2")];
  
  console.log('Sub Sub Criteria Grades:', subSubCriteriaGrades);
  
  const values = Object.values(subSubCriteriaGrades); // [80, 70, 90, 60]
  console.log(values);
  console.log(typeof values);

  const sum = values.reduce((total, value) => total + value, 0);
  const average = sum / values.length;

  sub_score= average*20;

  console.log("Average:", average);
  console.log("sub_score:", sub_score);
  let [entry, created] = await Score.findOrCreate({
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
      score_sub_criteria: sub_score,
      score_sub_sub_criteria: criteria.score_sub_sub_criteria,
      sub_sub_cr_grade: criteria.sub_sub_cr_grade,
      session
    }
  });

  if (!created) {
    await Score.update({
      score_sub_criteria: sub_score,
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

//score2.3
const score23 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("2.3");
  console.log(criteria_code);
  const criteria = await CriteriaMaster.findOne({
    where: { sub_criterion_id: criteria_code }
  });
  console.log(criteria);
  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }
  const score = await Score.findAll({
    attributes: ['score_sub_sub_criteria', 'sub_sub_criteria_code'],
    where: {
      criteria_code: criteria.criteria_code,
      session,
      sub_sub_criteria_code: {
        [Sequelize.Op.in]: [convertToPaddedFormat("2.3.3")]
      }
    }
  });

  // Create key-value pairs for the sub_sub_criteria_grade
  const subSubCriteriaGrades = {};
  score.forEach(item => {
    subSubCriteriaGrades[item.sub_sub_criteria_code] = item.score_sub_sub_criteria;
  });

  // Now you can access grades like this:
  // const grade211 = subSubCriteriaGrades[convertToPaddedFormat("2.1.1")];
  // const grade222 = subSubCriteriaGrades[convertToPaddedFormat("2.2.2")];
  
  console.log('Sub Sub Criteria Grades:', subSubCriteriaGrades);
  
  const values = Object.values(subSubCriteriaGrades); // [80, 70, 90, 60]
  console.log(values);
  console.log(typeof values);

  const sum = values.reduce((total, value) => total + value, 0);
  const average = sum / values.length;

  sub_score= average*15;

  console.log("Average:", average);
  console.log("sub_score:", sub_score);
  let [entry, created] = await Score.findOrCreate({
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
      score_sub_criteria: sub_score,
      score_sub_sub_criteria: criteria.score_sub_sub_criteria,
      sub_sub_cr_grade: criteria.sub_sub_cr_grade,
      session
    }
  });

  if (!created) {
    await Score.update({
      score_sub_criteria: sub_score,
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

//score2.4
const score24 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("2.4");
  console.log(criteria_code);
  const criteria = await CriteriaMaster.findOne({
    where: { sub_criterion_id: criteria_code }
  });
  console.log(criteria);
  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }
  const score = await Score.findAll({
    attributes: ['score_sub_sub_criteria', 'sub_sub_criteria_code'],
    where: {
      criteria_code: criteria.criteria_code,
      session,
      sub_sub_criteria_code: {
        [Sequelize.Op.in]: [convertToPaddedFormat("2.4.1"), convertToPaddedFormat("2.4.2"), convertToPaddedFormat("2.4.3")]
      }
    }
  });

  // Create key-value pairs for the sub_sub_criteria_grade
  const subSubCriteriaGrades = {};
  score.forEach(item => {
    subSubCriteriaGrades[item.sub_sub_criteria_code] = item.score_sub_sub_criteria;
  });

  // Now you can access grades like this:
  // const grade211 = subSubCriteriaGrades[convertToPaddedFormat("2.1.1")];
  // const grade212 = subSubCriteriaGrades[convertToPaddedFormat("2.1.2")];
  
  console.log('Sub Sub Criteria Grades:', subSubCriteriaGrades);
  
  const values = Object.values(subSubCriteriaGrades); // [80, 70, 90, 60]
  console.log(values);
  console.log(typeof values);

  const sum = values.reduce((total, value) => total + value, 0);
  const average = sum / values.length;

  sub_score= average*60;

  console.log("Average:", average);
  console.log("sub_score:", sub_score);
  let [entry, created] = await Score.findOrCreate({
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
      score_sub_criteria: sub_score,
      score_sub_sub_criteria: criteria.score_sub_sub_criteria,
      sub_sub_cr_grade: criteria.sub_sub_cr_grade,
      session
    }
  });

  if (!created) {
    await Score.update({
      score_sub_criteria: sub_score,
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

//score2.6
const score26 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("2.6");
  console.log(criteria_code);
  const criteria = await CriteriaMaster.findOne({
    where: { sub_criterion_id: criteria_code }
  });
  console.log(criteria);
  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }
  const score = await Score.findAll({
    attributes: ['score_sub_sub_criteria', 'sub_sub_criteria_code'],
    where: {
      criteria_code: criteria.criteria_code,
      session,
      sub_sub_criteria_code: {
        [Sequelize.Op.in]: [convertToPaddedFormat("2.2.2")]
      }
    }
  });

  // Create key-value pairs for the sub_sub_criteria_grade
  const subSubCriteriaGrades = {};
  score.forEach(item => {
    subSubCriteriaGrades[item.sub_sub_criteria_code] = item.score_sub_sub_criteria;
  });

  // Now you can access grades like this:
  // const grade211 = subSubCriteriaGrades[convertToPaddedFormat("2.1.1")];
  // const grade222 = subSubCriteriaGrades[convertToPaddedFormat("2.2.2")];
  
  console.log('Sub Sub Criteria Grades:', subSubCriteriaGrades);
  
  const values = Object.values(subSubCriteriaGrades); // [80, 70, 90, 60]
  console.log(values);
  console.log(typeof values);

  const sum = values.reduce((total, value) => total + value, 0);
  const average = sum / values.length;

  sub_score= average*20;

  console.log("Average:", average);
  console.log("sub_score:", sub_score);
  let [entry, created] = await Score.findOrCreate({
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
      score_sub_criteria: sub_score,
      score_sub_sub_criteria: criteria.score_sub_sub_criteria,
      sub_sub_cr_grade: criteria.sub_sub_cr_grade,
      session
    }
  });

  if (!created) {
    await Score.update({
      score_sub_criteria: sub_score,
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

//score2

export { score21, score22, score23, score24, score26 };
