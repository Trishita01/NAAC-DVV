import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Sequelize from "sequelize";
import { v4 as uuidv4 } from 'uuid';
const User = db.users;
const IQAC = db.iqac_supervision;



const generateAccessandRefreshToken = async (userId)=>{

    const checkUser = await IQAC.findOne({ where: { id: userId } });
    if (!checkUser) {
        throw new apiError(404, "User not found");
    }
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_TOKEN, {
        expiresIn: "1h"
      });
      const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d"
      });
      console.log("Access Token: ", accessToken);
      console.log("Refresh Token: ", refreshToken);
      return { accessToken, refreshToken };
}
/**
 * @route POST /api/v1/auth/iqacRegister
 * @description Register a new IQAC supervisor
 * @requestbody {string} name, email, password, institutionName, institutionType, aisheId, institutionalEmail, phoneNumber
 * @since 1.0.0
 * @access Public
 */
const iqacRegister = asyncHandler(async (req, res) => {

    console.log("Routeeeeeeeeeeeeeee")
    const {
        name,
        email,
        password,
        institutionName,
        institutionType, // should be validated against allowed values
        aisheId,
        institutionalEmail,
        phoneNumber
      } = req.body;

      console.log(name,email,password, institutionName, institutionType, aisheId, institutionalEmail, phoneNumber)

      if (!name || !email || !password || !institutionName || !institutionType || !aisheId || !institutionalEmail || !phoneNumber) {
        throw new apiError(400, "Missing required fields");
      }

      if(institutionType !== "autonomous" && institutionType !== "affiliated_ug" && institutionType !== "affiliated_pg" && institutionType !== "university") {
        throw new apiError(400, "Invalid institution type");
      }

      const user = await IQAC.findOne({ where: { email } });
      console.log(user)
      if (user) {
        throw new apiError(400, "User already exists");
      }
      const createdUUID = uuidv4();
      const hashedPassword = bcrypt.hashSync(password, 10);
      console.log("Hashed Password: ", hashedPassword);
      console.log("IQAC: ", IQAC);

      const refreshToken = jwt.sign({ id: createdUUID }, process.env.JWT_REFRESH_TOKEN, {
        expiresIn: "7d"
      });

      const accessToken = jwt.sign({ id: createdUUID }, process.env.JWT_ACCESS_TOKEN, {
        expiresIn: "1h"
      });

      console.log(accessToken)
      console.log(refreshToken)
  try {
    
        const iqac = await IQAC.create({
          uuid: createdUUID,
          name: name,
          email: email,
          password_hash: hashedPassword,
          institution_name: institutionName,
          institution_type: institutionType,
          aishe_id: aisheId,
          institutional_email: institutionalEmail,
          phone_number: phoneNumber,
          refresh_token: refreshToken
          });
          res
          .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
          })
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
          })
          .status(201).json(
            new apiResponse(201, {iqac,accessToken,refreshToken}, "User registered successfully")
          );
    
  } 
  catch (error) {
    console.log(error)
    throw new apiError(500, "Failed to create user"); 
  }
})

const iqacLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
})


export {
    iqacRegister,
    iqacLogin
}