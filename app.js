var fs = require('fs');
var path = require('path');
var cluster = require('cluster');
var debug = require('debug')('PaloozaAPI:server');

var config = require(path.join(process.cwd(), 'config.json'));

global._palooza = {}; // empty for now

if (cluster.isMaster) {
    var publicCss = path.join(process.cwd(), 'public', 'main.css');
    var strapCss = path.join(process.cwd(), 'Strapalooza', 'css', 'main.css');
    if (!fs.existsSync(publicCss)) {
        fs.createReadStream(strapCss).pipe(fs.createWriteStream(publicCss));
    }

    var numCPUs = process.env.CORES || require('os').cpus().length;
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    console.log('Created ' + numCPUs + ' processes.');

    var traffic = require('./src/utils/traffic');
    traffic(); // initial
    setInterval(traffic, 10 * 60 * 1000); // every 10 minutes
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

if (config.log && config.log.raven) {
    var raven = require('raven');
    var client = new raven.Client(config.log.raven);
    app.use(raven.middleware.express(config.log.raven));
    console.log('Enabled Raven Client');
    global._palooza.debug = function (message, debug) {
        if (message instanceof Error) {
            var temp = message;
            message = debug;
            debug = temp;
        }
        if (debug instanceof Error) {
            if (typeof message == 'string') {
                debug.message = '[' + message + '] ' + debug.message;
            }
            console.log('Sent ' + debug);
            client.captureError(debug);
        } else {
            client.captureMessage(String(message));
        }
    };
} else {
    global._palooza.debug = require('debug')('PaloozaAPI:method');
}

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
