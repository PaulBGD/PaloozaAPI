var requireAsync = require('require-async');

var bcrypt = requireAsync('bcryptjs');

module.exports = {
    path: "authenticate",
    type: "POST",
    parent: "player/auth",
    description: "Authenticates as the user and returns the user's API key",
    params: {
        id: {
            type: "integer",
            description: "The player's id",
            required: true
        },
        password: {
            type: "string",
            description: "The player's password. Use /account in game.",
            length: {
                min: 6
            },
            required: true
        }
    },
    example: {
        1: "someapikeyhere123"
    },
    handleRequest: function (_palooza, params, callback) {
        _palooza.database.execute('SELECT `api`,`password` FROM `palooza`.`accounts` WHERE `id` = ?', [params.id], function (err, rows) {
            if (err) {
                _palooza.debug('Failed to select player from database using id "' + params.id + '"', err);
                return callback('Internal error occurred');
            }
            var row = rows[0];
            if (row) {
                var password = row.password;
                if (!password) {
                    return callback('Password is not set');
                } else if (!row.api) {
                    return callback('User does not have API key set');
                }
                bcrypt('compareSync', params.password, password, function (err, password) {
                    if (err) {
                        _palooza.debug('Failed to check passwords for id ' + params.id + '"', err);
                        return callback('Internal error occurred');
                    }
                    if (password) {
                        var object = {};
                        object[params.id] = row.api;
                        callback(null, object);
                    } else {
                        callback('Incorrect password');
                    }
                });
            } else {
                callback('Player with supplied id not found');
            }
        });
    }
};
