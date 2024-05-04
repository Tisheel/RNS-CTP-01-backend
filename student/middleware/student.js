const jwt = require('jsonwebtoken')
const { client } = require('../db/RedisClient')
const AppError = require('../utls/AppError')
const { JWT_ERROR } = require('../utls/ErrorNames')

const student = async (req, res, next) => {
    try {
        const { token } = req.headers
        const { JWT_SECRET } = process.env

        if (token) {

            const { _id } = jwt.verify(token, JWT_SECRET)

            const cacheToken = await client.get(`StudentToken:${_id}`)

            if (cacheToken) {

                if (cacheToken === token) {

                    req.studentId = _id
                    next()

                } else {

                    throw new AppError(JWT_ERROR, `Permission denied try logging again`, 403)

                }

            } else {

                throw new AppError(JWT_ERROR, `Permission denied try logging again`, 403)

            }

        } else {

            throw new AppError(JWT_ERROR, `Unauthorized [TOKEN NOT FOUND]`, 401)

        }

    } catch (error) {

        next(error)

    }
}

module.exports = student