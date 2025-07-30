import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import Sequelize from "sequelize";

const Criteria623 = db.response_6_2_3;
const Criteria632 = db.response_6_3_2;
const Criteria633 = db.response_6_3_3;
const Criteria634 = db.response_6_3_4;
const Criteria642 = db.response_6_4_2;
const Criteria653 = db.response_6_5_3;
const CriteriaMaster = db.criteria_master;
const Score = db.scores;
const IIQA = db.iiqa_form;
const IIQA_Student_Details = db.iiqa_student_details;
const IIQAStaffDetails = db.iiqa_staff_details;
const extended_profile = db.extended_profile;


// Convert criteria code to padded format (e.g., '6.2.3' -> '060203')
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


//6.2.3


const createResponse623 = asyncHandler(async (req, res) => {
  const {
    session,
    implimentation,
    area_of_e_governance,
    year_of_implementation,
  } = req.body;

  console.log("Received implimentation:", implimentation); // Debug

  // Validation
  if (
    session === undefined ||
    implimentation === undefined
  ) {
    throw new apiError(400, "Missing required fields");
  }

  const currentYear = new Date().getFullYear();
  if (
    session < 1990 || session > currentYear
  ) {
    throw new apiError(400, "Session must be between 1990 and current year");
  }

  if (implimentation < 0 || implimentation > 4) {
    throw new apiError(400, "Implimentation must be between 0 and 4");
  }

  // Get criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '06',
      sub_criterion_id: '0602',
      sub_sub_criterion_id: '060203'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  // Validate session window against IIQA
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['id', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (session < startYear || session > endYear) {
    throw new apiError(400, `Session must be between ${startYear} and ${endYear}`);
  }

  // Find existing record by session only
  const existingRecord = await Criteria623.findOne({
    where: {
      session
    }
  });

  let entry;

  if (existingRecord) {
    await Criteria623.update(
      { implimentation },
      { where: { session } }
    );

    entry = await Criteria623.findOne({ where: { session } });
  } else {
    entry = await Criteria623.create({
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session,
      implimentation,
      area_of_e_governance,
      year_of_implementation
    });
  }

  console.log("Saved implimentation:", entry.implimentation);

  return res.status(201).json(
    new apiResponse(201, entry, existingRecord ? "Response updated successfully" : "Response created successfully")
  );
});

 //6.3.2


 const createResponse632 = asyncHandler(async (req, res) => {
  /*
    1. Extract input from req.body
    2. Validate required fields and logical constraints
    3. Get criteria_code from criteria_master
    4. Get latest IIQA session and validate session window
    5. Create or update response in response_6_3_2 table
  */

  const {
    session,
    year,
    teacher_name,
    conference_name,
    professional_body,
    amt_of_spt_received,
  } = req.body;

  // Step 1: Field validation
  if (
    !session ||
    !year ||
    !teacher_name ||
    !conference_name ||
    !professional_body ||
    !amt_of_spt_received
  ) {
    throw new apiError(400, "Missing required fields");
  }

  const currentYear = new Date().getFullYear();
  if (session < 1990 || session > currentYear) {
    throw new apiError(400, "Session must be between 1990 and current year");
  }

  if (year < 1990 || year > currentYear) {
    throw new apiError(400, "Year must be between 1990 and current year");
  }

  // Step 2: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '06',
      sub_criterion_id: '0603',
      sub_sub_criterion_id: '060302'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  // Step 3: Validate session window against IIQA
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
    throw new apiError(400, `Session must be between ${startYear} and ${endYear}`);
  }

  // Step 4: Create or update response
  let [entry, created] = await Criteria632.findOrCreate({
    where: {
      session,
      teacher_name,
      conference_name
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session,
      year,
      teacher_name,
      conference_name,
      professional_body,
      amt_of_spt_received
    }
  });

  if (!created) {
    await Criteria632.update({
      year,
      professional_body,
      amt_of_spt_received
    }, {
      where: {
        session,
        teacher_name,
        conference_name
      }
    });

    entry = await Criteria632.findOne({
      where: {
        session,
        teacher_name,
        conference_name
      }
    });
  }

  return res.status(201).json(
    new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});


//6.3.3

const createResponse633 = asyncHandler(async (req, res) => {
  const {
    session,
    from_to_date,
    title_of_prof_dev,
    title_of_add_training
  } = req.body;

  // Step 1: Field validation
  if (!session || !from_to_date || !title_of_prof_dev || !title_of_add_training) {
    throw new apiError(400, "Missing required fields");
  }

  const currentYear = new Date().getFullYear();
  if (session < 1990 || session > currentYear) {
    throw new apiError(400, "Session must be between 1990 and current year");
  }

  // Step 2: Prevent duplicate entries
  const duplicate = await Criteria633.findOne({
    where: { session, from_to_date, title_of_prof_dev, title_of_add_training }
  });

  if (duplicate) {
    throw new apiError(409, "Entry already exists for this session with the same date and titles");
  }

  // Step 3: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '06',
      sub_criterion_id: '0603',
      sub_sub_criterion_id: '060303'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  // Step 4: Validate session window against latest IIQA
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
    throw new apiError(400, `Session must be between ${startYear} and ${endYear}`);
  }

  // Step 5: Create new entry
  const newEntry = await Criteria633.create({
    id: criteria.id,
    criteria_code: criteria.criteria_code,
    session,
    from_to_date,
    title_of_prof_dev,
    title_of_add_training
  });

  return res.status(201).json(
    new apiResponse(201, newEntry, "Response created successfully")
  );
});


//6.3.4

const createResponse634 = asyncHandler(async (req, res) => {
  const {
    session,
    teacher_name,
    program_title,
    from_to_date
  } = req.body;

  // Step 1: Field validation
  if (!session || !teacher_name || !program_title || !from_to_date) {
    throw new apiError(400, "Missing required fields");
  }

  const currentYear = new Date().getFullYear();
  if (session < 1990 || session > currentYear) {
    throw new apiError(400, "Session must be between 1990 and current year");
  }

  // Step 2: Prevent duplicates — same session + teacher + program_title
  const duplicate = await Criteria634.findOne({
    where: { session, teacher_name, program_title }
  });

  if (duplicate) {
    throw new apiError(409, "Entry already exists for this teacher, session, and program");
  }

  // Step 3: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '06',
      sub_criterion_id: '0603',
      sub_sub_criterion_id: '060304'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  // Step 4: Validate session window against latest IIQA
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
    throw new apiError(400, `Session must be between ${startYear} and ${endYear}`);
  }

  // Step 5: Create new entry
  const newEntry = await Criteria634.create({
    id: criteria.id,
    criteria_code: criteria.criteria_code,
    session,
    teacher_name,
    program_title,
    from_to_date
  });

  return res.status(201).json(
    new apiResponse(201, newEntry, "Response created successfully")
  );
});


//6.4.2

const createResponse642 = asyncHandler(async (req, res) => {
  const {
    session,
    year,
    donor_name,
    grant_amount_lakhs
  } = req.body;

  // Step 1: Field validation
  if (!session || !year || !donor_name || grant_amount_lakhs === undefined) {
    throw new apiError(400, "Missing required fields");
  }

  const currentYear = new Date().getFullYear();
  if (session < 1990 || session > currentYear || year < 1990 || year > currentYear) {
    throw new apiError(400, "Year and session must be between 1990 and current year");
  }

  if (grant_amount_lakhs < 0) {
    throw new apiError(400, "Grant amount cannot be negative");
  }

  // Step 2: Prevent duplicates — same session + year + donor
  const duplicate = await Criteria642.findOne({
    where: { session, year, donor_name }
  });

  if (duplicate) {
    throw new apiError(409, "Entry already exists for this session, year, and donor");
  }

  // Step 3: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '06',
      sub_criterion_id: '0604',
      sub_sub_criterion_id: '060402'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  // Step 4: Validate session window against latest IIQA
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
    throw new apiError(400, `Session must be between ${startYear} and ${endYear}`);
  }

  // Step 5: Create new entry
  const newEntry = await Criteria642.create({
    id: criteria.id,
    criteria_code: criteria.criteria_code,
    session,
    year,
    donor_name,
    grant_amount_lakhs
  });

  return res.status(201).json(
    new apiResponse(201, newEntry, "Response created successfully")
  );
});


//6.5.3


const createResponse653 = asyncHandler(async (req, res) => {
  const {
    session,
    initiative_type,
    year,
    reg_meetings_of_the_IQAC_head,
    conf_seminar_workshops_on_quality_edu,
    collab_quality_initiatives,
    participation_in_NIRF,
    from_to_date,
    other_quality_audit,
  } = req.body;

  // Step 1: Validate input fields
  if (
    session === undefined ||
    initiative_type === undefined ||
    year === undefined ||
    reg_meetings_of_the_IQAC_head === undefined ||
    conf_seminar_workshops_on_quality_edu === undefined ||
    collab_quality_initiatives === undefined ||
    participation_in_NIRF === undefined ||
    from_to_date === undefined ||
    other_quality_audit === undefined
  ) {
    throw new apiError(400, "Missing required fields");
  }

  const currentYear = new Date().getFullYear();
  if (session < 1990 || session > currentYear || year < 1990 || year > currentYear) {
    throw new apiError(400, "Session and year must be between 1990 and current year");
  }

  if (initiative_type < 0 || initiative_type > 4) {
    throw new apiError(400, "Initiative type must be between 0 and 4");
  }

  // Step 2: Get Criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '06',
      sub_criterion_id: '0605',
      sub_sub_criterion_id: '060503'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  // Step 3: Validate session range using latest IIQA
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['id', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (session < startYear || session > endYear) {
    throw new apiError(400, `Session must be between ${startYear} and ${endYear}`);
  }

  // Step 4: Update or Create Entry
  let entry;
  const existingRecord = await Criteria653.findOne({ where: { session } });

  if (existingRecord) {
    await Criteria653.update(
      { initiative_type },
      { where: { session } }
    );
    entry = await Criteria653.findOne({ where: { session } });
  } else {
    entry = await Criteria653.create({
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session,
      initiative_type,
      year,
      reg_meetings_of_the_IQAC_head,
      conf_seminar_workshops_on_quality_edu,
      collab_quality_initiatives,
      participation_in_NIRF,
      from_to_date,
      other_quality_audit,
    });
  }

  return res.status(201).json(
    new apiResponse(201, entry, existingRecord ? "Response updated successfully" : "Response created successfully")
  );
});
