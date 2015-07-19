var debug = require('debug')('PaloozaAPI:method');
var async = require('async');

module.exports = {
    path: "global",
    type: "POST",
    parent: "player/stats",
    description: "Returns global stats",
    params: {},
    example: {
        uniquePlayers: 1000,
        mostOnAtOnce: 20,
        online: 5
    },
    handleRequest: function (_palooza, params, callback) {
        async.series([
            function (callback) {
                _palooza.database.execute('SELECT COUNT(`id`) FROM `palooza`.`accounts` WHERE `server` IS NOT NULL', callback);
            },
            function (callback) {
                _palooza.database.execute('SELECT COUNT(`id`) FROM `palooza`.`accounts`', callback);
            },
            function (callback) {
                _palooza.database.execute('SELECT COUNT(`id`) FROM `palooza`.`traffic` WHERE `time` IN (SELECT `time` FROM (SELECT `time`, COUNT(`time`) as `o` FROM `palooza`.`traffic` GROUP BY `time` ORDER BY `o` DESC LIMIT 1) AS `a`)', callback);
            }
        ], function (err, data) {
            if (err) {
                debug('Failed to find global data', err);
                return callback('Internal error occurred');
            }
            var object = {
                uniquePlayers: data[1][0][0]['COUNT(`id`)'],
                mostOnAtOnce: data[2][0][0]['COUNT(`id`)'],
                online: data[0][0][0]['COUNT(`id`)']
            };
            callback(undefined, object);
        });
    }
};
