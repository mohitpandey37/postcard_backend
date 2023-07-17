import express from "express";
const UserController =  require("./user_controller");
const userMiddleware = require("./user_middleware");
const fileUpload = require("../../helper/fileUpload");
const router = express.Router();


router.post('/login',userMiddleware.createuser_validation, UserController.userlogin);

// API for file upload in the local directory
router.post('/file_upload', fileUpload.upload, fileUpload.ImageUpload)

module.exports = router;