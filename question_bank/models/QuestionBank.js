const mongoose = require('mongoose')

const QuestionBankSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.Types.ObjectId
    },

    module: {
        type: Number
    },

    question: {
        type: String
    },

    options: {
        type: Array
    },

    answer: {
        type: Array
    },

    level: {
        type: Number
    },

    value: {
        type: Number
    }
})

QuestionBankSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['__v']
        return ret
    }
})

const QuestionBank = mongoose.model('QuestionBank', QuestionBankSchema);

module.exports = QuestionBank