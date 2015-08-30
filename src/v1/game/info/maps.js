module.exports = {
    path: "maps",
    type: "POST",
    parent: "game/info",
    description: "Returns details about the current maps",
    params: {
        game: {
            type: "string",
            description: "The game type"
        }
    },
    example: [
        {
            game: 'mcbrawl',
            map: 'Apocalypse',
            creator: 29,
            id: 0,
            modes: [
                0,
                2
            ]
        }
    ],
    handleRequest: function (_palooza, params, callback) {
        function execute(err, rows) {
            if (err) {
                _palooza.debug('Failed to select maps from database using game "' + params.game + '"', err);
                return callback('Internal error occurred');
            }
            var array = [];
            var object = {};
            var length = rows.length;
            while (length--) {
                var row = rows[length];
                var current = object[row.id];
                if (current) {
                    current.modes.push(row.mode);
                } else {
                    row.modes = [row.mode];
                    delete row.mode;
                    object[row.id] = row;
                    array.push(row);
                }
            }
            callback(undefined, array);
        }
        if (params.game) {
            return _palooza.database.execute('SELECT * FROM `game_maps` WHERE `game` = ?', [params.game], execute);
        }
        _palooza.database.execute('SELECT * FROM `game_maps`', execute);
    }
};
