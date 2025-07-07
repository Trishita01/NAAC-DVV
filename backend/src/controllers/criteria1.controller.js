import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

const Criteria113 = db.response_1_1_3;
const Criteria121 = db.response_1_2_1;
const Criteria122and123 = db.response_1_2_2and3;
const Criteria132 = db.response_1_3_2;
const Criteria133 = db.response_1_3_3;
const CriteriaMaster = db.criteria_master;

const getAllCriteria113 = asyncHandler(async (req, res) => {
    const criteria = await Criteria113.findAll();
    if (!criteria) {
        throw new apiError(404, "Criteria not found");
    }
    
    res.status(200).json(
        new apiResponse(200, criteria, "Criteria found")
    );
});

/**
 * @route POST /api/response/1.1.3
 * @description Create a new response for criteria 1.1.3
 * @access Private/Admin
 */
const createResponse113 = asyncHandler(async (req, res) => {
    /*
    1. get the user input from the req body
    2. query the criteria_master table to get the id and criteria_code 
    3. validate the user input
    4. create a new response
    5. return the response
    */
        // Fetch 1.1.3 criterion from criteria_master
        console.log(CriteriaMaster)
        const criteria = await CriteriaMaster.findOne({
            where: {
              sub_sub_criterion_id: '010103',
              sub_criterion_id: '0101',
              criterion_id: '01'
            }
          });
      
          if (!criteria) {
            throw new apiError(404, "Criteria not found");
          }
      
          // Validate required fields
          const { year, teacher_name, body_name, option_selected } = req.body;
          if (!year || !teacher_name || !body_name || !option_selected) {
            throw new apiError(400, "Missing required fields");
          }

          if (year < 1990 || year > new Date().getFullYear()) {
            throw new apiError(400, "Year must be between 1990 and current year");
          }

          if (option_selected < 1 || option_selected > 5) {
            throw new apiError(400, "Option selected must be between 1 and 5");
          }

          // Create proper Date objects for session
          const sessionDate = new Date(year, 0, 1); // Jan 1st of the given year
          console.log(criteria.criteria_code)
          // Insert into response_1_1_3_data
          const entry = await Criteria113.create({
            id: criteria.id,
            criteria_code: criteria.criteria_code,
            session: sessionDate,  // Store as Date object
            year: year,        // Store as Date object
            teacher_name,
            body_name,
            option_selected
          });
      
          res.status(201).json(
            new apiResponse(201, entry, "Response created successfully")
          );

});
/**
 * @route GET /api/response/1.1.3/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
const getResponsesByCriteriaCode113 = async (req, res, next) => {
    try {
        const { criteriaCode } = req.params;
        
        const responses = await db.response_1_1_3.findAll({
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
export { getAllCriteria113,
    createResponse113,
    getResponsesByCriteriaCode113
 };



 // 1.2.1


 const getAllCriteria121 = asyncHandler(async (req, res) => {
  const criteria = await Criteria121.findAll();
  if (!criteria) {
      throw new apiError(404, "Criteria not found");
  }
  
  res.status(200).json(
      new apiResponse(200, criteria, "Criteria found")
  );
});

/**
* @route POST /api/response/1.1.3
* @description Create a new response for criteria 1.1.3
* @access Private/Admin
*/

 const createResponse121 = asyncHandler(async (req, res) => {
    /*
    1. get the user input from the req body
    2. query the criteria_master table to get the id and criteria_code 
    3. validate the user input
    4. create a new response
    5. return the response
    */
        // Fetch 1.2.1 criterion from criteria_master
        console.log(CriteriaMaster)
        const criteria = await CriteriaMaster.findOne({
            where: {
              sub_sub_criterion_id: '010201',
              sub_criterion_id: '0102',
              criterion_id: '01'
            }
          });
      
          if (!criteria) {
            throw new apiError(404, "Criteria not found");
          }
      
          // Validate required fields
          const { programme_code, programme_name, year_of_introduction, status_of_implementation_of_CBCS, year_of_implementation_of_CBCS, year_of_revision, prc_content_added} = req.body;
          if (!programme_code || !programme_name || !year_of_introduction || !status_of_implementation_of_CBCS || !year_of_implementation_of_CBCS || !year_of_revision || !prc_content_added) {
            throw new apiError(400, "Missing required fields");
          }

          if (year_of_introduction < 1990 || year_of_introduction > new Date().getFullYear()) {
            throw new apiError(400, "Year of introduction must be between 1990 and current year");
          }

          if (year_of_implementation_of_CBCS < 1990 || year_of_implementation_of_CBCS > new Date().getFullYear()) {
            throw new apiError(400, "Year of implementation of CBCS must be between 1990 and current year");
          }

          if (year_of_revision < 1990 || year_of_revision > new Date().getFullYear()) {
            throw new apiError(400, "Year of revision must be between 1990 and current year");
          }

          // Create proper Date objects for session
          const sessionDate = new Date(year, 0, 1); // Jan 1st of the given year
          console.log(criteria.criteria_code)
          // Insert into response_1_2_1_data
          const entry = await Criteria121.create({
            id: criteria.id,
            criteria_code: criteria.criteria_code,
            session: sessionDate,  // Store as Date object
            
            programme_code,
            programme_name,
            year_of_introduction,
            status_of_implementation_of_CBCS,
            year_of_implementation_of_CBCS,
            year_of_revision,
            prc_content_added
          });
      
          res.status(201).json(
            new apiResponse(201, entry, "Response created successfully")
          );

});
/**
 * @route GET /api/response/1.2.1/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
const getResponsesByCriteriaCode121 = async (req, res, next) => {
    try {
        const { criteriaCode } = req.params;
        
        const responses = await db.response_1_2_1.findAll({
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
export { getAllCriteria121,
    createResponse121,
    getResponsesByCriteriaCode121
 };



 //1.2.2 

 const getAllCriteria122123 = asyncHandler(async (req, res) => {
  const criteria = await Criteria122and123.findAll();
  if (!criteria) {
      throw new apiError(404, "Criteria not found");
  }
  
  res.status(200).json(
      new apiResponse(200, criteria, "Criteria found")
  );
});

/**
* @route POST /api/response/1.2.2and1.2.3
* @description Create a new response for criteria 1.2.2 and 1.2.3
* @access Private/Admin
*/


 const createResponse122123 = asyncHandler(async (req, res) => {
    /*
    1. get the user input from the req body
    2. query the criteria_master table to get the id and criteria_code 
    3. validate the user input
    4. create a new response
    5. return the response
    */
        // Fetch 1.2.2 and 1.2.3 criterion from criteria_master
        console.log(CriteriaMaster)
        const criteria = await CriteriaMaster.findOne({
            where: {
              sub_sub_criterion_id: '010202' || '010203',
              sub_criterion_id: '0102' || '0102',
              criterion_id: '01' || '01'
            }
          });
      
          if (!criteria) {
            throw new apiError(404, "Criteria not found");
          }
      
          // Validate required fields
          const { program_code, course_code, year_of_offering, no_of_times_offered, duration, no_of_students_enrolled, no_of_students_completed} = req.body;
          if (!program_code || !course_code || !year_of_offering || !no_of_times_offered || !duration || !no_of_students_enrolled || !no_of_students_completed ) {
            throw new apiError(400, "Missing required fields");
          }

          if (year_of_offering < 1990 || year_of_offering > new Date().getFullYear()) {
            throw new apiError(400, "Year of offering must be between 1990 and current year");
          }

          
          // Create proper Date objects for session
          const sessionDate = new Date(year, 0, 1); // Jan 1st of the given year
          console.log(criteria.criteria_code)
          // Insert into response_1_2_2and3_data
          const entry = await Criteria122.create({
            id: criteria.id,
            criteria_code: criteria.criteria_code,
            session: sessionDate,  // Store as Date object
            
            program_code,
            course_code,
            year_of_offering,
            no_of_times_offered,
            duration,
            no_of_students_enrolled,
            no_of_students_completed
          });
      
          res.status(201).json(
            new apiResponse(201, entry, "Response created successfully")
          );

});
/**
 * @route GET /api/response/1.2.2and1.2.3/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
const getResponsesByCriteriaCode122123 = async (req, res, next) => {
    try {
        const { criteriaCode } = req.params;
        
        const responses = await db.response_1_2_2and3.findAll({
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
export { getAllCriteria122123,
    createResponse122123,
    getResponsesByCriteriaCode122123
 };




 //1.3.2


 const getAllCriteria132 = asyncHandler(async (req, res) => {
  const criteria = await Criteria113.findAll();
  if (!criteria) {
      throw new apiError(404, "Criteria not found");
  }
  
  res.status(200).json(
      new apiResponse(200, criteria, "Criteria found")
  );
});

/**
* @route POST /api/response/1.3.2
* @description Create a new response for criteria 1.3.2
* @access Private/Admin
*/


 const createResponse132 = asyncHandler(async (req, res) => {
    /*
    1. get the user input from the req body
    2. query the criteria_master table to get the id and criteria_code 
    3. validate the user input
    4. create a new response
    5. return the response
    */
        // Fetch 1.3.2 criterion from criteria_master
        console.log(CriteriaMaster)
        const criteria = await CriteriaMaster.findOne({
            where: {
              sub_sub_criterion_id: '010302',
              sub_criterion_id: '0103',
              criterion_id: '01'
            }
          });
      
          if (!criteria) {
            throw new apiError(404, "Criteria not found");
          }
      
          // Validate required fields
          const {  program_name, program_code, course_name, course_code, year_of_offering, student_name} = req.body;
          if (!program_name || !program_code || !course_name || !course_code || !year_of_offering || !student_name ) {
            throw new apiError(400, "Missing required fields");
          }

          if (year_of_offering < 1990 || year_of_offering > new Date().getFullYear()) {
            throw new apiError(400, "Year of introduction must be between 1990 and current year");
          }

          
          // Create proper Date objects for session
          const sessionDate = new Date(year, 0, 1); // Jan 1st of the given year
          console.log(criteria.criteria_code)
          // Insert into response_1_3_2_data
          const entry = await Criteria132.create({
            id: criteria.id,
            criteria_code: criteria.criteria_code,
            session: sessionDate,  // Store as Date object
            program_name,
            program_code,
            course_name,
            course_code,
            year_of_offering,
            student_name
          });
      
          res.status(201).json(
            new apiResponse(201, entry, "Response created successfully")
          );

});
/**
 * @route GET /api/response/1.3.2/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
const getResponsesByCriteriaCode132 = async (req, res, next) => {
    try {
        const { criteriaCode } = req.params;
        
        const responses = await db.response_1_3_2.findAll({
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
export { getAllCriteria132,
    createResponse132,
    getResponsesByCriteriaCode132
 };


 //1.3.3


 const getAllCriteria133 = asyncHandler(async (req, res) => {
  const criteria = await Criteria133.findAll();
  if (!criteria) {
      throw new apiError(404, "Criteria not found");
  }
  
  res.status(200).json(
      new apiResponse(200, criteria, "Criteria found")
  );
});

/**
* @route POST /api/response/1.3.3
* @description Create a new response for criteria 1.3.3
* @access Private/Admin
*/

 const createResponse133 = asyncHandler(async (req, res) => {
    /*
    1. get the user input from the req body
    2. query the criteria_master table to get the id and criteria_code 
    3. validate the user input
    4. create a new response
    5. return the response
    */
        // Fetch 1.3.3 criterion from criteria_master
        console.log(CriteriaMaster)
        const criteria = await CriteriaMaster.findOne({
            where: {
              sub_sub_criterion_id: '010303',
              sub_criterion_id: '0103',
              criterion_id: '01'
            }
          });
      
          if (!criteria) {
            throw new apiError(404, "Criteria not found");
          }
      
          // Validate required fields
          const {  program_name, program_code, student_name} = req.body;
          if (!program_name || !program_code || !student_name ) {
            throw new apiError(400, "Missing required fields");
          }

         
          // Create proper Date objects for session
          const sessionDate = new Date(year, 0, 1); // Jan 1st of the given year
          console.log(criteria.criteria_code)
          // Insert into response_1_3_2_data
          const entry = await Criteria133.create({
            id: criteria.id,
            criteria_code: criteria.criteria_code,
            session: sessionDate,  // Store as Date object
            program_name,
            program_code,
            student_name
          });
      
          res.status(201).json(
            new apiResponse(201, entry, "Response created successfully")
          );

});
/**
 * @route GET /api/response/1.3.3/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
const getResponsesByCriteriaCode133 = async (req, res, next) => {
    try {
        const { criteriaCode } = req.params;
        
        const responses = await db.response_1_3_3.findAll({
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
export { getAllCriteria133,
    createResponse133,
    getResponsesByCriteriaCode133
 };


 
