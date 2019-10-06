const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const Category = mongoose.model("categories");

const CategoryType = new GraphQLObjectType({
    name: "CategoryType",
    // remember we wrap the fields in a thunk to avoid circular dependency issues
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        items: {
            type: new GraphQLList(require("./item_type")),
            resolve(parentValue) {
                return Category.findItemss(parentValue.id, "items")
            }
        }
    })
});

module.exports = CategoryType;