const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLString } = graphql;
const Inbox = mongoose.model("inbox");
const User = mongoose.model("user");
debugger
const MessageType = new GraphQLObjectType({
    name: "MessageType",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        body: { type: GraphQLString },
        receiver: { 
            type: require('./user_type'),
            resolve(parentValue){
                return User.findById(parentValue.user)
                    .then(user => user)
                    .catch(err => null)
            }
         },
        inbox: {
            type: require('./inbox_type'),
            resolve(parentValue){
                return Inbox.findById(parentValue.inbox)
                    .then(inbox => inbox)
                    .catch(err => null);
            }
        }
    })
})


module.exports = MessageType;