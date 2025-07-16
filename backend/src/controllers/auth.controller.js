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
      console.log(IQAC)
    //   const user = await IQAC.findOne({ where: { email } });
    //   console.log(user)
    //   if (user) {
    //     throw new apiError(400, "User already exists");
    //   }
      const createdUUID = uuidv4();
      const hashedPassword = bcrypt.hashSync(password, 10);
      console.log("Hashed Password: ", hashedPassword);
      console.log("IQAC: ", IQAC);

      const token = jwt.sign({ id: createdUUID }, process.env.JWT_SECRET, {
        expiresIn: "1h"
      });
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
        refresh_token: token,
      });

      res.status(201).json(
        new apiResponse(201, iqac, "User registered successfully")
      );
})


export {
    iqacRegister
}