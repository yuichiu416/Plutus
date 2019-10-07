//server/schema/types/item_type.js
const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLID, GraphQLFloat } = graphql;

const Item = mongoose.model("items");

const ItemType = new GraphQLObjectType({
    name: "ItemType",
    // remember we wrap the fields in a thunk to avoid circular dependency issues
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        seller: { type: GraphQLID },
        starting_price: { type: GraphQLFloat },
        minimum_price: { type: GraphQLFloat },
        category: {
            type: require("./category_type"),
            resolve(parentValue) {
                return Item.findById(parentValue._id)
                .populate("category")
                .then(item => item.category)
            }
        },
        sold: { type: GraphQLBoolean },
        appraised: { type: GraphQLBoolean },
        champions: {
            type: new GraphQLList(GraphQLString)
        },
        imageURLs: { type: new GraphQLList(GraphQLString) },
        location: { type: new GraphQLList(GraphQLFloat) },
        endTime: {type: GraphQLFloat }
    })
});

module.exports = ItemType;