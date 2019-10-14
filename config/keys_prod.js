module.exports = {
<<<<<<< HEAD
    MONGO_URI: "mongodb://yui:RTwbVr3TulTmmEHK@plutus-shard-00-00-a90m7.mongodb.net:27017,plutus-shard-00-01-a90m7.mongodb.net:27017,plutus-shard-00-02-a90m7.mongodb.net:27017/test?ssl=true&replicaSet=Plutus-shard-0&authSource=admin&retryWrites=true&w=majority",
    secretOrKey: "secret"
=======
    MONGO_URI: process.env.MONGO_URI,
    secretOrKey: process.env.secretOrKey
>>>>>>> fbbd2dbb907f9c532e002a537cc36cc5e60a0321
}