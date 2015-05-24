var debug = require('debug')('PaloozaAPI:method');

module.exports = {
    path: "from-id",
    type: "GET",
    parent: "game",
    description: "Returns a games' data from it's id",
    params: {
        id: {
            type: "integer",
            description: "The games' id",
            required: true
        }
    },
    example: {
        1: {
            id: 1,
            type: "MCBrawl",
            winner: "a4c2c06f-c35d-42d4-87e8-87d74613ae85"
        }
    },
    handleRequest: function(_palooza, params, callback) {
        _palooza.database.execute('SELECT `type`,`winner` FROM `game_records` WHERE `game` = ?', [params.id], function(err, rows) {
            if(err) {
                debug('Failed to select game from database using id "' + params.id + '"', err);
                return callback('Internal error occurred');
            }
            var row = rows[0];
            if(row) {
                var object = {};
                object[params.id] = {
                    id: params.id,
                    type: row.type,
                    winner: row.winner
                };
                callback(undefined, object);
            } else {
                callback('Player with supplied id not found');
            }
        });
    }
};