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
    sender: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
})

module.exports = mongoose.model("message", MessageSchema);