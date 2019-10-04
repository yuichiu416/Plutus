const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InboxSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "message"
    }]
})

module.exports = mongoose.model("inbox", InboxSchema);