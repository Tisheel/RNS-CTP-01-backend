const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId
    },
    test: {
        type: mongoose.Schema.Types.ObjectId
    },
    questions: [
        {
            question: {
                type: Object
            },
            answer: {
                type: Array
            }
        }
    ],
    result: {
        maxMarks: {
            type: Number,
            default: 0
        },
        score: {
            type: Number,
            default: 0
        }
    }

}, { timestamps: true })

const Answer = mongoose.model('answer', answerSchema)

module.exports = Answer