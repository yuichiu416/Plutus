const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLID, GraphQLFloat } = graphql;
const mongoose = require("mongoose");
const AuthService = require("../services/auth");

const UserType = require("./types/user_type");
const CategoryType = require("./types/category_type");
const ItemType = require("./types/item_type");

const Category = mongoose.model("categories");
const Item = mongoose.model("items");

const mutations = new GraphQLObjectType({
    name: "Mutations",
    fields: {
        register: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(_, args) {
                return AuthService.register(args);
            }
        },
        logout: {
            type: UserType,
            args: {
                // all we need to log the user our is an id
                _id: { type: GraphQLID }
            },
            resolve(_, args) {
                return AuthService.logout(args);
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(_, args) {
                return AuthService.login(args);
            }
        },
        verifyUser: {
            type: UserType,
            args: {
                token: { type: GraphQLString }
            },
            async resolve(_, { name, description, weight }, ctx) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                // if our service returns true then our item is good to save!
                // anything else and we'll throw an error
                if (validUser.loggedIn) {
                    return validUser;
                } else {
                    throw new Error('Sorry, you need to be logged in to use the website.');
                }
            }
        },
        // imageURL: {
        //     type: GraphQLString
        // },
        // coordinate: {
        //     type: GraphQLFloat
        // },
        newCategory: {
            type: CategoryType,
            args: {
                name: { type: GraphQLString },
            },
            resolve(parentValue, { name }) {
                return new Category({ name }).save();
            }
        },
        newItem: {
            type: ItemType,
            args: {
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                seller: { type: GraphQLString },
                // imageURLs: new GraphQLList({ type: GraphQLString }),
                starting_price: {type: GraphQLFloat},
                minimum_price: {type: GraphQLFloat},
                // location: new GraphQLList({ type: GraphQLFloat }),
                category: { type: GraphQLString },
                sold: { type: GraphQLBoolean },
                appraised: { type: GraphQLBoolean }
            },
            async resolve(_, { name, description, seller, starting_price, minimum_price, category, sold, appraised }) {
                const item = await new Item({ name, description, seller, starting_price, minimum_price, category, sold, appraised }).save();
                return Item.updateItemCategory(item._doc._id, category);
            }
        },
        deleteItem: {
            type: ItemType,
            args: { id: { type: GraphQLID } },
            resolve(parentValue, { id }) {
                return Item.remove({ _id: id });
            }
        },
    }
});

module.exports = mutations;