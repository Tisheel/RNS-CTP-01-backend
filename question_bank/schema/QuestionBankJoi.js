const Joi = require('joi')

const QuestionAddJoi = Joi.object({
    
    module: Joi.number().min(1).max(5).required(),

    question: Joi.string().required(),

    options: Joi.array().required(),

    answer: Joi.array().required(),

    level: Joi.number().min(1).max(3).required(),

    value: Joi.number().min(1).max(7).required()

})

const QuestionEditJoi = Joi.object({

    module: Joi.number().min(1).max(5),

    question: Joi.string(),

    options: Joi.array(),

    answer: Joi.array(),

    level: Joi.number().min(1).max(3),

    value: Joi.number().min(1).max(7)

})

module.exports = { QuestionAddJoi, QuestionEditJoi }