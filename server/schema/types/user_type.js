//server/schema/types/user_type.js
const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean } = graphql;
const Inbox = mongoose.model('inbox');
const InboxType = require('./inbox_type');
const UserType = new GraphQLObjectType({
    name: "UserType",
    // remember we wrap the fields in a thunk to avoid circular dependency issues
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        token: { type: GraphQLString },
        loggedIn: { type: GraphQLBoolean },
        inbox: {
            type: InboxType,
            resolve(parentValue){
                return Inbox.findById(parentValue.inbox)
                    .then(inbox => inbox)
                    .catch(err => null);
            }
        }

    })
});

module.exports = UserType;