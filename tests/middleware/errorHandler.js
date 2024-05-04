const mongoose = require('mongoose')
const AppError = require('../utils/AppError')
const { JsonWebTokenError } = require('jsonwebtoken')
const Joi = require('joi')

const errorHandler = (error, req, res, next) => {

    if (error instanceof AppError) {

        const { statusCode, message, errorName } = error

        return res.status(statusCode).json({
            message
        })
    }

    if (error instanceof Joi.ValidationError) {

        const { details } = error

        let errorArray = []
        for (errMsg of details) {
            errorArray.push(errMsg.message)
        }

        return res.status(400).json({
            message: errorArray
        })
    }

    if (error instanceof JsonWebTokenError) {

        return res.status(498).json({
            message: error.message
        })

    }
    console.log(error)
    return res.status(500).json({
        message: 'Somthing went wrong'
    })
}

module.exports = errorHandler