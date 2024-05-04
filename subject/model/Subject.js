const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String
    },
    subjectCode: {
        type: String,
        unique: true
    }
})

const Subject = mongoose.model('subject', subjectSchema)
module.exports = Subject