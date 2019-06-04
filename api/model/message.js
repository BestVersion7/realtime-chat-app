const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatCommentSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        default: 'Kate'
    },
    message: {
        type: String,
        required: true
    },
    room: {
        type: String,
        maxlength: 15
    }
})

module.exports = mongoose.model('chatComment', chatCommentSchema)