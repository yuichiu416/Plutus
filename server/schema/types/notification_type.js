const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean } = graphql;
const Notification = mongoose.model("notification");

const NotificationType = new GraphQLObjectType({
    name: "NotificationType",
    fields: () => ({
        id: { type: GraphQLID },
        body: { type: GraphQLString },
        read: { type: GraphQLBoolean }
    })
});

module.exports = NotificationType;