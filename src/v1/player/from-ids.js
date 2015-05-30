var async = require('async');
var debug = require('debug')('PaloozaAPI:method');

module.exports = {
    path: "from-ids",
    type: "POST",
    parent: "player",
    description: "Returns players' data from their ids",
    params: {
        ids: {
            type: "string",
            description: "The players' ids in a comma separated list",
            required: true
        }
    },
    example: {
        1: {
            id: 1,
            name: "PaulBGD",
            uuid: "a4c2c06f-c35d-42d4-87e8-87d74613ae85",
            faction: "BGD",
            server: "factions",
            time: 373771
        }
    },
    handleRequest: function (_palooza, params, callback) {
        var ids = params.ids.split(',');
        ids = ids.filter(function (elem, index, self) {
            return index == self.indexOf(elem);
        });
        if (ids.length > 10) {
            return callback('Please do not use more than 100 ids');
        }
        var string = '';
        var length = ids.length;
        while (length--) {
            if (!/^-?[0-9]+$/.test(ids[length])) {
                return callback('Invalid id ' + ids[length]);
            }
            string += '`id` = ? OR ';
        }
        if (string.length > 0) {
            string = string.substr(0, string.length - 4);
        }
        _palooza.database.execute('SELECT `id`,`name`,`uuid`,`faction`,`points`,`server`,`time` FROM `palooza`.`accounts` WHERE ' + string, ids, function (err, rows) {
            if (err) {
                debug('Failed to select player from database using id "' + params.id + '"', err);
                return callback('Internal error occurred');
            }
            var length = rows.length;
            var object = {};
            while (length--) {
                var row = rows[length];
                object[row.id] = {
                    id: row.id,
                    name: row.name,
                    uuid: row.uuid,
                    faction: row.faction,
                    server: row.server,
                    time: row.time
                };
            }
            callback(undefined, object);
        });
    }
};