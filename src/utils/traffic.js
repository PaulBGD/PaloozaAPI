global.window = global; // hack for Chart so it has the window object
global.document = { // hack for Chart so it can get the width and height
    defaultView: {
        getComputedStyle: function (element) {
            return {
                getPropertyValue: function (type) {
                    if (type == 'Width') {
                        return 850;
                    } else if (type == 'Height') {
                        return 300;
                    }
                }
            }
        }
    }
};

var Chart = require('chart.js');
var moment = require('moment');
var Canvas = require('canvas');
var request = require('request');
var path = require('path');
var fs = require('fs');
var config = require('../../config.json');

function render() {
    request(config.server.traffic_url, function (err, status, body) {
        try {
            var chunks = JSON.parse(body.toString());
        } catch(err) {
            return;
        }
        var sorted = [];
        var top = -Infinity;
        for (var property in chunks) {
            if (property > top) {
                top = property;
            }
        }
        for (property in chunks) {
            sorted.push({time: property - top, data: chunks[property].length});
        }
        sorted.sort(function (o1, o2) {
            if (o1.time < o2.time) {
                return -1;
            } else if (o2.time < o1.time) {
                return 1;
            }
            return 0;
        });
        console.log(sorted);
        var labels = [];
        var raw = [];
        for (var i = 0; i < sorted.length; i++) {
            labels[i] = moment(Date.now() + (sorted[i].time * 30 * 60 * 1000)).format('h:mm a');
            raw[i] = sorted[i].data;
        }
        var data = {
            labels: labels,
            datasets: [
                {
                    label: "Players Online",
                    fillColor: "rgba(220,0,0,0.5)",
                    strokeColor: "rgba(220,0,0,0.8)",
                    highlightFill: "rgba(220,0,0,0.75)",
                    highlightStroke: "rgba(220,0,0,1)",
                    data: raw
                }
            ]
        };

        var canvas = new Canvas(850, 300);
        new Chart(canvas.getContext('2d')).Line(data, {bezierCurve: false});
        setTimeout(function () {
            var buffer = new Buffer(canvas.toBuffer());
            fs.writeFileSync(path.join(process.cwd(), 'traffic.png'), buffer);
        }, 1000);
    });
}

module.exports = render;
