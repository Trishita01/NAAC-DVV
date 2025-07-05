import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

const Criteria113 = db.response_1_1_3;
const CriteriaMaster = db.criteria_master;

const getAllCriteria1 = asyncHandler(async (req, res) => {
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
const getResponsesByCriteriaCode = async (req, res, next) => {
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
export { getAllCriteria1,
    createResponse113,
    getResponsesByCriteriaCode
 };
