import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

const Criteria1 = db.response_1_1_3_data;

const getAllCriteria1 = asyncHandler(async (req, res) => {
    const criteria = await Criteria1.findAll();
    if (!criteria) {
        throw new apiError(404, "Criteria not found");
    }
    
    res.status(200).json(
        new apiResponse(200, criteria, "Criteria found")
    );
});


const postCriteria1_1_3 = asyncHandler(async (req, res) => {
/*
1. take req body from user and check if empty
2. validate request probably using zod
3. insert into the db
4. return response
*/
});



export { getAllCriteria1 };
