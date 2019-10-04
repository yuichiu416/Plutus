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
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: "message"
    }]
})

MessageSchema.statics.addReply =  (id, reply) => {
    const Message = mongoose.model("message");

    return Message.findById(id).then(message => {
        message.replies.push(reply);
        return message.save().then(message => message);
    })
}

module.exports = mongoose.model("message", MessageSchema);