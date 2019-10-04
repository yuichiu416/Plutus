const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID } = graphql;
const mongoose = require("mongoose");
const UserType = require("./types/user_type");
const AuthService = require("../services/auth");

const mutations = new GraphQLObjectType({
    name: "Mutations",
    fields: {
        register: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(_, args) {
                return AuthService.register(args);
            }
        },
        logout: {
            type: UserType,
            args: {
                // all we need to log the user our is an id
                _id: { type: GraphQLID }
            },
            resolve(_, args) {
                return AuthService.logout(args);
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(_, args) {
                return AuthService.login(args);
            }
        },
        verifyUser: {
            type: UserType,
            args: {
                token: { type: GraphQLString }
            },
            async resolve(_, { name, description, weight }, ctx) {
                const validUser = await AuthService.verifyUser({ token: ctx.token });
                // if our service returns true then our product is good to save!
                // anything else and we'll throw an error
                if (validUser.loggedIn) {
                    return validUser;
                } else {
                    throw new Error('Sorry, you need to be logged in to use the website.');
                }
            }
        }
    }
});

module.exports = mutations;