const app = require("./server/server");
const port = process.env.PORT || 5000;

const server = require('http').createServer(app)

// This creates our socket using the instance of the server
const io = require('socket.io')(server)

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
    console.log('New client connected')

    // just like on the client side, we have a socket.on method that takes a callback function
    socket.on('send announce', (announce) => {
        // once we get a 'send announce' event from one of our clients, we will send it to the rest of the clients
        // we make use of the socket.emit method again with the argument given to use from the callback function above
        console.log('Announce is: ', announce)
        io.sockets.emit('send announce', announce);
    })

    // disconnect is fired when a client leaves the server
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
