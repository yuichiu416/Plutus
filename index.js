const app = require("./server/server");
const port = process.env.PORT || 5000;

const server = require('http').createServer(app)

const io = require('socket.io')(server)
io.on('connection', socket => {

    socket.on('bid', (currentPrice) => {
        io.sockets.emit('bid', currentPrice);
    });
})

server.listen(port, () => console.log(`Listening on port ${port}`))
// app.listen(port, () => console.log(`Listening on port ${port}`))