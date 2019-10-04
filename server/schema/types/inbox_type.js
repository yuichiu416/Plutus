const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID } = graphql;
const Inbox = mongoose.model('inbox');
const User = mongoose.model("user");

const InboxType = new GraphQLObjectType({
    name: "InboxType",
    fields: () => ({
        id: { type: GraphQLID },
        user: {
            type: require('./user_type'),
            resolve(parentValue) {
                return User.findById(parentValue.user)
                    .then(user => user)
                    .catch(err => null)
            }
        },
        messages: {
            type: new GraphQLList(require('./message_type')),
            resolve(parentValue) {
                return Inbox.findById(parentValue.id)
                    .populate("messages");
            }
        }
    })
})

module.exports = InboxType;
