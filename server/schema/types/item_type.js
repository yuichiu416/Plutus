//server/schema/types/item_type.js
const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLID, GraphQLFloat, GraphQLInt } = graphql;

const Item = mongoose.model("items");

const ItemType = new GraphQLObjectType({
    name: "ItemType",
    // remember we wrap the fields in a thunk to avoid circular dependency issues
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        nameHash: { 
            type: GraphQLString,
            resolve(parentValue){
                if (parentValue.nameHash) {
                    return JSON.stringify(parentValue.nameHash.toJSON());
                }
            } 
        },
        description: { type: GraphQLString },
        seller: { type: GraphQLID },
        starting_price: { type: GraphQLInt },
        minimum_price: { type: GraphQLInt },
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
        champions: { type: new GraphQLList(GraphQLString) },
        location: {
            type: GraphQLString,
            resolve(parentValue) {
                if (parentValue.location) {
                    return JSON.stringify(parentValue.location.toJSON());
                }
            }
        },
        endTime: { type: GraphQLFloat },
        current_price: { type: GraphQLInt },
        highestBidder: {
            type: require('./user_type'),
            resolve(parentValue){
                return Item.findById(parentValue.id)
                        .populate("highestBidder")
                        .then(item => item.highestBidder);
            }
        }
    })
});

module.exports = ItemType;