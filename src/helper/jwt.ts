import { Request, Response } from "express";
import { ObjectId } from "mongodb";
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const userModel = require('../modules/users/user_model');
const MyResponse = require('./response');

//======================== Generate Token =================
let jwt_token = (value: string) => {
   return jwt.sign({ id: value }, secret, { expiresIn: "30D" });
}

let jwtverify = (value: any) => {
   return jwt.verify(value, secret, async (err: any, decoded: any) => {
      return decoded ? decoded : null;
   });
}

let getPostCardJwtToken = (value: string)=>{
   return jwt.sign({ id: value }, secret, { expiresIn: "1D" });
}

// ====================== Verify Auth Token =================
let authMiddleware = async (req: Request, res: Response, next: any) => {
   var token = req.headers['authorization'];

   if (!token) {
      return new MyResponse(406, "Auth token is required", false).errorResponse(res)
   } else {
      //verify token
      const decoded = await jwtverify(token.split(" ")[1]);
         if (!decoded) {
            return new MyResponse(406, "Invalid token or has been expired", false).errorResponse(res)
         } else {
            let data = await userModel.findById(new ObjectId(decoded["id"]));

            if (!data) {
               return new MyResponse(406, "Invalid token or has been expired", false).errorResponse(res)
            } else {
               const keysToDelete = ["created_at", "updated_at", "password", "__v"];
               // remove unwanted data
               keysToDelete.forEach(key => { delete data["_doc"][key] });
               req.headers.authUser = data
               next();
            }
         }
   }
}

module.exports = {
   jwt_token,
   getPostCardJwtToken,
   authMiddleware,
   jwtverify
}