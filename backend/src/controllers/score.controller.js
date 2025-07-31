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
const IIQA = db.iiqa_form;


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
  const weighted_cri_score = cri_score * 0.3;
  console.log("cri_score:", cri_score);
  console.log("weighted_cri_score:", weighted_cri_score);
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
    weighted_cr_score: weighted_cri_score,
    session: session
  }
});

// Always update all rows with this criteria_id
await Score.update(
  { score_criteria: cri_score,
    weighted_cr_score: weighted_cri_score,
   },
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
      weightedCRScore: weighted_cri_score,
      subCriteriaScores: Object.entries(subCriteriaScores).map(([id, score]) => ({
        sub_criteria_id: id,
        score_sub_criteria: score
      }))
    }, created ? "Score created successfully" : "Score updated successfully")
  );
});

//score1.1
const score11 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("1.1");

  const criteria = await CriteriaMaster.findAll({
    where: {
      sub_sub_criterion_id: {
        [Sequelize.Op.in]: [convertToPaddedFormat("1.1.3")]
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
  const sub_score = average * 5;

  console.log("Average:", average);
  console.log("sub_score:", sub_score);

  // Ensure all Score entries exist
  for (const criterion of criteria) {
    if (criterion.sub_criteria_id !== '0101') continue;

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

  // Bulk update for all under 1.1.3
  await Score.update(
    { score_sub_criteria: sub_score },
    {
      where: {
        session,
        sub_criteria_id: '0101',
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
    new apiResponse(200, finalScores, "Score sub_criteria updated for 1.3")
  );
});

//score1.2
const score12 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("1.2");

  // Get 2.1.1 and 2.1.2 criteria
  const criteria = await CriteriaMaster.findAll({
    where: {
      sub_sub_criterion_id: {
        [Sequelize.Op.in]: [
          convertToPaddedFormat("1.2.1"),
          convertToPaddedFormat("1.2.2"),
          convertToPaddedFormat("1.2.3") 
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
  const sub_score = average * 30;
  console.log("sub_score:", sub_score);

  // Ensure all Score rows exist, then update them
  for (const criterion of criteria) {
    if (criterion.sub_criteria_id !== '0102') continue;

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

  // Update all entries under sub_criteria_id = '0102'
  await Score.update(
    { score_sub_criteria: sub_score },
    {
      where: {
        session,
        sub_criteria_id: '0102',
        sub_sub_criteria_id: { [Sequelize.Op.in]: subSubCriteriaIds }
      }
    }
  );

  // Fetch and return 1.2.1 and 1.2.2 and 1.2.3 rows (after update)
  const finalScores = await Score.findAll({
    where: {
      session,
      sub_sub_criteria_id: {
        [Sequelize.Op.in]: subSubCriteriaIds
      }
    }
  });

  return res.status(200).json(
    new apiResponse(200, finalScores, "Score sub_criteria updated for 1.2")
  );
});

//score1.3
const score13 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("1.3");

  // Get 2.1.1 and 2.1.2 criteria
  const criteria = await CriteriaMaster.findAll({
    where: {
      sub_sub_criterion_id: {
        [Sequelize.Op.in]: [
          convertToPaddedFormat("1.3.2"),
          convertToPaddedFormat("1.3.3")
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
  const sub_score = average * 20;
  console.log("sub_score:", sub_score);

  // Ensure all Score rows exist, then update them
  for (const criterion of criteria) {
    if (criterion.sub_criteria_id !== '0103') continue;

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

  // Update all entries under sub_criteria_id = '0103'
  await Score.update(
    { score_sub_criteria: sub_score },
    {
      where: {
        session,
        sub_criteria_id: '0103',
        sub_sub_criteria_id: { [Sequelize.Op.in]: subSubCriteriaIds }
      }
    }
  );

  // Fetch and return 1.3.2 and 1.3.3 rows (after update)
  const finalScores = await Score.findAll({
    where: {
      session,
      sub_sub_criteria_id: {
        [Sequelize.Op.in]: subSubCriteriaIds
      }
    }
  });

  return res.status(200).json(
    new apiResponse(200, finalScores, "Score sub_criteria updated for 1.3")
  );
});

//score1.4
const score14 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("1.4");

  // Get 2.1.1 and 2.1.2 criteria
  const criteria = await CriteriaMaster.findAll({
    where: {
      sub_sub_criterion_id: {
        [Sequelize.Op.in]: [
          convertToPaddedFormat("1.4.1"),
          convertToPaddedFormat("1.4.2") 
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
  const sub_score = average * 20;
  console.log("sub_score:", sub_score);

  // Ensure all Score rows exist, then update them
  for (const criterion of criteria) {
    if (criterion.sub_criteria_id !== '0104') continue;

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

  // Update all entries under sub_criteria_id = '0104'
  await Score.update(
    { score_sub_criteria: sub_score },
    {
      where: {
        session,
        sub_criteria_id: '0104',
        sub_sub_criteria_id: { [Sequelize.Op.in]: subSubCriteriaIds }
      }
    }
  );

  // Fetch and return 1.4.1 and 1.4.2 rows (after update)
  const finalScores = await Score.findAll({
    where: {
      session,
      sub_sub_criteria_id: {
        [Sequelize.Op.in]: subSubCriteriaIds
      }
    }
  });

  return res.status(200).json(
    new apiResponse(200, finalScores, "Score sub_criteria updated for 1.4")
  );
});

//score1
const score1 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear().toString();
  const criteria_id = "01";

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
  const cri_score = totalScore / 75;
  const weighted_cri_score = cri_score * 0.1;

  const criteria = await CriteriaMaster.findOne({ where: { criterion_id: criteria_id } });
  if (!criteria) throw new apiError(404, "Criteria not found");
  const criteria2Weight = 30;
  const weightedScore = cri_score * (criteria2Weight/100);
  const weightedScoreWorkAround = weightedScore * 1000;

  // Update or create a placeholder row (this helps if you still want to keep one main entry)
const [entry, created] = await Score.findOrCreate({
  where: {
    criteria_id: criteria_id,
    session: session
  },
  defaults: {
    criteria_code: criteria.criteria_code,
    criteria_id: criteria.criterion_id,
    sub_criteria_id: criteria.sub_criterion_id,
    sub_sub_criteria_id: criteria.sub_sub_criterion_id,
    score_criteria: cri_score,
    weighted_cr_score: weighted_cri_score,
    score_sub_criteria: 0,
    score_sub_sub_criteria: 0,
    session: session,
    weighted_cr_score: weightedScoreWorkAround
  }
});

// Always update all rows with this criteria_id
await Score.update(
  { score_criteria: cri_score, weighted_cr_score: weightedScoreWorkAround },
  { score_criteria: cri_score,
    weighted_cr_score: weighted_cri_score },
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
      weightedCRScore:weighted_cri_score,
      subCriteriaScores: Object.entries(subCriteriaScores).map(([id, score]) => ({
        sub_criteria_id: id,
        score_sub_criteria: score,
        weighted_cr_score: weightedScore
      }))
    }, created ? "Score created successfully" : "Score updated successfully")
  );
});
 /*        4       3       2       1       0
    2.1.1	>=80%	60%-80%	40%- 60%	30%-40%	<30%
    2.1.2	>=80%	60%-80%	40%- 60%	30%-40%	<30%
    2.2.2	<20:1	20-30:1	30-40:1	  40-50:1	>50:1
    2.3.3					
    2.4.1	>=75%	65%-75%	50%- 65%	40%-50%	<40%
    2.4.3	>=15%	12%-15%	9%- 12%	  6%-9%	  <6%
    2.4.2	>=75%	60%-75%	50%- 60%	30%-50%	<30%
    2.6.3	>=90%	80%-90%	70%- 80%	60%-70%	<60%

    Criteria	Target  Sub-Criteria  Weightage
        2.1		160.0      2.1.1		    20
        2.1		160.0      2.1.2		    20
        2.2		80.0       2.2.2		    20
        2.3		60.0       2.3.3		    15
        2.4		240.0      2.4.1		    20
        2.4		240.0      2.4.2		    20
        2.4		240.0      2.4.3		    20
        2.6		120.0      2.6.3		    30
    */
  const calculateTarget21 = async () => {
      const weights = [20, 20]; // 2.1.1 and 2.1.2
      const target = 160;
        
      const scores = await Score.findAll({
        attributes: ['sub_sub_cr_grade'],
        where: { sub_criteria_id: '0201' }
      });
        
      const grades = scores.map(r => Number(r.sub_sub_cr_grade));
      if (grades.length !== 2) throw new Error("Expected 2 grades for 2.1.1 and 2.1.2");
        
      const weighted = grades.map((g, i) => g * weights[i]);
      const total = weighted.reduce((a, b) => a + b, 0);
      const percentage = (total / target) * 100;
      const averageGrade = grades.reduce((a, b) => a + b, 0) / grades.length;
        
      return {
            "2.1.1": { grade: grades[0], targetPercentage: (weighted[0] / target) * 100 },
            "2.1.2": { grade: grades[1], targetPercentage: (weighted[1] / target) * 100 },
            percentage: +percentage.toFixed(2),
            averageGrade: +averageGrade.toFixed(2)
          };
};
        
        const calculateTarget22 = async () => {
          const weight = 20, target = 80;
          const score = await Score.findOne({
            attributes: ['sub_sub_cr_grade'],
            where: { sub_criteria_id: '0202' }
          });
        
          if (!score) throw new Error("No grade for 2.2.2");
        
          const grade = Number(score.sub_sub_cr_grade);
          return {
            "2.2.2": {
              grade,
              targetPercentage: +(grade * weight / target * 100).toFixed(2)
            }
          };
        };
        
        const calculateTarget23 = async () => {
          const weight = 15, target = 60;
          const score = await Score.findOne({
            attributes: ['sub_sub_cr_grade'],
            where: { sub_criteria_id: '0203' }
          });
        
          if (!score) throw new Error("No grade for 2.3.3");
        
          const grade = Number(score.sub_sub_cr_grade);
          return {
            "2.3.3": {
              grade,
              targetPercentage: +(grade * weight / target * 100).toFixed(2)
            }
          };
        };
        
        const calculateTarget24 = async () => {
          const weights = [20, 20, 20];
          const target = 240;
        
          const scores = await Score.findAll({
            attributes: ['sub_sub_cr_grade'],
            where: { sub_criteria_id: '0204' },
            order: [['sub_sub_criteria_id', 'ASC']]
          });
        
          const grades = scores.map(r => Number(r.sub_sub_cr_grade));
          if (grades.length !== 3) throw new Error("Expected 3 grades for 2.4.1, 2.4.2, 2.4.3");
        
          const keys = ["2.4.1", "2.4.2", "2.4.3"];
          const weightedScores = grades.map((g, i) => g * weights[i]);
        
          const data = {};
          keys.forEach((k, i) => {
            data[k] = {
              grade: grades[i],
              targetPercentage: +(weightedScores[i] / target * 100).toFixed(2)
            };
          });
        
          const totalWeighted = weightedScores.reduce((a, b) => a + b, 0);
          const averageGrade = +(grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);
        
          return {
            ...data,
            percentage: +(totalWeighted / target * 100).toFixed(2),
            averageGrade
          };
        };
        
        const calculateTarget26 = async () => {
          const weight = 30, target = 120;
          const score = await Score.findOne({
            attributes: ['sub_sub_cr_grade'],
            where: { sub_criteria_id: '0206' }
          });
        
          if (!score) throw new Error("No grade for 2.6.3");
        
          const grade = Number(score.sub_sub_cr_grade);
          return {
            "2.6.3": {
              grade,
              targetPercentage: +(grade * weight / target * 100).toFixed(2)
            }
          };
        };
        

        const target2 = asyncHandler(async (req, res) => {
          const weights = [40, 30, 30, 25, 40, 60]; // example weights for 2.1 to 2.6
          const maxTarget = 225; // Total weight

          const scoreResponse = await Score.findAll({
            attributes: ['score_sub_criteria', 'sub_criteria_id'],
            where: {
              criteria_id: '02',
            }
          });

          const subCriteria = {
            '0201': 0,
            '0202': 1,
            '0203': 2,
            '0204': 3,
            '0205': 4,
            '0206': 5
          };

          const weightedScores = scoreResponse
            .filter(score => subCriteria[score.sub_criteria_id] !== undefined)
            .map(score => {
              const index = subCriteria[score.sub_criteria_id];
              return (parseFloat(score.score_sub_criteria) || 0) * weights[index];
            });

          const total = weightedScores.reduce((sum, s) => sum + s, 0);
          const percentage = (total / maxTarget) * 100;

          return res.status(200).json(
            new apiResponse(200, { percentage: percentage.toFixed(2) }, "Overall percentage for Criterion 2")
          );
        });



const getCollegeSummary = asyncHandler(async (req, res) => {
  const collegeId = 1; // Hardcoded college ID
  const session = new Date().getFullYear();

  // 🎯 Grade → Target GPA and Score Map
  const gradeTargetMap = {
    "A++": { gpa: 2.455, score: 0.7365 },
    "A+": { gpa: 2.205, score: 0.6615 },
    "A": { gpa: 2.04, score: 0.612 },
    "B++": { gpa: 1.88, score: 0.564 },
    "B+": { gpa: 1.715, score: 0.5145 },
    "B": { gpa: 1.47, score: 0.441 },
    "C": { gpa: 1.145, score: 0.3435 },
    "D": { gpa: 0.49, score: 0.24 }
  };

  // 1️⃣ Desired grade
  const iiqaForm = await IIQA.findOne({ 
    attributes: ['desired_grade'],
    where: { 
      institution_id: collegeId,
    }, 
    order: [['year_filled', 'DESC']],
    limit: 1
  });
  const desiredGrade = iiqaForm?.dataValues?.desired_grade || "A";
  console.log("desiredGrade",desiredGrade)
  const { gpa: targetGPA, score: targetScore } = gradeTargetMap[desiredGrade] || gradeTargetMap["A"];

  // 2️⃣ GPA (score_criteria) and total score (weighted_cr_score / 1000) for criteria 02
const gpaRow = await Score.findOne({ 
  where: { criteria_id: '02', session }, 
  attributes: ['score_criteria', 'weighted_cr_score']
});

const currentGPA = parseFloat(gpaRow?.score_criteria || 0);
const totalScore = gpaRow?.weighted_cr_score ? +(parseFloat(gpaRow.weighted_cr_score) / 1000).toFixed(2) : 0;

  // 3️⃣ Grade from GPA
  const getGrade = (gpa) => {
    if (gpa >= 2.29) return "A++";
    if (gpa >= 2.12) return "A+";
    if (gpa >= 1.96) return "A";
    if (gpa >= 1.8) return "B++";
    if (gpa >= 1.63) return "B+";
    if (gpa >= 1.31) return "B";
    if (gpa >= 0.98) return "C";
    return "D";
  };
  const grade = getGrade(currentGPA);

  // 4️⃣ Criteria Master rows for criteria_id = '02'
  const masterRows = await CriteriaMaster.findAll({
    where: { criterion_id: '02' },
    raw: true
  });

  // 5️⃣ Score rows for this session and criteria_id = '02'
  const scoreRows = await Score.findAll({
    where: { criteria_id: '02', session },
    raw: true
  });

  // 🧠 Group by sub_criteria_id
  const criteriaMap = {};

  for (const row of masterRows) {
    const { sub_criterion_id, sub_sub_criterion_id, sub_criterion_name, sub_sub_criterion_name, criterion_name } = row;

    if (!criteriaMap[sub_criterion_id]) {
      criteriaMap[sub_criterion_id] = {
        code: sub_criterion_id.replace(/^02/, "2."),
        title: sub_criterion_name,
        score: 0,
        grade: 0,
        target: 100, // you can refine per-subcriterion target if needed
        sub_sub_criteria: []
      };
    }

    const scoreRow = scoreRows.find(s => s.sub_sub_criteria_id === sub_sub_criterion_id);
    const score = parseFloat(scoreRow?.score_sub_sub_criteria || 0);
    const gradeVal = parseFloat(scoreRow?.sub_sub_cr_grade || 0);

    // Push sub-sub row
    criteriaMap[sub_criterion_id].sub_sub_criteria.push({
      code: sub_sub_criterion_id.replace(/^02/, "2."),
      title: sub_sub_criterion_name,
      score,
      grade: gradeVal
    });

    // Sum into parent
    criteriaMap[sub_criterion_id].score += score;
    criteriaMap[sub_criterion_id].grade += gradeVal;
  }

  // Convert sub_criteria map to array with stats
  const subcriteriaArr = Object.values(criteriaMap).map(obj => {
    const totalGrade = obj.grade;
    const averageGrade = obj.sub_sub_criteria.length ? (totalGrade / obj.sub_sub_criteria.length).toFixed(2) : 0;
    const targetPercentage = obj.score ? ((obj.score / obj.target) * 100).toFixed(2) : 0;
    console.log("obj",obj)
    return {
      code: obj.code,
      title: obj.title,
      score: +obj.score.toFixed(2),
      target: obj.target,
      grade: +averageGrade,
      targetPercentage: +targetPercentage
    };
  });

  console.log("subcriteriaArr",subcriteriaArr)

  // Total score of criteria 2
  const avgGrade = subcriteriaArr.reduce((acc, sc) => acc + sc.grade, 0) / subcriteriaArr.length;
  console.log("avgGrade",avgGrade)
  return res.status(200).json({
    collegeId,
    currentGPA: +currentGPA.toFixed(2),
    targetGPA,
    grade,
    criteria: [
      {
        id: 2,
        title: masterRows[0]?.criterion_name || "Teaching-Learning and Evaluation",
        score: +totalScore.toFixed(2),
        target: targetScore,
        status: (totalScore >= targetScore ? "Near Target" : "Below Target"),
        averageGrade: +avgGrade.toFixed(2),
        subcriteria: subcriteriaArr
      }
    ]
  });
});

//totalscore
const scoreTotal = asyncHandler(async (req, res) => {
  // Get current year as session string (e.g., "2025")
  const session = new Date().getFullYear().toString();

  // Step 1: Fetch all rows with non-zero weighted_cr_score, ensuring they're linked to proper sub-criteria
  const allScores = await Score.findAll({
    attributes: ['criteria_id', 'weighted_cr_score'],
    where: {
      session: session,
      weighted_cr_score: { [Sequelize.Op.gt]: 0 },
      sub_criteria_id: { [Sequelize.Op.ne]: null },
      sub_sub_criteria_id: { [Sequelize.Op.ne]: null }
    },
    raw: true
  });

  // Step 2: For each criteria_id, keep the highest weighted_cr_score
  const weightedMap = {};
  for (const score of allScores) {
    const id = score.criteria_id;
    const weight = parseFloat(score.weighted_cr_score);
    if (!weightedMap[id] || weightedMap[id] < weight) {
      weightedMap[id] = weight;
    }
  }

  // Step 3: Compute total score by summing all max weighted scores per criterion
  const totalWeighted = Object.values(weightedMap).reduce((sum, w) => sum + w, 0);

  let grade;
if (totalWeighted >= 2.29 && totalWeighted <= 2.62) {
  grade = 'A++';
} else if (totalWeighted >= 2.12 && totalWeighted < 2.29) {
  grade = 'A+';
} else if (totalWeighted >= 1.96 && totalWeighted < 2.12) {
  grade = 'A';
} else if (totalWeighted >= 1.8 && totalWeighted < 1.96) {
  grade = 'B++';
} else if (totalWeighted >= 1.63 && totalWeighted < 1.8) {
  grade = 'B+';
} else if (totalWeighted >= 1.31 && totalWeighted < 1.63) {
  grade = 'B';
} else if (totalWeighted >= 0.98 && totalWeighted < 1.31) {
  grade = 'C';
} else {
  grade = 'D';
}


  // Step 4: Create or find the TOTAL SCORE row (criteria_id = '00')
  const [entry, created] = await Score.findOrCreate({
    where: {
      criteria_id: '00',
      session: session,
      sub_criteria_id: '0000',
      sub_sub_criteria_id: '000000'
    },
    defaults: {
      criteria_code: '000000000000',  // Placeholder code for total score
      criteria_id: '00',
      sub_criteria_id: '0000',
      sub_sub_criteria_id: '000000',
      score_criteria: totalWeighted,
      weighted_cr_score: grade,
      score_sub_criteria: 0,
      score_sub_sub_criteria: 0,
      session: session
    }
  });

  // Step 5: If the row already existed, update it with the new total score
  if (!created) {
    await Score.update(
      {
        score_criteria: totalWeighted,
        weighted_cr_score: grade
      },
      {
        where: {
          criteria_id: '00',
          session: session,
          sub_criteria_id: '0000',
          sub_sub_criteria_id: '000000'
        }
      }
    );
  }

  // Step 6: Return a response with the total and breakdown
  return res.status(200).json(
    new apiResponse(200, {
      totalWeightedScore: totalWeighted,
      Grade:grade,
      criteriaWiseWeightedScores: Object.entries(weightedMap).map(([id, score]) => ({
        criteria_id: id,
        weighted_cr_score: score
      }))
    }, created ? "Total weighted score created" : "Total weighted score updated")
  );
});


export { score21, score22, score23, score24, score26, score2, score12, score13, score14, score1, scoreTotal, getCollegeSummary };
