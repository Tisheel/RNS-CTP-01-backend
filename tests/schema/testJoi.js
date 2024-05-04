const Joi = require('joi')

const createTestMannualJoi = Joi.object({
    title: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    questionIds: Joi.array().items(Joi.string().hex().length(24)).required()
})

const createTestAutoJoi = Joi.object({
    title: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    numberOfQuestions: Joi.number().integer().required(),
    modules: Joi.array().items(Joi.number().integer().min(1).max(5)).required()
})

const finishTestJoi = Joi.object({
    questions: Joi.array().items(Joi.object({
        question: Joi.object().required(),
        answer: Joi.array().items().required()
    })).required()
})

module.exports = { createTestMannualJoi, createTestAutoJoi, finishTestJoi }