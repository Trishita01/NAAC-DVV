import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import Sequelize from "sequelize";

const Criteria113 = db.response_1_1_3;
const Criteria121 = db.response_1_2_1;
const Criteria122 = db.response_1_2_2;
const Criteria123 = db.response_1_2_3;
const Criteria132 = db.response_1_3_2;
const Criteria133 = db.response_1_3_3;
const Criteria141 = db.response_1_4_1;
const Criteria142 = db.response_1_4_2;
const CriteriaMaster = db.criteria_master;
const Score = db.scores;
const IIQA = db.iiqa_form;
const IIQA_Student_Details = db.iiqa_student_details;
const IIQAStaffDetails = db.iiqa_staff_details;
const extended_profile = db.extended_profile;

// Convert criteria code to padded format (e.g., '1.1.3' -> '010103')
const convertToPaddedFormat = (code) => {
    // First remove any dots, then split into individual characters
    const parts = code.replace(/\./g, '').split('');
    // Pad each part to 2 digits and join
    return parts.map(part => part.padStart(2, '0')).join('');
};

// Helper function to calculate total number of teachers
const getTeacherCount = async () => {
    const response = await IIQAStaffDetails.findAll({
      order: [['id', 'DESC']], // Get the most recent record first
      limit: 1 // Only get the latest record
    });

    if (!response || response.length === 0) {
      console.log("No teacher details found");
      return 0;
    }

    const latestRecord = response[0].dataValues;
    const totalTeachers = 
      (latestRecord.perm_male || 0) + 
      (latestRecord.perm_female || 0) + 
      (latestRecord.perm_trans || 0) + 
      (latestRecord.other_male || 0) + 
      (latestRecord.other_female || 0) + 
      (latestRecord.other_trans || 0);

    console.log("Total teachers:", totalTeachers);
    return totalTeachers;
};

// Helper function to calculate total number of students
const getTotalStudents = async () => {
    const responses = await IIQA_Student_Details.findAll({
      order: [['id', 'DESC']], // Get the most recent record first
      limit: 1 // Only get the latest record
    });

    if (!responses || responses.length === 0) {
      console.log("No student details found");
      return 0;
    }

    const latestRecord = responses[0].dataValues;
    const totalStudents = 
      (latestRecord.regular_male || 0) + 
      (latestRecord.regular_female || 0) + 
      (latestRecord.regular_trans || 0);

    console.log("Total students:", totalStudents);
    return totalStudents;
};


const createResponse113 = asyncHandler(async (req, res) => {
  /*
    1. Extract input from req.body
    2. Validate required fields and logical constraints
    3. Check if programme_name or programme_code already exists for the same year and session
    4. Get criteria_code from criteria_master
    5. Get latest IIQA session and validate session window
    6. Create or update response in response_2_1_1 table
  */

  const {
    session,
    year,
    teacher_name,
    body_name,
    option_selected,
    } = req.body;

  // Step 1: Field validation
  if (
    !session || !year || !teacher_name || !body_name || !option_selected
  ) {
    throw new apiError(400, "Missing required fields");
  }

  const currentYear = new Date().getFullYear();
  if (
    session < 1990 || session > currentYear ||
    year < 1990 || year > currentYear
  ) {
    throw new apiError(400, "Year and session must be between 1990 and current year");
  }

  if (option_selected < 0 || option_selected >= 4) {
    throw new apiError(400, "Option selected must be between 0 and 4");
  }

  // Create proper Date objects for session
  const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
  console.log(criteria.criteria_code)


  // Step 2: Check for existing programme_name or programme_code in same session/year
  const existingRecord = await Criteria113.findOne({
    where: {
      session,
      year,
      [Sequelize.Op.or]: [
        { teacher_name },
      ]
    }
  });

  if (existingRecord) {
    if (existingRecord.teacher_name === teacher_name) {
      throw new apiError(400, "Teacher name already exists for this session and year");
    } else {
      throw new apiError(400, "Programme code already exists for this session and year");
    }
  }

  // Step 3: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '01',
      sub_criterion_id: '0101',
      sub_sub_criterion_id: '010103'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  // Step 4: Validate session window against IIQA
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (session < startYear || session > endYear) {
    throw new apiError(400, "Session must be between ${startYear} and ${endYear}");
  }

  // Step 5: Create or update response
  let [entry, created] = await Criteria113.findOrCreate({
    where: {
      session,
      year,
      teacher_name,
      body_name
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session,
      year,
      teacher_name,
      body_name,
      option_selected
    }
  });

  if (!created) {
    await Criteria113.update({
      option_selected
    }, {
      where: {
        session,
        year,
        teacher_name,
        body_name
      }
    });

    entry = await Criteria113.findOne({
      where: {
        session,
        year,
        teacher_name,
        body_name
      }
    });
  }

  return res.status(201).json(
    new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});

const score113 = asyncHandler(async (req, res) => {
  const criteria_code = convertToPaddedFormat("1.1.3");
  const currentYear = new Date().getFullYear();
  const sessionDate = new Date(currentYear, 0, 1); // Jan 1st of current year

  // Get criteria details
  const criteria = await CriteriaMaster.findOne({
    where: { 
      sub_sub_criterion_id: criteria_code
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria 1.3.3 not found in criteria_master");
  }

  // Get latest IIQA session range
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5; // Last 5 years data

  // Get count of unique students who went for higher studies
  const higherStudiesCounts = await Criteria113.findAll({
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('student_name'))), 'unique_students']
    ],
    where: {
      criteria_code: criteria.criteria_code,
      session: { [Sequelize.Op.between]: [startYear, endYear] }
    },
    raw: true
  });

  // Get total students from extended_profile
  const extendedProfiles = await extended_profile.findAll({
    where: { year: { [Sequelize.Op.between]: [startYear, endYear] } },
    attributes: [[Sequelize.fn('SUM', Sequelize.col('total_students')), 'total_students']],
    raw: true
  });

  const totalHigherStudies = higherStudiesCounts[0]?.unique_students || 0;
  const totalStudents = extendedProfiles[0]?.total_students || 1; // Avoid division by zero

  // Calculate percentage
  const percentage = (totalHigherStudies / totalStudents) * 100;
  let score, grade;

  // Determine score and grade based on percentage
  if (percentage >= 20) {
    score = 4;
    grade = "A";
  } else if (percentage >= 15) {
    score = 3;
    grade = "B";
  } else if (percentage >= 10) {
    score = 2;
    grade = "C";
  } else if (percentage >= 5) {
    score = 1;
    grade = "D";
  } else {
    score = 0;
    grade = "E";
  }

  // Create or update score
  const [entry, created] = await Score.upsert({
    criteria_code: criteria.criteria_code,
    criteria_id: criteria.criterion_id,
    sub_criteria_id: criteria.sub_criterion_id,
    sub_sub_criteria_id: criteria.sub_sub_criterion_id,
    score_criteria: 0,
    score_sub_criteria: 0,
    score_sub_sub_criteria: score,
    session: sessionDate,
    year: currentYear,
    cycle_year: 1
  }, {
    conflictFields: ['criteria_code', 'session', 'year']
  });

  return res.status(200).json(
    new apiResponse(200, {
      score,
      percentage,
      totalHigherStudies,
      totalStudents,
      grade,
      message: `Grade is ${grade}`
    }, created ? "Score created successfully" : "Score updated successfully")
  );
});

const createResponse121 = asyncHandler(async (req, res) => {
  /*
    1. Extract input from req.body
    2. Validate required fields and logical constraints
    3. Check if programme_name or programme_code already exists for the same year and session
    4. Get criteria_code from criteria_master
    5. Get latest IIQA session and validate session window
    6. Create or update response in response_1_2_1 table
  */

  const {
    session,
    year,
    programme_code,
    programme_name,
    year_of_introduction,
    status_of_implementation_of_CBCS,
    year_of_implementation_of_CBCS,
    year_of_revision,
    prc_content_added
  } = req.body;

  // Step 1: Field validation
  if (
    !session || !year || !programme_name || !programme_code ||
    !year_of_introduction || status_of_implementation_of_CBCS === undefined || !year_of_implementation_of_CBCS  || !year_of_revision || prc_content_added === undefined
  ) {
    throw new apiError(400, "Missing required fields");
  }

  const currentYear = new Date().getFullYear();
  if (
    session < 1990 || session > currentYear ||
    year < 1990 || year > currentYear
  ) {
    throw new apiError(400, "Year and session must be between 1990 and current year");
  }

  if (year_of_introduction < 1990 || year_of_implementation_of_CBCS < 1990 || year_of_revision < 1990) {
    throw new apiError(400, "Year of introduction, implementation of CBCS and revision must be between 1990 and current year");
  }

  if (year_of_introduction > currentYear || year_of_implementation_of_CBCS > currentYear || year_of_revision > currentYear) {
    throw new apiError(400, "Year of introduction, implementation of CBCS and revision must be between 1990 and current year");
  }

  // Step 2: Check for existing programme_name or programme_code in same session/year
  const existingRecord = await Criteria121.findOne({
    where: {
      session,
      year,
      [Sequelize.Op.or]: [
        { programme_code },
        { programme_name }
      ]
    }
  });

  if (existingRecord) {
    if (existingRecord.programme_name === programme_name) {
      throw new apiError(400, "Programme name already exists for this session and year");
    } else {
      throw new apiError(400, "Programme code already exists for this session and year");
    }
  }

  // Step 3: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '01',
      sub_criterion_id: '0102',
      sub_sub_criterion_id: '010201'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  // Step 4: Validate session window against IIQA
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (session < startYear || session > endYear) {
    throw new apiError(400, "Session must be between ${startYear} and ${endYear}");
  }

  // Step 5: Create or update response
  let [entry, created] = await Criteria121.findOrCreate({
    where: {
      session,
      year,
      programme_code,
      programme_name
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session,
      year,
      programme_code,
      programme_name,
      year_of_introduction,
      status_of_implementation_of_CBCS,
      year_of_implementation_of_CBCS,
      year_of_revision,
      prc_content_added
    }
  });

  if (!created) {
    await Criteria121.update({
      year_of_introduction,
      status_of_implementation_of_CBCS,
      year_of_implementation_of_CBCS,
      year_of_revision,
      prc_content_added
    }, {
      where: {
        session,
        year,
        programme_code,
        programme_name
      }
    });

    entry = await Criteria121.findOne({
      where: {
        session,
        year,
        programme_code,
        programme_name
      }
    });
  }

  return res.status(201).json(
    new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});

const score121 = asyncHandler(async (req, res) => {
  /*
  1. Get current session (year)
  2. Get criteria from criteria master with sub-sub-criterion id 1.1.2
  3. Get latest IIQA session range
  4. Check if session is between the latest IIQA session and current year
  5. Fetch all responses for CBCS implementation status
  6. Count total programs and programs with CBCS implemented
  7. Calculate score as (CBCS programs / total programs)
  8. Create or update score in the score table
  9. Return the score
  */

  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("1.1.2");
  
  // Step 1: Get corresponding criteria from master
  const criteria = await CriteriaMaster.findOne({
    where: { sub_sub_criterion_id: criteria_code }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria 1.1.2 not found in criteria_master");
  }

  // Step 2: Get latest IIQA session range
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5; // Considering last 5 years data

  if (session < startYear || session > endYear) {
    throw new apiError(400, `Session must be between ${startYear} and ${endYear}`);
  }

  // Step 3: Fetch CBCS implementation data
  const responses = await Response121.findAll({
    attributes: [
      'session',
      'programme_code',
      'programme_name',
      'status_of_implementation_of_CBCS'
    ],
    where: {
      criteria_code: criteria.criteria_code,
      session: {
        [Sequelize.Op.between]: [startYear, endYear]
      }
    }
  });

  if (!responses.length) {
    throw new apiError(404, "No program data found in the session range");
  }

  // Step 4: Count total programs and programs with CBCS implemented
  const totalPrograms = responses.length;
  const cbcsImplementedPrograms = responses.filter(
    program => program.status_of_implementation_of_CBCS === 'Yes'
  ).length;

  // Calculate score (percentage of programs with CBCS implemented)
  const score = totalPrograms > 0 ? (cbcsImplementedPrograms / totalPrograms) * 100 : 0;

  // Step 5: Insert or update score
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
      score_sub_criteria: 0,
      score_sub_sub_criteria: score,
      session
    }
  });

  if (!created) {
    await Score.update({
      score_sub_sub_criteria: score,
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
    new apiResponse(200, {
      score: entry.score_sub_sub_criteria,
      totalPrograms,
      cbcsImplementedPrograms,
      criteria_code: criteria.criteria_code,
      session
    }, created ? "Score created successfully" : "Score updated successfully")
  );
});

const createResponse122_123 = asyncHandler(async (req, res) => {
  const {
    session,
    program_name,
    course_code,
    year_of_offering,
    no_of_times_offered,
    duration,
    no_of_students_enrolled,
    no_of_students_completed
  } = req.body;

  // Validate required fields
  if (
    !program_name ||
    !course_code ||
    !year_of_offering ||
    !no_of_times_offered ||
    !duration ||
    !no_of_students_enrolled ||
    !no_of_students_completed
  ) {
    throw new apiError(400, "Missing required fields");
  }

  if (year_of_offering < 1990 || year_of_offering > new Date().getFullYear()) {
    throw new apiError(400, "Year of offering must be between 1990 and current year");
  }

  if (session < 1990 || session > new Date().getFullYear()) {
    throw new apiError(400, "Session must be between 1990 and current year");
  }

  // Get IIQA session range for validation
  const latestIIQA = await IIQA.findOne({
    attributes: ["session_end_year"],
    order: [["created_at", "DESC"]],
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (session < startYear || session > endYear) {
    throw new apiError(400, "Session must be between ${startYear} and ${endYear}");
  }

  // Start a transaction
  const transaction = await db.sequelize.transaction();

  try {
    // Step 1: Get all 3 criteria from CriteriaMaster
    const criteriaList = await CriteriaMaster.findAll({
      where: {
        sub_sub_criterion_id: { [Sequelize.Op.in]: ['010202', '010203'] },
        sub_criterion_id: { [Sequelize.Op.in]: ['0102', '0102'] },
        criterion_id: '01'
      },
      transaction
    });

    if (!criteriaList || criteriaList.length !== 2) {
      await transaction.rollback();
      throw new apiError(404, "One or more criteria not found");
    }

    // Step 2: Map sub_sub_criterion_id to model
    const modelMap = {
      '010202': { model: Criteria122, name: '1.2.2' },
      '010203': { model: Criteria123, name: '1.2.3' },
    };

    const responses = [];

    for (const criteria of criteriaList) {
      const { model: Model, name } = modelMap[criteria.sub_sub_criterion_id];
      if (!Model) continue;

      try {
        const [entry, created] = await Model.findOrCreate({
          where: {
            session,
            year_of_offering,
            program_name,
            course_code,
            no_of_times_offered,
            duration,
            no_of_students_enrolled,
            no_of_students_completed
          },
          defaults: {
            id: criteria.id, // Add the criteria ID
            criteria_code: criteria.criteria_code,
            session,
            year_of_offering,
            program_name,
            course_code,
            no_of_times_offered,
            duration,
            no_of_students_enrolled,
            no_of_students_completed  
          },
          transaction
        });

        responses.push({
          criteria: name,
          entry,
          created,
          message: created ? "Entry created successfully" : "Entry already exists"
        });

      } catch (error) {
        // Rollback and throw error
        await transaction.rollback();
        throw new apiError(400, "Error creating entry for criteria ${name}: ${error.message}");
      }
    }

    // If we get here, all operations were successful
    await transaction.commit();

    return res.status(200).json(
      new apiResponse(200, { responses }, "Operation completed successfully")
    );

  } catch (error) {
    // If we get here, the transaction has already been rolled back
    // in one of the inner catch blocks
    throw error; // Let the error handler deal with it
  }
});

const score122 = asyncHandler(async (req, res) => {
  /*
  1. Get current session (year)
  2. Get criteria from criteria master with sub-sub-criterion id 1.2.2
  3. Get latest IIQA session range
  4. For each year in the last 5 years:
     a. Get total students enrolled in certificate programs (criteria 1.2.2)
     b. Get total students across all programs (from iiqa_programme_count)
     c. Calculate percentage for the year
  5. Calculate average percentage over 5 years
  6. Create or update score in the score table
  7. Return the score
  */

  const currentYear = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("1.2.2");
  
  // Step 1: Get corresponding criteria from master
  const criteria = await CriteriaMaster.findOne({
    where: { sub_sub_criterion_id: criteria_code }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria 1.2.2 not found in criteria_master");
  }

  // Step 2: Get latest IIQA session range
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5; // Last 5 years data

  // Step 3: Calculate percentages for each year
  const yearlyPercentages = [];
  
  for (let year = startYear; year <= endYear; year++) {
    // Get total students in certificate programs (criteria 1.2.2) for the year
    const certPrograms = await Response122.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('no_of_students_enrolled')), 'total_students']
      ],
      where: {
        criteria_code: criteria.criteria_code,
        year_of_offering: year
      },
      raw: true
    });

    // Get total students across all programs from iiqa_programme_count
    const totalStudents = await IIQAProgrammeCount.findOne({
      attributes: [
        [Sequelize.literal('IFNULL(ug, 0) + IFNULL(pg, 0) + IFNULL(post_masters, 0) + IFNULL(pre_doctoral, 0) + IFNULL(doctoral, 0) + IFNULL(post_doctoral, 0) + IFNULL(pg_diploma, 0) + IFNULL(diploma, 0)'), 'total_students']
      ],
      where: {
        session: year
      },
      raw: true
    });

    const certStudents = certPrograms[0]?.total_students || 0;
    const totalStudentsCount = totalStudents?.total_students || 1; // Avoid division by zero
    
    // Calculate percentage for the year
    const percentage = (certStudents / totalStudentsCount) * 100;
    yearlyPercentages.push(percentage);
  }

  // Calculate average percentage over 5 years
  const avgPercentage = yearlyPercentages.length > 0 
    ? yearlyPercentages.reduce((sum, p) => sum + p, 0) / yearlyPercentages.length 
    : 0;

  // Step 4: Insert or update score
  let [entry, created] = await Score.findOrCreate({
    where: {
      criteria_code: criteria.criteria_code,
      session: currentYear
    },
    defaults: {
      criteria_code: criteria.criteria_code,
      criteria_id: criteria.criterion_id,
      sub_criteria_id: criteria.sub_criterion_id,
      sub_sub_criteria_id: criteria.sub_sub_criterion_id,
      score_criteria: 0,
      score_sub_criteria: 0,
      score_sub_sub_criteria: avgPercentage,
      session: currentYear
    }
  });

  if (!created) {
    await Score.update({
      score_sub_sub_criteria: avgPercentage,
      session: currentYear
    }, {
      where: {
        criteria_code: criteria.criteria_code,
        session: currentYear
      }
    });

    entry = await Score.findOne({
      where: {
        criteria_code: criteria.criteria_code,
        session: currentYear
      }
    });
  }

  return res.status(200).json(
    new apiResponse(200, {
      score: entry.score_sub_sub_criteria,
      yearlyPercentages,
      criteria_code: criteria.criteria_code,
      session: currentYear
    }, created ? "Score created successfully" : "Score updated successfully")
  );
});

const score123 = asyncHandler(async (req, res) => {
  /*
  Similar to score122 but for criteria 1.2.3 (Add-on programs)
  */
  const currentYear = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("1.2.3");
  
  // Step 1: Get corresponding criteria from master
  const criteria = await CriteriaMaster.findOne({
    where: { sub_sub_criterion_id: criteria_code }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria 1.2.3 not found in criteria_master");
  }

  // Step 2: Get latest IIQA session range
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5; // Last 5 years data

  // Step 3: Calculate percentages for each year
  const yearlyPercentages = [];
  
  for (let year = startYear; year <= endYear; year++) {
    // Get total students in add-on programs (criteria 1.2.3) for the year
    const addonPrograms = await Response123.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('no_of_students_enrolled')), 'total_students']
      ],
      where: {
        criteria_code: criteria.criteria_code,
        year_of_offering: year
      },
      raw: true
    });

    // Get total students across all programs from iiqa_programme_count
    const totalStudents = await IIQAProgrammeCount.findOne({
      attributes: [
        [Sequelize.literal('IFNULL(ug, 0) + IFNULL(pg, 0) + IFNULL(post_masters, 0) + IFNULL(pre_doctoral, 0) + IFNULL(doctoral, 0) + IFNULL(post_doctoral, 0) + IFNULL(pg_diploma, 0) + IFNULL(diploma, 0)'), 'total_students']
      ],
      where: {
        session: year
      },
      raw: true
    });

    const addonStudents = addonPrograms[0]?.total_students || 0;
    const totalStudentsCount = totalStudents?.total_students || 1; // Avoid division by zero
    
    // Calculate percentage for the year
    const percentage = (addonStudents / totalStudentsCount) * 100;
    yearlyPercentages.push(percentage);
  }

  // Calculate average percentage over 5 years
  const avgPercentage = yearlyPercentages.length > 0 
    ? yearlyPercentages.reduce((sum, p) => sum + p, 0) / yearlyPercentages.length 
    : 0;

  // Step 4: Insert or update score
  let [entry, created] = await Score.findOrCreate({
    where: {
      criteria_code: criteria.criteria_code,
      session: currentYear
    },
    defaults: {
      criteria_code: criteria.criteria_code,
      criteria_id: criteria.criterion_id,
      sub_criteria_id: criteria.sub_criterion_id,
      sub_sub_criteria_id: criteria.sub_sub_criterion_id,
      score_criteria: 0,
      score_sub_criteria: 0,
      score_sub_sub_criteria: avgPercentage,
      session: currentYear
    }
  });

  if (!created) {
    await Score.update({
      score_sub_sub_criteria: avgPercentage,
      session: currentYear
    }, {
      where: {
        criteria_code: criteria.criteria_code,
        session: currentYear
      }
    });

    entry = await Score.findOne({
      where: {
        criteria_code: criteria.criteria_code,
        session: currentYear
      }
    });
  }

  return res.status(200).json(
    new apiResponse(200, {
      score: entry.score_sub_sub_criteria,
      yearlyPercentages,
      criteria_code: criteria.criteria_code,
      session: currentYear
    }, created ? "Score created successfully" : "Score updated successfully")
  );
})

const createResponse132 = asyncHandler(async (req, res) => {
  /*
    1. Extract input from req.body
    2. Validate required fields and logical constraints
    3. Check if programme_name or programme_code already exists for the same year and session
    4. Get criteria_code from criteria_master
    5. Get latest IIQA session and validate session window
    6. Create or update response in response_1_3_2_data table
  */

  const {
    session,
    year,
    program_name,
    program_code,
    course_name,
    course_code,
    year_of_offering,
    student_name
  } = req.body;

  // Step 1: Field validation
  if (
    !session || !year || !program_name || !program_code ||
    !course_name  || !course_code || year_of_offering === undefined || student_name === undefined
  ) {
    throw new apiError(400, "Missing required fields");
  }

  const currentYear = new Date().getFullYear();
  if (
    session < 1990 || session > currentYear ||
    year < 1990 || year > currentYear
  ) {
    throw new apiError(400, "Year and session must be between 1990 and current year");
  }

  if (year_of_offering < 1990 || year_of_offering > currentYear) {
    throw new apiError(400, "Year of offering must be between 1990 and current year");
  }

  if (student_name === undefined) {
    throw new apiError(400, "Student name cannot be undefined");
  }

  // Step 2: Check for existing programme_name or programme_code in same session/year
  const existingRecord = await Criteria132.findOne({
    where: {
      session,
      year,
      [Sequelize.Op.or]: [
        { program_name },
        { program_code }
      ]
    }
  });

  if (existingRecord) {
    if (existingRecord.program_name === program_name) {
      throw new apiError(400, "Program name already exists for this session and year");
    } else {
      throw new apiError(400, "Program code already exists for this session and year");
    }
  }

  // Step 3: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '01',
      sub_criterion_id: '0103',
      sub_sub_criterion_id: '010302'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  // Step 4: Validate session window against IIQA
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (session < startYear || session > endYear) {
    throw new apiError(400, "Session must be between ${startYear} and ${endYear}");
  }

  // Step 5: Create or update response
  let [entry, created] = await Criteria132.findOrCreate({
    where: {
      session,
      year,
      program_name,
      program_code
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session,
      year,
      program_name,
      program_code,
      course_name,
      course_code,
      year_of_offering,
      student_name
    }
  });

  if (!created) {
    await Criteria132.update({
      no_of_seats,
      no_of_students
    }, {
      where: {
        session,
        year,
        program_name,
        program_code
      }
    });

    entry = await Criteria132.findOne({
      where: {
        session,
        year,
        program_name,
        program_code
      }
    });
  }

  return res.status(201).json(
    new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});

const score132 = asyncHandler(async (req, res) => {
  /*
  1. Get current session (year)
  2. Get criteria from criteria master with sub-sub-criterion id 1.3.2
  3. Get latest IIQA session range
  4. For each year in the last 5 years:
     a. Get count of unique courses with experiential learning (criteria 1.3.2)
     b. Get total number of courses across all programs (from IIQA)
     c. Calculate percentage for the year
  5. Calculate average percentage over 5 years
  6. Create or update score in the score table
  7. Return the score
  */

  const currentYear = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("1.3.2");
  
  // Step 1: Get corresponding criteria from master
  const criteria = await CriteriaMaster.findOne({
    where: { sub_sub_criterion_id: criteria_code }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria 1.3.2 not found in criteria_master");
  }

  // Step 2: Get latest IIQA session range
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5; // Last 5 years data

  // Step 3: Calculate percentages for each year
  const yearlyPercentages = [];
  
  for (let year = startYear; year <= endYear; year++) {
    // Get count of unique courses with experiential learning for the year
    const expLearningCourses = await Response132.count({
      distinct: true,
      col: 'course_code',
      where: {
        criteria_code: criteria.criteria_code,
        year_of_offering: year
      }
    });

    // Get total number of courses across all programs from IIQA
    // Note: This assumes we have a way to get total courses from IIQA
    // Since we don't have a direct field in IIQAProgrammeCount, we'll need to calculate it
    // For now, we'll use a placeholder value of 100, but this should be replaced with actual data
    const totalCourses = 100; // TODO: Replace with actual total courses count from IIQA
    
    // Calculate percentage for the year
    const percentage = totalCourses > 0 ? (expLearningCourses / totalCourses) * 100 : 0;
    yearlyPercentages.push(percentage);
  }

  // Calculate average percentage over 5 years
  const avgPercentage = yearlyPercentages.length > 0 
    ? yearlyPercentages.reduce((sum, p) => sum + p, 0) / yearlyPercentages.length 
    : 0;

  // Step 4: Insert or update score
  let [entry, created] = await Score.findOrCreate({
    where: {
      criteria_code: criteria.criteria_code,
      session: currentYear
    },
    defaults: {
      criteria_code: criteria.criteria_code,
      criteria_id: criteria.criterion_id,
      sub_criteria_id: criteria.sub_criterion_id,
      sub_sub_criteria_id: criteria.sub_sub_criterion_id,
      score_criteria: 0,
      score_sub_criteria: 0,
      score_sub_sub_criteria: avgPercentage,
      session: currentYear
    }
  });

  if (!created) {
    await Score.update({
      score_sub_sub_criteria: avgPercentage,
      session: currentYear
    }, {
      where: {
        criteria_code: criteria.criteria_code,
        session: currentYear
      }
    });

    entry = await Score.findOne({
      where: {
        criteria_code: criteria.criteria_code,
        session: currentYear
      }
    });
  }

  return res.status(200).json(
    new apiResponse(200, {
      score: entry.score_sub_sub_criteria,
      yearlyPercentages,
      criteria_code: criteria.criteria_code,
      session: currentYear
    }, created ? "Score created successfully" : "Score updated successfully")
  );
})

const createResponse133 = asyncHandler(async (req, res) => {
  /*
    1. Extract input from req.body
    2. Validate required fields and logical constraints
    3. Check if programme_name or programme_code already exists for the same year and session
    4. Get criteria_code from criteria_master
    5. Get latest IIQA session and validate session window
    6. Create or update response in response_2_1_1 table
  */

  const {
    session,
    year,
    program_name,
    program_code,
    student_name
  } = req.body;

  // Step 1: Field validation
  if (
    !session || !year || !program_name || !program_code ||
    student_name === undefined
  ) {
    throw new apiError(400, "Missing required fields");
  }

  const currentYear = new Date().getFullYear();
  if (
    session < 1990 || session > currentYear ||
    year < 1990 || year > currentYear
  ) {
    throw new apiError(400, "Year and session must be between 1990 and current year");
  }

  if (student_name === undefined) {
    throw new apiError(400, "Student name cannot be undefined");
  }

  
  // Step 2: Check for existing programme_name or programme_code in same session/year
  const existingRecord = await Criteria133.findOne({
    where: {
      session,
      year,
      [Sequelize.Op.or]: [
        { program_name },
        { program_code }
      ]
    }
  });

  if (existingRecord) {
    if (existingRecord.program_name === program_name) {
      throw new apiError(400, "Program name already exists for this session and year");
    } else {
      throw new apiError(400, "Program code already exists for this session and year");
    }
  }

  // Step 3: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '01',
      sub_criterion_id: '0103',
      sub_sub_criterion_id: '010303'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  // Step 4: Validate session window against IIQA
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (session < startYear || session > endYear) {
    throw new apiError(400, "Session must be between ${startYear} and ${endYear}");
  }

  // Step 5: Create or update response
  let [entry, created] = await Criteria133.findOrCreate({
    where: {
      session,
      year,
      program_name,
      program_code
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session,
      year,
      program_name,
      program_code,
      student_name
    }
  });

  if (!created) {
    await Criteria133.update({
      student_name
    }, {
      where: {
        session,
        year,
        program_name,
        program_code
      }
    });

    entry = await Criteria133.findOne({
      where: {
        session,
        year,
        program_name,
        program_code
      }
    });
  }

  return res.status(201).json(
    new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});

const score133 = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("1.3.3");
  
  // Get criteria from master
  const criteria = await CriteriaMaster.findOne({
    where: { sub_sub_criterion_id: criteria_code }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria 1.3.3 not found in criteria_master");
  }

  // Get latest IIQA session range
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5; // Last 5 years data

  // Get count of unique students who went for higher studies for each year
  const higherStudiesCounts = await Response133.findAll({
    attributes: [
      'session',
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('student_name'))), 'unique_students']
    ],
    where: {
      criteria_code: criteria.criteria_code,
      session: { [Sequelize.Op.between]: [startYear, endYear] }
    },
    group: ['session'],
    raw: true
  });

  // Get total students from extended_profile for each year
  const extendedProfiles = await extended_profile.findAll({
    where: { year: { [Sequelize.Op.between]: [startYear, endYear] } },
    attributes: ['year', 'total_students'],
    raw: true
  });

  // Calculate total higher studies students and total students over 5 years
  let totalHigherStudies = 0;
  let totalStudents = 0;
  const yearlyData = [];

  for (let year = startYear; year <= endYear; year++) {
    const higherStudies = higherStudiesCounts.find(h => h.session === year);
    const extendedProfile = extendedProfiles.find(e => e.year === year);
    
    const higherStudiesCount = higherStudies ? parseInt(higherStudies.unique_students) : 0;
    const studentCount = extendedProfile ? parseInt(extendedProfile.total_students) : 0;
    
    totalHigherStudies += higherStudiesCount;
    totalStudents += studentCount;
    
    yearlyData.push({
      year,
      higherStudiesStudents: higherStudiesCount,
      totalStudents: studentCount
    });
  }

  // Calculate overall percentage
  const percentage = totalStudents > 0 ? (totalHigherStudies / totalStudents) * 100 : 0;

  // Insert or update score
  let [entry, created] = await Score.findOrCreate({
    where: {
      criteria_code: criteria.criteria_code,
      session: currentYear
    },
    defaults: {
      criteria_code: criteria.criteria_code,
      criteria_id: criteria.criterion_id,
      sub_criteria_id: criteria.sub_criterion_id,
      sub_sub_criteria_id: criteria.sub_sub_criterion_id,
      score_criteria: 0,
      score_sub_criteria: 0,
      score_sub_sub_criteria: percentage,
      session: currentYear
    }
  });

  if (!created) {
    await Score.update({
      score_sub_sub_criteria: percentage
    }, {
      where: {
        criteria_code: criteria.criteria_code,
        session: currentYear
      }
    });

    entry = await Score.findOne({
      where: {
        criteria_code: criteria.criteria_code,
        session: currentYear
      }
    });
  }

  return res.status(200).json(
    new apiResponse(200, {
      score: entry.score_sub_sub_criteria,
      totalHigherStudies,
      totalStudents,
      yearlyData,
      criteria_code: criteria.criteria_code,
      session: currentYear
    }, created ? "Score created successfully" : "Score updated successfully")
  );
});

const createResponse141 = asyncHandler(async (req, res) => {
  /*
    1. Extract input from req.body
    2. Validate required fields and logical constraints
    3. Check if programme_name or programme_code already exists for the same year and session
    4. Get criteria_code from criteria_master
    5. Get latest IIQA session and validate session window
    6. Create or update response in response_1_4_1 table
  */

  const {
    session,
    year,
    option_selected,
  } = req.body;

  // Step 1: Field validation
  if (
    !session || !year || !option_selected
  ) {
    throw new apiError(400, "Missing required fields");
  }

  const currentYear = new Date().getFullYear();
  if (
    session < 1990 || session > currentYear ||
    year < 1990 || year > currentYear
  ) {
    throw new apiError(400, "Year and session must be between 1990 and current year");
  }

  if (option_selected < 0 || option_selected > 4) {
    throw new apiError(400, "Option selected must be between 0 and 4");
  }

  

  // Step 2: Check for existing programme_name or programme_code in same session/year
  const existingRecord = await Criteria141.findOne({
    where: {
      session,
      year,
      option_selected: option_selected
    }
  });

  if (existingRecord) {
    if (existingRecord.option_selected === option_selected) {
      throw new apiError(400, "Option selected already exists for this session and year");
    } 
  }

  // Step 3: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '01',
      sub_criterion_id: '0104',
      sub_sub_criterion_id: '010401'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  // Step 4: Validate session window against IIQA
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (session < startYear || session > endYear) {
    throw new apiError(400, "Session must be between ${startYear} and ${endYear}");
  }

  // Step 5: Create or update response
  let [entry, created] = await Criteria141.findOrCreate({
    where: {
      session,
      year,
      option_selected
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session,
      year,
      option_selected
    }
  });

  if (!created) {
    await Criteria141.update({
      option_selected
    },
    {
      where: {
        session,
        year,
        option_selected
      }
    });

    entry = await Criteria141.findOne({
      where: {
        session,
        year,
        option_selected
      }
    });
  }

  return res.status(201).json(
    new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});

const score141 = asyncHandler(async (req, res) => {
  const criteria_code = convertToPaddedFormat("1.4.1");
  const currentYear = new Date().getFullYear();
  const sessionDate = new Date(currentYear, 0, 1); // Jan 1st of current year

  // Get criteria details
  const criteria = await CriteriaMaster.findOne({
    where: { 
      sub_sub_criterion_id: criteria_code
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria 1.4.1 not found in criteria_master");
  }

  // Get the latest response for this criteria
  const response = await Criteria141.findOne({
    where: {
      criteria_code: criteria.criteria_code
    },
    order: [['created_at', 'DESC']],
    raw: true
  });

  if (!response) {
    throw new apiError(404, "No response found for criteria 1.4.1");
  }

  const optionSelected = response.option_selected;
  let score, grade;

  // Map option to score and grade
  switch(optionSelected) {
    case '4':
      score = 4;
      grade = "A";
      break;
    case '3':
      score = 3;
      grade = "B";
      break;
    case '2':
      score = 2;
      grade = "C";
      break;
    case '1':
      score = 1;
      grade = "D";
      break;
    case '0':
    default:
      score = 0;
      grade = "E";
  }

  // Create or update score
  const [entry, created] = await Score.upsert({
    criteria_code: criteria.criteria_code,
    criteria_id: criteria.criterion_id,
    sub_criteria_id: criteria.sub_criterion_id,
    sub_sub_criteria_id: criteria.sub_sub_criterion_id,
    score_criteria: 0,
    score_sub_criteria: 0,
    score_sub_sub_criteria: score,
    session: sessionDate,
    year: currentYear,
    cycle_year: 1
  }, {
    conflictFields: ['criteria_code', 'session', 'year']
  });

  return res.status(200).json(
    new apiResponse(200, {
      score,
      optionSelected,
      grade,
      message: `Grade is ${grade} (Selected option: ${optionSelected})`
    }, created ? "Score created successfully" : "Score updated successfully")
  );
});

const createResponse142 = asyncHandler(async (req, res) => {
  /*
    1. Extract input from req.body
    2. Validate required fields and logical constraints
    3. Check if programme_name or programme_code already exists for the same year and session
    4. Get criteria_code from criteria_master
    5. Get latest IIQA session and validate session window
    6. Create or update response in response_1_4_1 table
  */

  const {
    session,
    year,
    option_selected,
  } = req.body;

  // Step 1: Field validation
  if (
    !session || !year || !option_selected
  ) {
    throw new apiError(400, "Missing required fields");
  }

  const currentYear = new Date().getFullYear();
  if (
    session < 1990 || session > currentYear ||
    year < 1990 || year > currentYear
  ) {
    throw new apiError(400, "Year and session must be between 1990 and current year");
  }

  if (option_selected < 0 || option_selected > 4) {
    throw new apiError(400, "Option selected must be between 0 and 4");
  }

  

  // Step 2: Check for existing programme_name or programme_code in same session/year
  const existingRecord = await Criteria142.findOne({
    where: {
      session,
      year,
      option_selected: option_selected
    }
  });

  if (existingRecord) {
    if (existingRecord.option_selected === option_selected) {
      throw new apiError(400, "Option selected already exists for this session and year");
    } 
  }

  // Step 3: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '01',
      sub_criterion_id: '0104',
      sub_sub_criterion_id: '010402'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  // Step 4: Validate session window against IIQA
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (session < startYear || session > endYear) {
    throw new apiError(400, "Session must be between ${startYear} and ${endYear}");
  }

  // Step 5: Create or update response
  let [entry, created] = await Criteria142.findOrCreate({
    where: {
      session,
      year,
      option_selected
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session,
      year,
      option_selected
    }
  });

  if (!created) {
    await Criteria142.update({
      option_selected
    },
    {
      where: {
        session,
        year,
        option_selected
      }
    });

    entry = await Criteria142.findOne({
      where: {
        session,
        year,
        option_selected
      }
    });
  }

  return res.status(201).json(
    new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});

const score142 = asyncHandler(async (req, res) => {
  const criteria_code = convertToPaddedFormat("1.4.2");
  const currentYear = new Date().getFullYear();
  const sessionDate = new Date(currentYear, 0, 1); // Jan 1st of current year

  // Get criteria details
  const criteria = await CriteriaMaster.findOne({
    where: { 
      sub_sub_criterion_id: criteria_code
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria 1.4.2 not found in criteria_master");
  }

  // Get the latest response for this criteria
  const response = await Criteria142.findOne({
    where: {
      criteria_code: criteria.criteria_code
    },
    order: [['created_at', 'DESC']],
    raw: true
  });

  if (!response) {
    throw new apiError(404, "No response found for criteria 1.4.2");
  }

  const optionSelected = response.option_selected;
  let score, grade;

  // Map option to score and grade
  switch(optionSelected) {
    case '4':
      score = 4;
      grade = "A";
      break;
    case '3':
      score = 3;
      grade = "B";
      break;
    case '2':
      score = 2;
      grade = "C";
      break;
    case '1':
      score = 1;
      grade = "D";
      break;
    case '0':
    default:
      score = 0;
      grade = "E";
  }

  // Create or update score
  const [entry, created] = await Score.upsert({
    criteria_code: criteria.criteria_code,
    criteria_id: criteria.criterion_id,
    sub_criteria_id: criteria.sub_criterion_id,
    sub_sub_criteria_id: criteria.sub_sub_criterion_id,
    score_criteria: 0,
    score_sub_criteria: 0,
    score_sub_sub_criteria: score,
    session: sessionDate,
    year: currentYear,
    cycle_year: 1
  }, {
    conflictFields: ['criteria_code', 'session', 'year']
  });

  return res.status(200).json(
    new apiResponse(200, {
      score,
      optionSelected,
      grade,
      message: `Grade is ${grade} (Selected option: ${optionSelected})`
    }, created ? "Score created successfully" : "Score updated successfully")
  );
});


export { createResponse133,
  createResponse132,
  createResponse122_123,
  createResponse121,
  createResponse113,
  getResponsesByCriteriaCode,
   score113,
   score133,
   score121,
   score123,
   score132,
   score141,
   score142,
  

};