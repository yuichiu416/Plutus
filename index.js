const app = require("./server/server");
const port = process.env.PORT || 5000;

const server = require('http').createServer(app)

const io = require('socket.io')(server)
io.on('connection', socket => {

    socket.on('send announce', (announce) => {
        // once we get a 'send announce' event from one of our clients, we will send it to the rest of the clients
        // we make use of the socket.emit method again with the argument given to use from the callback function above
        console.log('Announce is: ', announce)
        io.sockets.emit('send announce', announce);
    });
})

server.listen(port, () => console.log(`Listening on port ${port}`))
// app.listen(port, () => console.log(`Listening on port ${port}`))