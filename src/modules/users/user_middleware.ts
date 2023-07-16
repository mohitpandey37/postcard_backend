const { body,query, check } = require('express-validator');

let createuser_validation = [
    body('email', 'Email can not be empty').notEmpty(),
    body('email', 'inValid Email').isEmail(),
    check('password')
        .notEmpty()
        .withMessage('Password can not be empty')
        .isLength({min: 6,max:6})       
        .withMessage('Password should be of 6 digits')
]

module.exports = {
    createuser_validation,
}