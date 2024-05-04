require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ConnectToMongoDB = require('./db/MongoDB')
const testRoute = require('./routes/test')
const errorHandler = require('./middleware/errorHandler')
const { connectToClient } = require('./db/RedisClient')
const cors = require('cors')

const app = express();

const { PORT, MONGO_URL, HOST } = process.env

const startApp = async () => {

    //middleware
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cors())

    //mongodb connection
    await ConnectToMongoDB(MONGO_URL, "db0")
    await connectToClient()
    
    // routing
    app.use('/api/v1/test', testRoute)

    // error handler
    app.use(errorHandler)

    app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`)
        console.log(`${HOST}:${PORT}`);
    })
}

startApp()