const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString } = graphql;

const ChampionType = new GraphQLObjectType({
    name: "ChampionType",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        publicId: { type: GraphQLString }
    })
})

module.exports = ChampionType;