const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChampionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'items'
    }
})

module.exports = mongoose.model("champion", ChampionSchema);