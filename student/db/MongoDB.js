const mongoose = require('mongoose')

const connectToMongoDB = async (URL, dbName) => {
    try {
        const res = await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName
        })
        console.log(`MongoDB Connected Successfully [${dbName}]`)
    } catch (error) {
        console.log(`Cannot connect To MongoDB`)
        console.log(error)
    }
}

module.exports = connectToMongoDB