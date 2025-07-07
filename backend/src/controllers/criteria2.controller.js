import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

const Criteria211 = db.response_2_1_1;
const Criteria212 = db.response_2_1_2;
const Criteria241243222233 = db.response_2_4_1and_2_4_3and2_2_2and2_3_3;
const Criteria242 = db.response_2_4_2;
const Criteria263 = db.response_2_6_3;
const Criteria271 = db.response_2_7_1;
const CriteriaMaster = db.criteria_master;

const getAllCriteria211 = asyncHandler(async (req, res) => {
    const criteria = await Criteria211.findAll();
    if (!criteria) {
        throw new apiError(404, "Criteria not found");
    }
    
    res.status(200).json(
        new apiResponse(200, criteria, "Criteria found")
    );
});

/**
 * @route POST /api/response/2.1.1
 * @description Create a new response for criteria 2.1.1
 * @access Private/Admin
 */
const createResponse211 = asyncHandler(async (req, res) => {
        console.log(CriteriaMaster)
        const criteria = await CriteriaMaster.findOne({
            where: {
              sub_sub_criterion_id: '020101',
              sub_criterion_id: '0201',
              criterion_id: '02'
            }
          });
      
          if (!criteria) {
            throw new apiError(404, "Criteria not found");
          }
      
          // Validate required fields
          const {session,year,programme_name, programme_code, no_of_seats, no_of_students } = req.body;
          if (!year || !programme_name || !programme_code || !no_of_seats || !no_of_students) {
            throw new apiError(400, "Missing required fields");
          }

          if (year < 1990 || year > new Date().getFullYear()) {
            throw new apiError(400, "Year must be between 1990 and current year");
          }

          // Create proper Date objects for session
          const sessionDate = new Date(year, 0, 1); // Jan 1st of the given year
          console.log(criteria.criteria_code)
          // Insert into response_2_1_1_data
          const entry = await Criteria211.create({
            id: criteria.id,
            criteria_code: criteria.criteria_code,
            session: sessionDate,  // Store as Date object
            year: year,        // Store as Date object
            programme_name,
            programme_code,
            no_of_seats,
            no_of_students
          });
      
          res.status(201).json(
            new apiResponse(201, entry, "Response created successfully")
          );

});
/**
 * @route GET /api/response/2.1.1/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
const getResponsesByCriteriaCode = async (req, res, next) => {
    try {
        const { criteriaCode } = req.params;
        
        const responses = await db.response_2_1_1.findAll({
            where: { criteria_code: criteriaCode },
            include: [{
                model: db.criteria_master,
                as: 'criteria',
                attributes: ['criterion_id', 'sub_criterion_id', 'sub_sub_criterion_id']
            }],
            order: [['submitted_at', 'DESC']]
        });

        return res.status(200).json(
            new apiResponse(200, responses, 'Responses retrieved successfully')
        );

    } catch (error) {
        next(error);
    }
};
export { getAllCriteria211,
    createResponse211,
    getResponsesByCriteriaCode
 };




 const getAllCriteria212 = asyncHandler(async (req, res) => {
  const criteria = await Criteria212.findAll();
  if (!criteria) {
      throw new apiError(404, "Criteria not found");
  }
  
  res.status(200).json(
      new apiResponse(200, criteria, "Criteria found")
  );
});

/**
* @route POST /api/response/2.1.2
* @description Create a new response for criteria 2.1.2
* @access Private/Admin
*/
const createResponse212 = asyncHandler(async (req, res) => {
      console.log(CriteriaMaster)
      const criteria = await CriteriaMaster.findOne({
          where: {
            sub_sub_criterion_id: '020102',
            sub_criterion_id: '0201',
            criterion_id: '02'
          }
        });
    
        if (!criteria) {
          throw new apiError(404, "Criteria not found");
        }
    
        // Validate required fields
        const {session,year,number_of_seats_earmarked_for_reserved_category_as_per_GOI, number_of_students_admitted_from_the_reserved_category } = req.body;
        if (!session || !year || !number_of_seats_earmarked_for_reserved_category_as_per_GOI || !number_of_students_admitted_from_the_reserved_category) {
          throw new apiError(400, "Missing required fields");
        }

        if (year < 1990 || year > new Date().getFullYear()) {
          throw new apiError(400, "Year must be between 1990 and current year");
        }

        // Create proper Date objects for session
        const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
        console.log(criteria.criteria_code)
        // Insert into response_2_1_2_data
        const entry = await Criteria212.create({
          id: criteria.id,
          criteria_code: criteria.criteria_code,
          session: sessionDate,  // Store as Date object
          year: year,        // Store as Date object
          number_of_seats_earmarked_for_reserved_category_as_per_GOI,
          number_of_students_admitted_from_the_reserved_category
        });
    
        res.status(201).json(
          new apiResponse(201, entry, "Response created successfully")
        );

});
/**
* @route GET /api/response/2.1.2/:criteriaCode
* @description Get all responses for a specific criteria code
* @access Public
*/
const getResponsesByCriteriaCode212 = async (req, res, next) => {
  try {
      const { criteriaCode } = req.params;
      
      const responses = await db.response_2_1_2.findAll({
          where: { criteria_code: criteriaCode },
          include: [{
              model: db.criteria_master,
              as: 'criteria',
              attributes: ['criterion_id', 'sub_criterion_id', 'sub_sub_criterion_id']
          }],
          order: [['submitted_at', 'DESC']]
      });

      return res.status(200).json(
          new apiResponse(200, responses, 'Responses retrieved successfully')
      );

  } catch (error) {
      next(error);
  }
};
export { getAllCriteria211,
  createResponse211,
  getResponsesByCriteriaCode,
  getAllCriteria212,
  createResponse212,
  getResponsesByCriteriaCode212
};



const getAllCriteria241243222233 = asyncHandler(async (req, res) => {
  const criteria = await Criteria241243222233.findAll();
  if (!criteria) {
      throw new apiError(404, "Criteria not found");
  }
  
  res.status(200).json(
      new apiResponse(200, criteria, "Criteria found")
  );
});

/**
* @route POST /api/response/2.4.1and2.4.3and2.2.2and2.3.3
* @description Create a new response for criteria 2.4.1 and 2.4.3 and 2.2.2 and 2.3.3
* @access Private/Admin
*/
const createResponse241243222233 = asyncHandler(async (req, res) => {
      console.log(CriteriaMaster)
      const criteria = await CriteriaMaster.findOne({
          where: {
            sub_sub_criterion_id: '020401'||'020403'||'020202'||'020303',
            sub_criterion_id: '0204'||'0202'||'0203',
            criterion_id: '02'
          }
        });
    
        if (!criteria) {
          throw new apiError(404, "Criteria not found");
        }
    
        // Validate required fields
        const {session,name_of_the_fulltime_teachers,designation, year_of_appointment,nature_of_appointment,name_of_department,total_number_of_years_of_experience_in_the_same_institution,is_the_teacprogramme_name} = req.body;
        if (!year_of_appointment || !name_of_the_fulltime_teachers || !designation || !nature_of_appointment || !name_of_department || !total_number_of_years_of_experience_in_the_same_institution || !is_the_teacprogramme_name) {
          throw new apiError(400, "Missing required fields");
        }

        if (year_of_appointment < 1990 || year_of_appointment > new Date().getFullYear()) {
          throw new apiError(400, "Year must be between 1990 and current year");
        }

        // Create proper Date objects for session
        const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
        console.log(criteria.criteria_code)
        // Insert into response_2_4_1and2_4_3and2_2_2and2_3_3_data
        const entry = await Criteria241243222233.create({
          id: criteria.id,
          criteria_code: criteria.criteria_code,
          session: sessionDate,  // Store as Date object
          year_of_appointment: year_of_appointment,        // Store as Date object
          name_of_the_fulltime_teachers,
          designation,
          nature_of_appointment,
          name_of_department,
          total_number_of_years_of_experience_in_the_same_institution,
          is_the_teacprogramme_name
        });
    
        res.status(201).json(
          new apiResponse(201, entry, "Response created successfully")
        );

});
/**
* @route GET /api/response/2.4.1and2.4.3and2.2.2and2.3.3/:criteriaCode
* @description Get all responses for a specific criteria code
* @access Public
*/
const getResponsesByCriteriaCode241243222233 = async (req, res, next) => {
  try {
      const { criteriaCode } = req.params;
      
      const responses = await db.response_2_4_1and_2_4_3and2_2_2and2_3_3.findAll({
          where: { criteria_code: criteriaCode },
          include: [{
              model: db.criteria_master,
              as: 'criteria',
              attributes: ['criterion_id', 'sub_criterion_id', 'sub_sub_criterion_id']
          }],
          order: [['submitted_at', 'DESC']]
      });

      return res.status(200).json(
          new apiResponse(200, responses, 'Responses retrieved successfully')
      );

  } catch (error) {
      next(error);
  }
};
export { getAllCriteria241243222233,
  createResponse241243222233,
  getResponsesByCriteriaCode241243222233
};



const getAllCriteria242 = asyncHandler(async (req, res) => {
  const criteria = await Criteria212.findAll();
  if (!criteria) {
      throw new apiError(404, "Criteria not found");
  }
  
  res.status(200).json(
      new apiResponse(200, criteria, "Criteria found")
  );
});

/**
* @route POST /api/response/2.4.2
* @description Create a new response for criteria 2.4.2
* @access Private/Admin
*/
const createResponse242 = asyncHandler(async (req, res) => {
      console.log(CriteriaMaster)
      const criteria = await CriteriaMaster.findOne({
          where: {
            sub_sub_criterion_id: '020402',
            sub_criterion_id: '0204',
            criterion_id: '02'
          }
        });
    
        if (!criteria) {
          throw new apiError(404, "Criteria not found");
        }
    
        // Validate required fields
        const {session,number_of_full_time_teachers,qualification,year_of_obtaining_the_qualification, whether_recognised_as_research_guide, year_of_recognition_as_research_guide } = req.body;
        if (!session || !number_of_full_time_teachers || !qualification || !year_of_obtaining_the_qualification || !whether_recognised_as_research_guide || !year_of_recognition_as_research_guide) {
          throw new apiError(400, "Missing required fields");
        }

        if (year_of_obtaining_the_qualification < 1990 || year_of_obtaining_the_qualification > new Date().getFullYear()) {
          throw new apiError(400, "Year must be between 1990 and current year");
        }

        // Create proper Date objects for session
        const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
        console.log(criteria.criteria_code)
        // Insert into response_2_4_2_data
        const entry = await Criteria242.create({
          id: criteria.id,
          criteria_code: criteria.criteria_code,
          session: sessionDate,  // Store as Date object
          number_of_full_time_teachers,
          qualification,
          year_of_obtaining_the_qualification,
          whether_recognised_as_research_guide,
          year_of_recognition_as_research_guide
        });
    
        res.status(201).json(
          new apiResponse(201, entry, "Response created successfully")
        );

});
/**
* @route GET /api/response/2.4.2/:criteriaCode
* @description Get all responses for a specific criteria code
* @access Public
*/
const getResponsesByCriteriaCode242 = async (req, res, next) => {
  try {
      const { criteriaCode } = req.params;
      
      const responses = await db.response_2_4_2.findAll({
          where: { criteria_code: criteriaCode },
          include: [{
              model: db.criteria_master,
              as: 'criteria',
              attributes: ['criterion_id', 'sub_criterion_id', 'sub_sub_criterion_id']
          }],
          order: [['submitted_at', 'DESC']]
      });

      return res.status(200).json(
          new apiResponse(200, responses, 'Responses retrieved successfully')
      );

  } catch (error) {
      next(error);
  }
};
export { getAllCriteria242,
  createResponse242,
  getResponsesByCriteriaCode242
};



const getAllCriteria263 = asyncHandler(async (req, res) => {
  const criteria = await Criteria263.findAll();
  if (!criteria) {
      throw new apiError(404, "Criteria not found");
  }
  
  res.status(200).json(
      new apiResponse(200, criteria, "Criteria found")
  );
});

/**
* @route POST /api/response/2.6.3
* @description Create a new response for criteria 2.6.3
* @access Private/Admin
*/
const createResponse263 = asyncHandler(async (req, res) => {
      console.log(CriteriaMaster)
      const criteria = await CriteriaMaster.findOne({
          where: {
            sub_sub_criterion_id: '020603',
            sub_criterion_id: '0206',
            criterion_id: '02'
          }
        });
    
        if (!criteria) {
          throw new apiError(404, "Criteria not found");
        }
    
        // Validate required fields
        const {session,year,programme_name,programme_code,number_of_students_appeared_in_the_final_year_examination,number_of_students_passed_in_the_final_year_examination } = req.body;
        if (!session || !year || !programme_name || !programme_code || !number_of_students_appeared_in_the_final_year_examination || !number_of_students_passed_in_the_final_year_examination) {
          throw new apiError(400, "Missing required fields");
        }

        if (year < 1990 || year > new Date().getFullYear()) {
          throw new apiError(400, "Year must be between 1990 and current year");
        }

        // Create proper Date objects for session
        const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
        console.log(criteria.criteria_code)
        // Insert into response_2_6_3_data
        const entry = await Criteria263.create({
          id: criteria.id,
          criteria_code: criteria.criteria_code,
          session: sessionDate,  // Store as Date object
          year,
          programme_name,
          programme_code,
          number_of_students_appeared_in_the_final_year_examination,
          number_of_students_passed_in_the_final_year_examination
        });
    
        res.status(201).json(
          new apiResponse(201, entry, "Response created successfully")
        );

});
/**
* @route GET /api/response/2.6.3/:criteriaCode
* @description Get all responses for a specific criteria code
* @access Public
*/
const getResponsesByCriteriaCode263 = async (req, res, next) => {
  try {
      const { criteriaCode } = req.params;
      
      const responses = await db.response_2_6_3.findAll({
          where: { criteria_code: criteriaCode },
          include: [{
              model: db.criteria_master,
              as: 'criteria',
              attributes: ['criterion_id', 'sub_criterion_id', 'sub_sub_criterion_id']
          }],
          order: [['submitted_at', 'DESC']]
      });

      return res.status(200).json(
          new apiResponse(200, responses, 'Responses retrieved successfully')
      );

  } catch (error) {
      next(error);
  }
};
export { getAllCriteria263,
  createResponse263,
  getResponsesByCriteriaCode263
};




const getAllCriteria271 = asyncHandler(async (req, res) => {
  const criteria = await Criteria271.findAll();
  if (!criteria) {
      throw new apiError(404, "Criteria not found");
  }
  
  res.status(200).json(
      new apiResponse(200, criteria, "Criteria found")
  );
});

/**
* @route POST /api/response/2.7.1
* @description Create a new response for criteria 2.7.1
* @access Private/Admin
*/
const createResponse271 = asyncHandler(async (req, res) => {
      console.log(CriteriaMaster)
      const criteria = await CriteriaMaster.findOne({
          where: {
            sub_sub_criterion_id: '020701',
            sub_criterion_id: '0207',
            criterion_id: '02'
          }
        });
    
        if (!criteria) {
          throw new apiError(404, "Criteria not found");
        }
    
        // Validate required fields
    const {session,name_of_the_student,gender,category,state_of_domicile,nationality_if_other_than_indian,email_id,programme_name,unique_enrolment_id_college_id,mobile_number,year_of_joining } = req.body;
        if (!session || !name_of_the_student || !gender || !category || !state_of_domicile || !programme_name || !unique_enrolment_id_college_id || !mobile_number || !year_of_joining) {
          throw new apiError(400, "Missing required fields");
        }

        if (year < 1990 || year > new Date().getFullYear()) {
          throw new apiError(400, "Year must be between 1990 and current year");
        }

        // Create proper Date objects for session
        const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
        console.log(criteria.criteria_code)
        // Insert into response_2_7_1_data
        const entry = await Criteria271.create({
          id: criteria.id,
          criteria_code: criteria.criteria_code,
          session: sessionDate,  // Store as Date object
          name_of_the_student,
          gender,
          category,
          state_of_domicile,
          nationality_if_other_than_indian,
          email_id,
          programme_name,
          unique_enrolment_id_college_id,
          mobile_number,
          year_of_joining
        });
    
        res.status(201).json(
          new apiResponse(201, entry, "Response created successfully")
        );

});
/**
* @route GET /api/response/2.7.1/:criteriaCode
* @description Get all responses for a specific criteria code
* @access Public
*/
const getResponsesByCriteriaCode271 = async (req, res, next) => {
  try {
      const { criteriaCode } = req.params;
      
      const responses = await db.response_2_7_1.findAll({
          where: { criteria_code: criteriaCode },
          include: [{
              model: db.criteria_master,
              as: 'criteria',
              attributes: ['criterion_id', 'sub_criterion_id', 'sub_sub_criterion_id']
          }],
          order: [['submitted_at', 'DESC']]
      });

      return res.status(200).json(
          new apiResponse(200, responses, 'Responses retrieved successfully')
      );

  } catch (error) {
      next(error);
  }
};
export { getAllCriteria271,
  createResponse271,
  getResponsesByCriteriaCode271
};
