import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import Sequelize from "sequelize";

// Helper function to convert criteria code to padded format
const convertToPaddedFormat = (code) => {
    // First remove any dots, then split into individual characters
    const parts = code.replace(/\./g, '').split('');
    // Pad each part to 2 digits and join
    return parts.map(part => part.padStart(2, '0')).join('');
  };
  
// import Score from "../models/scores.js";

const Score = db.scores;
const CriteriaMaster = db.criteria_master;

//score2.1
const score21 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("2.1");

  // Get 2.1.1 and 2.1.2 criteria
  const criteria = await CriteriaMaster.findAll({
    where: {
      sub_sub_criterion_id: {
        [Sequelize.Op.in]: [
          convertToPaddedFormat("2.1.1"),
          convertToPaddedFormat("2.1.2")
        ]
      }
    }
  });

  if (!criteria || criteria.length === 0) {
    throw new apiError(404, "Criteria not found");
  }

  const criteriaCodes = criteria.map(c => c.criteria_code);
  const subSubCriteriaIds = criteria.map(c => c.sub_sub_criterion_id);

  // Fetch existing score rows
  const existingScores = await Score.findAll({
    attributes: ['sub_sub_cr_grade', 'sub_sub_criteria_id', 'criteria_code', 'score_sub_sub_criteria'],
    where: {
      criteria_code: { [Sequelize.Op.in]: criteriaCodes },
      session,
      sub_sub_criteria_id: { [Sequelize.Op.in]: subSubCriteriaIds }
    }
  });

  // Calculate grades average
  const grades = existingScores.map(s => parseFloat(s.sub_sub_cr_grade) || 0);
  const sum = grades.reduce((total, value) => total + value, 0);
  const average = grades.length ? sum / grades.length : 0;
  console.log("Average:", average);
  const sub_score = average * 40;
  console.log("sub_score:", sub_score);

  // Ensure all Score rows exist, then update them
  for (const criterion of criteria) {
    if (criterion.sub_criteria_id !== '0201') continue;

    await Score.findOrCreate({
      where: {
        criteria_code: criterion.criteria_code,
        session,
        sub_sub_criteria_id: criterion.sub_sub_criterion_id
      },
      defaults: {
        criteria_code: criterion.criteria_code,
        criteria_id: criterion.criterion_id,
        sub_criteria_id: criterion.sub_criteria_id,
        sub_sub_criteria_id: criterion.sub_sub_criterion_id,
        score_criteria: 0,
        score_sub_criteria: 0,
        score_sub_sub_criteria: 0,
        sub_sub_cr_grade: 0,
        session
      }
    });
  }

  // Update all entries under sub_criteria_id = '0201'
  await Score.update(
    { score_sub_criteria: sub_score },
    {
      where: {
        session,
        sub_criteria_id: '0201',
        sub_sub_criteria_id: { [Sequelize.Op.in]: subSubCriteriaIds }
      }
    }
  );

  // Fetch and return both 2.1.1 and 2.1.2 rows (after update)
  const finalScores = await Score.findAll({
    where: {
      session,
      sub_sub_criteria_id: {
        [Sequelize.Op.in]: subSubCriteriaIds
      }
    }
  });

  return res.status(200).json(
    new apiResponse(200, finalScores, "Score sub_criteria updated for 2.1")
  );
});

//score2.4
const score24 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const subCriteriaId = convertToPaddedFormat("2.4"); // '0204'

  // Get all sub-sub-criteria under 2.4 (020401, 020402, 020403)
  const criteria = await CriteriaMaster.findAll({
    where: {
      sub_criterion_id: subCriteriaId
    }
  });

  if (!criteria || criteria.length === 0) {
    throw new apiError(404, "Sub-criteria 2.4 not found");
  }

  const criteriaCodes = criteria.map(c => c.criteria_code);
  const subSubCriteriaIds = criteria.map(c => c.sub_sub_criterion_id);

  // Fetch all scores of sub-sub-criteria under 2.4
  const scoreEntries = await Score.findAll({
    attributes: ['score_sub_sub_criteria', 'sub_sub_cr_grade', 'sub_sub_criteria_id', 'criteria_code'],
    where: {
      criteria_code: { [Sequelize.Op.in]: criteriaCodes },
      session,
      sub_sub_criteria_id: { [Sequelize.Op.in]: subSubCriteriaIds }
    }
  });

  // Compute average and weighted sub_score
  const values = scoreEntries.map(s => parseFloat(s.sub_sub_cr_grade) || 0);
  const average = values.length 
  ? values.reduce((sum, val) => sum + val, 0) / Number(values.length) 
  : 0.0;
  const sub_score = average * 60;

  console.log("Average:", average);
  console.log("Sub-criteria score for 2.4:", sub_score);

  // Ensure all Score rows exist (for each sub-sub-criterion)
  for (const criterion of criteria) {
    await Score.findOrCreate({
      where: {
        criteria_code: criterion.criteria_code,
        session,
        sub_sub_criteria_id: criterion.sub_sub_criterion_id
      },
      defaults: {
        criteria_code: criterion.criteria_code,
        criteria_id: criterion.criterion_id,
        sub_criteria_id: criterion.sub_criteria_id,
        sub_sub_criteria_id: criterion.sub_sub_criterion_id,
        score_criteria: 0,
        score_sub_criteria: sub_score,
        score_sub_sub_criteria: 0,
        sub_sub_cr_grade: 0,
        session
      }
    });
  }

  // Update sub_criteria score in all sub-sub rows for sub_criteria 2.4
  await Score.update(
    { score_sub_criteria: sub_score },
    {
      where: {
        session,
        sub_criteria_id: subCriteriaId,
        sub_sub_criteria_id: { [Sequelize.Op.in]: subSubCriteriaIds }
      }
    }
  );

  // Fetch updated rows and return
  const updatedScores = await Score.findAll({
    where: {
      session,
      sub_sub_criteria_id: { [Sequelize.Op.in]: subSubCriteriaIds }
    }
  });

  return res.status(200).json(
    new apiResponse(200, updatedScores, "Score sub_criteria updated for 2.4")
  );
});

//score2.3
const score23 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("2.3");

  const criteria = await CriteriaMaster.findAll({
    where: {
      sub_sub_criterion_id: {
        [Sequelize.Op.in]: [convertToPaddedFormat("2.3.3")]
      }
    }
  });

  if (!criteria || criteria.length === 0) {
    throw new apiError(404, "Criteria not found");
  }

  const criteriaCodes = criteria.map(c => c.criteria_code);
  const subSubCriteriaIds = criteria.map(c => c.sub_sub_criterion_id);

  const scores = await Score.findAll({
    attributes: ['score_sub_sub_criteria', 'sub_sub_criteria_id', 'sub_sub_cr_grade'],
    where: {
      session,
      criteria_code: { [Sequelize.Op.in]: criteriaCodes },
      sub_sub_criteria_id: { [Sequelize.Op.in]: subSubCriteriaIds }
    }
  });

  const values = scores.map(s => parseFloat(s.sub_sub_cr_grade) || 0);
  const average = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const sub_score = average * 15;

  console.log("Average:", average);
  console.log("sub_score:", sub_score);

  // Ensure all Score entries exist
  for (const criterion of criteria) {
    if (criterion.sub_criteria_id !== '0203') continue;

    await Score.findOrCreate({
      where: {
        criteria_code: criterion.criteria_code,
        session,
        sub_sub_criteria_id: criterion.sub_sub_criterion_id
      },
      defaults: {
        criteria_code: criterion.criteria_code,
        criteria_id: criterion.criterion_id,
        sub_criteria_id: criterion.sub_criteria_id,
        sub_sub_criteria_id: criterion.sub_sub_criterion_id,
        score_criteria: 0,
        score_sub_criteria: 0,
        score_sub_sub_criteria: 0,
        sub_sub_cr_grade: 0,
        session
      }
    });
  }

  // Bulk update for all under 2.3.3
  await Score.update(
    { score_sub_criteria: sub_score },
    {
      where: {
        session,
        sub_criteria_id: '0203',
        sub_sub_criteria_id: { [Sequelize.Op.in]: subSubCriteriaIds }
      }
    }
  );

  const finalScores = await Score.findAll({
    where: {
      session,
      sub_sub_criteria_id: {
        [Sequelize.Op.in]: subSubCriteriaIds
      }
    }
  });

  return res.status(200).json(
    new apiResponse(200, finalScores, "Score sub_criteria updated for 2.3")
  );
});




//score2.2
const score22 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("2.2");

  const criteria = await CriteriaMaster.findAll({
    where: {
      sub_sub_criterion_id: {
        [Sequelize.Op.in]: [convertToPaddedFormat("2.2.2")]
      }
    }
  });

  if (!criteria || criteria.length === 0) {
    throw new apiError(404, "Criteria not found");
  }

  const criteriaCodes = criteria.map(c => c.criteria_code);
  const subSubCriteriaIds = criteria.map(c => c.sub_sub_criterion_id);

  const scores = await Score.findAll({
    attributes: ['score_sub_sub_criteria', 'sub_sub_criteria_id', 'sub_sub_cr_grade'],
    where: {
      session,
      criteria_code: { [Sequelize.Op.in]: criteriaCodes },
      sub_sub_criteria_id: { [Sequelize.Op.in]: subSubCriteriaIds }
    }
  });

  const values = scores.map(s => parseFloat(s.sub_sub_cr_grade) || 0);
  const average = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const sub_score = average * 20;

  console.log("Average:", average);
  console.log("sub_score:", sub_score);

  // Ensure all Score entries exist
  for (const criterion of criteria) {
    if (criterion.sub_criteria_id !== '0202') continue;

    await Score.findOrCreate({
      where: {
        criteria_code: criterion.criteria_code,
        session,
        sub_sub_criteria_id: criterion.sub_sub_criterion_id
      },
      defaults: {
        criteria_code: criterion.criteria_code,
        criteria_id: criterion.criterion_id,
        sub_criteria_id: criterion.sub_criteria_id,
        sub_sub_criteria_id: criterion.sub_sub_criterion_id,
        score_criteria: 0,
        score_sub_criteria: 0,
        score_sub_sub_criteria: 0,
        sub_sub_cr_grade: 0,
        session
      }
    });
  }

  // Bulk update for all under 2.2.2
  await Score.update(
    { score_sub_criteria: sub_score },
    {
      where: {
        session,
        sub_criteria_id: '0202',
        sub_sub_criteria_id: { [Sequelize.Op.in]: subSubCriteriaIds }
      }
    }
  );

  const finalScores = await Score.findAll({
    where: {
      session,
      sub_sub_criteria_id: {
        [Sequelize.Op.in]: subSubCriteriaIds
      }
    }
  });

  return res.status(200).json(
    new apiResponse(200, finalScores, "Score sub_criteria updated for 2.2")
  );
});



//score2.6

const score26 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const subSubCriteriaId = convertToPaddedFormat("2.6.3"); // '020601030103'

  // Step 1: Fetch only 2.6.3 from CriteriaMaster
  const criteria = await CriteriaMaster.findAll({
    where: {
      sub_sub_criterion_id: subSubCriteriaId
    }
  });

  if (!criteria || criteria.length === 0) {
    throw new apiError(404, "Sub-sub-criteria 2.6.3 not found");
  }

  const criteriaCodes = criteria.map(c => c.criteria_code);

  // Step 2: Fetch Score entries for 2.6.3
  const scores = await Score.findAll({
    attributes: ['score_sub_sub_criteria', 'sub_sub_criteria_id', 'sub_sub_cr_grade'],
    where: {
      session,
      criteria_code: { [Sequelize.Op.in]: criteriaCodes },
      sub_sub_criteria_id: subSubCriteriaId
    }
  });

  // Step 3: Calculate average and sub_score
  const values = scores.map(s => parseFloat(s.sub_sub_cr_grade) || 0);
  const average = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const sub_score = average * 30;

  console.log("Average:", average);
  console.log("sub_score:", sub_score);

  // Step 4: Ensure Score row exists
  for (const criterion of criteria) {
    await Score.findOrCreate({
      where: {
        criteria_code: criterion.criteria_code,
        session,
        sub_sub_criteria_id: criterion.sub_sub_criterion_id
      },
      defaults: {
        criteria_code: criterion.criteria_code,
        criteria_id: criterion.criterion_id,
        sub_criteria_id: criterion.sub_criteria_id,
        sub_sub_criteria_id: criterion.sub_sub_criterion_id,
        score_criteria: 0,
        score_sub_criteria: 0,
        score_sub_sub_criteria: 0,
        sub_sub_cr_grade: 0,
        session
      }
    });
  }

  // Step 5: Update the score_sub_criteria for 2.6.3
  await Score.update(
    { score_sub_criteria: sub_score },
    {
      where: {
        session,
        sub_sub_criteria_id: subSubCriteriaId
      }
    }
  );

  // Step 6: Return updated score entry
  const finalScores = await Score.findAll({
    where: {
      session,
      sub_sub_criteria_id: subSubCriteriaId
    }
  });

  return res.status(200).json(
    new apiResponse(200, finalScores, "Score sub_criteria updated for 2.6.3")
  );
});



//score2
const score2 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear().toString();
  const criteria_id = "02";

  let scores = await Score.findAll({
    attributes: [
      'sub_criteria_id',
      'score_sub_criteria',
      'score_sub_sub_criteria',
      'sub_sub_criteria_id'
    ],
    where: {
      criteria_id: criteria_id,
      session: session,
      [Sequelize.Op.or]: [
        { score_sub_criteria: { [Sequelize.Op.gt]: 0 } },
        { score_sub_sub_criteria: { [Sequelize.Op.gt]: 0 } }
      ]
    },
    raw: true
  });

  // Fill missing sub_criteria_id using sub_sub_criteria_id from CriteriaMaster
  for (let i = 0; i < scores.length; i++) {
    if (!scores[i].sub_criteria_id && scores[i].sub_sub_criteria_id) {
      const criteriaMap = await CriteriaMaster.findOne({
        where: { sub_sub_criterion_id: scores[i].sub_sub_criteria_id },
        attributes: ['sub_criterion_id'],
        raw: true
      });
      if (criteriaMap) {
        scores[i].sub_criteria_id = criteriaMap.sub_criterion_id;
      }
    }
  }

  const subCriteriaScores = {};
  scores.forEach(score => {
    const subId = score.sub_criteria_id;
    if (subId) {
      const maxScore = Math.max(
        score.score_sub_criteria || 0,
        score.score_sub_sub_criteria || 0
      );
      if (!subCriteriaScores[subId] || subCriteriaScores[subId] < maxScore) {
        subCriteriaScores[subId] = maxScore;
      }
    }
  });

  const totalScore = Object.values(subCriteriaScores).reduce((sum, score) => sum + parseFloat(score), 0);
  const cri_score = totalScore / 225;

  const criteria = await CriteriaMaster.findOne({ where: { criterion_id: criteria_id } });
  if (!criteria) throw new apiError(404, "Criteria not found");

  // Update or create a placeholder row (this helps if you still want to keep one main entry)
const [entry, created] = await Score.findOrCreate({
  where: {
    criteria_id: criteria_id,
    session: session,
    sub_criteria_id: null,
    sub_sub_criteria_id: null
  },
  defaults: {
    criteria_code: criteria.criteria_code,
    criteria_id: criteria.criterion_id,
    sub_criteria_id: criteria.sub_criterion_id,
    sub_sub_criteria_id: criteria.sub_sub_criterion_id,
    score_criteria: cri_score,
    score_sub_criteria: 0,
    score_sub_sub_criteria: 0,
    session: session
  }
});

// ✅ Always update all rows with this criteria_id
await Score.update(
  { score_criteria: cri_score },
  {
    where: {
      criteria_id: criteria_id,
      session: session
    }
  }
);


  return res.status(200).json(
    new apiResponse(200, {
      score: cri_score,
      totalSubCriteriaScore: totalScore,
      subCriteriaScores: Object.entries(subCriteriaScores).map(([id, score]) => ({
        sub_criteria_id: id,
        score_sub_criteria: score
      }))
    }, created ? "Score created successfully" : "Score updated successfully")
  );
});


export { score21, score22, score23, score24, score26, score2 };
