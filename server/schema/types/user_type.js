//server/schema/types/user_type.js
const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean } = graphql;

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
            type: require('./message_type'),
            resolve(parentValue){
                return User.findById(parentValue.id)
                    .populate("messages");
            }
        }

    })
});

module.exports = UserType;