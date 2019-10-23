//server/server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require("../config/keys.js").MONGO_URI;
const expressGraphQL = require("express-graphql");
const models = require("./models/index");
const schema = require("./schema/schema.js");
const app = express();
const cors = require("cors");
const graphqlUpload = require('graphql-upload');
const { graphqlUploadExpress } = graphqlUpload;

mongoose
.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connected to MongoDB successfully"))
.catch(err => console.log(err));
mongoose.set('useFindAndModify', false);

if (!db) {
    throw new Error("You must provide a string to connect to MongoDB Atlas");
}

// remember we use bodyParser to parse requests into json
app.use(bodyParser.json());
app.use(cors());
app.use(/\/((?!graphql).)*/, bodyParser.urlencoded({ extended: true }));
app.use(/\/((?!graphql).)*/, bodyParser.json());
// use the expressGraphQL middleware to connect our GraphQLSchema to Express
// use graphqlUploadExpress middleware to upload file
app.use("/graphql", graphqlUploadExpress({
    maxFileSize: 10000000,
    maxFiles: 10
}), expressGraphQL(req => {
        return {
            schema,
            context: {
                token: req.headers.authorization
            },
            graphiql: true
        };
    })
);

module.exports = app;