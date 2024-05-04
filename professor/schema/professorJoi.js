const Joi = require('joi');

const professorRegisterJoi = Joi.object({

    email: Joi.string().email().required(),

    name: Joi.string().pattern(/^[a-zA-Z\s]+$/).required(),

    password: Joi.string().min(7).max(25).required(),

    subjectCode: Joi.string().pattern(/[A-Z]{5}\d{3}-\d{3}/).required()

})

const professorEditJoi = Joi.object({

    email: Joi.string().email(),

    name: Joi.string().pattern(/^[a-zA-Z\s]+$/),

    password: Joi.string().min(7).max(25),

    subjectCode: Joi.string().pattern(/[A-Z]{5}\d{3}-\d{3}/)
})

const loginJoi = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(7).max(25)
})

module.exports = { professorEditJoi, professorRegisterJoi, loginJoi }