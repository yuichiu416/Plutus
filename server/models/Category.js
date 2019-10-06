const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: "items"
        }
    ]
})

CategorySchema.statics.findItems = function (categoryId) {
    return this.findById(categoryId)
        .populate("items")
        .then(category => category.items);
};

module.exports = mongoose.model("categories", CategorySchema);