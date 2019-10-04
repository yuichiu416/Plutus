const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLString } = graphql;
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
                return User.findById(parentValue.receiver)
                    .then(user => user)
                    .catch(err => null)
            }
         },
        sender: {
            type: require('./user_type'),
            resolve(parentValue) {
                return User.findById(parentValue.sender)
                    .then(user => user)
                    .catch(err => null)
            }
        },
    })
})


module.exports = MessageType;