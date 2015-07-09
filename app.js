var cluster = require('cluster');
var path = require('path');
var debug = require('debug')('PaloozaAPI:server');

var config = require(path.join(process.cwd(), 'config.json'));

global._palooza = {}; // empty for now

if (cluster.isMaster) {
    var numCPUs = process.env.CORES || require('os').cpus().length;
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    console.log('Created ' + numCPUs + ' processes.');

    var phantom = require('phantom');

    function renderImage() {
        phantom.create(function (ph) {
            ph.createPage(function (page) {
                page.open(config.traffic_url, function (status) {
                    if (status == 'fail') {
                        debug('Failed to update status image!', config.traffic_url);
                        return;
                    }
                    setTimeout(function () {
                        page.render(path.join(process.cwd(), 'public', 'traffic.png'));
                    }, 200);
                });
            })
        });
    }

    renderImage();
    setInterval(renderImage, 10 * 60 * 1000); // every 10 minutes
    return;
}

var http = require('http');

var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var limit = require('express-better-ratelimit');
var mysql = require('mysql2');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(limit({
    duration: 5000, // 5s
    max: 30,
    accessLimited: '{"error":true,"message":"Rate limit exceeded"}'
}));

app.use((config.path || '') + '/v1/servers/chat/send', limit({
    duration: 3000, // 3s
    max: 3,
    accessLimited: '{"error":true,"message":"Rate limit exceeded"}'
}));

app.use((config.path || '') + '/', require('./src/routes/index'));
app.use((config.path || '') + '/v1', require('./src/routes/v1'));
app.use((config.path || '') + '/slack', require('./src/routes/slack'));
app.use((config.path || '') + '/traffic', require('./src/routes/traffic'));

// I condone global objects, but oh they're great
global._palooza.database = mysql.createPool(config.database);

var server = http.createServer(app);
server.on('listening', function () {
    debug('Listening on ' + config.server.port);
});
server.listen(config.server.port);
