const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    read: {
        type: Boolean,
        default: false
    }
    
});

module.exports = mongoose.model("notification", NotificationSchema);