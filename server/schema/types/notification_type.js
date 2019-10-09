const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean } = graphql;
const Notification = mongoose.model("notification");
const UserType = require('./user_type');

const NotificationType = new GraphQLObjectType({
    name: "NotificationType",
    fields: () => ({
        id: { type: GraphQLID },
        body: { type: GraphQLString },
        read: { type: GraphQLBoolean },
        user: { type: GraphQLID }
    })
});

module.exports = NotificationType;