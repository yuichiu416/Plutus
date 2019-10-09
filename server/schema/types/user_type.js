//server/schema/types/user_type.js
const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean, GraphQLList } = graphql;
const User = mongoose.model("user");
const UserType = new GraphQLObjectType({
    name: "UserType",
    // remember we wrap the fields in a thunk to avoid circular dependency issues
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        token: { type: GraphQLString },
        loggedIn: { type: GraphQLBoolean },
        messages: {
            type: new GraphQLList(require('./message_type')),
            resolve(parentValue){
                return User.findById(parentValue.id)
                    .populate("messages")
                    .then(user => user.messages);
            }
        },
        notifications: {
            type: new GraphQLList(require('./notification_type')),
            resolve(parentValue){
                return User.findById(parentValue.id)
                        .populate("notifications")
                        .then(user => user.notifications);
            }
        }

    })
});

module.exports = UserType;