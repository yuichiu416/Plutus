const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLID, GraphQLFloat } = graphql;
const mongoose = require("mongoose");
const AuthService = require("../services/auth");

const UserType = require("./types/user_type");
const CategoryType = require("./types/category_type");
const ItemType = require("./types/item_type");
const MessageType = require('./types/message_type');
const ChampionType = require('./types/champion_type');

const Category = mongoose.model("categories");
const Item = mongoose.model("items");
const Message = mongoose.model("message");
const Champion = mongoose.model('champion');

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
                starting_price: {type: GraphQLFloat},
                minimum_price: {type: GraphQLFloat},
                category: { type: GraphQLString },
                sold: { type: GraphQLBoolean },
                appraised: { type: GraphQLBoolean },
                location: { type: new GraphQLList(GraphQLFloat) },
                champions: { type: new GraphQLList(GraphQLString) }
            },
            async resolve(_, { name, description, starting_price, minimum_price, category, sold, appraised, location, champions }, context) {
                debugger
                const obj = await AuthService.verifyUser({ token: context.token });
                const seller = obj.id;
                return new Item({ name, description, seller, starting_price, minimum_price, category, sold, appraised, champions, location }).save();
            }
        },
        updateItem: {
            type: ItemType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                seller: { type: GraphQLID },
                starting_price: { type: GraphQLFloat },
                minimum_price: { type: GraphQLFloat },
                category: { type: GraphQLString },
                sold: { type: GraphQLBoolean },
                appraised: { type: GraphQLBoolean },
                location: { type: new GraphQLList(GraphQLFloat) }
            },
            async resolve(_, {id, name, description, starting_price, minimum_price, category, sold, appraised, location }, context) {
                const obj = await AuthService.verifyUser({ token: context.token });
                const seller = obj.id;
                const item = { name, description, seller, starting_price, minimum_price, category, sold, appraised, location };
                debugger;
                return Item.findOneAndUpdate(
                    { _id: id },
                    { $set: item },
                    { new: true },
                    (err, item) => {
                        return item;
                    }
                );
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
        },
        createChampion: {
            type: ChampionType,
            args: {
                name: { type: GraphQLString },
                publicId: { type: GraphQLString },
                item: { type: GraphQLString }
            },
            resolve(_, { name, publicId, item }){
                return new Champion({name, publicId, item}).save();
            }
        },
        updateItemImages: {
            type: ItemType,
            args: {
                publicId: { type: GraphQLString },
                id: { type: GraphQLString }
            },
            async resolve(_, {publicId, id}){
                const item = await Item.findById(id);
                item.champions.push(publicId);
                item.save();
                return item;
            }
        }
    }
    
});

module.exports = mutations;