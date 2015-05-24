var http = require('http');
var path = require('path');

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var limit = require('express-better-ratelimit');
var mysql = require('mysql2');
var debug = require('debug')('PaloozaAPI:server');

var config = require(path.join(process.cwd(), 'config.json'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(limit({
    duration: 10000, // 10s
    max: 10,
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
