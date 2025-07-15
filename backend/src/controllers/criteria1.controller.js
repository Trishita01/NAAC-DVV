import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

const Criteria113 = db.response_1_1_3;
const Criteria121 = db.response_1_2_1;
const Criteria132 = db.response_1_3_2;
const Criteria133 = db.response_1_3_3;
const CriteriaMaster = db.criteria_master;
const Score = db.scores;

// Convert criteria code to padded format (e.g., '1.1.3' -> '010103')
const convertToPaddedFormat = (code) => {
    // First remove any dots, then split into individual characters
    const parts = code.replace(/\./g, '').split('');
    // Pad each part to 2 digits and join
    return parts.map(part => part.padStart(2, '0')).join('');
};

const getResponsesByCriteriaCode = asyncHandler(async (req, res) => {
    const { criteriaCode } = req.params;
    if (!criteriaCode) {
        throw new apiError(400, "Missing criteria code");
    }
    
    console.log(criteriaCode)
    
    const paddedCriteriaCode = convertToPaddedFormat(criteriaCode);
    const dbName = `response_${criteriaCode.replace(/\./g, '_')}`;

    console.log(paddedCriteriaCode)
    console.log(dbName)
    
    // First find the criteria master record
    const criteriaMaster = await db.criteria_master.findOne({
      where: { 
        sub_sub_criterion_id: paddedCriteriaCode
      }
    });

    console.log(criteriaMaster.criteria_code)
    
    if (!criteriaMaster) {
      throw new apiError(404, `Criteria not found for code: ${criteriaCode}`);
    }
    
    // Then find all responses for this criteria
    const responses = await db[dbName].findAll({
      where: { 
        criteria_code: criteriaMaster.criteria_code 
      },
      order: [['submitted_at', 'DESC']]
    });

    return res.status(200).json(
        new apiResponse(200, responses, 'Responses retrieved successfully')
    );
});


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


const score113 = asyncHandler(async (req, res) => {
    /*
    1. get the user input from the req body
    2. query the criteria_master table to get the id and criteria_code 
    3. validate the user input
    4. create a new response
    5. return the response
    */
    const criteria_code = convertToPaddedFormat("1.1.3");
    console.log(criteria_code)
    console.log(CriteriaMaster)
    const criteria = await CriteriaMaster.findOne({
      where: { 
        sub_sub_criterion_id: criteria_code
      }
    });
    const responses = await Criteria113.findAll({
      attributes: ['option_selected'],  // Only get the option_selected field
      where: {
          criteria_code:criteria.criteria_code  
      }
  });
  const optionValues = responses.map(response => response.option_selected);
  console.log('All option values:', optionValues);
  
  // Create a Set to store unique values between 1-4
  const uniqueValues = new Set();
  
  optionValues.forEach(value => {
    const num = parseInt(value, 10);
    if (num >= 1 && num <= 4) {
      uniqueValues.add(num);
    }
  });

  console.log("Score",Score)
  const currentYear = new Date().getFullYear();
  const sessionDate = new Date(currentYear, 0, 1);  // Jan 1st of current year
  console.log(sessionDate);
  console.log(currentYear);
  
  const count = uniqueValues.size;

  if(count == 4) {
    const entry = await Score.create({
      criteria_code: criteria.criteria_code,
      criteria_id: criteria.criterion_id,
      sub_criteria_id: criteria.sub_criterion_id,
      sub_sub_criteria_id: criteria.sub_sub_criterion_id,
      score_criteria: 0,
      score_sub_criteria: 0,
      score_sub_sub_criteria: 4,
      session: sessionDate,
      year: currentYear,
      cycle_year: 1
    });
    res.status(200).json(
      new apiResponse(200,4, "Grade is A")
    );
  }
  else if(count == 3) {
    const entry = await Score.create({
      criteria_code: criteria.criteria_code,
      criteria_id: criteria.criterion_id,
      sub_criteria_id: criteria.sub_criterion_id,
      sub_sub_criteria_id: criteria.sub_sub_criterion_id,
      score_criteria: 0,
      score_sub_criteria: 0,
      score_sub_sub_criteria: 3,
      session: sessionDate,
      year: currentYear,
      cycle_year: 1
    });
    res.status(200).json(
      new apiResponse(200,3, "Grade is B")
    );
  }
  else if(count == 2) {
    const entry = await Score.create({
      criteria_code: criteria.criteria_code,
      criteria_id: criteria.criterion_id,
      sub_criteria_id: criteria.sub_criterion_id,
      sub_sub_criteria_id: criteria.sub_sub_criterion_id,
      score_criteria: 0,
      score_sub_criteria: 0,
      score_sub_sub_criteria: 2,
      session: sessionDate,
      year: currentYear,
      cycle_year: 1
    });
    res.status(200).json(
      new apiResponse(200,2, "Grade is C")
    );
  }
  else if(count == 1) {
    const entry = await Score.create({
      criteria_code: criteria.criteria_code,
      criteria_id: criteria.criterion_id,
      sub_criteria_id: criteria.sub_criterion_id,
      sub_sub_criteria_id: criteria.sub_sub_criterion_id,
      score_criteria: 0,
      score_sub_criteria: 0,
      score_sub_sub_criteria: 1,
      session: sessionDate,
      year: currentYear,
      cycle_year: 1
    });
    res.status(200).json(
      new apiResponse(200,1, "Grade is D")
    );
  }
  else {
    const entry = await Score.create({
      criteria_code: criteria.criteria_code,
      criteria_id: criteria.criterion_id,
      sub_criteria_id: criteria.sub_criterion_id,
      sub_sub_criteria_id: criteria.sub_sub_criterion_id,
      score_criteria: 0,
      score_sub_criteria: 0,
      score_sub_sub_criteria: 0,
      session: sessionDate,
      year: currentYear,
      cycle_year: 1
    });
    res.status(200).json(
      new apiResponse(200,0, "Grade is E")
    );
  }

});


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
        const year  = new Date().getFullYear();
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

const score121 = asyncHandler(async (req, res) => {
  /*
  1. get the user input from the req body
  2. query the criteria_master table to get the id and criteria_code 
  3. validate the user input
  4. create a new response
  5. return the response
  */
  const criteria_code = convertToPaddedFormat("1.2.1");
  console.log(criteria_code)
  console.log(CriteriaMaster)
  const criteria = await CriteriaMaster.findOne({
    where: { 
      sub_sub_criterion_id: criteria_code
    }
  });
  
  const responses = await Criteria121.findAll({
  attributes: ['status_of_implementation_of_CBCS'],
  where: {
    criteria_code: criteria.criteria_code
  }
  });
  
  const cbcsStatusArray = responses.map(response => response.status_of_implementation_of_CBCS);
  console.log('CBCS Status Array:', cbcsStatusArray);
  function countCBCSYes(dataArray) {
  let counter = 0;
  dataArray.forEach(item => {
    if (item == "YES" || item == "Yes") {
      counter++;
    }
  });
  console.log('Number of YES responses:', counter);
  return counter;
  }
  const count = countCBCSYes(cbcsStatusArray);
  console.log('Number of YES responses:', count);
  const totalResponses = cbcsStatusArray.length;
  console.log('Total CBCS responses:', totalResponses);
  const percentage = (count / totalResponses) * 100;
  console.log('Percentage of YES responses:', percentage);
  
  let score;
  if (percentage > 25) {
  score = 4;
  } else if (percentage >= 15 && percentage <= 25) {
  score = 3;
  } else if (percentage >= 5 && percentage < 15) {
  score = 2;
  } else if (percentage >0 && percentage < 5) {
  score = 1;
  } else {
  score = 0; 
  }
  console.log('Score:', score);
  const currentYear = new Date().getFullYear();
  const sessionDate = new Date(currentYear, 0, 1); 
  const entry = await Score.create(
    {
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
    }
  );
  
  res.status(200).json(
  new apiResponse(200, entry, "Response created successfully")
  );
  
  });
  
  
const score122 = asyncHandler(async (req, res) => {
    /*
    1. get the user input from the req body
    2. query the criteria_master table to get the id and criteria_code 
    3. validate the user input
    4. create a new response
    5. return the response
    */
    const criteria_code = convertToPaddedFormat("1.2.2&1.2.3");
    console.log(criteria_code)  
    console.log(CriteriaMaster)
    const criteria = await CriteriaMaster.findOne({
      where: { 
        sub_sub_criterion_id: criteria_code
      }
    });
    
    const responses = await Criteria122123.findAll({
    attributes: ['no_of_times_offered'],
    where: {
      criteria_code: criteria.criteria_code
    }
    });
    // Calculate the score: sum of no_of_times_offered for the last 5 years
  const currentYear = new Date().getFullYear();
  const total = responses
      .filter(r => r.year_of_offering >= currentYear - 4)
      .reduce((sum, r) => sum + (r.no_of_times_offered || 0), 0);
  
  // Grading logic (now called score)
  let score = 0;
  if (total >= 25) score = 4;
  else if (total >= 15) score = 3;
  else if (total >= 5) score = 2;
  else if (total >= 1) score = 1;
  else score = 0;
  
  return res.status(200).json(
      new apiResponse(200, { responses, total, score }, 'Responses, total, and score retrieved successfully')
      );
  
});


export { createResponse133,
  createResponse132,
  createResponse122123,
  createResponse121,
  createResponse113,
  getResponsesByCriteriaCode,
  score113

 };


 
