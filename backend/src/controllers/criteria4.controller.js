import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

const Criteria413 = db.response_4_1_3;
const Criteria414 = db.response_4_1_4;
const CriteriaMaster = db.criteria_master;
const IIQA = db.iiqa_form;
const ExtendedProfile = db.extended_profile;
const Criteria422 = db.response_4_2_2;
const Criteria423 = db.response_4_2_3;
const Criteria424 = db.response_4_2_4;
const Criteria432 = db.response_4_3_2;
const Criteria441 = db.response_4_4_1;

/*
1. 413
2. 414 done
3. 422423
4. 424
5. 432
6. 441
*/
/**
 * @route POST /api/response/4.1.3
 * @description Create a new response for criteria 4.1.3
 * @access Private/Admin
 */
const createResponse413 = asyncHandler(async (req, res) => {

  const { session, room_identifier, typeict_facility } = req.body;

  const sessionYear = Number(session);
  const room = String(room_identifier);
  const facilityType = String(typeict_facility);

  if (!sessionYear || !room || !facilityType) {
    throw new apiError(400, "Missing or invalid required fields");
  }

  const currentYear = new Date().getFullYear();
  if (sessionYear < 1990 || sessionYear > currentYear) {
    throw new apiError(400, "Session year must be between 1990 and current year");
  }

  // Fetch Criteria
  const criteria = await CriteriaMaster.findOne({
    where: {
      sub_sub_criterion_id: '040103',
      sub_criterion_id: '0401',
      criterion_id: '04'
    }
  });

  if (!criteria) throw new apiError(404, "Criteria not found");

  // Check session range with IIQA
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) throw new apiError(404, "IIQA not found");

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (sessionYear < startYear || sessionYear > endYear) {
    throw new apiError(400, `Session must be between ${startYear} and ${endYear}`);
  }

  // Upsert entry
  let [entry, created] = await Criteria413.findOrCreate({
    where: {
      session: sessionYear,
      criteria_code: criteria.criteria_code,
      room_identifier: room
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session: sessionYear,
      room_identifier: room,
      typeict_facility: facilityType
    }
  });

  if (!created) {
    await Criteria413.update({
      typeict_facility: facilityType
    }, {
      where: {
        session: sessionYear,
        criteria_code: criteria.criteria_code,
        room_identifier: room
      }
    });

    entry = await Criteria413.findOne({
      where: {
        session: sessionYear,
        criteria_code: criteria.criteria_code,
        room_identifier: room
      }
    });
  }

  return res.status(created ? 201 : 200).json(
    new apiResponse(created ? 201 : 200, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});

const score413 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("4.1.3");
  
  const criteria = await CriteriaMaster.findOne({
    where: { sub_sub_criterion_id: criteria_code }
  });
  
  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }
  // 5 Years should be calculated form IIQA session DB
  const currentIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']] // Get the most recent IIQA form
  });
  
  if (!currentIIQA) {
    throw new apiError(404, "No IIQA form found");
  }
  
  const startDate = currentIIQA.session_end_year - 5;
  const endDate = currentIIQA.session_end_year;
  
  if (session < startDate || session > endDate) {
    throw new apiError(400, "Session must be between the latest IIQA session and the current year");
  }

  const responses = await Criteria413.findAll({
    attributes: ['room_identifier'],
    where: {
      session: {
        [Op.between]: [startDate, endDate]
      },
      criteria_code: criteria.criteria_code
    }
  });

  const extendedProfile = await ExtendedProfile.findOne({
    attributes: ['total_classroom', 'total_seminar_hall'],
    where: {
      session: session
    }
  });

  if (!extendedProfile) {
    throw new apiError(404, "Extended profile not found");
  }

  const totalClassroom = extendedProfile.total_classroom;
  const totalSeminarHall = extendedProfile.total_seminar_hall;

  if(totalClassroom === 0 && totalSeminarHall === 0){
    throw new apiError(400, "Total classroom and seminar hall is 0");
  }

  const noOfRooms = responses.length;

  //get extended profile
  //divide responses room by total classroom or seminar hall in extended profile
  const score = (noOfRooms / (totalClassroom + totalSeminarHall)) * 100;

  return res.status(200).json(
    new apiResponse(200, score, "Score calculated successfully")
  ); 
});


const createResponse414 = asyncHandler(async (req, res) => {
  const {
    session,
    year,
    budget_allocated_infra_aug,
    expenditure_infra_aug,
    total_expenditure_excl_salary,
    expenditure_academic_maint,
    expenditure_physical_maint
  } = req.body;

  const sessionYear = Number(session);
  const yearVal = Number(year);
  const budget = Number(budget_allocated_infra_aug);
  const infraExpenditure = Number(expenditure_infra_aug);
  const totalExpenditure = Number(total_expenditure_excl_salary);
  const academicMaint = Number(expenditure_academic_maint);
  const physicalMaint = Number(expenditure_physical_maint);

  if (
    !sessionYear ||
    !yearVal ||
    isNaN(budget) ||
    isNaN(infraExpenditure) ||
    isNaN(totalExpenditure) ||
    isNaN(academicMaint) ||
    isNaN(physicalMaint)
  ) {
    throw new apiError(400, "Missing or invalid required fields");
  }

  const currentYear = new Date().getFullYear();

  if (
    sessionYear < 1990 || sessionYear > currentYear ||
    yearVal < 1990 || yearVal > currentYear
  ) {
    throw new apiError(400, "Years must be between 1990 and current year");
  }

  const criteria = await CriteriaMaster.findOne({
    where: {
      sub_sub_criterion_id: '040104',
      sub_criterion_id: '0401',
      criterion_id: '04'
    }
  });

  if (!criteria) throw new apiError(404, "Criteria not found");

  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) throw new apiError(404, "IIQA not found");

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (sessionYear < startYear || sessionYear > endYear) {
    throw new apiError(400, `Session must be between ${startYear} and ${endYear}`);
  }

  let [entry, created] = await Criteria414.findOrCreate({
    where: {
      session: sessionYear,
      criteria_code: criteria.criteria_code,
      year: yearVal
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session: sessionYear,
      year: yearVal,
      budget_allocated_infra_aug: budget,
      expenditure_infra_aug: infraExpenditure,
      total_expenditure_excl_salary: totalExpenditure,
      expenditure_academic_maint: academicMaint,
      expenditure_physical_maint: physicalMaint
    }
  });

  if (!created) {
    await Criteria414.update({
      budget_allocated_infra_aug: budget,
      expenditure_infra_aug: infraExpenditure,
      total_expenditure_excl_salary: totalExpenditure,
      expenditure_academic_maint: academicMaint,
      expenditure_physical_maint: physicalMaint
    }, {
      where: {
        session: sessionYear,
        criteria_code: criteria.criteria_code,
        year: yearVal
      }
    });

    entry = await Criteria414.findOne({
      where: {
        session: sessionYear,
        criteria_code: criteria.criteria_code,
        year: yearVal
      }
    });
  }

  return res.status(created ? 201 : 200).json(
    new apiResponse(created ? 201 : 200, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});

const score414  = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("2.1.1");

  const criteria = await CriteriaMaster.findOne({
    where: { sub_sub_criterion_id: criteria_code }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  // 5 Years should be calculated form IIQA session DB
  const currentIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']] // Get the most recent IIQA form
  });

  if (!currentIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const startDate = currentIIQA.session_end_year - 5;
  const endDate = currentIIQA.session_end_year;

  if (session < startDate || session > endDate) {
    throw new apiError(400, "Session must be between the latest IIQA session and the current year");
  }

  // Fetch all responses from the last 5 years
  const responses = await Criteria414.findAll({
    attributes: ['expenditure_infra_aug', 'total_expenditure_excl_salary','year', 'session'],
    where: {
      criteria_code: criteria.criteria_code,
      session: {
      [Sequelize.Op.between]: [startDate, endDate]
    }
  },
  order: [['session', 'DESC']]
});


  if (!responses.length) {
    throw new apiError(404, "No responses found for Criteria 2.1.2 in the session range");
  }

  // Group responses by session
  const groupedBySession = {};
  responses.forEach(response => {
   const session = response.session;
    if (!groupedBySession[session]) {
      groupedBySession[session] = { expenditure_infra_aug: 0, total_expenditure_excl_salary: 0 };
    }
    groupedBySession[session].expenditure_infra_aug += response.expenditure_infra_aug || 0;
    groupedBySession[session].total_expenditure_excl_salary += response.total_expenditure_excl_salary || 0;
});

console.log(groupedBySession);
// Calculate score for each year
const scores = [];
for (const session of Object.keys(groupedBySession).sort((a, b) => b - a)) {
  const infra = groupedBySession[session].expenditure_infra_aug;
  const total = groupedBySession[session].total_expenditure_excl_salary;
  const score = (infra / total) * 100;
  scores.push({ session, score });
}

console.log(scores);
return res.status(200).json(
  new apiResponse(200, scores, "Scores calculated successfully")
);
})


/**
 * @route POST /api/response/4.2.2 & 4.2.3
 * @description Create a new response for criteria 4.2.2 & 4.2.3
 * @access Private/Admin
 */

const createResponse422_423 = asyncHandler(async (req, res) => {
  const {
    session,
    year,
    resource_type,
    subscription_detail,
    expenditure_lakhs,
    total_expenditure
  } = req.body;

  // Validate required fields
  if (
    !session ||
    !year ||
    !resource_type ||
    !subscription_detail ||
    expenditure_lakhs === undefined ||
    total_expenditure === undefined
  ) {
    throw new apiError(400, "Missing required fields");
  }

  if (session < 1990 || session > new Date().getFullYear()) {
    throw new apiError(400, "Session year must be between 1990 and current year");
  }

  if (year < 1990 || year > new Date().getFullYear()) {
    throw new apiError(400, "Year must be between 1990 and current year");
  }

  // Get IIQA session range for validation
  const latestIIQA = await IIQA.findOne({
    attributes: ["session_end_year"],
    order: [["created_at", "DESC"]],
  });

  if (!latestIIQA) {
    throw new apiError(404, "IIQA session not found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (session < startYear || session > endYear) {
    throw new apiError(400, `Session must be between ${startYear} and ${endYear}`);
  }

  // Start transaction
  const transaction = await db.sequelize.transaction();

  try {
    // Step 1: Get both 4.2.2 and 4.2.3 criteria from master
    const criteriaList = await CriteriaMaster.findAll({
      where: {
        sub_sub_criterion_id: { [Sequelize.Op.in]: ['040202', '040203'] },
        sub_criterion_id: '0402',
        criterion_id: '04'
      },
      transaction
    });

    if (!criteriaList || criteriaList.length !== 2) {
      await transaction.rollback();
      throw new apiError(404, "One or both criteria not found");
    }

    // Step 2: Map each sub_sub_criterion_id to model
    const modelMap = {
      '040202': { model: Criteria422, name: '4.2.2' },
      '040203': { model: Criteria423, name: '4.2.3' }
    };

    const responses = [];

    for (const criteria of criteriaList) {
      const { model: Model, name } = modelMap[criteria.sub_sub_criterion_id];
      if (!Model) continue;

      try {
        const [entry, created] = await Model.findOrCreate({
          where: {
            session,
            year,
            resource_type
          },
          defaults: {
            id: criteria.id,
            criteria_code: criteria.criteria_code,
            session,
            year,
            resource_type,
            subscription_detail,
            expenditure_lakhs,
            total_expenditure
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
        await transaction.rollback();
        throw new apiError(500, `Failed to create entry for criteria ${name}: ${error.message}`);
      }
    }

    // Commit transaction if all went well
    await transaction.commit();

    return res.status(200).json(
      new apiResponse(200, { responses }, "Operation completed successfully")
    );

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
  
  res.status(200).json(
      new apiResponse(200, criteria, "Criteria found")
  );
});

/**
 * @route POST /api/response/4.2.4
 * @description Create a new response for criteria 4.2.4
 * @access Private/Admin
 */

const createResponse424 = asyncHandler(async (req, res) => {
  const {
    session,
    no_of_teachers_stds,
    total_teachers_stds
  } = req.body;

  const sessionYear = Number(session);
  const noOfTeachers = Number(no_of_teachers_stds);
  const totalTeachers = Number(total_teachers_stds);

  if (!sessionYear || !noOfTeachers || !totalTeachers) {
    throw new apiError(400, "Missing or invalid required fields");
  }

  const currentYear = new Date().getFullYear();
  if (sessionYear < 1990 || sessionYear > currentYear) {
    throw new apiError(400, "Session year must be between 1990 and current year");
  }

  // Fetch Criteria for 4.2.4
  const criteria = await CriteriaMaster.findOne({
    where: {
      sub_sub_criterion_id: '040204',
      sub_criterion_id: '0402',
      criterion_id: '04'
    }
  });

  if (!criteria) throw new apiError(404, "Criteria not found");

  // Get session range from latest IIQA
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) throw new apiError(404, "IIQA not found");

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (sessionYear < startYear || sessionYear > endYear) {
    throw new apiError(400, `Session must be between ${startYear} and ${endYear}`);
  }

  // Upsert logic (check if entry exists)
  let [entry, created] = await Criteria424.findOrCreate({
    where: {
      session: sessionYear,
      criteria_code: criteria.criteria_code
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session: sessionYear,
      no_of_teachers_stds: noOfTeachers,
      total_teachers_stds: totalTeachers
    }
  });

  // If already exists, update values
  if (!created) {
    await Criteria424.update({
      no_of_teachers_stds: noOfTeachers,
      total_teachers_stds: totalTeachers
    }, {
      where: {
        session: sessionYear,
        criteria_code: criteria.criteria_code
      }
    });

    entry = await Criteria424.findOne({
      where: {
        session: sessionYear,
        criteria_code: criteria.criteria_code
      }
    });
  }

  return res.status(created ? 201 : 200).json(
    new apiResponse(
      created ? 201 : 200,
      entry,
      created ? "Response created successfully" : "Response updated successfully"
    )
  );
});


const score424 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("2.1.1");

  const criteria = await CriteriaMaster.findOne({
    where: { sub_sub_criterion_id: criteria_code }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  // 5 Years should be calculated form IIQA session DB
  const currentIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']] // Get the most recent IIQA form
  });

  if (!currentIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const startDate = currentIIQA.session_end_year - 5;
  const endDate = currentIIQA.session_end_year;

  if (session < startDate || session > endDate) {
    throw new apiError(400, "Session must be between the latest IIQA session and the current year");
  }

  const responses = await Criteria424.findAll({
    attributes: ['session', 'no_of_teachers_stds', 'total_teachers_stds'],
    where: {
      session: {
        [Sequelize.Op.between]: [startDate, endDate]
      }
    },
    order: [['session', 'DESC']]
  });

  if (!responses.length) {
    throw new apiError(404, "No responses found for Criteria 2.1.2 in the session range");
  }

  if (responses.session !== session) {
    throw new apiError(400, "Response not found for this session");
  }

  const noOfTeachers = responses.reduce((total, response) => total + response.no_of_teachers_stds, 0);
  const totalTeachers = responses.reduce((total, response) => total + response.total_teachers_stds, 0);

  const score = (noOfTeachers / totalTeachers) * 100;

  return res.status(200).json(
    new apiResponse(200, score, "Score calculated successfully")
  );
})


const createResponse432 = asyncHandler(async (req, res) => {
  const {
    session,
    academic_year,
    total_students,
    working_computers,
    student_computer_ratio
  } = req.body;

  const sessionYear = Number(session);
  const academicYear = Number(academic_year);
  const totalStudents = Number(total_students);
  const workingComputers = Number(working_computers);
  const ratio = Number(student_computer_ratio);

  if (!sessionYear || !academicYear || !totalStudents || !workingComputers || !ratio) {
    throw new apiError(400, "Missing or invalid required fields");
  }

  const currentYear = new Date().getFullYear();
  if (sessionYear < 1990 || sessionYear > currentYear) {
    throw new apiError(400, "Session year must be between 1990 and current year");
  }

  if (academicYear < 1990 || academicYear > currentYear) {
    throw new apiError(400, "Academic year must be between 1990 and current year");
  }

  const criteria = await CriteriaMaster.findOne({
    where: {
      sub_sub_criterion_id: '040302',
      sub_criterion_id: '0403',
      criterion_id: '04'
    }
  });

  if (!criteria) throw new apiError(404, "Criteria not found");

  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) throw new apiError(404, "IIQA not found");

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (sessionYear < startYear || sessionYear > endYear) {
    throw new apiError(400, `Session must be between ${startYear} and ${endYear}`);
  }

  let [entry, created] = await Criteria432.findOrCreate({
    where: {
      session: sessionYear,
      criteria_code: criteria.criteria_code,
      academic_year: academicYear
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session: sessionYear,
      academic_year: academicYear,
      total_students: totalStudents,
      working_computers: workingComputers,
      student_computer_ratio: ratio
    }
  });

  if (!created) {
    await Criteria432.update({
      total_students: totalStudents,
      working_computers: workingComputers,
      student_computer_ratio: ratio
    }, {
      where: {
        session: sessionYear,
        criteria_code: criteria.criteria_code,
        academic_year: academicYear
      }
    });

    entry = await Criteria432.findOne({
      where: {
        session: sessionYear,
        criteria_code: criteria.criteria_code,
        academic_year: academicYear
      }
    });
  }

  return res.status(created ? 201 : 200).json(
    new apiResponse(created ? 201 : 200, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});


const createResponse441 = asyncHandler(async (req, res) => {
  const {
    session,
    year,
    budget_allocated_infra,
    expenditure_infra_lakhs,
    total_exp_infra_lakhs,
    exp_maintainance_acad,
    exp_maintainance_physical
  } = req.body;

  const sessionYear = Number(session);
  const yearVal = Number(year);
  const budget = Number(budget_allocated_infra);
  const expenditure = Number(expenditure_infra_lakhs);
  const totalExp = Number(total_exp_infra_lakhs);
  const maintainAcad = Number(exp_maintainance_acad);
  const maintainPhysical = Number(exp_maintainance_physical);

  if (!sessionYear || !yearVal || !budget || !expenditure || !totalExp || !maintainAcad || !maintainPhysical) {
    throw new apiError(400, "Missing or invalid required fields");
  }

  const currentYear = new Date().getFullYear();
  if (sessionYear < 1990 || sessionYear > currentYear) {
    throw new apiError(400, "Session year must be between 1990 and current year");
  }

  const criteria = await CriteriaMaster.findOne({
    where: {
      sub_sub_criterion_id: '040401',
      sub_criterion_id: '0404',
      criterion_id: '04'
    }
  });

  if (!criteria) throw new apiError(404, "Criteria not found");

  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) throw new apiError(404, "IIQA not found");

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if (sessionYear < startYear || sessionYear > endYear) {
    throw new apiError(400, `Session must be between ${startYear} and ${endYear}`);
  }

  let [entry, created] = await Criteria441.findOrCreate({
    where: {
      session: sessionYear,
      criteria_code: criteria.criteria_code,
      year: yearVal
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session: sessionYear,
      year: yearVal,
      budget_allocated_infra: budget,
      expenditure_infra_lakhs: expenditure,
      total_exp_infra_lakhs: totalExp,
      exp_maintainance_acad: maintainAcad,
      exp_maintainance_physical: maintainPhysical
    }
  });

  if (!created) {
    await Criteria441.update({
      budget_allocated_infra: budget,
      expenditure_infra_lakhs: expenditure,
      total_exp_infra_lakhs: totalExp,
      exp_maintainance_acad: maintainAcad,
      exp_maintainance_physical: maintainPhysical
    }, {
      where: {
        session: sessionYear,
        criteria_code: criteria.criteria_code,
        year: yearVal
      }
    });

    entry = await Criteria441.findOne({
      where: {
        session: sessionYear,
        criteria_code: criteria.criteria_code,
        year: yearVal
      }
    });
  }

  return res.status(created ? 201 : 200).json(
    new apiResponse(created ? 201 : 200, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});

