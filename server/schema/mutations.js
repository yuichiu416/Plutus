const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLID, GraphQLFloat } = graphql;
const mongoose = require("mongoose");
const AuthService = require("../services/auth");

const UserType = require("./types/user_type");
const CategoryType = require("./types/category_type");
const ItemType = require("./types/item_type");
const MessageType = require('./types/message_type');

const Category = mongoose.model("categories");
const Item = mongoose.model("items");
const Message = mongoose.model("message");

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
                seller: { type: GraphQLID },
                starting_price: {type: GraphQLFloat},
                minimum_price: {type: GraphQLFloat},
                category: { type: GraphQLString },
                sold: { type: GraphQLBoolean },
                appraised: { type: GraphQLBoolean }
                // imageURLs: new GraphQLList({ type: GraphQLString }),
                // location: new GraphQLList({ type: GraphQLFloat }),
            },
            async resolve(_, { name, description, starting_price, minimum_price, category, sold, appraised }, context) {
                const obj = await AuthService.verifyUser({ token: context.token });
                const seller = obj.id;
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
        newMessage: {
            type: MessageType,
            args: {
                title: { type: GraphQLString },
                body: { type: GraphQLString },
                receiver: { type: GraphQLString },
            },
            async resolve(_, { title, body, receiver }, context){
                const validUser = await AuthService.verifyUser({ token: context.token });

                if (validUser.loggedIn){
                    const sender = validUser.id;
                    return new Message({ title, body, sender, receiver, sender }).save();
                }
            }
        },
        addReply: {
            type: MessageType,
            args: {
                id: { type: GraphQLString },
                title: { type: GraphQLString },
                body: { type: GraphQLString },
                receiver: { type: GraphQLString },
            },
            async resolve(_, { id, title, body, receiver }, context) {
                const validUser = await AuthService.verifyUser({ token: context.token });

                if (validUser.loggedIn){
                    const sender = validUser.id;
                    const reply = await new Message({ title, body, receiver, sender }).save();
                    return Message.addReply(id, reply);
                }
                
            }
        }
    }
    
});

module.exports = mutations;