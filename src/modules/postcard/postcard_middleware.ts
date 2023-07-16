import { body, query, check } from 'express-validator';

let postcard_validator = [
    check('recipient')
        .notEmpty().withMessage('Recipient name is required')
        .isString().withMessage('Invalid Recipient name'),

    check('street_1')
        .notEmpty().withMessage('Street is required')
        .isString().withMessage('Street value should be string'),

    check('city')
        .notEmpty().withMessage('City is required')
        .isString().withMessage('City value should be string'),

    check('state')
        .notEmpty().withMessage('State is required')
        .isString().withMessage('State value should be string'),

    check('zipcode')
        .notEmpty().withMessage('zipcode is required')
        .matches('^[0-9]{6}$').withMessage('zipcode should be of 6 digits.'),

    check('message')
    .notEmpty().withMessage('message is required.')

]

module.exports = {
    postcard_validator
}
