const proxy = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(proxy('/',
    { target: 'https://plutus-5566.herokuapp.com' } //your server

    ));
}