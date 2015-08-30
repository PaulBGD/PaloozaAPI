module.exports = {
    path: "by-name",
    type: "POST",
    parent: "faction",
    description: "Returns a Faction with the provided name. The list of members uses Palooza IDs",
    params: {
        name: {
            type: "string",
            length: {
                min: 1,
                max: 10
            },
            description: "The name of the faction",
            required: true
        }
    },
    example: {
        BGD: {
            members: [
                1,
                5,
                16
            ]
        }
    },
    handleRequest: function (_palooza, params, callback) {
        _palooza.database.execute('SELECT `id` FROM `accounts` WHERE `faction` = ?', [params.name], function (err, rows) {
            if (err) {
                _palooza.debug('Failed to select Factions from database"', err);
                return callback('Internal error occurred');
            }
            if (rows.length == 0) {
                return callback('Faction with name "' + params.name + '" does not exist');
            }
            var object = {};
            var array = [];
            var length = rows.length;
            while (length--) {
                array[length] = rows[length].id;
            }
            object[params.name] = {
                members: array
            };
            callback(undefined, object);
        });
    }
};
