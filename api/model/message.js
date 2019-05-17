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
        type: String
    }
})

module.exports = mongoose.model('chatComment', chatCommentSchema)