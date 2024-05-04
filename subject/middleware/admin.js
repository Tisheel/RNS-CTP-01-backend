const jwt = require('jsonwebtoken')
const { client } = require('../db/RedisClient')
const AppError = require('../utils/AppError')
const { JWT_ERROR } = require('../utils/ErrorNames')

const admin = async (req, res, next) => {
    try {
        const { token } = req.headers
        const { JWT_SECRET } = process.env

        if (token) {

            const { _id, role } = jwt.verify(token, JWT_SECRET)

            if (role === 'Admin') {

                const professorCacheToken = await client.get(`ProfessorToken:${_id}`)

                if (professorCacheToken === token) {

                    req.adminId = _id
                    next()

                } else {

                    throw new AppError(JWT_ERROR, 'Permission Denied try logging again', 403)
                }

            } else {

                throw new AppError(JWT_ERROR, `Permission Denied`, 403)

            }

        } else {

            throw new AppError(JWT_ERROR, `Unauthorized`, 401)

        }

    } catch (error) {

        next(error)

    }
}

module.exports = admin