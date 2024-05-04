class AppError extends Error {
    constructor(errorName, message, statusCode) {
        super(message)
        this.errorName = errorName
        this.statusCode = statusCode
    }
}

module.exports = AppError