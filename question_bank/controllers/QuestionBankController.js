const QuestionBank = require('../models/QuestionBank')
const { QuestionAddJoi, QuestionEditJoi } = require('../schema/QuestionBankJoi')
const { default: mongoose } = require('mongoose')
const { QUESTIONBANK_ERROR, MONGO_ERROR } = require('../utils/ErrorNames')
const { client } = require('../db/RedisClient')
const AppError = require('../utils/AppError')

module.exports.addQuestion = async (req, res, next) => {
    try {
        const professorId = req.professorId
        const subjectId = req.subjectId

        const { module, question, options, answer, level, value } = await QuestionAddJoi.validateAsync(req.body, { abortEarly: false })

        const Question = new QuestionBank({ subject: subjectId, module, question, options, answer, level, value })

        await Question.save()

        res.status(200).json({
            message: "ok"
        })

    } catch (error) {

        next(error)

    }
}

module.exports.editQuestion = async (req, res, next) => {
    try {

        const { questionId } = req.params

        if (mongoose.isValidObjectId(questionId)) {

            const { module, question, options, answer, level, value } = await QuestionEditJoi.validateAsync(req.body, { abortEarly: false })

            const updatedQuestion = await QuestionBank.findByIdAndUpdate(questionId, { module, question, options, answer, level, value }, { new: true })

            if (updatedQuestion === null) {

                throw new AppError(QUESTIONBANK_ERROR, `Question with id ${questionId} not found`, 404)

            } else {

                res.status(200).json({
                    message: "ok"
                })

            }

        } else {

            throw new AppError(MONGO_ERROR, 'Invalid ObjectId', 400)

        }

    }
    catch (error) {

        next(error)

    }
}

module.exports.deleteQuestion = async (req, res, next) => {
    try {

        const { questionId } = req.params

        if (mongoose.isValidObjectId(questionId)) {

            const deletedQuestion = await QuestionBank.findByIdAndDelete(questionId)

            if (deletedQuestion === null) {

                throw new AppError(QUESTIONBANK_ERROR, `Question with id ${questionId} not found`, 404)

            } else {

                res.status(200).json({
                    message: "ok"
                })

            }

        } else {

            throw new AppError(MONGO_ERROR, 'Invalid ObjectId', 400)

        }

    } catch (error) {

        next(error)

    }
}

module.exports.getQuestions = async (req, res, next) => {
    try {

        const filter = req.body

        const questions = await QuestionBank.aggregate([
            {
                $match: {
                    subject: new mongoose.Types.ObjectId(req.subjectId),
                    ...filter
                }
            },
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'subject',
                    foreignField: '_id',
                    as: 'subject'
                }
            },
            {
                $project: {
                    __v: 0
                }
            }
        ])

        if (questions.length === 0) {

            throw new AppError(QUESTIONBANK_ERROR, `No questions for parameters found`, 404)

        } else {

            res.status(200).json(questions)

        }

    }
    catch (error) {

        next(error)

    }
}

module.exports.getQuestion = async (req, res, next) => {
    try {

        const questionId = req.params.id

        if (mongoose.isValidObjectId(questionId)) {

            const catchedQuestion = JSON.parse(await client.get(`questiion:${questionId}`))

            if (catchedQuestion) {

                res.status(200).json(catchedQuestion)

            } else {

                const question = await QuestionBank.aggregate([
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(questionId)
                        }
                    },
                    {
                        $lookup: {
                            from: 'subjects',
                            localField: 'subject',
                            foreignField: '_id',
                            as: 'subject'
                        }
                    },
                    {
                        $project: {
                            answer: 0,
                            __v: 0
                        }
                    }
                ])

                if (question.length !== 0) {

                    const expire5Min = 5 * 60
                    await client.set(`questiion:${questionId}`, JSON.stringify(question[0]), { EX: expire5Min })
                    res.status(200).json(question[0])

                } else {

                    throw new AppError(QUESTIONBANK_ERROR, `No question found for id ${questionId}`, 404)

                }

            }

        } else {

            throw new AppError(QUESTIONBANK_ERROR, 'Inavlid ObjectId', 400)

        }

    } catch (error) {

        next(error)

    }
}

module.exports.addManyQuestions = async (req, res, next) => {
    try {



    } catch (error) {

        next(error)

    }
}