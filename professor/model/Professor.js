const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId
    },
    role: {
        type: String,
        default: 'Professor'
    }
})

professorSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['password']
        delete ret['__v']
        return ret
    }
})

const Professor = mongoose.model('professor', professorSchema);

module.exports = Professor;