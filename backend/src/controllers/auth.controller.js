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

      if(institutionType !== "autonomous" && institutionType !== "affiliated UG" && institutionType !== "affiliated PG" && institutionType !== "university") {
        throw new apiError(400, "Invalid institution type");
      }

      const formattedInstitutionType = institutionType.toLowerCase().replace(/\s+/g, "_");
      console.log("Formatted Institution Type: ", formattedInstitutionType);
      console.log("type: ", typeof formattedInstitutionType);
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
          institution_type: formattedInstitutionType,
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

const userLogin = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;


  const formattedRole = role.toLowerCase();

  if (!email || !password || !role) {
      throw new apiError(400, "Missing required fields");
  }

  // Role-based model selection
  let userModel;
  switch (formattedRole) {
      case "iqac":
          userModel = IQAC;
          break;
      case "faculty":
      case "hod":
      case "admin":
      case "mentor":
          userModel = User;
          break;
      default:
          throw new apiError(400, "Invalid role");
  }

  const user = await userModel.findOne({ where: { email } });
  if (!user) {
      throw new apiError(404, "User not found");
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
  if (!isPasswordValid) {
      throw new apiError(401, "Invalid password");
  }

  console.log('Generating tokens for user:', { uuid: user.uuid, role });
  
  if (!process.env.JWT_ACCESS_TOKEN || !process.env.JWT_REFRESH_TOKEN) {
      console.error('JWT secrets are not configured');
      throw new apiError(500, 'Server configuration error');
  }

  const accessToken = jwt.sign(
      { 
          id: user.uuid, 
          role,
          type: 'access'
      }, 
      process.env.JWT_ACCESS_TOKEN, 
      { 
          expiresIn: '1h',
          algorithm: 'HS256'
      }
  );

  const refreshToken = jwt.sign(
      { 
          id: user.uuid, 
          role,
          type: 'refresh'
      }, 
      process.env.JWT_REFRESH_TOKEN, 
      { 
          expiresIn: '7d',
          algorithm: 'HS256'
      }
  );
  
  console.log('Tokens generated successfully');

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax', 
    maxAge: 60 * 60 * 1000, 
    path: '/', 
  };

  const refreshCookieOptions = {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  };

  console.log('Setting cookies with options:', { 
      accessToken: { ...cookieOptions, value: '***' },
      refreshToken: { ...refreshCookieOptions, value: '***' } 
  });

  res
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, refreshCookieOptions)
      .status(200)
      .json(new apiResponse(200, { 
          user: { 
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role || role,
              institution_name: user.institution_name
          },
          accessToken,
          refreshToken 
      }, "User logged in successfully"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
      throw new apiError(401, "Refresh token missing");
  }

  try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

      const userId = decoded.id;
      const role = decoded.role;

      // Get user by role
      let userModel;
      switch (role) {
          case "iqac":
              userModel = IQAC;
              break;
          case "faculty":
          case "hod":
          case "admin":
          case "mentor":
              userModel = User;
              break;
          default:
              throw new apiError(400, "Invalid user role");
      }

      const user = await userModel.findOne({ where: { uuid: userId } });

      if (!user) {
          throw new apiError(404, "User not found");
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
          { id: userId, role, type: "access" },
          process.env.JWT_ACCESS_TOKEN,
          { expiresIn: "1h", algorithm: "HS256" }
      );

      // Set the new access token in cookie
      res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 1000, // 1 hour
          path: "/"
      });

      return res.status(200).json(
          new apiResponse(200, { accessToken: newAccessToken }, "Access token refreshed")
      );

  } catch (err) {
      console.error("Error refreshing token:", err.message);
      throw new apiError(401, "Invalid or expired refresh token");
  }
});



export {
    iqacRegister,
    userLogin,
    refreshAccessToken
}