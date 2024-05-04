const Joi = require('joi')

const usnJoi = Joi.string().alphanum().pattern(/^\d{1}RN\d{2}[A-Z]{2}\d{3}$/).length(10).required()

const emailJoi = Joi.string().email().required()

const phoneJoi = Joi.string().length(10).pattern(/^[0-9]+$/).required()

const passwordJoi = Joi.string().min(7).max(25).required()

const studentRegisterJoi = Joi.object({
    usn: usnJoi,

    email: emailJoi,

    phone: phoneJoi,

    name: Joi.string().pattern(/^[a-zA-Z\s]+$/).required(),

    sem: Joi.number().min(1).max(8).required(),

    branch: Joi.string().length(2).pattern(/^[A-Z]+$/).required(),

    section: Joi.string().length(1).pattern(/^[A-Z]+$/).required(),

    password: passwordJoi,

    subjectCodes: Joi.array().items(Joi.string().pattern(/[A-Z]{5}\d{3}-\d{3}/)).min(1).unique().required()
})

const studentLoginJoi = Joi.object({
    usn: usnJoi,
    password: Joi.string().required()
})

const studentEditJoi = Joi.object({
    usn: Joi.string().alphanum().pattern(/^\d{1}RN\d{2}[A-Z]{2}\d{3}$/).length(10),

    email: Joi.string().email(),

    phone: Joi.string().length(10).pattern(/^[0-9]+$/),

    name: Joi.string().pattern(/^[a-zA-Z\s]+$/),

    sem: Joi.number().min(1).max(8),

    branch: Joi.string().length(2).pattern(/^[A-Z]+$/),

    section: Joi.string().length(1).pattern(/^[A-Z]+$/),

    password: Joi.string().min(7).max(25),

    subjectCodes: Joi.array().items(Joi.string().pattern(/[A-Z]{5}\d{3}-\d{3}/)).min(1).unique()
})

module.exports = { studentEditJoi, studentRegisterJoi, usnJoi, emailJoi, phoneJoi, passwordJoi, studentLoginJoi }