const app = require("./server/server");
const express = require("express");
const path = require('path');

const port = process.env.PORT || 5000;

const server = require('http').createServer(app)

const io = require('socket.io')(server)
io.on('connection', socket => {

    socket.on('bid', (currentPrice) => {
        io.sockets.emit('bid', currentPrice);
    });
})


if (process.env.NODE_ENV === 'development') {
    app.use(express.static('client/build'));
    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

server.listen(port, () => console.log(`Listening on port ${port}`));