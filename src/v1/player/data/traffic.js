module.exports = {
    path: "traffic",
    type: "POST",
    parent: "player/data",
    description: "Returns a player's traffic from his id",
    params: {
        id: {
            type: "integer",
            description: "The player's id",
            required: true
        }
    },
    example: {
        1: [
            1,
            2,
            100,
            101,
            102,
            103,
            5065
        ]
    },
    handleRequest: function (_palooza, params, callback) {
        _palooza.database.execute('SELECT `time` FROM `palooza`.`traffic` WHERE `id` = ?', [params.id], function (err, rows) {
            if (err) {
                _palooza.debug('Failed to select traffic from database using id "' + params.id + '"', err);
                return callback('Internal error occurred');
            }
            var array = [];
            var length = rows.length;
            while (length--) {
                array[length] = rows[length].time;
            }
            var object = {};
            object[params.id] = array;
            callback(undefined, object);
        });
    }
};
