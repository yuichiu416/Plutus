//server/server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require("../config/keys_dev.js").MONGO_URI;
const expressGraphQL = require("express-graphql");
const models = require("./models/index");
const schema = require("./schema/schema.js");
const app = express();
const cors = require("cors");
const graphqlUpload = require('graphql-upload');
const { graphqlUploadExpress } = graphqlUpload;


if (!db) {
    throw new Error("You must provide a string to connect to MongoDB Atlas");
}

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));

// remember we use bodyParser to parse requests into json
app.use(bodyParser.json());
app.use(cors());
// use the expressGraphQL middleware to connect our GraphQLSchema to Express
// use graphqlUploadExpress middleware to upload file
app.use("/graphql", graphqlUploadExpress({
    maxFileSize: 10000000,
    maxFiles: 10
}), expressGraphQL(req => {
    return {
        schema,
        // we are receiving the request and can check for our
        // auth token under headers
        context: {
            token: req.headers.authorization
        },
        graphiql: true
    };
})
);

module.exports = app;