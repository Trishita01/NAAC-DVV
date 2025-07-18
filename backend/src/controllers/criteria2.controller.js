
import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

const Criteria211 = db.response_2_1_1;
const Criteria212 = db.response_2_1_2;
// const Criteria241243222233 = db.response_2_4_1_2_4_3_2_2_2_2_3_3;
// const Criteria222 = db.response_2_2_2;
// const Criteria233 = db.response_2_3_3;
// const Criteria242 = db.response_2_4_2;
// const Criteria263 = db.response_2_6_3;
// const Criteria271 = db.response_2_7_1;
const Score = db.scores;
const CriteriaMaster = db.criteria_master;

// Helper function to convert criteria code to padded format
const convertToPaddedFormat = (code) => {
  // First remove any dots, then split into individual characters
  const parts = code.replace(/\./g, '').split('');
  // Pad each part to 2 digits and join
  return parts.map(part => part.padStart(2, '0')).join('');
};
function getTeacherCount(responses) {
  let fullTimeTeacherCount = 0;

  responses.forEach(response => {
    if (response.name_of_full_time_teachers) {
      const names = response.name_of_full_time_teachers
        .split(',')
        .map(name => name.trim())
        .filter(name => name.length > 0);
      fullTimeTeacherCount += names.length;
    }
  });

  return fullTimeTeacherCount;
}

// // Example usage:
// // const responses = await Criteria241243222233.findAll();
// // const count = getTeacherCount(responses);
// // console.log(count); // You can now use count wherever needed


// const getAllCriteria211 = asyncHandler(async (req, res) => {
//     const criteria = await Criteria211.findAll();
//     if (!criteria) {
//         throw new apiError(404, "Criteria not found");
//     }
    
//     res.status(200).json(
//         new apiResponse(200, criteria, "Criteria found")
//     );
// });

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
          const {year,programme_name, programme_code, no_of_seats, no_of_students } = req.body;
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
            session: year,  // Store as Date object
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
// /**
//  * @route GET /api/response/2.1.1/:criteriaCode
//  * @description Get all responses for a specific criteria code
//  * @access Public
//  */
// const getResponsesByCriteriaCode = async (req, res, next) => {
//     try {
//         const { criteriaCode } = req.params;
        
//         const responses = await db.response_2_1_1.findAll({
//             where: { criteria_code: criteriaCode },
//             include: [{
//                 model: db.criteria_master,
//                 as: 'criteria',
//                 attributes: ['criterion_id', 'sub_criterion_id', 'sub_sub_criterion_id']
//             }],
//             order: [['submitted_at', 'DESC']]
//         });

//         return res.status(200).json(
//             new apiResponse(200, responses, 'Responses retrieved successfully')
//         );

//     } catch (error) {
//         next(error);
//     }
// };

const score211 = asyncHandler(async (req, res) => {
  /*
  1. get the user input from the req body
  2. query the criteria_master table to get the id and criteria_code 
  3. validate the user input
  4. create a new response
  5. return the response
  */
  const criteria_code = convertToPaddedFormat("2.1.1");
  console.log(criteria_code)
  console.log(CriteriaMaster)
  const criteria = await CriteriaMaster.findOne({
    where: { 
      sub_sub_criterion_id: criteria_code
    }
  });
  const responses = await Criteria211.findAll({
    attributes: ['no_of_seats', 'no_of_students'],  // Only get the option_selected field
    where: {
        criteria_code:criteria.criteria_code  
    }
});

const total_seats = responses.reduce((total, response) => total + (response.no_of_seats || 0), 0);
const total_students = responses.reduce((total, response) => total + (response.no_of_students || 0), 0);

let score = 0;
if (total_seats > 0) {
  score = (total_students / total_seats) * 100;
}
//array of scores of 5 years
let scores = [];
if (total_seats > 0) {
  score = (total_students / total_seats) * 100;
}
for (let i = 0; i < 5; i++) {
  scores.push(score);
}
let average = 0;
let years=scores.length;
average = scores.reduce((sum, value) => sum + value, 0) / years;

console.log("Average:", average);
console.log("Score:", Score);
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
    score_sub_sub_criteria: average,
    session: sessionDate,
    year: currentYear,
    cycle_year: 1
  }
);

res.status(200).json(
  new apiResponse(200, entry, "Response created successfully")
)
});


 
// //2.1.2

//  const getAllCriteria212 = asyncHandler(async (req, res) => {
//   const criteria = await Criteria212.findAll();
//   if (!criteria) {
//       throw new apiError(404, "Criteria not found");
//   }
  
//   res.status(200).json(
//       new apiResponse(200, criteria, "Criteria found")
//   );
// });

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
// /**
// * @route GET /api/response/2.1.2/:criteriaCode
// * @description Get all responses for a specific criteria code
// * @access Public
// */
// const getResponsesByCriteriaCode212 = async (req, res, next) => {
//   try {
//       const { criteriaCode } = req.params;
      
//       const responses = await db.response_2_1_2.findAll({
//           where: { criteria_code: criteriaCode },
//           include: [{
//               model: db.criteria_master,
//               as: 'criteria',
//               attributes: ['criterion_id', 'sub_criterion_id', 'sub_sub_criterion_id']
//           }],
//           order: [['submitted_at', 'DESC']]
//       });

//       return res.status(200).json(
//           new apiResponse(200, responses, 'Responses retrieved successfully')
//       );

//   } catch (error) {
//       next(error);
//   }
// };
/* DEBUG 
1. There should be one year for one req body

*/
const score212 = asyncHandler(async (req, res) => {
  /*
  1. get the user input from the req body
  2. query the criteria_master table to get the id and criteria_code 
  3. validate the user input
  4. create a new response
  5. return the response
  */
  const criteria_code = convertToPaddedFormat("2.1.2");
  console.log(criteria_code)
  console.log(CriteriaMaster)
  const criteria = await CriteriaMaster.findOne({
    where: { 
      sub_sub_criterion_id: criteria_code
    }
  });
  const responses = await Criteria212.findAll({
    attributes: ['number_of_seats_earmarked_for_reserved_category_as_per_GOI', 'number_of_students_admitted_from_the_reserved_category'],  // Only get the option_selected field
    where: {
        criteria_code:criteria.criteria_code  
    }
});
const total_seats = responses.reduce((total, response) => total + (response.number_of_seats_earmarked_for_reserved_category_as_per_GOI || 0), 0);
const total_students = responses.reduce((total, response) => total + (response.number_of_students_admitted_from_the_reserved_category || 0), 0);

let score = 0;
if (total_seats > 0) {
  score = (total_students / total_seats) * 100;
}
//array of scores of 5 years
let scores = [];
if (total_seats > 0) {
  score = (total_students / total_seats) * 100;
}
for (let i = 0; i < 5; i++) {
  scores.push(score);
}
let average = 0;
let years=scores.length;
average = scores.reduce((sum, value) => sum + value, 0) / years;

console.log("Average:", average);

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
    score_sub_sub_criteria: average,
    session: sessionDate,
    year: currentYear,
    cycle_year: 1
  }
);

res.status(200).json(
  new apiResponse(200, entry, "Response created successfully")
)

});


// // response 241242222233


// const getAllCriteria241243222233 = asyncHandler(async (req, res) => {
//   const criteria = await Criteria241243222233.findAll();
//   if (!criteria) {
//       throw new apiError(404, "Criteria not found");
//   }
  
//   res.status(200).json(
//       new apiResponse(200, criteria, "Criteria found")
//   );
// });

// /**
// * @route POST /api/response/2.4.1and2.4.3and2.2.2and2.3.3
// * @description Create a new response for criteria 2.4.1 and 2.4.3 and 2.2.2 and 2.3.3
// * @access Private/Admin
// */
// const createResponse241243222233 = asyncHandler(async (req, res) => {
//       console.log(CriteriaMaster)
//       const criteria = await CriteriaMaster.findOne({
//           where: {
//             sub_sub_criterion_id: '020401'||'020403'||'020202'||'020303',
//             sub_criterion_id: '0204'||'0202'||'0203',
//             criterion_id: '02'
//           }
//         });
    
//         if (!criteria) {
//           throw new apiError(404, "Criteria not found");
//         }
    
//         // Validate required fields
//         const {session,name_of_the_fulltime_teachers,designation, year_of_appointment,nature_of_appointment,name_of_department,total_number_of_years_of_experience_in_the_same_institution,is_the_teacprogramme_name} = req.body;
//         if (!year_of_appointment || !name_of_the_fulltime_teachers || !designation || !nature_of_appointment || !name_of_department || !total_number_of_years_of_experience_in_the_same_institution || !is_the_teacprogramme_name) {
//           throw new apiError(400, "Missing required fields");
//         }

//         if (year_of_appointment < 1990 || year_of_appointment > new Date().getFullYear()) {
//           throw new apiError(400, "Year must be between 1990 and current year");
//         }

//         // Create proper Date objects for session
//         const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
//         console.log(criteria.criteria_code)
//         // Insert into response_2_4_1and2_4_3and2_2_2and2_3_3_data
//         const entry = await Criteria241243222233.create({
//           id: criteria.id,
//           criteria_code: criteria.criteria_code,
//           session: sessionDate,  // Store as Date object
//           year_of_appointment: year_of_appointment,        // Store as Date object
//           name_of_the_fulltime_teachers,
//           designation,
//           nature_of_appointment,
//           name_of_department,
//           total_number_of_years_of_experience_in_the_same_institution,
//           is_the_teacprogramme_name
//         });
    
//         res.status(201).json(
//           new apiResponse(201, entry, "Response created successfully")
//         );

// });
// /**
// * @route GET /api/response/2.4.1and2.4.3and2.2.2and2.3.3/:criteriaCode
// * @description Get all responses for a specific criteria code
// * @access Public
// */
// const getResponsesByCriteriaCode241243222233 = async (req, res, next) => {
//   try {
//       const { criteriaCode } = req.params;
      
//       const responses = await db.response_2_4_1and_2_4_3and2_2_2and2_3_3.findAll({
//           where: { criteria_code: criteriaCode },
//           include: [{
//               model: db.criteria_master,
//               as: 'criteria',
//               attributes: ['criterion_id', 'sub_criterion_id', 'sub_sub_criterion_id']
//           }],
//           order: [['submitted_at', 'DESC']]
//       });

//       return res.status(200).json(
//           new apiResponse(200, responses, 'Responses retrieved successfully')
//       );

//   } catch (error) {
//       next(error);
//   }
//   };

// // score 241
//   const score241 = asyncHandler(async (req, res) => {
//     /*
//     1. get the user input from the req body
//     2. query the criteria_master table to get the id and criteria_code 
//     3. validate the user input
//     4. create a new response
//     5. return the response
//     */
//     const criteria_code = convertToPaddedFormat("2.4.1");
//     console.log(criteria_code)
//     console.log(CriteriaMaster)
//     const criteria = await CriteriaMaster.findOne({
//       where: { 
//         sub_sub_criterion_id: criteria_code
//       }
//     });
//     const responses = await Criteria212.findAll({
//       attributes: ['name_of_full_time_teachers', ],  // Only get the option_selected field
//       where: {
//           criteria_code:criteria.criteria_code  
//       }
//   });

//   // Count number of full-time teachers

//   let fullTimeTeacherCount = 0;
//   responses.forEach(response => {
//     if (response.name_of_full_time_teachers) {
//       const names = response.name_of_full_time_teachers
//         .split(',')
//         .map(name => name.trim())
//         .filter(name => name.length > 0);
//       fullTimeTeacherCount += names.length;
//     }
//   });
//   let score = 0;
//   score= (fullTimeTeacherCount/2000)*100;

//   const currentYear = new Date().getFullYear();
//   const sessionDate = new Date(currentYear, 0, 1); 
//   const entry = await Score.create(
//     {
//       criteria_code: criteria.criteria_code,
//       criteria_id: criteria.criterion_id,
//       sub_criteria_id: criteria.sub_criterion_id,
//       sub_sub_criteria_id: criteria.sub_sub_criterion_id,
//       score_criteria: 0,
//       score_sub_criteria: 0,
//       score_sub_sub_criteria: score,
//       session: sessionDate,
//       year: currentYear,
//       cycle_year: 1
//     }
//   );

//   res.status(200).json(
//     new apiResponse(200, entry, "Response created successfully")
//   );

// });

  //score 243
  const score243 = asyncHandler(async (req, res) => {
    /*
    1. get the user input from the req body
    2. query the criteria_master table to get the id and criteria_code 
    3. validate the user input
    4. create a new response
    5. return the response
    */
    const criteria_code = convertToPaddedFormat("2.4.3");
    console.log(criteria_code)
    console.log(CriteriaMaster)
    const criteria = await CriteriaMaster.findOne({
      where: { 
        sub_sub_criterion_id: criteria_code
      }
    });
    const responses = await Criteria212.findAll({
      attributes: ['name_of_full_time_teachers', 'total_number_of_years_of_experience_in_the_same_institution'],
      where: {
        criteria_code: criteria.criteria_code  
      }
    });
  
    // Count number of full-time teachers using a helper function
    function getFullTimeTeacherCount(responses) {
      let count = 0;
      responses.forEach(response => {
        if (response.name_of_full_time_teachers) {
          const names = response.name_of_full_time_teachers
            .split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0);
          count += names.length;
        }
      });
      return count;
    }

    let fullTimeTeacherCount = getFullTimeTeacherCount(responses);
    let experienceCount = 0;
    responses.forEach(response => {
      if (response.name_of_full_time_teachers) {
        const names = response.name_of_full_time_teachers
          .split(',')
          .map(name => name.trim())
          .filter(name => name.length > 0);
        // Add experience for each teacher
        if (response.total_number_of_years_of_experience_in_the_same_institution) {
          experienceCount += Number(response.total_number_of_years_of_experience_in_the_same_institution) * names.length;
        }
      }
    });
  
    let score = 0;
    if (fullTimeTeacherCount > 0) {
      score = experienceCount / fullTimeTeacherCount;
    }
  
    const currentYear = new Date().getFullYear();
    const sessionDate = new Date(currentYear, 0, 1); 
    const entry = await Score.create({
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
    });
  
    res.status(200).json(
      new apiResponse(200, { entry, fullTimeTeacherCount, experienceCount, score }, "Response created successfully")
    );
  });


//   //score 222
//   const score222 = asyncHandler(async (req, res) => {
//     /*
//     1. get the user input from the req body
//     2. query the criteria_master table to get the id and criteria_code 
//     3. validate the user input
//     4. create a new response
//     5. return the response
//     */
//     const criteria_code = convertToPaddedFormat("2.1.2");
//     console.log(criteria_code)
//     console.log(CriteriaMaster)
//     const criteria = await CriteriaMaster.findOne({
//       where: { 
//         sub_sub_criterion_id: criteria_code
//       }
//     });
//     const responses = await Criteria222.findAll({
//       attributes: ['number_of_seats_earmarked_for_reserved_category_as_per_GOI', 'number_of_students_admitted_from_the_reserved_category'],  // Only get the option_selected field
//       where: {
//           criteria_code:criteria.criteria_code  
//       }
//   });



//   // score 233
//  const score233 = asyncHandler(async (req, res) => {
//     /*
//     1. get the user input from the req body
//     2. query the criteria_master table to get the id and criteria_code 
//     3. validate the user input
//     4. create a new response
//     5. return the response
//     */
//     const criteria_code = convertToPaddedFormat("2.3.3");
//     console.log(criteria_code)
//     console.log(CriteriaMaster)
//     const criteria = await CriteriaMaster.findOne({
//       where: { 
//         sub_sub_criterion_id: criteria_code
//       }
//     });
//     const responses = await Criteria212.findAll({
//       attributes: ['number_of_seats_earmarked_for_reserved_category_as_per_GOI', 'number_of_students_admitted_from_the_reserved_category'],  // Only get the option_selected field
//       where: {
//           criteria_code:criteria.criteria_code  
//       }
//   });



// const getAllCriteria242 = asyncHandler(async (req, res) => {
//   const criteria = await Criteria212.findAll();
//   if (!criteria) {
//       throw new apiError(404, "Criteria not found");
//   }
  
//   res.status(200).json(
//       new apiResponse(200, criteria, "Criteria found")
//   );
// });

// /**
// * @route POST /api/response/2.4.2
// * @description Create a new response for criteria 2.4.2
// * @access Private/Admin
// */
// const createResponse242 = asyncHandler(async (req, res) => {
//       console.log(CriteriaMaster)
//       const criteria = await CriteriaMaster.findOne({
//           where: {
//             sub_sub_criterion_id: '020402',
//             sub_criterion_id: '0204',
//             criterion_id: '02'
//           }
//         });
    
//         if (!criteria) {
//           throw new apiError(404, "Criteria not found");
//         }
    
//         // Validate required fields
//         const {session,number_of_full_time_teachers,qualification,year_of_obtaining_the_qualification, whether_recognised_as_research_guide, year_of_recognition_as_research_guide } = req.body;
//         if (!session || !number_of_full_time_teachers || !qualification || !year_of_obtaining_the_qualification || !whether_recognised_as_research_guide || !year_of_recognition_as_research_guide) {
//           throw new apiError(400, "Missing required fields");
//         }

//         if (year_of_obtaining_the_qualification < 1990 || year_of_obtaining_the_qualification > new Date().getFullYear()) {
//           throw new apiError(400, "Year must be between 1990 and current year");
//         }

//         // Create proper Date objects for session
//         const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
//         console.log(criteria.criteria_code)
//         // Insert into response_2_4_2_data
//         const entry = await Criteria242.create({
//           id: criteria.id,
//           criteria_code: criteria.criteria_code,
//           session: sessionDate,  // Store as Date object
//           number_of_full_time_teachers,
//           qualification,
//           year_of_obtaining_the_qualification,
//           whether_recognised_as_research_guide,
//           year_of_recognition_as_research_guide
//         });
    
//         res.status(201).json(
//           new apiResponse(201, entry, "Response created successfully")
//         );

// });
// /**
// * @route GET /api/response/2.4.2/:criteriaCode
// * @description Get all responses for a specific criteria code
// * @access Public
// */
// const getResponsesByCriteriaCode242 = (async (req, res, next) => {
//   try {
//       const { criteriaCode } = req.params;
      
//       const responses = await db.response_2_4_2.findAll({
//           where: { criteria_code: criteriaCode },
//           include: [{
//               model: db.criteria_master,
//               as: 'criteria',
//               attributes: ['criterion_id', 'sub_criterion_id', 'sub_sub_criterion_id']
//           }],
//           order: [['submitted_at', 'DESC']]
//       });

//       return res.status(200).json(
//           new apiResponse(200, responses, 'Responses retrieved successfully')
//       );

//   } catch (error) {
//       next(error);
//   }
// });
// //score 242
// const score242 = asyncHandler(async (req, res) => {
//   /*
//   1. get the user input from the req body
//   2. query the criteria_master table to get the id and criteria_code 
//   3. validate the user input
//   4. create a new response
//   5. return the response
//   */
//   const criteria_code = convertToPaddedFormat("2.4.2");
//   console.log(criteria_code)
//   console.log(CriteriaMaster)
//   const criteria = await CriteriaMaster.findOne({
//     where: { 
//       sub_sub_criterion_id: criteria_code
//     }
//   });
//   const responses = await Criteria242.findAll({
//     attributes: ['number_of_full_time_teachers'],  // Only get the option_selected field
//     where: {
//         criteria_code:criteria.criteria_code  
//     }
// });

// const total_full_time_teachers = responses.reduce((total, response) => total + (response.number_of_full_time_teachers || 0), 0);
// const count = getTeacherCount(responses);
// console.log(count); 
// let score = 0;
// if (total_full_time_teachers > 0) {
//   score = (total_full_time_teachers / count) * 100;
// }
// //array of scores of 5 years
// let scores = [];
// if (total_seats > 0) {
//   score = (total_students / total_seats) * 100;
// }
// for (let i = 0; i < 5; i++) {
//   scores.push(score);
// }
// let average = 0;
// let years=scores.length;
// average = scores.reduce((sum, value) => sum + value, 0) / years;

// console.log("Average:", average);

// const currentYear = new Date().getFullYear();
// const sessionDate = new Date(currentYear, 0, 1); 
// const entry = await Score.create(
//   {
//     criteria_code: criteria.criteria_code,
//     criteria_id: criteria.criterion_id,
//     sub_criteria_id: criteria.sub_criterion_id,
//     sub_sub_criteria_id: criteria.sub_sub_criterion_id,
//     score_criteria: 0,
//     score_sub_criteria: 0,
//     score_sub_sub_criteria: average,
//     session: sessionDate,
//     year: currentYear,
//     cycle_year: 1
//   }
// );

// res.status(200).json(
//   new apiResponse(200, entry, "Response created successfully")
// )

// });
  


// const getAllCriteria263 = asyncHandler(async (req, res) => {
//   const criteria = await Criteria263.findAll();
//   if (!criteria) {
//       throw new apiError(404, "Criteria not found");
//   }
  
//   res.status(200).json(
//       new apiResponse(200, criteria, "Criteria found")
//   );
// });

// /**
// * @route POST /api/response/2.6.3
// * @description Create a new response for criteria 2.6.3
// * @access Private/Admin
// */
// const createResponse263 = asyncHandler(async (req, res) => {
//       console.log(CriteriaMaster)
//       const criteria = await CriteriaMaster.findOne({
//           where: {
//             sub_sub_criterion_id: '020603',
//             sub_criterion_id: '0206',
//             criterion_id: '02'
//           }
//         });
    
//         if (!criteria) {
//           throw new apiError(404, "Criteria not found");
//         }
    
//         // Validate required fields
//         const {session,year,programme_name,programme_code,number_of_students_appeared_in_the_final_year_examination,number_of_students_passed_in_the_final_year_examination } = req.body;
//         if (!session || !year || !programme_name || !programme_code || !number_of_students_appeared_in_the_final_year_examination || !number_of_students_passed_in_the_final_year_examination) {
//           throw new apiError(400, "Missing required fields");
//         }

//         if (year < 1990 || year > new Date().getFullYear()) {
//           throw new apiError(400, "Year must be between 1990 and current year");
//         }

//         // Create proper Date objects for session
//         const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
//         console.log(criteria.criteria_code)
//         // Insert into response_2_6_3_data
//         const entry = await Criteria263.create({
//           id: criteria.id,
//           criteria_code: criteria.criteria_code,
//           session: sessionDate,  // Store as Date object
//           year,
//           programme_name,
//           programme_code,
//           number_of_students_appeared_in_the_final_year_examination,
//           number_of_students_passed_in_the_final_year_examination
//         });
    
//         res.status(201).json(
//           new apiResponse(201, entry, "Response created successfully")
//         );

// });
// /**
// * @route GET /api/response/2.6.3/:criteriaCode
// * @description Get all responses for a specific criteria code
// * @access Public
// */
// const getResponsesByCriteriaCode263 = async (req, res, next) => {
//   try {
//       const { criteriaCode } = req.params;
      
//       const responses = await db.response_2_6_3.findAll({
//           where: { criteria_code: criteriaCode },
//           include: [{
//               model: db.criteria_master,
//               as: 'criteria',
//               attributes: ['criterion_id', 'sub_criterion_id', 'sub_sub_criterion_id']
//           }],
//           order: [['submitted_at', 'DESC']]
//       });

//       return res.status(200).json(
//           new apiResponse(200, responses, 'Responses retrieved successfully')
//       );

//   } catch (error) {
//       next(error);
//   }
// };
// //score 263
// const score263 = asyncHandler(async (req, res) => {
//   /*
//   1. get the user input from the req body
//   2. query the criteria_master table to get the id and criteria_code 
//   3. validate the user input
//   4. create a new response
//   5. return the response
//   */
//   const criteria_code = convertToPaddedFormat("2.1.1");
//   console.log(criteria_code)
//   console.log(CriteriaMaster)
//   const criteria = await CriteriaMaster.findOne({
//     where: { 
//       sub_sub_criterion_id: criteria_code
//     }
//   });
//   const responses = await Criteria263.findAll({
//     attributes: ['number_of_students_appeared_in_the_final_year_examination', 'number_of_students_passed_in_the_final_year_examination'],  // Only get the option_selected field
//     where: {
//         criteria_code:criteria.criteria_code  
//     }
// });

// const total_appeared = responses.reduce((total, response) => total + (response.number_of_students_appeared_in_the_final_year_examination || 0), 0);
// const total_passed = responses.reduce((total, response) => total + (response.number_of_students_passed_in_the_final_year_examination || 0), 0);

// let score = 0;
// if (total_appeared > 0) {
//   score = (total_passed / total_appeared) * 100;
// }
// //array of scores of 5 years
// let scores = [];
// if (total_appeared > 0) {
//   score = (total_passed / total_appeared) * 100;
// }
// for (let i = 0; i < 5; i++) {
//   scores.push(score);
// }
// let average = 0;
// let years=scores.length;
// average = scores.reduce((sum, value) => sum + value, 0) / years;

// console.log("Average:", average);

// const currentYear = new Date().getFullYear();
// const sessionDate = new Date(currentYear, 0, 1); 
// const entry = await Score.create(
//   {
//     criteria_code: criteria.criteria_code,
//     criteria_id: criteria.criterion_id,
//     sub_criteria_id: criteria.sub_criterion_id,
//     sub_sub_criteria_id: criteria.sub_sub_criterion_id,
//     score_criteria: 0,
//     score_sub_criteria: 0,
//     score_sub_sub_criteria: average,
//     session: sessionDate,
//     year: currentYear,
//     cycle_year: 1
//   }
// );

// res.status(200).json(
//   new apiResponse(200, entry, "Response created successfully")
// )
// });



// const getAllCriteria271 = asyncHandler(async (req, res) => {
//   const criteria = await Criteria271.findAll();
//   if (!criteria) {
//       throw new apiError(404, "Criteria not found");
//   }
  
//   res.status(200).json(
//       new apiResponse(200, criteria, "Criteria found")
//   );
// });

// /**
// * @route POST /api/response/2.7.1
// * @description Create a new response for criteria 2.7.1
// * @access Private/Admin
// */
// const createResponse271 = asyncHandler(async (req, res) => {
//       console.log(CriteriaMaster)
//       const criteria = await CriteriaMaster.findOne({
//           where: {
//             sub_sub_criterion_id: '020701',
//             sub_criterion_id: '0207',
//             criterion_id: '02'
//           }
//         });
    
//         if (!criteria) {
//           throw new apiError(404, "Criteria not found");
//         }
    
//         // Validate required fields
//     const {session,name_of_the_student,gender,category,state_of_domicile,nationality_if_other_than_indian,email_id,programme_name,unique_enrolment_id_college_id,mobile_number,year_of_joining } = req.body;
//         if (!session || !name_of_the_student || !gender || !category || !state_of_domicile || !programme_name || !unique_enrolment_id_college_id || !mobile_number || !year_of_joining) {
//           throw new apiError(400, "Missing required fields");
//         }

//         if (year < 1990 || year > new Date().getFullYear()) {
//           throw new apiError(400, "Year must be between 1990 and current year");
//         }

//         // Create proper Date objects for session
//         const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year
//         console.log(criteria.criteria_code)
//         // Insert into response_2_7_1_data
//         const entry = await Criteria271.create({
//           id: criteria.id,
//           criteria_code: criteria.criteria_code,
//           session: sessionDate,  // Store as Date object
//           name_of_the_student,
//           gender,
//           category,
//           state_of_domicile,
//           nationality_if_other_than_indian,
//           email_id,
//           programme_name,
//           unique_enrolment_id_college_id,
//           mobile_number,
//           year_of_joining
//         });
    
//         res.status(201).json(
//           new apiResponse(201, entry, "Response created successfully")
//         );

// });
// /**
// * @route GET /api/response/2.7.1/:criteriaCode
// * @description Get all responses for a specific criteria code
// * @access Public
// */
// const getResponsesByCriteriaCode271 = async (req, res, next) => {
//   try {
//       const { criteriaCode } = req.params;
      
//       const responses = await db.response_2_7_1.findAll({
//           where: { criteria_code: criteriaCode },
//           include: [{
//               model: db.criteria_master,
//               as: 'criteria',
//               attributes: ['criterion_id', 'sub_criterion_id', 'sub_sub_criterion_id']
//           }],
//           order: [['submitted_at', 'DESC']]
//       });

//       return res.status(200).json(
//           new apiResponse(200, responses, 'Responses retrieved successfully')
//       );

//   } catch (error) {
//       next(error);
//   }
// };
// //score 271

export { 
  // getAllCriteria211,
  createResponse211,
  // getResponsesByCriteriaCode211,
  score211,
  // getAllCriteria212,
  createResponse212,
  // getResponsesByCriteriaCode212,
  score212,
  // getAllCriteria241243222233 ,
  // createResponse241243222233,
  // getResponsesByCriteriaCode241243222233,
  // score241,
  // score243,
  // score222,
  // score271
}