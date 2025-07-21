import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import Sequelize from "sequelize";

const IIQAForm = db.iiqa_form;
const IIQAStaffDetails = db.iiqa_staff_details;
const IIQAStudentDetails = db.iiqa_student_details;
const IIQADepartments = db.iiqa_departments;
const IIQAProgrammeCount = db.iiqa_programme_count;

const createIIQAForm = asyncHandler(async (req, res) => {
    // Start a transaction
    const transaction = await db.sequelize.transaction();
    
    try {
        console.log('Request body:', req.body);
        
        // Extract and validate main form data
        const { 
            // Main form fields
            institution_id,
            session_start_year, 
            session_end_year, 
            year_filled, 
            naac_cycle, 
            desired_grade, 
            has_mou, 
            mou_file_url,
            
            // Programme count fields
            programmeCount = {},
            
            // Departments array
            departments = [],
            
            // Staff details
            staffDetails = {},
            
            // Student details
            studentDetails = {}
        } = req.body;

        // Validate required fields with specific error messages
        const requiredFields = [
            { field: institution_id, name: 'institution_id' },
            { field: session_start_year, name: 'session_start_year' },
            { field: session_end_year, name: 'session_end_year' },
            { field: year_filled, name: 'year_filled' },
            { field: naac_cycle, name: 'naac_cycle' },
            { field: desired_grade, name: 'desired_grade' },
            { field: has_mou, name: 'has_mou' }
        ];

        const missingFields = requiredFields
            .filter(item => item.field === undefined || item.field === null || item.field === '')
            .map(item => item.name);

        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
            throw new apiError(400, `Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate has_mou and mou_file_url relationship
        if (has_mou && !mou_file_url) {
            console.error('MOU file URL is required when has_mou is true');
            throw new apiError(400, 'MOU file URL is required when has_mou is true');
        }

        // Validate departments array
        if (!Array.isArray(departments) || departments.length === 0) {
            console.error('No departments provided');
            throw new apiError(400, 'At least one department is required');
        }

        // Validate department fields
        const departmentRequiredFields = ['department', 'program', 'university', 'affiliation_status'];
        for (const [index, dept] of departments.entries()) {
            const missingDeptFields = departmentRequiredFields
                .filter(field => !dept[field])
                .map(field => `departments[${index}].${field}`);
            
            if (missingDeptFields.length > 0) {
                console.error('Missing department fields:', missingDeptFields);
                throw new apiError(400, `Missing required department fields: ${missingDeptFields.join(', ')}`);
            }
        }

        // Create main IIQA form
        try {
            const form = await IIQAForm.create({
                institution_id,
                session_start_year,
                session_end_year,
                year_filled,
                naac_cycle,
                desired_grade,
                has_mou,
                mou_file_url: has_mou ? mou_file_url : null
            }, { transaction });
            console.log('IIQA form created successfully');
            
            // Create programme count with all fields
            await IIQAProgrammeCount.create({
                iiqa_form_id: form.id,
                ug: programmeCount.ug || 0,
                pg: programmeCount.pg || 0,
                post_masters: programmeCount.post_masters || 0,
                pre_doctoral: programmeCount.pre_doctoral || 0,
                doctoral: programmeCount.doctoral || 0,
                post_doctoral: programmeCount.post_doctoral || 0,
                pg_diploma: programmeCount.pg_diploma || 0,
                diploma: programmeCount.diploma || 0,
                certificate: programmeCount.certificate || 0
            }, { transaction });
            console.log('Programme count created successfully');

            // Create departments
            const departmentPromises = departments.map(dept => 
                IIQADepartments.create({
                    iiqa_form_id: form.id,
                    department: dept.department,
                    program: dept.program,
                    university: dept.university,
                    sra: dept.sra || null,
                    affiliation_status: dept.affiliation_status,
                    specialization: dept.specialization || null
                }, { transaction })
            );
            await Promise.all(departmentPromises);
            console.log('Departments created successfully');

            // Create staff details with all fields
            await IIQAStaffDetails.create({
                iiqa_form_id: form.id,
                perm_male: staffDetails.perm_male || 0,
                perm_female: staffDetails.perm_female || 0,
                perm_trans: staffDetails.perm_trans || 0,
                other_male: staffDetails.other_male || 0,
                other_female: staffDetails.other_female || 0,
                other_trans: staffDetails.other_trans || 0,
                non_male: staffDetails.non_male || 0,
                non_female: staffDetails.non_female || 0,
                non_trans: staffDetails.non_trans || 0
            }, { transaction });
            console.log('Staff details created successfully');

            // Create student details with all fields
            await IIQAStudentDetails.create({
                iiqa_form_id: form.id,
                regular_male: studentDetails.regular_male || 0,
                regular_female: studentDetails.regular_female || 0,
                regular_trans: studentDetails.regular_trans || 0
            }, { transaction });
            console.log('Student details created successfully');

            // Commit the transaction
            await transaction.commit();
            console.log('Transaction committed successfully');

            // Fetch the complete form data with all relations
            const completeForm = await IIQAForm.findByPk(form.id, {
                include: [
                    { model: IIQAProgrammeCount, as: 'iiqa_programme_counts' },
                    { model: IIQADepartments, as: 'iiqa_departments' },
                    { model: IIQAStaffDetails, as: 'iiqa_staff_details' },
                    { model: IIQAStudentDetails, as: 'iiqa_student_details' }
                ]
            });

            res.status(201).json(
                new apiResponse(201, completeForm, "IIQA form created successfully")
            );

        } catch (dbError) {
            console.error('Database error:', dbError);
            // Rollback the transaction in case of error
            await transaction.rollback();
            
            // Handle validation errors specifically
            if (dbError.name === 'SequelizeValidationError') {
                const errors = dbError.errors.map(err => err.message);
                console.error('Validation errors:', errors);
                throw new apiError(400, errors.join(', '));
            }
            
            throw dbError;
        }

    } catch (error) {
        console.error('Error in IIQA form submission:', error);
        throw error;
    }
});

export {
    createIIQAForm
}
