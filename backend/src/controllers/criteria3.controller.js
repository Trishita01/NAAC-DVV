import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import Sequelize from "sequelize";

const Criteria313 = db.response_3_1_3;
const Criteria312 = db.response_3_1_2;
const Criteria311 = db.response_3_1_1;
const Criteria321 = db.response_3_2_1;
const Criteria322 = db.response_3_2_2;
const Criteria332 = db.response_3_3_2;
const Criteria333 = db.response_3_3_3;
const Criteria341 = db.response_3_4_1;
const Criteria342 = db.response_3_4_2;
const Score = db.scores;
const IIQA = db.iiqa_form;
const extendedProfile = db.extended_profile;
const IIQA_Student_Details = db.iiqa_student_details;
const IIQAStaffDetails = db.iiqa_staff_details;
const CriteriaMaster = db.criteria_master;

// Helper function to convert criteria code to padded format
const convertToPaddedFormat = (code) => {
  // First remove any dots, then split into individual characters
  const parts = code.replace(/\./g, '').split('');
  // Pad each part to 2 digits and join
  return parts.map(part => part.padStart(2, '0')).join('');
};

// Helper function to calculate total number of teachers
const getTeacherCount = async () => {
  const response = await extendedProfile.findAll({
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

const getResponsesByCriteriaCode = asyncHandler(async (req, res) => {
  const { criteriaCode } = req.params;
  const { session } = req.query;

  if (!criteriaCode) {
    throw new apiError(400, "Missing criteria code");
  }

  const paddedCriteriaCode = convertToPaddedFormat(criteriaCode);
  const dbName = `response_${criteriaCode.replace(/\./g, '_')}`;

  // Step 1: Get criteria master
  const criteriaMaster = await db.criteria_master.findOne({
    where: { sub_sub_criterion_id: paddedCriteriaCode }
  });

  if (!criteriaMaster) {
    throw new apiError(404, `Criteria not found for code: ${criteriaCode}`);
  }

  // Step 2: Prepare where clause
  const whereClause = {
    criteria_code: criteriaMaster.criteria_code,
    ...(session && { session })  // Only include session if it's passed
  };
 console.log("DB Name",db[dbName])
  console.log("Database name:", dbName);
  console.log("Where clause:", whereClause);

  // Step 3: Fetch responses
try {
    const responses = await db[dbName].findAll({
      where: whereClause,
    });
    console.log("Query results:", responses);
    return res.status(200).json(
      new apiResponse(200, responses, 'Responses retrieved successfully')
    );
} catch (error) {
  console.log(error)
  throw new apiError(500, "Failed to fetch responses");
}
});

const createResponse313 = asyncHandler(async (req, res) => {
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
    workshop_name,
    participants,
    date_from,
    date_to,
    } = req.body;

  // Step 1: Field validation
if (!session || !workshop_name || !participants || !date_from || !date_to || !year) {
  throw new apiError(400, "Missing required fields");
}
const currentYear = new Date().getFullYear();
if (session < 1990 || session > currentYear) {
  throw new apiError(400, "Session must be between 1990 and current year");
}

if (year < 1990 || year > currentYear) {
  throw new apiError(400, "Year must be between 1990 and current year");
}

if (date_from  < 1990 || date_from > currentYear) {
  throw new apiError(400, "Date from must be between 1990 and current year");
}
if (date_to < 1990 || date_to > currentYear) {
  throw new apiError(400, "Date to must be between 1990 and current year");
}

if (date_from > date_to) {
  throw new apiError(400, "Date from must be before date to");
}

if (participants < 0) {
  throw new apiError(400, "Participants must be a positive number");
}

//Create proper Date objects for session
const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year

// Step 2: Check if workshop_name or workshop_code already exists for the same year and session
const existingRecord = await Criteria313.findOne({
  where: {
    session,
    [Sequelize.Op.or]: [
      { workshop_name },
    ]
  }
});

if (existingRecord) {
  if (existingRecord.workshop_name === workshop_name) {
    throw new apiError(400, "Workshop name already exists for this session and year");
  } else {
    throw new apiError(400, "Workshop code already exists for this session and year");
  }
}

// Step 3: Fetch criteria details
const criteria = await CriteriaMaster.findOne({
  where: {
    criterion_id: '03',
    sub_criterion_id: '0301',
    sub_sub_criterion_id: '030103'
  }
});

if (!criteria) {
  throw new apiError(404, "Criteria not found");
}

console.log(criteria.criteria_code);

//Step 4: Validate session window against IIQA 
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

//Step 5: Create or update response 
let [entry, created] = await Criteria313.findOrCreate({
  where: {
    session,
    year,
    workshop_name,
    date_from,
    date_to
  },
  defaults: {
    id: criteria.id,
    criteria_code: criteria.criteria_code,
    session,
    year,
    workshop_name,
    participants,
    date_from,
    date_to
  }
});

if(!created){
  await Criteria313.update({
    participants,
    year,
    workshop_name,
    date_from,
    date_to
  }, {
    where: {
      session,
      workshop_name,
      date_from,
      date_to,
      year
    }
  });

  // Fetch updated entry
  entry = await Criteria313.findOne({
    where: {
      session,
      year,
      workshop_name,
      date_from,
      date_to
    }
  });
}

return res.status(201).json(
  new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
);
});

const score313 = asyncHandler(async (req, res) => {
  const criteria_code = convertToPaddedFormat("3.1.3");
  const currentYear = new Date().getFullYear();
  const sessionYear = currentYear;

  // Step 1: Get criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      sub_sub_criterion_id: criteria_code
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria 3.1.3 not found in criteria_master");
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
  const startYear = endYear - 5; // Last 5 years including endYear

  // Step 3: Count total number of events conducted in the last 5 years
  const totalEvents = await Criteria313.count({
    where: {
      session: { [Sequelize.Op.between]: [startYear, endYear] }
    }
  });

  // Step 4: Scoring logic — Adjust as per your actual scale
  let score, grade;
  if (totalEvents >= 40) {
    score = 4;
    grade = 4;
  } else if (totalEvents >= 30) {
    score = 3;
    grade = 3;
  } else if (totalEvents >= 20) {
    score = 2;
    grade = 2;
  } else if (totalEvents >= 5) {
    score = 1;
    grade = 1;
  } else {
    score = 0;
    grade = 0;
  }

  console.log("Score 3.1.3:", score);
  console.log("Grade 3.1.3:", grade);

  // Step 5: Insert or update score
  let [entry, created] = await Score.findOrCreate({
    where: {
      criteria_code: criteria.criteria_code,
      session: sessionYear
    },
    defaults: {
      criteria_code: criteria.criteria_code,
      criteria_id: criteria.criterion_id,
      sub_criteria_id: criteria.sub_criterion_id,
      sub_sub_criteria_id: criteria.sub_sub_criterion_id,
      score_criteria: 0,
      score_sub_criteria: 0,
      score_sub_sub_criteria: score,
      sub_sub_cr_grade: grade,
      session: sessionYear,
      year: currentYear,
      cycle_year: 1
    }
  });

  if (!created) {
    await Score.update({
      score_sub_sub_criteria: score,
      sub_sub_cr_grade: grade,
      session: sessionYear,
      year: currentYear,
      cycle_year: 1
    }, {
      where: {
        criteria_code: criteria.criteria_code,
        session: sessionYear
      }
    });

    entry = await Score.findOne({
      where: {
        criteria_code: criteria.criteria_code,
        session: sessionYear
      }
    });
  }

  return res.status(200).json(
    new apiResponse(200, {
      score,
      totalEvents,
      grade
    }, created ? "Score created successfully" : "Score updated successfully")
  );
});

const createResponse321 = asyncHandler(async (req, res) => {
  /*
  1. Extract input from the body
  2. Validate required fields and logical constraints
  3. Check if programme_name or programme_code already exists for the same year and session
  4. Get criteria_code from criteria_master
  5. Get latest IIQA session and validate session window
  6. Create or update response in response_3_2_1 table
  */

  const {
    session,
    paper_title,
    author_names,
    department,
    journal_name,
    year_of_publication,
    issn_number,
    indexation_status   
   } = req.body;

   // Step 1: Field Validation
   if(
    !session || !paper_title || ! author_names || ! department || ! journal_name || ! year_of_publication || ! issn_number
   ) {
    throw new apiError(400, "Missing required fields");
   }

   const currentYear = new Date().getFullYear();
   if(
    session < 1990 || session > currentYear
    ) {
    throw new apiError(400, "Session must be between 1990 and current year");
   }

   if(year_of_publication < 1990 || year_of_publication > currentYear) {
    throw new apiError(400, "Year of publication must be between 1990 and current year");
   }

   if(issn_number.length !== 13) {
    throw new apiError(400, "ISSN number must be 13 digits");
   }

   //Create proper Date objects for session
   const sessionDate = new Date(session, 0, 1); // Jan 1st of the given year

   //Step 2: Check for existing programme_name or programme_code in same session/year
   const existingRecord = await Criteria321.findOne({
    where: {
      session,
      [Sequelize.Op.or]: [
        { paper_title },
      ]
    }
  });

  if(existingRecord) {
    if(existingRecord.author_names === author_names) {
      throw new apiError(400, " Author name already exists for this paper_title")
    }
    if(existingRecord.department === department) {
      throw new apiError(400, "Department already exists for this paper_title")
    }
    if(existingRecord.journal_name === journal_name) {
      throw new apiError(400, "Journal name already exists for this paper_title")
    }
    if(existingRecord.year_of_publication === year_of_publication) {
      throw new apiError(400, "Year of publication already exists for this paper_title")
    }
    if(existingRecord.issn_number === issn_number) {
      throw new apiError(400, "ISSN number already exists for this paper_title")
    }
    else{
      throw new apiError(400, "Paper title already exists for this session and year")
    }
  }

  // Step 3: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '03',
      sub_criterion_id: '0302',
      sub_sub_criterion_id: '030201'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  console.log(criteria.criteria_code);

  //Step 4: Validate session window against IIQA 
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if(!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if(session < startYear || session > endYear) {
    throw new apiError(400, "Session must be between ${startYear} and ${endYear}");
  }

  // Step 5 : Create or update response
  let [entry, created] = await Criteria321.findOrCreate({
    where : {
      session,
      paper_title,
      author_names,
      department,
      journal_name,
      year_of_publication,
      issn_number
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session,
      paper_title,
      author_names,
      department,
      journal_name,
      year_of_publication,
      issn_number   
    }
  });

  if (!created) {
    await Criteria321.update({
      
    }, {
      where: {
        session,
        paper_title,
        author_names,
        department,
        journal_name,
        year_of_publication,
        issn_number   
      }
    });

    entry = await Criteria321.findOne({
      where: {
        session,
        paper_title,
        author_names,
        department,
        journal_name,
        year_of_publication,
        issn_number   
      }
    });
  }

  return res.status(201).json(
    new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});

const score321 = asyncHandler(async (req, res) => {
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });
  if (!latestIIQA) throw new apiError(404, "No IIQA record found");

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  console.log(startYear, endYear);

  const publicationCount = await Criteria321.findAll({
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('paper_title')), 'count']
    ],
    where: {
      session: { [Sequelize.Op.between]: [startYear, endYear] }
    },
    raw: true
  });

  console.log(publicationCount);

  const teacherData = await extendedProfile.findAll({
    attributes: ['year', 'full_time_teachers'],
    where: {
      year: {
        [Sequelize.Op.between]: [startYear, endYear]
      }
    },
    order: [['year', 'DESC']]
  });
  
  if (!teacherData) {
    throw new apiError(404, "No full-time teacher data found in the session range");
  }
  
  // Step 1: Group by session/year
  const groupedBySession = {};
  teacherData.forEach(record => {
    const year = record.year;
    if (!groupedBySession[year]) {
      groupedBySession[year] = 0;
    }
    groupedBySession[year] += record.full_time_teachers || 0;
  });
  
  // Step 2: Calculate average from latest 5 years
  const recentSessions = Object.keys(groupedBySession)
    .sort((a, b) => b - a) // Sort DESC
    .slice(0, 5); // Take latest 5 sessions
  
  const teacherCounts = recentSessions.map(session => groupedBySession[session]);
  const totalTeachers = teacherCounts.reduce((sum, value) => sum + value, 0);
  const average = (teacherCounts.length > 0 ? totalTeachers / teacherCounts.length : 0).toFixed(3);
  
  console.log("Grouped By Session:", groupedBySession);
  console.log("Recent Sessions:", recentSessions);
  console.log("Average Full-Time Teachers (last 5 years):", average);
  

  const avgTeachers = parseFloat(average || 0);
  console.log(avgTeachers);
  const score = avgTeachers > 0 ? (publicationCount[0].count / avgTeachers).toFixed(2) : 0;
  console.log(score);

  // Grading
  let grade = 0;
  if (score >= 10) {
    grade = 4;
  } else if (score >= 5) {
    grade = 3;
  } else if (score >= 3) {
    grade = 2;
  } else if (score > 0) {
    grade = 1;
  } else {
    grade = 0;
  }

  console.log("Score 3.2.1:", score);
  console.log("Grade 3.2.1:", grade);

  return res.status(200).json({ success: true, score, grade });
});

const createResponse322 = asyncHandler(async (req, res) => {
  /*
    1. Extract input from req.body
    2. Validate required fields and logical constraints
    3. Check if programme_name or programme_code already exists for the same year and session
    4. Get criteria_code from criteria_master
    5. Get latest IIQA session and validate session window
    6. Create or update response in response_3_2_2 table
  */

    const {
      session,
      teacher_name,
      book_chapter_title,
      paper_title,
      conference_title,
      year_of_publication,
      publisher_name,
      isbn_issn_number,
      institution_affiliated  
    } = req.body;

    // Step 1: Field validation
    if (
      !session || !teacher_name || !book_chapter_title || !paper_title || !conference_title || !year_of_publication || !publisher_name || !isbn_issn_number || !institution_affiliated
    ) {
      throw new apiError(400, "Missing required fields");
    }

    const currentYear = new Date().getFullYear();
    if(session < 1990 || session > currentYear) {
      throw new apiError(400, "Session must be between 1990 and current year");
    }

    if(year_of_publication < 1990 || year_of_publication > currentYear) {
      throw new apiError(400, "Year of publication must be between 1990 and current year");
    }

    if(institution_affiliated !== 'YES' && institution_affiliated !== 'NO') {
      throw new apiError(400, "Institution affiliated must be 'YES' or 'NO'");
    }

    if(isbn_issn_number.length !== 13) {
      throw new apiError(400, "ISBN/ISSN number must be 13 digits");
    }
  
  // Step 2: Check for existing teacher_name or book_chapter_title in same session/year
  const existingRecord = await Criteria322.findOne({
    where: {
      session,
      [Sequelize.Op.or]: [
        { teacher_name },
        { book_chapter_title }
      ]
    }
  });

  if(existingRecord) {
    if(existingRecord.teacher_name === teacher_name) {
      throw new apiError(400, "Teacher name already exists for this book_chapter_title")
    }
    if(existingRecord.book_chapter_title === book_chapter_title) {
      throw new apiError(400, "Book chapter title already exists for this teacher_name")
    }
    if(existingRecord.paper_title === paper_title) {
      throw new apiError(400, "Paper title already exists for this teacher_name")
    }
    if(existingRecord.conference_title === conference_title) {
      throw new apiError(400, "Conference title already exists for this teacher_name")
    }
    if(existingRecord.year_of_publication === year_of_publication) {
      throw new apiError(400, "Year of publication already exists for this teacher_name")
    }
    if(existingRecord.publisher_name === publisher_name) {
      throw new apiError(400, "Publisher name already exists for this teacher_name")
    }
    if(existingRecord.isbn_issn_number === isbn_issn_number) {
      throw new apiError(400, "ISBN/ISSN number already exists for this teacher_name")
    }
    if(existingRecord.institution_affiliated === institution_affiliated) {
      throw new apiError(400, "Institution affiliated already exists for this teacher_name")
    }
    else{
      throw new apiError(400, "Book chapter title already exists for this session and year")
    }
  }

  //Step 3: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '03',
      sub_criterion_id: '0302',
      sub_sub_criterion_id: '030202'
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

  if(!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if(session < startYear || session > endYear) {
    throw new apiError(400, "Session must be between ${startYear} and ${endYear}");
  } 

  // Step 5 : Create or update response
 let [entry, created] = await Criteria322.findOrCreate({
  where: {
    session,
    teacher_name,
    book_chapter_title,
    paper_title,
    conference_title,
    year_of_publication,
    publisher_name,
    isbn_issn_number,
    institution_affiliated  
  },
  defaults: {
    id: criteria.id,
    criteria_code: criteria.criteria_code,
    session,
    teacher_name,
    book_chapter_title,
    paper_title,
    conference_title,
    year_of_publication,
    publisher_name,
    isbn_issn_number,
    institution_affiliated  
  }
 });

 if (!created) {
  await Criteria322.update({
    
  }, {
    where: {
      session,
      teacher_name,
      book_chapter_title,
      paper_title,
      conference_title,
      year_of_publication,
      publisher_name,
      isbn_issn_number,
      institution_affiliated  
    }
  });
 }

 entry = await Criteria322.findOne({
  where: {
    session,
    teacher_name,
    book_chapter_title,
    paper_title,
    conference_title,
    year_of_publication,
    publisher_name,
    isbn_issn_number,
    institution_affiliated  
  }
 });

 return res.status(201).json(
  new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
 );
});

const score322 = asyncHandler(async (req, res) => {
  // Step 1: Get latest IIQA session end year
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });
  if (!latestIIQA) throw new apiError(404, "No IIQA record found");

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 4; // last 5 years inclusive

  // Step 2: Count total books, chapters, papers from Criteria322 in last 5 years
  // (assuming each record counts as one)
  const totalPublications = await Criteria322.count({
    where: {
      year_of_publication: { [Sequelize.Op.between]: [startYear, endYear] }
    }
  });

  // Step 3: Get average full-time teachers from extended_profile
  const teacherData = await extendedProfile.findAll({
    attributes: [
      [Sequelize.fn('AVG', Sequelize.col('full_time_teachers')), 'avg_teachers']
    ],
    where: {
      year: { [Sequelize.Op.between]: [startYear, endYear] }
    },
    raw: true
  });

  const avgTeachers = parseFloat(teacherData[0]?.avg_teachers || 0);

  // Step 4: Calculate score (avoid division by zero)
  const score = avgTeachers > 0 ? (totalPublications / avgTeachers).toFixed(2) : 0;

  // Step 5: Apply grading logic
  let grade = 0;
  if (score >= 10) {
    grade = 4;
  } else if (score >= 5) {
    grade = 3;
  } else if (score >= 3) {
    grade = 2;
  } else if (score > 0) {
    grade = 1;
  } else {
    grade = 0;
  }

  console.log("Score 3.2.2:", score);
  console.log("Grade 3.2.2:", grade);

  // Optional: fetch criteria code for response
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '03',
      sub_criterion_id: '0302',
      sub_sub_criterion_id: '030202'
    }
  });

  if (!criteria) throw new apiError(404, "Criteria not found");

  return res.status(200).json(
    new apiResponse(200, {
      criteria_code: criteria.criteria_code,
      total_publications: totalPublications,
      average_teachers: avgTeachers,
      score,
      grade
    }, "Score calculated successfully")
  );
});

const createResponse332 = asyncHandler(async (req, res) => {
  /*
    1. Extract input from req.body
    2. Validate required fields and logical constraints
    3. Check if programme_name or programme_code already exists for the same year and session
    4. Get criteria_code from criteria_master
    5. Get latest IIQA session and validate session window
    6. Create or update response in response_3_3_2 table
  */

  const {
    session,
    activity_name,
    award_name,
    awarding_body,
    year_of_award
  } = req.body;

  // Step 1: Field validation
  if (!session || !activity_name || !award_name || !awarding_body || !year_of_award) {
    throw new apiError(400, "Missing required fields");
  }

  const currentYear = new Date().getFullYear();
  if(session < 1990 || session > currentYear) {
    throw new apiError(400, "Session must be between 1990 and current year");
  }

  if(year_of_award < 1990 || year_of_award > currentYear) {
    throw new apiError(400, "Year of award must be between 1990 and current year");
  }

  // Step 2: Check if activity_name or award_name already exists for the same year and session
  const existingRecord = await Criteria332.findOne({
    where: {
      session,
      [Sequelize.Op.or]: [
        { activity_name },
        { award_name }
      ]
    }
  });

  if(existingRecord) {
    if(existingRecord.activity_name === activity_name) {
      throw new apiError(400, "Activity name already exists for this award_name")
    }
    if(existingRecord.award_name === award_name) {
      throw new apiError(400, "Award name already exists for this activity_name")
    }
    if(existingRecord.awarding_body === awarding_body) {
      throw new apiError(400, "Awarding body already exists for this activity_name")
    }
    if(existingRecord.year_of_award === year_of_award) {
      throw new apiError(400, "Year of award already exists for this activity_name")
    }
    else{
      throw new apiError(400, "Activity name already exists for this session and year")
    }
  }

  //Step 3: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '03',
      sub_criterion_id: '0303',
      sub_sub_criterion_id: '030301'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  //Step 4: Validate session window against IIQA
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if(!latestIIQA) {
    throw new apiError(404, "No IIQA form found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  if(session < startYear || session > endYear) {
    throw new apiError(400, "Session must be between ${startYear} and ${endYear}");
  }

  //Step 5: Create or update response
  let [entry, created] = await Criteria332.findOrCreate({
    where: {
      session,
      activity_name,
      award_name,
      awarding_body,
      year_of_award
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session,
      activity_name,
      award_name,
      awarding_body,
      year_of_award
    }
  }); 

  if(!created) {
    await Criteria332.update({
      activity_name,
      award_name,
      awarding_body,
      year_of_award
    }, {
      where: {
        session,
        activity_name,
        award_name,
        awarding_body,
        year_of_award
      }
    });

    entry = await Criteria332.findOne({
      where: {
        session,
        activity_name,
      award_name,
      awarding_body,
      year_of_award
    }
  });
}

  return res.status(201).json(
    new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});

const score332 = asyncHandler(async (req, res) => {
  // Get criteria info
  const criteria_code = '030302';

  const criteria = await CriteriaMaster.findOne({
    where: { sub_sub_criterion_id: criteria_code }
  });
  if (!criteria) throw new apiError(404, "Criteria not found");

  // Get latest IIQA session end year
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });
  if (!latestIIQA) throw new apiError(404, "No IIQA form found");

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5; // last 5 years inclusive

  // Fetch awards count grouped by year (year_of_award) for last 5 years
  const awardsPerYear = await Criteria332.findAll({
    attributes: [
      'year_of_award',
      [Sequelize.fn('COUNT', Sequelize.col('year_of_award')), 'count']
    ],
    where: {
      year_of_award: { [Sequelize.Op.between]: [startYear, endYear] }
    },
    group: ['year_of_award'],
    order: [['year_of_award', 'ASC']],
    raw: true
  });

  // To include years with zero awards, create a map with 0 defaults
  const yearWiseAwards = {};
  for(let y = startYear; y <= endYear; y++) {
    yearWiseAwards[y] = 0;
  }

  awardsPerYear.forEach(record => {
    yearWiseAwards[record.year_of_award] = parseInt(record.count, 10);
  });

  return res.status(200).json(
    new apiResponse(200, {
      criteria_code: criteria.criteria_code,
      yearWiseAwards
    }, "Year-wise awards count fetched successfully")
  );
});

const  createResponse333 = asyncHandler(async (req, res) => {
  /*
    1. Extract input from req.body
    2. Validate required fields and logical constraints
    3. Check if programme_name or programme_code already exists for the same year and session
    4. Get criteria_code from criteria_master
    5. Get latest IIQA session and validate session window
    6. Create or update response in response_3_3_3 table
  */

    const {
      session,
      activity_name,
      collaborating_agency,
      scheme_name,
      student_count,
      year
    } = req.body;

    //Step 1: Field validation
    if(!session || !activity_name || !collaborating_agency || !scheme_name || !student_count || !year) {
      throw new apiError(400, "Missing required fields");
    }

    const currentYear = new Date().getFullYear();
    if (
      session < 1990 || session > currentYear
    )  {
        throw new apiError(400, "Session must be between 1990 and current year");
    }

    if (
      year < 1990 || year > currentYear
    )  {
      throw new apiError(400, "Year must be between 1990 and current year");
    }


   // Step 2: Check for existing activity_name or collaborating_agency or scheme_name or activity_type or student_count or year
   const existingRecord = await Criteria333.findOne({
    where: {
      session,
      [Sequelize.Op.or]: [
        { activity_name },
        { collaborating_agency },
        { scheme_name },
        { student_count },
        { year }
      ]
    }
  });

  if (existingRecord) {
    if (existingRecord.activity_name === activity_name) {
      throw new apiError(400, "Activity name already exists for this session and year");
    } else {
      throw new apiError(400, "Collaborating agency already exists for this session and year");
    }
  }

  if (existingRecord) {
    if (existingRecord.collaborating_agency === collaborating_agency) {
      throw new apiError(400, "Collaborating agency already exists for this session and year");
    } else {
      throw new apiError(400, "Scheme name already exists for this session and year");
    }
  }

  if (existingRecord) {
    if (existingRecord.scheme_name === scheme_name) {
      throw new apiError(400, "Scheme name already exists for this session and year");
    } else {
      throw new apiError(400, "Student count already exists for this session and year");
    }
  }

  if (existingRecord) {
    if (existingRecord.student_count === student_count) {
      throw new apiError(400, "Student count already exists for this session and year");
    } else {
      throw new apiError(400, "Year already exists for this session and year");
    }
  }

  if (existingRecord) {
    if (existingRecord.year === year) {
      throw new apiError(400, "Year already exists for this session and year");
    } else {
      throw new apiError(400, "Activity name already exists for this session and year");
    }
  }

  //Step 3: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '03',
      sub_criterion_id: '0303',
      sub_sub_criterion_id: '030303'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  console.log(criteria.criteria_code);

  //Step 4: Validate session window against IIQA 
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

  //Step 5: Create or update response
  let [entry,created] = await Criteria333.findOrCreate({
    where: {
      session,
      activity_name,
      collaborating_agency,
      scheme_name,
      student_count,
      year
   
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session,
      activity_name,
      collaborating_agency,
      scheme_name,
      student_count,
      year
    }
  });

  if(!created) {
    await Criteria333.update({
      activity_name,
      collaborating_agency,
      scheme_name,
      student_count,
      year
    }, {
      where: {
        session,
        activity_name,
        collaborating_agency,
        scheme_name,
        student_count,
        year
      }
    });

    entry = await Criteria333.findOne({
      where: {
        session,
        activity_name,
        collaborating_agency,
        scheme_name,
        student_count,
        year
      }
    });
  }

  return res.status(201).json(
    new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});

const score333 = asyncHandler(async (req, res) => {
  const criteria_code = '030303';

  // Fetch criteria info
  const criteria = await CriteriaMaster.findOne({
    where: { sub_sub_criterion_id: criteria_code }
  });
  if (!criteria) throw new apiError(404, "Criteria not found");

  // Get latest IIQA session end year
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });
  if (!latestIIQA) throw new apiError(404, "No IIQA form found");

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 4; // last 5 years inclusive

  // Count total programs in last 5 years
  const totalPrograms = await Criteria333.count({
    where: {
      year: { [Sequelize.Op.between]: [startYear, endYear] }
    }
  }) || 0;

  // Grade thresholds based on total programs
  let score = 0, grade = 0;
  if (totalPrograms > 75) {
    score = 4; grade = 4;
  } else if (totalPrograms >= 60) {
    score = 3; grade = 3;
  } else if (totalPrograms >= 40) {
    score = 2; grade = 2;
  } else if (totalPrograms >= 10) {
    score = 1; grade = 1;
  } else {
    score = 0; grade = 0;
  }

  const sessionYear = new Date().getFullYear();

  // Create or update score record
  let [entry, created] = await Score.findOrCreate({
    where: { criteria_code: criteria.criteria_code, session: sessionYear },
    defaults: {
      criteria_code: criteria.criteria_code,
      criteria_id: criteria.criterion_id,
      sub_criteria_id: criteria.sub_criterion_id,
      sub_sub_criteria_id: criteria.sub_sub_criterion_id,
      score_criteria: 0,
      score_sub_criteria: 0,
      score_sub_sub_criteria: score,
      sub_sub_cr_grade: grade,
      session: sessionYear,
      year: sessionYear,
      cycle_year: 1
    }
  });

  if (!created) {
    await Score.update({
      score_sub_sub_criteria: score,
      sub_sub_cr_grade: grade,
      session: sessionYear,
      year: sessionYear,
      cycle_year: 1
    }, {
      where: { criteria_code: criteria.criteria_code, session: sessionYear }
    });

    entry = await Score.findOne({
      where: { criteria_code: criteria.criteria_code, session: sessionYear }
    });
  }

  return res.status(200).json(
    new apiResponse(200, {
      score,
      grade,
      totalPrograms
    }, created ? "Score created successfully" : "Score updated successfully")
  );
});

const createResponse341 = asyncHandler(async (req, res) => {
  /*
    1. Extract input from req.body
    2. Validate required fields and logical constraints
    3. Check if programme_name or programme_code already exists for the same year and session
    4. Get criteria_code from criteria_master
    5. Get latest IIQA session and validate session window
    6. Create or update response in response_3_4_1 table
  */
 const {
  session,
  title_of_activity,
  collaborating_agency,
  participant_name,
  year_of_collaboration,
  duration,
  document_link
  }= req.body;

  //Step 1: Field validation
  if(!session || !title_of_activity || !collaborating_agency || !participant_name || !year_of_collaboration || !duration || !document_link) {
    throw new apiError(400, "Missing required fields");
  }

  const currentYear = new Date().getFullYear();
  if (
    session < 1990 || session > currentYear
  )  {
      throw new apiError(400, "Session must be between 1990 and current year");
  }

  if (
    year_of_collaboration < 1990 || year_of_collaboration > currentYear
  )  {
    throw new apiError(400, "Year of collaboration must be between 1990 and current year");
  }
  


  //Step 2: Check for existing title_of_activity or collaborating_agency or participant_name or year_of_collaboration or duration or document_link in same session/year
  const existingRecord = await Criteria341.findOne({
    where: {
      session,
      [Sequelize.Op.or]: [
        { title_of_activity },
        { collaborating_agency },
        { participant_name },
        { year_of_collaboration },
        { duration },
        { document_link }
      ]
    }
  });

  if(existingRecord) {
    if(existingRecord.title_of_activity === title_of_activity) {
      throw new apiError(400, "Title of activity already exists for this session and year");
    } else {
      throw new apiError(400, "Collaborating agency already exists for this session and year");
    }
  }

  if(existingRecord) {
    if(existingRecord.collaborating_agency === collaborating_agency) {
      throw new apiError(400, "Collaborating agency already exists for this session and year");
    } else {
      throw new apiError(400, "Participant name already exists for this session and year");
    }
  }

  if(existingRecord) {
    if(existingRecord.participant_name === participant_name) {
      throw new apiError(400, "Participant name already exists for this session and year");
    } else {
      throw new apiError(400, "Year of collaboration already exists for this session and year");
    }
  }

  if(existingRecord) {
    if(existingRecord.year_of_collaboration === year_of_collaboration) {
      throw new apiError(400, "Year of collaboration already exists for this session and year");
    } else {
      throw new apiError(400, "Duration already exists for this session and year");
    }
  }

  if(existingRecord) {
    if(existingRecord.duration === duration) {
      throw new apiError(400, "Duration already exists for this session and year");
    } else {
      throw new apiError(400, "Document link already exists for this session and year");
    }
  }

  if(existingRecord) {
    if(existingRecord.document_link === document_link) {
      throw new apiError(400, "Document link already exists for this session and year");
    } else {
      throw new apiError(400, "Title of activity already exists for this session and year");
    }
  }
  
  //Step 3: Fetch criteria details
  const criteria = await CriteriaMaster.findOne({
    where: {
      criterion_id: '03',
      sub_criterion_id: '0304',
      sub_sub_criterion_id: '030401'
    }
  });

  if (!criteria) {
    throw new apiError(404, "Criteria not found");
  }

  console.log(criteria.criteria_code);

  //Step 4: Validate session window against IIQA 
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

  //Step 5: Create or update response
  let [entry, created] = await Criteria341.findOrCreate({
    where: {
      session,
      title_of_activity,
      collaborating_agency,
      participant_name,
      year_of_collaboration,
      duration,
      document_link
    },
    defaults: {
      id: criteria.id,
      criteria_code: criteria.criteria_code,
      session,
      title_of_activity,
      collaborating_agency,
      participant_name,
      year_of_collaboration,
      duration,
      document_link
    }
  });

  if (!created) {
    await Criteria341.update({
      title_of_activity,
      collaborating_agency,
      participant_name,
      year_of_collaboration,
      duration,
      document_link
    }, {
      where: {
        session,
        title_of_activity,
        collaborating_agency,
        participant_name,
        year_of_collaboration,
        duration,
        document_link
      }
    });

    entry = await Criteria341.findOne({
      where: {
        session,
        title_of_activity,
        collaborating_agency,
        participant_name,
        year_of_collaboration,
        duration,
        document_link
      }
    });
  }

  return res.status(201).json(
    new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
  );
});

const score341 = asyncHandler(async (req, res) => {
  // Step 1: Get the latest IIQA session
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['created_at', 'DESC']]
  });

  if (!latestIIQA) {
    throw new apiError(404, "No IIQA session found");
  }

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 4;

  // Step 2: Count linkages year-wise
  const linkages = await Criteria341.findAll({
    attributes: [
      'session',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
    ],
    where: {
      session: {
        [Sequelize.Op.between]: [startYear, endYear]
      }
    },
    group: ['session'],
    raw: true
  });

  // Step 3: Calculate total over last 5 years
  const totalLinkages = linkages.reduce((sum, record) => {
    return sum + parseInt(record.count, 10);
  }, 0);

  // Step 4: Map to grade
  let grade = 0;
  if (totalLinkages > 20) {
    grade = 4;
  } else if (totalLinkages >= 15) {
    grade = 3;
  } else if (totalLinkages >= 10) {
    grade = 2;
  } else if (totalLinkages >= 1) {
    grade = 1;
  } else {
    grade = 0;
  }

  console.log("Score 3.4.1:", score);
  console.log("Grade 3.4.1:", grade);

  return res.status(200).json(
    new apiResponse(200, {
      startYear,
      endYear,
      totalLinkages,
      grade
    }, "Linkages calculated successfully")
  );
});

const createResponse342 = asyncHandler(async (req, res) => {
  /*
    1. Extract input from req.body
    2. Validate required fields and logical constraints
    3. Check if programme_name or programme_code already exists for the same year and session
    4. Get criteria_code from criteria_master
    5. Get latest IIQA session and validate session window
    6. Create or update response in response_3_4_2 table
  */

  const {
    session,
    institution_name,
    year_of_mou,
    duration,
    activities_list
    } = req.body;

    // Step 1: Field validation
    if (!session || !institution_name || !year_of_mou || !duration || !activities_list) {
      throw new apiError(400, "Missing required fields");
    }
    
    const currentYear = new Date().getFullYear();
    if (
      session < 1990 || session > currentYear
    )  {
        throw new apiError(400, "Session must be between 1990 and current year");
    }
    
    if (
      year_of_mou < 1990 || year_of_mou > currentYear
    )  {
      throw new apiError(400, "Year of MOU must be between 1990 and current year");
    }
    
    if (duration < 0) {
      throw new apiError(400, "Duration must be greater than 0");
    }
    
    // Step 2: Check for existing institution_name or year_of_mou or duration or activities_list in same session/year
    const existingRecord = await Criteria342.findOne({
      where: {
        session,
        [Sequelize.Op.or]: [
          { institution_name },
          { year_of_mou },
          { duration },
          { activities_list }
        ]
      }
    });
    
    if (existingRecord) {
      if (existingRecord.institution_name === institution_name) {
        throw new apiError(400, "Institution name already exists for this session and year");
      } else {
        throw new apiError(400, "Year of MOU already exists for this session and year");
      }
    }
    
    if (existingRecord) {
      if (existingRecord.year_of_mou === year_of_mou) {
        throw new apiError(400, "Year of MOU already exists for this session and year");
      } else {
        throw new apiError(400, "Duration already exists for this session and year");
      }
    }
    
    if (existingRecord) {
      if (existingRecord.duration === duration) {
        throw new apiError(400, "Duration already exists for this session and year");
      } else {
        throw new apiError(400, "Activities list already exists for this session and year");
      }
    }
    
    if (existingRecord) {
      if (existingRecord.activities_list === activities_list) {
        throw new apiError(400, "Activities list already exists for this session and year");
      } else {
        throw new apiError(400, "Institution name already exists for this session and year");
      }
    }

    //Step 3: Fetch criteria details
    const criteria = await CriteriaMaster.findOne({
      where: {
        criterion_id: '03',
        sub_criterion_id: '0304',
        sub_sub_criterion_id: '030402'
      }
    });

    if (!criteria) {
      throw new apiError(404, "Criteria not found");
    }

    console.log(criteria.criteria_code);
    
    //Step 4: Validate session window against IIQA
    const latestIIQA = await IIQA.findOne({
      attributes: ['session_end_year'],
      order: [['created_at', 'DESC']]
    });

    if(!latestIIQA) {
      throw new apiError(404, "No IIQA form found");
    }

    const endYear = latestIIQA.session_end_year;
    const startYear = endYear - 5;

    if (session < startYear || session > endYear) {
      throw new apiError(400, "Session must be between ${startYear} and ${endYear}");
    }

    //Step 5: Create or update response
    let [entry, created]  = await Criteria342.findOrCreate({
      where: {
        session,
        institution_name,
        year_of_mou,
        duration,
        activities_list
      },
      defaults: {
        id: criteria.id,
        criteria_code: criteria.criteria_code,
        session,
        institution_name,
        year_of_mou,
        duration,
        activities_list
      }
    });

    if (!created) {
      await Criteria342.update({
        institution_name,
        year_of_mou,
        duration,
        activities_list
      }, {
        where: {
          session,
          institution_name,
          year_of_mou,
          duration,
          activities_list
        }
      });

      entry = await Criteria342.findOne({
        where: {
          session,
          institution_name,
          year_of_mou,
          duration,
          activities_list
        }
      });
    }

    return res.status(201).json(
      new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
    );
});

const score342 = asyncHandler(async (req, res) => {
    // Step 1: Get latest IIQA session end year
    const latestIIQA = await IIQA.findOne({
      attributes: ['session_end_year'],
      order: [['created_at', 'DESC']]
    });
    if (!latestIIQA) throw new apiError(404, "No IIQA record found");
  
    const endYear = latestIIQA.session_end_year;
    const startYear = endYear - 4; // last 5 years inclusive
  
    // Step 2: Count total functional MoUs (year_of_mou) in last 5 years
    const totalMoUs = await Criteria342.count({
      where: {
        year_of_mou: { [Sequelize.Op.between]: [startYear, endYear] }
      }
    });
  
    // Step 3: Calculate grade based on totalMoUs
    let grade = 0;
    if (totalMoUs >= 20) {
      grade = 4;
    } else if (totalMoUs >= 15) {
      grade = 3;
    } else if (totalMoUs >= 10) {
      grade = 2;
    } else if (totalMoUs >= 1) {
      grade = 1;
    } else {
      grade = 0;
    }
  
    return res.status(200).json({
      success: true,
      totalMoUs,
      grade
    });
});

const createResponse311_312 = asyncHandler(async (req, res) => {
  const {
    session,
    year,
    name_of_principal_investigator,
    department_of_principal_investigator,
    duration_of_project,
    type,
    name_of_project,
    year_of_award,
    amount_sanctioned,
    name_of_funding_agency
  } = req.body;

  // Step 1: Validate required fields
  if (
    !session ||
    !year ||
    !name_of_principal_investigator ||
    !duration_of_project ||
    !name_of_project ||
    !amount_sanctioned ||
    !name_of_funding_agency
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

  if (year_of_award && (year_of_award < 1990 || year_of_award > currentYear)) {
    throw new apiError(400, "Year of award must be between 1990 and current year");
  }

  if (duration_of_project < 0 || amount_sanctioned < 0) {
    throw new apiError(400, "Duration and amount must be positive");
  }

  // Step 2: Validate session against IIQA
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
    throw new apiError(400, `Session must be between ${startYear} and ${endYear}`);
  }

  // Step 3: Start transaction
  const transaction = await db.sequelize.transaction();

  try {
    // Fetch criteria for both 3.1.1 and 3.1.2
    const criteriaList = await CriteriaMaster.findAll({
      where: {
        sub_sub_criterion_id: { [Sequelize.Op.in]: ["030101", "030102"] },
        sub_criterion_id: "0301",
        criterion_id: "03"
      },
      transaction
    });

    if (!criteriaList || criteriaList.length !== 2) {
      await transaction.rollback();
      throw new apiError(404, "One or more criteria not found");
    }

    // Map criteria to models
    const modelMap = {
      "030101": { model: Criteria311, name: "3.1.1" },
      "030102": { model: Criteria312, name: "3.1.2" }
    };

    const responses = [];

    // Insert or update in both tables
    for (const criteria of criteriaList) {
      const { model: Model, name } = modelMap[criteria.sub_sub_criterion_id];
      if (!Model) continue;

      try {
        const [entry, created] = await Model.findOrCreate({
          where: {
            session,
            year,
            name_of_principal_investigator,
            name_of_project
          },
          defaults: {
            id: criteria.id,
            criteria_code: criteria.criteria_code,
            session,
            year,
            name_of_principal_investigator,
            department_of_principal_investigator,
            duration_of_project,
            type,
            name_of_project,
            year_of_award,
            amount_sanctioned,
            name_of_funding_agency
          },
          transaction
        });

        responses.push({
          criteria: name,
          created,
          message: created ? "Entry created successfully" : "Entry already exists"
        });

      } catch (error) {
        await transaction.rollback();
        throw new apiError(400, `Error creating entry for criteria ${name}: ${error.message}`);
      }
    }

    await transaction.commit();

    return res.status(200).json(
      new apiResponse(200, { responses }, "Stored in both 3.1.1 and 3.1.2 successfully")
    );

  } catch (error) {
    throw error; // Let global error handler handle it
  }
});

const score311 = asyncHandler(async (req, res) => {
  const session = new Date().getFullYear();
  const criteria_code = convertToPaddedFormat("3.1.1");

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

  // Step 2: Fetch all records in session window
  const grants = await Criteria311.findAll({
    attributes: ['amount_sanctioned', 'year_of_award'],
    where: {
      year_of_award: {
        [Sequelize.Op.between]: [startDate, endDate]
      }
    }
  });

  // Step 3: Calculate total grant in lakhs
  const totalGrant = grants.reduce((sum, grant) => sum + parseFloat(grant.amount_sanctioned || 0), 0);

  // Step 4: Determine grade
  let grade = 0;
  if (totalGrant >= 15) {
    grade = 4;
  } else if (totalGrant >= 10) {
    grade = 3;
  } else if (totalGrant >= 5) {
    grade = 2;
  } else if (totalGrant >= 1) {
    grade = 1;
  } else {
    grade = 0;
  }

  console.log("Score 3.1.1:", totalGrant);
  console.log("Grade 3.1.1:", grade);
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
      score_sub_sub_criteria: totalGrant,
      sub_sub_cr_grade: grade,
      session
    }
  });

  if (!created) {
    await Score.update({
      score_sub_sub_criteria: totalGrant,
      sub_sub_cr_grade: grade,
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
    new apiResponse(200, entry, created ? "Score created successfully" : "Score updated successfully")
  );
});

const score312 = asyncHandler(async (req, res) => {
  // Get latest IIQA session
  const latestIIQA = await IIQA.findOne({
    attributes: ['session_end_year'],
    order: [['session_end_year', 'DESC']],
  });

  if (!latestIIQA) throw new apiError(404, "No IIQA session found");

  const endYear = latestIIQA.session_end_year;
  const startYear = endYear - 5;

  // Step 1: Count unique departments with funded projects within valid session window
  const fundedDepartments = await Criteria312.findAll({
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('name_of_principal_investigator')), 'department']],
    where: {
      session: { [Sequelize.Op.between]: [startYear, endYear] },
    },
    raw: true
  });

  const fundedDepartmentCount = fundedDepartments.length;

  // Step 2: Get total number of departments from extended profile
  const departmentCountResult = await extendedProfile.findOne({
    attributes: ['number_of_departments'],
    order: [['year', 'DESC']],
    raw: true
  });

  const totalDepartments = parseInt(departmentCountResult?.number_of_departments || 0);

  if (totalDepartments === 0) {
    return res.status(200).json({
      success: true,
      score: 0,
      grade: 0,
      message: "No departments found in extended profile"
    });
  }

  // Step 3: Calculate percentage
  const percentage = ((fundedDepartmentCount / totalDepartments) * 100).toFixed(2);

  // Step 4: Grade mapping
  let grade = 0;
  const percent = parseFloat(percentage);
  if (percent >= 75) grade = 4;
  else if (percent >= 60) grade = 3;
  else if (percent >= 40) grade = 2;
  else if (percent >= 10) grade = 1;

  return res.status(200).json({
    success: true,
    score: percentage,
    grade
  });
});

const createResponse334 = asyncHandler(async (req, res) => {
  /*
   1. Extract input from req.body
   2. Validate required fields and logical constraints
   3. Check if programme_name or programme_code already exists for the same year and session
   4. Get criteria_code from criteria_master
   5. Get latest IIQA session and validate session window
   6. Create or update response in response_3_3_4 table
 */

   const{
     session,
     activity_name,
     activity_year,
     no_of_teacher,
     no_of_student,
     scheme_name
   }= req.body;

   //Step 1: Field validation
   if(!session || !activity_name || !activity_year || !no_of_teacher || !no_of_student || !scheme_name) {
     throw new apiError(400, "Missing required fields");
   }

   const currentYear = new Date().getFullYear();
   if (
     session < 1990 || session > currentYear
   )  {
       throw new apiError(400, "Session must be between 1990 and current year");
   }

   if (
     activity_year < 1990 || activity_year > currentYear
   )  {
     throw new apiError(400, "Activity year must be between 1990 and current year");
   }

   if (
     no_of_teacher < 0 
   )  {
     throw new apiError(400, "Number of teachers must be a positive number");
   }

   if (
     no_of_student < 0 
   )  {
     throw new apiError(400, "Number of students must be a positive number");
   }

   //Step 2: Check for existing activity_name or activity_year or no_of_teacher or no_of_student or scheme_name in same session and year
   const existingRecord = await Criteria334.findOne({
     where: {
       session,
       [Sequelize.Op.or]: [
         { activity_name },
         { activity_year },
         { no_of_teacher },
         { no_of_student },
         { scheme_name }
       ]
     }
   });
   if (existingRecord) {
     if (existingRecord.scheme_name === scheme_name) {
       throw new apiError(400, "Scheme name already exists for this session and year");
     } else if (existingRecord.activity_name === activity_name) {
       throw new apiError(400, "Activity name already exists for this session and year");
     } else if (existingRecord.activity_year === activity_year) {
       throw new apiError(400, "Activity year already exists for this session and year");
     } else {
       throw new apiError(400, "Record already exists for this session and year");
     }
   }
   

   

   //Step 3: Fetch criteria details
   const criteria = await CriteriaMaster.findOne({
     where: {
       criterion_id: '03',
       sub_criterion_id: '0304',
       sub_sub_criterion_id: '030401'
     }
   });
   if (!criteria) throw new apiError(404, "Criteria not found");

   //Step 4: Validate session window against IIQA 
   const latestIIQA = await IIQA.findOne({
     attributes: ['session_end_year'],
     order: [['created_at', 'DESC']]
   });
   if (!latestIIQA) throw new apiError(404, "No IIQA form found");

   const endYear = latestIIQA.session_end_year;
   const startYear = endYear - 5;

   if (session < startYear || session > endYear) {
     throw new apiError(400, "Session must be between ${startYear} and ${endYear}");
   }

   //Step 5: Create or update response
   let [entry,created] = await Criteria334.findOrCreate({
     where: {
       session,
       activity_name,
       activity_year,
       no_of_teacher,
       no_of_student,
       scheme_name
     },
     defaults: {
       id: criteria.id,
       criteria_code: criteria.criteria_code,
       session,
       activity_name,
       activity_year,
       no_of_teacher,
       no_of_student,
       scheme_name
     }
   });

   if(!created) {
     await Criteria334.update({
       activity_name,
       activity_year,
       no_of_teacher,
       no_of_student,
       scheme_name
     }, {
       where: {
         session,
         activity_name,
         activity_year,
         no_of_teacher,
         no_of_student,
         scheme_name
       }
     });

     entry = await Criteria334.findOne({
       where: {
         session,
         activity_name,
         activity_year,
         no_of_teacher,
         no_of_student,
         scheme_name
       }
     });
   }

   return res.status(201).json(
     new apiResponse(201, entry, created ? "Response created successfully" : "Response updated successfully")
   );
});

const score334 = asyncHandler(async (req, res) => {
 const session = new Date().getFullYear();

 // Step 1: Get latest IIQA session window
 const latestIIQA = await IIQA.findOne({
   attributes: ['session_end_year'],
   order: [['created_at', 'DESC']],
 });

 if (!latestIIQA) {
   throw new apiError(404, "IIQA session not found");
 }

 const endYear = latestIIQA.session_end_year;
 const startYear = endYear - 4;

 // Step 2: Get all entries in the 5-year window
 const records = await Criteria334.findAll({
   attributes: ['activity_year', 'no_of_student'],
   where: {
     activity_year: {
       [Sequelize.Op.between]: [startYear, endYear],
     },
   },
 });

 if (!records.length) {
   throw new apiError(404, "No data found for the last 5 years");
 }

 // Step 3: Calculate average percentage
 const yearlyData = {};

 // Group student count per year
 for (const record of records) {
   const year = record.activity_year;
   if (!yearlyData[year]) {
     yearlyData[year] = {
       total_participated: 0,
       total_students: 0,
     };
   }

   yearlyData[year].total_participated += parseFloat(record.no_of_student || 0);
   yearlyData[year].total_students += parseFloat(record.no_of_student || 0); // Assuming same value (may change if total student is separate field)
 }

 let totalPercentage = 0;
 let validYears = 0;

 for (const year in yearlyData) {
   const data = yearlyData[year];
   if (data.total_students > 0) {
     const percentage = (data.total_participated / data.total_students) * 100;
     totalPercentage += percentage;
     validYears++;
   }
 }

 if (validYears === 0) {
   throw new apiError(400, "No valid records with student data found");
 }

 const averagePercentage = totalPercentage / validYears;

 // Step 4: Apply grading
 let grade = 0;
 if (averagePercentage > 75) {
   grade = 4;
 } else if (averagePercentage >= 60) {
   grade = 3;
 } else if (averagePercentage >= 40) {
   grade = 2;
 } else if (averagePercentage >= 10) {
   grade = 1;
 }

 return res.status(200).json(
   new apiResponse(200, {
     average_percentage: averagePercentage.toFixed(2),
     grade: grade
   }, "Score calculated successfully")
 );
});

export {
  getResponsesByCriteriaCode,
  createResponse313,
  createResponse321,
  createResponse322,
  createResponse332,
  createResponse333,
  createResponse342,
  createResponse341,
  createResponse311_312,
  createResponse334,
  score313,
  score321,
  score322,
  score332,
  score333,
  score341,
  score342,
  score311,
  score312,
  score334,
}
