// server/models/Item.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    seller:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // imageURLs: [
    //     {
    //         type: String,
    //         required: true
    //     }
    // ],
    starting_price:{
        type: Number,
        default: 0
    },
    minimum_price:{
        type: Number,
        default: 0
    },
    // location: [
    //     {
    //         type: Number,
    //         required: true
    //     }
    // ],
    category:{
        type: Schema.Types.ObjectId,
        ref: "categories"
    },
    sold:{
        type: Boolean,
        required: true,
        default: false
    },
    appraised:{
        type: Boolean,
        required: true,
        default: false
    }
});

ItemSchema.statics.updateItemCategory = (itemId, categoryId) => {
    const Item = mongoose.model("items");
    const Category = mongoose.model("categories");
    return Item.findById(itemId).then(item => {
        // if the item already had a category
        if (item.category) {
            // find the old category and remove this item from it's items
            Category.findById(item.category).then(oldcategory => {
                oldcategory.items.pull(item);
                return oldcategory.save();
            });
        }
        //  find the Category and push this item in, as well as set this item's category
        return Category.findById(categoryId).then(newCategory => {
            item.category = newCategory;
            newCategory.items.push(item);

            return Promise.all([item.save(), newCategory.save()]).then(
                ([item, newCategory]) => item
            );
        });
    });
};


module.exports = mongoose.model("items", ItemSchema);