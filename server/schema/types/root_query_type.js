//server/schema/types/root_types.js

const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;
const UserType = require("./user_type");
const MessageType = require('./message_type');
const User = mongoose.model("user");
const Message = mongoose.model("message");
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
        message: {
            type: MessageType,
            args: { _id: { type: new GraphQLNonNull(GraphQLID) }},
            resolve(_, args){
                return Message.findById(args._id);
            }
        },
        messages: {
            type: new GraphQLList(MessageType),
            resolve(){
                return Message.find({});
            }
        },
       
        
    })
});

module.exports = RootQueryType;