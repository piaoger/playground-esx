'use strict';

var http = require('http'),
    request = require('request');

function postJsonData(url, body, callback) {
    request.put({
        url: url,
        headers: { 'content-type': "application/json" },
        body: JSON.stringify(body)
    }, function (error, response, body) {
        console.log(response);
        if (callback) callback();
    });
}

function download(endpoint, callback) {
    http.get(endpoint, function (res) {
        var body = '';
        res.on('data', function (chuck) {
            body += chuck;
        });
        res.on('end', function () {
            if (callback) callback(undefined, body);
        });
    }).on('error', function (err) {
        if (callback) callback(err, '');
    });
}

exports.postJsonData = postJsonData;
exports.download = download;