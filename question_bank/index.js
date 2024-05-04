require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const ConnectToMongoDB = require('./db/MongoDB')
const QuestionBankRoute = require('./routes/QuestionBankRoutes')
const errorHandler = require('./middlewares/errorHandler')
const { connectToClient } = require('./db/RedisClient')
const cors = require('cors')

const app = express()

const { PORT, MONGO_URL } = process.env

const startApp = async () => {
    //middleware
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cors())

    //database connect 
    await ConnectToMongoDB(MONGO_URL, "db0")
    await connectToClient()

    //routing 
    app.use('/api/v1/questionBank', QuestionBankRoute)

    // error handling
    app.use(errorHandler)

    app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`);
        console.log(`${process.env.HOST}:${process.env.PORT}`);
    })
}

startApp()