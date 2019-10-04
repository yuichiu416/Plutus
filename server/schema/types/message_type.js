// const mongoose = require('mongoose');
// const graphql = require('graphql');
// const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLString } = graphql;
// const UserType = require('./user_type');
// const InboxType = require('./inbox_type');
// const Inbox = mongoose.model("inbox");
// const User = mongoose.model("user");

// const MessageType = new GraphQLObjectType({
//     name: "MessageType",
//     fields: () => ({
//         id: { type: GraphQLID },
//         title: { type: GraphQLString },
//         body: { type: GraphQLString },
//         receiver: { 
//             type: UserType,
//             resolve(parentValue){
//                 return User.findById(parentValue.user)
//                     .then(user => user)
//                     .catch(err => null)
//             }
//          },
//         inbox: {
//             type: InboxType,
//             resolve(parentValue){
//                 return Inbox.findById(parentValue.inbox)
//                     .then(inbox => inbox)
//                     .catch(err => null);
//             }
//         }
//     })
// })


// module.exports = MessageType;