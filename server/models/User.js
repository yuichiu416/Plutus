// server/models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 32
    },
    date: {
        type: Date,
        default: Date.now
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "message"
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'notification'
    }]
   
});

module.exports = mongoose.model("user", UserSchema);