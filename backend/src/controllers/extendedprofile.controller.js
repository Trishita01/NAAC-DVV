import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import Sequelize from "sequelize";

const ExtendedProfile = db.extended_profile;
const IIQAForm = db.iiqa_form;
// NEEDS VALIDATION
// WHAT TO DO ABOUT INSTITUTION ID ??
const createExtendedProfile = asyncHandler(async (req, res) => {
    const {
        institution_id,
        number_of_courses_offered,
        total_students,
        reserved_category_seats,
        outgoing_final_year_students,
        full_time_teachers,
        sanctioned_posts,
        total_classrooms,
        total_seminar_halls,
        total_computers,
        expenditure_in_lakhs} = req.body;

    const currentYear = new Date().getFullYear();

    const iiqaForm = await IIQAForm.findOne({
        where: {
            institution_id,
            year: currentYear
        }
    });
    if (!iiqaForm) {
        throw new apiError(404, "IIQA form not found");
    }
    
    const profile = await ExtendedProfile.create({
        institution_id,
        year: currentYear,
        number_of_courses_offered,
        total_students,
        reserved_category_seats,
        outgoing_final_year_students,
        full_time_teachers,
        sanctioned_posts,
        total_classrooms,
        total_seminar_halls,
        total_computers,
        expenditure_in_lakhs
    });
    res.status(201).json(
        new apiResponse(201, profile, "Extended profile created successfully")
    );
});

export default {
    createExtendedProfile
};