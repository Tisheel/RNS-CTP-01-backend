const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    usn: {
        type: String,
        unique: true
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    name: {
        type: String
    },
    sem: {
        type: Number
    },
    branch: {
        type: String
    },
    section: {
        type: String
    },
    password: {
        type: String
    },
    subjects: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ]
}, { timestamps: true })

studentSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['password']
        delete ret['__v']
        return ret
    }
})

const Student = mongoose.model('student', studentSchema)
module.exports = Student