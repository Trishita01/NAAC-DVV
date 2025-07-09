import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

const Criteria623 = db.response_6_2_3;
const Criteria632 = db.response_6_3_2;
const Criteria633 = db.response_6_3_3;
const Criteria634 = db.response_6_3_4;
const Criteria642 = db.response_6_4_2;
const Criteria653 = db.response_6_5_3;
const CriteriaMaster = db.criteria_master;

const getAllCriteria623 = asyncHandler(async (req, res) => {
    const criteria = await Criteria623.findAll();
    if (!criteria) {
        throw new apiError(404, "Criteria not found");
    }
    
    res.status(200).json(
        new apiResponse(200, criteria, "Criteria found")
    );
});
/**
 * @route GET /api/response/6.2.3/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */

const createResponse623 = asyncHandler(async(req,res)=>{
    /*1. get the user input from the req body
    2. query the criteria_master table to get the id and criteria_code 
    3. validate the user input
    4. create a new response
    5. return the response
    */
   // Fetch 6.2.3 criterion form criteria_master
   const criteria = await CriteriaMaster.findOne({
    where: {
      sub_sub_criterion_id: '060203',
      sub_criterion_id: '0602',
      criterion_id: '06'
    }
  });
  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }
  //Validate required fields
  const {session, implementation, area_of_e_governance, year_of_implementation} = req.body;
  if (!session || !implementation || !area_of_e_governance || !year_of_implementation) {
    throw new apiError(400, "Missing required fields");
  }
  if (year_of_implementation < 1990 || year_of_implementation > new Date().getFullYear()) {
    throw new apiError(400, "Year of implementation must be between 1990 and current year");
  }
  if(session < 1990 || session > new Date().getFullYear()) {
    throw new apiError(400, "Session must be between 1990 and current year");
  }

  //Create proper Date objects for session
  const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
  console.log(criteria.criteria_code)
  //Insert into response_6_2_3_data
  const entry = await Criteria623.create({
    id: criteria.id,
    criteria_code: criteria.criteria_code,
    session: sessionDate,
    year_of_implementation,
    implementation,
    area_of_e_governance
  });

  res.status(201).json(
    new apiResponse(201, entry, "Response created successfully")
  );
    
});
/**
 * @route GET /api/response/6.2.3/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
const getResponsesByCriteriaCode623 = async (req, res, next) => {
    try {
        const { criteriaCode } = req.params;
        
        const responses = await db.response_6_2_3.findAll({
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
export { getAllCriteria623,
    createResponse623,
    getResponsesByCriteriaCode623
 };
nc

 //6.3.2
 const getAllCriteria632 = asyncHandler(async (req, res) => {
    const criteria = await Criteria632.findAll();
    if (!criteria) {
        throw new apiError(404, "Criteria not found");
    }
    
    res.status(200).json(
        new apiResponse(200, criteria, "Criteria found")
    );
});
/**
 * @route GET /api/response/6.3.2/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
const createResponse632 = asyncHandler(async(req, res)=>{
    /*
    1. get the user input from the req body
    2. query the criteria_master table to get the id and criteria_code 
    3. validate the user input
    4. create a new response
    5. return the response
    */
   // Fetch 6.3.2 criterion from criteria_master
   const criteria = await CriteriaMaster.findOne({
    where: {
      sub_sub_criterion_id: '060302',
      sub_criterion_id: '0603',
      criterion_id: '06'
    }
  });
  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }
  //Validate required fields
  const {session, year, teacher_name, conference_name, professional_body, amt_of_spt_received} = req.body;
  if (!session || !year || !teacher_name || !conference_name || !professional_body || !amt_of_spt_received) {
    throw new apiError(400, "Missing required fields");
  }
  if (year < 1990 || year > new Date().getFullYear()) {
    throw new apiError(400, "Year of implementation must be between 1990 and current year");
  }
  if(session < 1990 || session > new Date().getFullYear()) {
    throw new apiError(400, "Session must be between 1990 and current year");
  }

  //Create proper Date objects for session
  const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
  console.log(criteria.criteria_code)
  //Insert into response_6_3_2_data
  const entry = await Criteria632.create({
    id: criteria.id,
    criteria_code: criteria.criteria_code,
    session: sessionDate,
    year,
    teacher_name,
    conference_name,
    professional_body,
    amt_of_spt_received
  });

  res.status(201).json(
    new apiResponse(201, entry, "Response created successfully")
  );
});

/**
 * @route GET /api/response/6.3.2/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
const getResponsesByCriteriaCode632 = async (req, res, next) => {
    try {
        const { criteriaCode } = req.params;
        
        const responses = await db.response_6_3_2.findAll({
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
export {
    getAllCriteria632,
    createResponse632,
    getResponsesByCriteriaCode632
 };


//6.3.3
const getAllCriteria633 = asyncHandler(async (req, res) => {
    const criteria = await Criteria633.findAll();
    if (!criteria) {
        throw new apiError(404, "Criteria not found");
    }
    
    res.status(200).json(
        new apiResponse(200, criteria, "Criteria found")
    );
});
/**
 * @route GET /api/response/6.3.3/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
 const createResponse633 = asyncHandler(async(req ,res)=>{
    /*
    1. get the user input from the req body
    2. query the criteria_master table to get the id and criteria_code 
    3. validate the user input
    4. create a new response
    5. return the response
    */
   // Fetch 6.3.3 criterion from criteria_master
   const criteria = await CriteriaMaster.findOne({
    where: {
      sub_sub_criterion_id: '060303',
      sub_criterion_id: '0603',
      criterion_id: '06'
    }
  });
  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }
  //Validate required fields
  const {session, from_to_date, title_of_prof_dev, title_of_add_training} = req.body;
  if (!session || !from_to_date || !title_of_prof_dev || !title_of_add_training) {
    throw new apiError(400, "Missing required fields");
  }
  if (from_to_date < 1990 || from_to_date > new Date().getFullYear()) {
    throw new apiError(400, "From to date must be between 1990 and current year");
  }
  if(session < 1990 || session > new Date().getFullYear()) {
    throw new apiError(400, "Session must be between 1990 and current year");
  }

  //Create proper Date objects for session
  const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
  console.log(criteria.criteria_code)
  //Insert into response_6_3_3_data
  const entry = await Criteria633.create({
    id: criteria.id,
    criteria_code: criteria.criteria_code,
    session: sessionDate,
    from_to_date,
    title_of_prof_dev,
    title_of_add_training
  });

  res.status(201).json(
    new apiResponse(201, entry, "Response created successfully")
  );
});

/**
 * @route GET /api/response/6.3.3/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
const getResponsesByCriteriaCode633 = async (req, res, next) => {
    try {
        const { criteriaCode } = req.params;
        
        const responses = await db.response_6_3_3.findAll({
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

export { getAllCriteria633,
    createResponse633,
    getResponsesByCriteriaCode633
 }; 

//6.3.4
const getAllCriteria634 = asyncHandler(async (req, res) => {
    const criteria = await Criteria634.findAll();
    if (!criteria) {
        throw new apiError(404, "Criteria not found");
    }
    
    res.status(200).json(
        new apiResponse(200, criteria, "Criteria found")
    );
});
/**
 * @route GET /api/response/6.3.4/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
const createResponse634 = asyncHandler(async(req , res)=>{
    /*
    1. get the user input from the req body
    2. query the criteria_master table to get the id and criteria_code 
    3. validate the user input
    4. create a new response
    5. return the response
    */
   // Fetch 6.3.4 criterion from criteria_master
   const criteria = await CriteriaMaster.findOne({
    where: {
      sub_sub_criterion_id: '060304',
      sub_criterion_id: '0603',
      criterion_id: '06'
    }
  });
  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }
  //Validate required fields
  const {session, teacher_name, program_title, from_to_date} = req.body;
  if (!session || !teacher_name || !program_title || !from_to_date) {
    throw new apiError(400, "Missing required fields");
  }
      if (from_to_date < 1990 || from_to_date > new Date().getFullYear()) {
    throw new apiError(400, "From to date must be between 1990 and current year");
  }
  if(session < 1990 || session > new Date().getFullYear()) {
    throw new apiError(400, "Session must be between 1990 and current year");
  }

  //Create proper Date objects for session
  const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
  console.log(criteria.criteria_code)
  //Insert into response_6_3_4_data
  const entry = await Criteria634.create({
    id: criteria.id,
    criteria_code: criteria.criteria_code,
    session: sessionDate,
    teacher_name,
    program_title,
    from_to_date
  });

  res.status(201).json(
    new apiResponse(201, entry, "Response created successfully")
  );

});
/**
 * @route GET /api/response/6.3.4/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
const getResponsesByCriteriaCode634 = async (req, res, next) => {
    try {
        const { criteriaCode } = req.params;
        
        const responses = await db.response_6_3_4.findAll({
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
export { getAllCriteria634,
    createResponse634,
    getResponsesByCriteriaCode634
 };


//6.4.2
const getAllCriteria642 = asyncHandler(async (req, res) => {
    const criteria = await Criteria642.findAll();
    if (!criteria) {
        throw new apiError(404, "Criteria not found");
    }
    
    res.status(200).json(
        new apiResponse(200, criteria, "Criteria found")
    );
});
/**
 * @route POST /api/response/6.4.2
 * @description Create a new response for criteria 6.4.2
 * @access Private/Admin
 */
const createResponse642 = asyncHandler(async(req, res)=>{
    /*
    1. get the user input from the req body
    2. query the criteria_master table to get the id and criteria_code 
    3. validate the user input
    4. create a new response
    5. return the response
    */

    //Fetch 6.4.2 criterion from criteria_master
    const criteria = await CriteriaMaster.findOne({
        where: {
          sub_sub_criterion_id: '060402',
          sub_criterion_id: '0604',
          criterion_id: '06'
        }
      });
      if (!criteria) {
        throw new apiError(404, "Criteria not found");
      }

      //Validate required fields
      const {session, year, donor_name, grant_amount_lakhs} = req.body;
      if (!session || !year || !donor_name || !grant_amount_lakhs) {
        throw new apiError(400, "Missing required fields");
      }
      if (year < 1990 || year > new Date().getFullYear()) {
        throw new apiError(400, "Year must be between 1990 and current year");
      }
      if(session < 1990 || session > new Date().getFullYear()) {
        throw new apiError(400, "Session must be between 1990 and current year");
      }

      //Create proper Date objects for session
      const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
      console.log(criteria.criteria_code)
      //Insert into response_6_4_2_data
      const entry = await Criteria642.create({
        id: criteria.id,
        criteria_code: criteria.criteria_code,
        session: sessionDate,
        year,
        donor_name,
        grant_amount_lakhs
      });

      res.status(201).json(
        new apiResponse(201, entry, "Response created successfully")
      );
});
/**
 * @route GET /api/response/6.4.2/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
const getResponsesByCriteriaCode642 = async (req, res, next) => {
    try {
        const { criteriaCode } = req.params;
        
        const responses = await db.response_6_4_2.findAll({
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
export { getAllCriteria642,
    createResponse642,
    getResponsesByCriteriaCode642
 }; 


//6.5.3
const getAllCriteria653 = asyncHandler(async (req, res) => {
    const criteria = await Criteria653.findAll();
    if (!criteria) {
        throw new apiError(404, "Criteria not found");
    }
    
    res.status(200).json(
        new apiResponse(200, criteria, "Criteria found")
    );
});
/**
 * @route POST /api/response/6.5.3
 * @description Create a new response for criteria 6.5.3
 * @access Private/Admin
 */

const createResponse653 = asyncHandler(async(req, res)=>{
    /*
    1. get the user input from the req body
    2. query the criteria_master table to get the id and criteria_code 
    3. validate the user input
    4. create a new response
    5. return the response
    */

    //Fetch 6.5.3 criterion from criteria_master
    const criteria = await CriteriaMaster.findOne({
        where: {
          sub_sub_criterion_id: '060503',
          sub_criterion_id: '0605',
          criterion_id: '06'
        }
      });
      if (!criteria) {
        throw new apiError(404, "Criteria not found");
      }

      //Validate required fields
      const {session, initiative_type, year, reg_meetings_of_the_IQAC_head, conf_seminar_workshops_on_quality_edu, collab_quality_initiatives, participation_in_NIRF, from_to_date, other_quality_audit} = req.body;
      if (!session || !year || !initiative_type || !reg_meetings_of_the_IQAC_head || !conf_seminar_workshops_on_quality_edu || !collab_quality_initiatives || !participation_in_NIRF || !from_to_date || !other_quality_audit) {
        throw new apiError(400, "Missing required fields");
      }
      if (year < 1990 || year > new Date().getFullYear()) {
        throw new apiError(400, "Year must be between 1990 and current year");
      }
      if(session < 1990 || session > new Date().getFullYear()) {
        throw new apiError(400, "Session must be between 1990 and current year");
      }

      //Create proper Date objects for session
      const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
      console.log(criteria.criteria_code)
      //Insert into response_6_5_3_data
      const entry = await Criteria653.create({
        id: criteria.id,
        criteria_code: criteria.criteria_code,
        session: sessionDate,
        year,
        initiative_type,
        reg_meetings_of_the_IQAC_head,
        conf_seminar_workshops_on_quality_edu,
        collab_quality_initiatives,
        participation_in_NIRF,
        from_to_date,
        other_quality_audit
      });

      res.status(201).json(
        new apiResponse(201, entry, "Response created successfully")
      );
});
/**
 * @route GET /api/response/6.5.3/:criteriaCode
 * @description Get all responses for a specific criteria code
 * @access Public
 */
const getResponsesByCriteriaCode653 = async (req, res, next) => {
    try {
        const { criteriaCode } = req.params;
        
        const responses = await db.response_6_5_3.findAll({
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
export { getAllCriteria653,
    createResponse653,
    getResponsesByCriteriaCode653
 }; 
