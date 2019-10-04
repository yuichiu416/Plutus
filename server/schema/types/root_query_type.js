//server/schema/types/root_types.js

const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;

const UserType = require("./user_type");
const CategoryType = require("./category_type");
const ItemType = require("./item_type");

const User = mongoose.model("user");
const Category = mongoose.model("categories");
const Item = mongoose.model("items");

const RootQueryType = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            resolve() {
                return User.find({});
            }
        },
        user: {
            type: UserType,
            args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(_, args) {
                return User.findById(args._id);
            }
        },
        items: {
            type: new GraphQLList(ItemType),
            resolve() {
                return Item.find({});
            }
        },
        item: {
            type: ItemType,
            args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(_, args) {
                return Item.findById(args._id);
            }
        },
        categories: {
            type: new GraphQLList(CategoryType),
            resolve() {
                return Category.find({});
            }
        },
        category: {
            type: CategoryType,
            args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(_, args) {
                return Category.findById(args._id);
            }
        }
    })
});

module.exports = RootQueryType;