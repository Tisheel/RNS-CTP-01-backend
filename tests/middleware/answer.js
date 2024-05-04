const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const { JWT_ERROR } = require('../utils/ErrorNames')
const { client } = require('../db/RedisClient')

const answer = async (req, res, next) => {
    try {

        const { token } = req.headers
        const { JWT_SECRET } = process.env

        if (token) {

            const { test, student } = jwt.verify(token, JWT_SECRET)

            const AnswerToken = await client.get(`AnswerToken:${test}:${student}`)

            if (AnswerToken) {

                req.testId = test
                req.studentId = student
                next()

            } else {

                throw new AppError(JWT_ERROR, 'Permission Denied', 403)

            }

        } else {

            throw new AppError(JWT_ERROR, `Unauthorized [TEST TOKEN NOT FOUND]`, 401)

        }

    } catch (error) {

        next(error)

    }
}

module.exports = answer