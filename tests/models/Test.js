const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({

    title: {
        type: String
    },
    professor: {
        type: mongoose.Schema.Types.ObjectId
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    questions: [
        {
            type: Object
        }
    ],
    passKey: {
        type: String
    }

}, { timestamps: true })

testSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['__v']
        return ret
    }
})

const Test = mongoose.model('test', testSchema);

module.exports = Test;