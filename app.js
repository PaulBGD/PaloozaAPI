var http = require('http');
var path = require('path');

var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var limit = require('express-better-ratelimit');
var mysql = require('mysql2');
var debug = require('debug')('PaloozaAPI:server');

var config = require(path.join(process.cwd(), 'config.json'));

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

var allowedSites = [
    'http://dev.minigamepalooza.com',
    'http://www.minigamepalooza.com'
];

app.use(cors({
    origin: function (origin, callback) {
        return callback(null, allowedSites.indexOf(origin) !== -1);
    }
}));

app.use(limit({
    duration: 10000, // 10s
    max: 10,
    accessLimited: '{"error":true,"message":"Rate limit exceeded"}'
}));

app.use((config.path || '') + '/v1/servers/chat/send', limit({
    duration: 10000, // 10s
    max: 4,
    accessLimited: '{"error":true,"message":"Rate limit exceeded"}'
}));

app.use((config.path || '') + '/', require('./src/routes/index'));
app.use((config.path || '') + '/v1', require('./src/routes/v1'));

// I condone global objects, but oh they're great
global._palooza = {
    database: mysql.createPool(config.database)
};

var server = http.createServer(app);
server.on('listening', function () {
    debug('Listening on ' + config.server.port);
});
server.listen(config.server.port);
