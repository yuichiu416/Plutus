const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    inbox: {
        type: Schema.Types.ObjectId,
        ref: "inbox"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
})

module.exports = mongoose.model("message", MessageSchema);