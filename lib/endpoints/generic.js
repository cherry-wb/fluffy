// Copyright (c) Grant Murphy
var https       = require('https')
var http        = require('http')
var url         = require('url')
var _           = require('underscore')

exports.send = function(action, options, data){
   
    console.log(action.path)
    var ssl = action.path.indexOf("https://") == 0;
    var parsed_url = url.parse(action.path)
    var opts = _.extend(parsed_url, {
        method  : action.method, 
        headers : action.headers
    });

    if ((opts.method === 'POST' || opts.method === 'PUT') && data){

        var headers = {};
        headers['Content-Length'] = data.length
        opts.headers = _.extend(opts.headers, headers)

    }

    var client = http;
    if (ssl)
        client = https;

    console.log('settings: ' + JSON.stringify(opts))
    var r = client.request(opts, options.callback)
    r.on('error', options.error)

    if (data){
        console.log(action.path) 
        console.log('sending...')
        console.log(data)
        r.write(data)
    }

    r.end()
}

