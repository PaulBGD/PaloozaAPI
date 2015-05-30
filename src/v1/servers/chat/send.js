var async = require('async');
var debug = require('debug')('PaloozaAPI:method');

module.exports = {
    path: "send",
    type: "POST",
    parent: "servers/chat",
    description: "Retrieves the latest messages from a user",
    params: {
        id: {
            type: "integer",
            description: "The player's Palooza ID",
            required: true
        },
        server: {
            type: "string",
            description: "The server to send the message to",
            required: true
        },
        api_key: {
            type: "string",
            description: "The api key for the user",
            required: true
        },
        message: {
            type: "string",
            description: "The message to send",
            length: 30,
            required: true
        }
    },
    example: {
        error: false,
        message: "Sent"
    },
    handleRequest: function (_palooza, params, callback) {
        async.waterfall([
            function (callback) {
                _palooza.database.execute('SELECT COUNT(*) FROM `palooza`.`accounts` WHERE `id` = ? AND `api` = ?', [params.id, params.api_key], function (err, rows) {
                    if (err) {
                        debug('Failed to find player by id ' + params.id + ' and api key ' + params.api_key + ' in database', err);
                        return callback('Internal error occurred');
                    } else if (rows.length == 0 || rows[0]['COUNT(*)'] == 0) {
                        return callback('Invalid id or API key');
                    }
                    callback();
                });
            },
            function (callback) {
                _palooza.database.execute('SELECT COUNT(*) FROM `palooza`.`servers` WHERE `server` = ?', [params.server], function (err, rows) {
                    if (err) {
                        debug('Failed to find server by name ' + params.server + ' in database', err);
                        return callback('Internal error occurred');
                    } else if (rows.length == 0 || rows[0]['COUNT(*)'] == 0) {
                        return callback('Invalid server');
                    }
                    callback();
                });
            },
            function (callback) {
                _palooza.database.execute('INSERT INTO `palooza_chat`.`messages` (`id`,`server`,`type`,`message`) VALUES (?,?,?,?)', [params.id, params.server, 2, params.message], callback);
            }
        ], function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, {error: false, message: 'Sent'});
        });
    }
};
