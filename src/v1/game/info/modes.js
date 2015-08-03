var debug = require('debug')('PaloozaAPI:method');

module.exports = {
    path: "modes",
    type: "POST",
    parent: "game/info",
    description: "Returns details about the current modes",
    params: {
        game: {
            type: "string",
            description: "The game type"
        }
    },
    example: [
        {
            game: 'mcbrawl',
            mode: 'Regular',
            id: 0
        },
        {
            game: 'mcbrawl',
            mode: 'Duel',
            id: 1
        },
        {
            game: 'mcbrawl',
            mode: 'Teams',
            id: 2
        }
    ],
    handleRequest: function (_palooza, params, callback) {
        function execute(err, rows) {
            if (err) {
                debug('Failed to select maps from database using game "' + params.game + '"', err);
                return callback('Internal error occurred');
            }
            callback(undefined, rows);
        }
        if (params.game) {
            return _palooza.database.execute('SELECT `game`,`mode`,`id` FROM `game_modes` WHERE `game` = ? AND `enabled` = 1', [params.game], execute);
        }
        _palooza.database.execute('SELECT `game`,`mode`,`id` FROM `game_modes` WHERE `enabled` = 1', execute);
    }
};