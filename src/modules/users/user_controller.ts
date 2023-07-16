import { Request, Response } from "express";
import { validationResult } from 'express-validator';
const userModel = require("./user_model");
const MyResponse = require('../../helper/response');
const { jwt_token } = require("../../helper/jwt");

//================ User Login ===================
let userlogin = async (req: Request, res: Response) => {
    try {
        // request body validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            return new MyResponse(406, errors.array()[0].msg, false, { errors: errors.array() }).errorResponse(res);

        } else {
            // find user by email
            let user = await userModel.findOne({ email: req.body.email });

            if (user == null) {
                return new MyResponse(406, "User not found", false).errorResponse(res);
            } else {

               // verify password
                if (user.password !== req.body.password) {
                    return new MyResponse(406, "Password does not match.", false).errorResponse(res);
                } else {
                    // auth token generate
                    user["_doc"].auth_token = jwt_token(user._id.toString());
                    delete user["_doc"].password;
                    delete user["_doc"].__v;

                    return new MyResponse(200, "Login Successfully", true, user).successResponse(res);
                }
            }

        }
    } catch (error: any) {
        return new MyResponse(500, "server error", false).errorResponse(res);
    }
}

module.exports = {
    userlogin,
}
