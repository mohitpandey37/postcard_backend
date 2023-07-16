import express from "express";
const UserController =  require("./user_controller");
const userMiddleware = require("./user_middleware");
const router = express.Router();

router.post('/login',userMiddleware.createuser_validation, UserController.userlogin)

module.exports = router;