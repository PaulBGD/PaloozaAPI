var debug = require('debug')('PaloozaAPI:method');

module.exports = {
    path: "from-winner",
    type: "POST",
    parent: "game",
    description: "Returns all the games won by the specified winner",
    params: {
        winner: {
            type: "string",
            description: "The player's uuid, or the team's name",
            required: true
        }
    },
    example: {
        games: [
            {
                id: 1,
                type: "MCBrawl"
            }
        ]
    },
    handleRequest: function(_palooza, params, callback) {
        _palooza.database.execute('SELECT `game`,`type` FROM `palooza`.`game_records` WHERE `winner` = ?', [params.winner], function(err, rows) {
            if(err) {
                debug('Failed to select game from database using id "' + params.id + '"', err);
                return callback('Internal error occurred');
            }
            var object = {
                games: rows
            };
            callback(undefined, object);
        });
    }
};