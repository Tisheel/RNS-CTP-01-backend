require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const connectToMongoDB = require('./db/MongoDB')
const studentRoute = require('./routes/studentRoute')
const { connectToClient } = require('./db/RedisClient')
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors')

const app = express()

const { MONGO_URL, PORT, HOST } = process.env

const startApp = async () => {
    // Middleware
    app.use(cors())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    // Connect To Databases
    await connectToMongoDB(MONGO_URL, 'db0')
    await connectToClient()

    // Routes
    app.use('/api/v1/student', studentRoute)

    // error handler
    app.use(errorHandler)

    app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`)
        console.log(`${HOST}:${PORT}`)
    })
}
startApp()