// const mongoose = require('mongoose');
// const graphql = require('graphql');
// const { GraphQLObjectType, GraphQLList, GraphQLID } = graphql;
// const UserType = require('./user_type');
// const Inbox = mongoose.model('inbox');
// const MessageType = require('./message_type');

// const InboxType = new GraphQLObjectType({
//     name: "InboxType",
//     fields: () => ({
//         id: { type: GraphQLID },
//         user: { type: UserType },
//         messages: { 
//             type: new GraphQLList(MessageType),
//             resolve(parentValue){
//                 return Inbox.findById(parentValue.id)
//                     .populate("messages");
//             }
//         }
//     })
// })

// module.exports = InboxType;