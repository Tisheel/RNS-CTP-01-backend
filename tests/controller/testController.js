const Test = require('../models/Test')
const Answer = require('../models/Answer')
const AppError = require('../utils/AppError')
const { QUESTIONBANK_ERROR, TEST_ERROR, ANSWER_ERROR } = require('../utils/ErrorNames')
const { client } = require('../db/RedisClient')
const { default: mongoose } = require('mongoose')
const { MONGO_ERROR } = require('../utils/ErrorNames')
const jwt = require('jsonwebtoken')
const { createTestMannualJoi, createTestAutoJoi, finishTestJoi } = require('../schema/testJoi')

module.exports.createTestMannual = async (req, res, next) => {
    try {

        const professorId = req.professorId
        const subjectId = req.subjectId

        const { title, startTime, endTime, questionIds } = await createTestMannualJoi.validateAsync(req.body, { abortEarly: false })

        const validQuestionIds = questionIds.map(qid => new mongoose.Types.ObjectId(qid))

        const questions = await mongoose.connection.db.collection('questionbanks').aggregate([
            {
                $match: {
                    _id: {
                        $in: validQuestionIds
                    }
                }
            },
            {
                $project: {
                    subject: 0,
                    answer: 0,
                    __v: 0
                }
            }
        ]).toArray()

        if (questions.length === 0 || questions.length !== questionIds?.length) {

            throw new AppError(QUESTIONBANK_ERROR, `Invalid questions`, 400)

        }

        const passKey = Math.floor(100000 + Math.random() * 900000)

        const newTest = await Test({ title, professor: professorId, subject: subjectId, startTime, endTime, questions, passKey })

        await newTest.save()

        res.status(200).json(newTest)

    } catch (error) {

        next(error)

    }
}

module.exports.createTestAuto = async (req, res, next) => {
    try {
        const professorId = req.professor._id
        const subjectId = req.professor.subject

        const { startTime, endTime, modules, numberOfQuestions } = await createTestAutoJoi.validateAsync(req.body, { abortEarly: false })

        const config = { REQ_CHANNEL, RPLY_CHANNEL }
        const payload = { subject: subjectId, module: modules }

        const questions = await request(config, payload)

        if (Array.isArray(questions) === true && questions.length !== 0) {

            if (questions.length >= numberOfQuestions) {

                const numberOfEasyQuestions = numberOfQuestions * 0.50
                const numberOfMediumQuestions = numberOfQuestions * 0.30
                const numberOfHardQuestions = numberOfQuestions * 0.20

                const easyQuestions = questions.filter((question) => question.level === 1).sort(() => Math.random() - 0.5)
                const mediumQuestions = questions.filter((question) => question.level === 2).sort(() => Math.random() - 0.5)
                const hardQuestions = questions.filter((question) => question.level === 3).sort(() => Math.random() - 0.5)

                if (easyQuestions.length > numberOfEasyQuestions && mediumQuestions.length > numberOfMediumQuestions && hardQuestions.length > numberOfHardQuestions) {

                    const questions = []

                    questions.push(...easyQuestions.slice(0, numberOfEasyQuestions))
                    questions.push(...mediumQuestions.slice(0, numberOfMediumQuestions))
                    questions.push(...hardQuestions.slice(0, numberOfHardQuestions))

                    const passKey = Math.floor(100000 + Math.random() * 900000)

                    const newTest = await Test({ professor: professorId, subject: subjectId, startTime, endTime, questions, passKey })

                    await newTest.save()

                    res.json(newTest)

                } else {

                    throw new AppError(TEST_ERROR, `Insufficient Questions to create test in ratio 50:30:20`, 400)

                }
            } else {

                throw new AppError(TEST_ERROR, `Questions from ${subjectId} modules ${modules} not sufficient to create test of ${numberOfQuestions} questions`, 400)

            }
        } else {

            throw new AppError(TEST_ERROR, 'Cannot create test somthing went wrong', 400)

        }

    } catch (error) {

        next(error)

    }
}

module.exports.startTest = async (req, res, next) => {
    try {

        const studentId = req.studentId
        const { testId } = req.params
        const { passKey } = req.body

        if (mongoose.isValidObjectId(testId)) {

            const answer = await Answer.findOne({ student: studentId, test: testId })

            if (answer) {

                throw new AppError(ANSWER_ERROR, `Test already attempted.`, 400)

            }

            let test = JSON.parse(await client.get(`test:${testId}`))

            if (!test) {

                [test] = await Test.aggregate([
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(testId)
                        }
                    },
                    {
                        $lookup: {
                            from: 'subjects',
                            localField: 'subject',
                            foreignField: '_id',
                            as: 'subject'
                        }
                    }
                ])

                if (!test) {

                    throw new AppError(TEST_ERROR, `No test found for ${testId}`, 404)

                } else {

                    const expire1Min = 1 * 60
                    client.set(`test:${testId}`, JSON.stringify(test), { EX: expire1Min })

                }

            }

            const currentTime = new Date().getTime()
            const startTime = new Date(test.startTime).getTime()
            const endTime = new Date(test.endTime).getTime()

            if (currentTime >= startTime && currentTime <= endTime) {

                if (passKey === test.passKey) {

                    const token = await client.get(`AnswerToken:${test._id}:${studentId}`)

                    if (token) {

                        res.status(200).json({ token, test })

                    } else {

                        const { JWT_SECRET } = process.env
                        const EXPIRY = endTime - currentTime
                        const payload = { test: test._id, student: studentId }
                        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: parseInt(EXPIRY / 1000) })

                        await client.set(`AnswerToken:${test._id}:${studentId}`, token, { PX: EXPIRY })

                        res.status(200).json({ token, test })

                    }

                } else {

                    throw new AppError(TEST_ERROR, 'Wrong pass key', 403)

                }

            } else {

                throw new AppError(TEST_ERROR, `Test can only be accessed between ${test.startTime} - ${test.endTime}`, 400)

            }

        } else {

            throw new AppError(MONGO_ERROR, 'Invalid ObjectId', 400)

        }

    } catch (error) {

        next(error)

    }
}

module.exports.finishTest = async (req, res, next) => {
    try {

        const studentId = req.studentId
        const testId = req.testId

        const { questions } = await finishTestJoi.validateAsync(req.body, { abortEarly: false })
        let score = 0, maxMarks = 0

        for (let q of questions) {

            let questionCache = JSON.parse(await client.get(`question:${q.question._id}`))

            if (!questionCache) {

                const question = await mongoose.connection.db.collection('questionbanks').findOne({ _id: new mongoose.Types.ObjectId(q?.question?._id) })

                if (question) {

                    questionCache = question
                    const expire5min = 5 * 60 * 60
                    await client.set(`question:${q.question._id}`, JSON.stringify(question), { EX: expire5min })

                } else {

                    throw new AppError(QUESTIONBANK_ERROR, `Question with id ${q.question._id} not found`, 404)

                }

            }

            if (JSON.stringify(questionCache.answer) === JSON.stringify(q?.answer)) {

                score = score + questionCache.value

            }
            maxMarks = maxMarks + questionCache.value

            q.question.answer = questionCache.answer

        }

        const newAnswer = new Answer({ student: studentId, test: testId, questions, result: { maxMarks, score } })
        await newAnswer.save()

        await client.del(`AnswerToken:${testId}:${studentId}`)

        res.status(200).json(newAnswer)

    } catch (error) {

        next(error)

    }
}

module.exports.testDetail = async (req, res, next) => {
    try {

        const { testId } = req.params

        if (mongoose.isValidObjectId(testId)) {

            const test = await Test.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(testId)
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
                    $lookup: {
                        from: 'professors',
                        localField: 'professor',
                        foreignField: '_id',
                        as: 'professor'
                    }
                }
            ])

            if (test.length !== 0) {

                res.status(200).json(test[0])

            } else {

                throw new AppError(TEST_ERROR, `No test found for ${testId}`, 404)

            }

        } else {

            throw new AppError(MONGO_ERROR, 'Invalid ObjectId', 400)

        }

    } catch (error) {

        next(error)

    }
}

module.exports.getTests = async (req, res, next) => {
    try {

        const { date } = req.query

        const test = await Test.aggregate([
            {
                $match: req.professorId ?
                    date ? {
                        startTime: {
                            $gt: new Date(date),
                            $lt: new Date(new Date(date).getTime() + 60 * 60 * 24 * 1000)
                        },
                        professor: new mongoose.Types.ObjectId(req.professorId)
                    } : {
                        professor: new mongoose.Types.ObjectId(req.professorId)
                    }
                    :
                    date ? {
                        startTime: {
                            $gt: new Date(date),
                            $lt: new Date(new Date(date).getTime() + 60 * 60 * 24 * 1000)
                        }
                    } : {}
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
                $project: req.professorId ? {
                    questions: 0,
                    __v: 0
                } :
                    {
                        questions: 0,
                        passKey: 0,
                        __v: 0
                    }
            }
        ])

        if (test.length !== 0) {

            res.status(200).json(test)

        } else {

            throw new AppError(TEST_ERROR, `No tests found`, 404)

        }

    } catch (error) {

        next(error)

    }
}

module.exports.getAnswers = async (req, res, next) => {
    try {

        const studentId = req.studentId

        const answer = await Answer.aggregate([
            {
                $match: {
                    student: new mongoose.Types.ObjectId(studentId),
                    ...req.body
                }
            },
            {
                $lookup: {
                    from: 'tests',
                    localField: 'test',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'subjects',
                                localField: 'subject',
                                foreignField: '_id',
                                as: 'subject'
                            }
                        },
                        {
                            $lookup: {
                                from: 'professors',
                                localField: 'professor',
                                foreignField: '_id',
                                as: 'professor'
                            }
                        },
                        {
                            $project: {
                                title: 1,
                                'professor.name': 1,
                                'professor.email': 1,
                                'subject.subjectCode': 1,
                                'subject.subjectName': 1,
                                startTime: 1,
                                endTime: 1
                            }
                        }
                    ],
                    as: 'test'
                }
            },
            {
                $project: {
                    questions: 0,
                    __v: 0,
                    'test.questions': 0,
                    'test.passkey': 0
                }
            }
        ])

        if (answer.length === 0) {

            throw new AppError(ANSWER_ERROR, 'No answer scripts found', 404)

        }

        res.status(200).json(answer)

    } catch (error) {

        next(error)

    }
}

module.exports.getDetailedAnswer = async (req, res, next) => {
    try {

        const studentId = req.studentId
        const answerId = req.params.answerId

        if (!mongoose.isValidObjectId(answerId)) {

            throw new AppError(MONGO_ERROR, 'Invalid ObjectId', 400)

        }

        const answer = await Answer.aggregate([
            {
                $match: {
                    student: new mongoose.Types.ObjectId(studentId),
                    _id: new mongoose.Types.ObjectId(answerId)
                }
            },
            {
                $lookup: {
                    from: 'tests',
                    localField: 'test',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'subjects',
                                localField: 'subject',
                                foreignField: '_id',
                                as: 'subject'
                            }
                        },
                        {
                            $lookup: {
                                from: 'professors',
                                localField: 'professor',
                                foreignField: '_id',
                                as: 'professor'
                            }
                        }
                    ],
                    as: 'test'
                }
            },
            {
                $project: {
                    'test.professor.password': 0,
                    'test.professor.subject': 0,
                    'test.professor.role': 0,
                    'test.professor.__v': 0,
                    'test.professor._id': 0,
                    'test.subject.__v': 0,
                    'test.subject._id': 0,
                    'test.questions': 0,
                    'test.passkey': 0,
                }
            }
        ])

        if (answer.length === 0) {

            throw new AppError(ANSWER_ERROR, 'No answer scripts found', 404)

        }

        res.status(200).json(answer)

    } catch (error) {

        next(error)

    }
}