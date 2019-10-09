//server/schema/types/root_types.js

const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;
const UserType = require("./user_type");
const MessageType = require('./message_type');
const CategoryType = require("./category_type");
const ItemType = require("./item_type");
const ChampionType = require('./champion_type');
const NotificationType = require('./notification_type');

const User = mongoose.model("user");
const Message = mongoose.model("message");
const Category = mongoose.model("categories");
const Item = mongoose.model("items");
const Champion = mongoose.model('champion');
const Notification = mongoose.model("notification");

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
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(_, args) {
                return User.findById(args.id);
            }
        },
        message: {
            type: MessageType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) }},
            resolve(_, args){
                return Message.findById(args.id);
            }
        },
        messages: {
            type: new GraphQLList(MessageType),
            resolve(){
                return Message.find({});
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
        },
        notification: {
            type: NotificationType,
            args: { id: { type: new GraphQLNonNull(GraphQLID)} },
            resolve(_, { id }){
                debugger
                return Notification.findById(id);
            }
        },
        notifications: {
            type: new GraphQLList(NotificationType),
            resolve(){
                return Notification.find({});
            }
        }
        // champions: {
        //     type: new GraphQLList(ChampionType),
        //     resolve(){
        //         return Champion.find({});
        //     }
        // },
        // champion: {
        //     type: ChampionType,
        //     args: {
        //         id: { type: new GraphQLNonNull(GraphQLID) }
        //     },
        //     resolve(_, args){
        //         return Champion.findById(args.id);
        //     }
        // }
    })
});

module.exports = RootQueryType;