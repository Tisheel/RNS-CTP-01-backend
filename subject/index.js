require('dotenv').config()
const express = require('express')
const connectToMongoDB = require('./db/MongoDB')
const { connectToClient } = require('./db/RedisClient')
const bodyParser = require('body-parser')
const subjectRoute = require('./routes/subjectRoutes')
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

const { HOST, PORT, MONGO_URL } = process.env

const startApp = async () => {
    // Middleware
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cors())
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

    // Connect to DB
    await connectToMongoDB(MONGO_URL, 'db0')
    await connectToClient()

    // Routes
    app.use('/api/v1/subject', subjectRoute)

    // Error Middleware
    app.use(errorHandler)

    app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`)
        console.log(`${HOST}:${PORT}`)
    })
}
startApp()