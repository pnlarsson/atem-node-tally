'use strict';

// npm-Free Server by The Jared Wilcurt
// All you need to run this is an installed copy of Node.JS
// Put this next to the files you want to serve and run: node server.js

// Require in some of the native stuff that comes with Node
var appHttp = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var filePath = 'html';
// Colors for CLI output
var WHT = '\x1b[39m';
var RED = '\x1b[91m';
var GRN = '\x1b[32m';

// Create the server
var server = appHttp.createServer(function (request, response) {

    // The requested URL, like http://localhost:8000/file.html => /file.html
    var uri = url.parse(request.url).pathname;
    // get the /file.html from above and then find it from the current folder
    var filename = path.join(process.cwd(), filePath, uri);

    // Setting up MIME-Type (YOU MAY NEED TO ADD MORE HERE) <--------
    var contentTypesByExtension = {
        '.html': 'text/html',
        '.css':  'text/css',
        '.js':   'text/javascript',
        '.json': 'text/json',
        '.svg':  'image/svg+xml'
    };

    // Check if the requested file exists
    fs.exists(filename, function (exists) {
        // If it doesn't
        if (!exists) {
            // Output a red error pointing to failed request
            console.log(RED + 'http - FAIL: ' + WHT + filename);
            // Redirect the browser to the 404 page
	        response.writeHead(404, {'Content-Type': 'text/plain'});
	        response.end();
	        return;
        // If the requested URL is a folder, like http://localhost:8000/catpics
        } else if (fs.statSync(filename).isDirectory()) {
            // Output a green line to the console explaining what folder was requested
            console.log(GRN + 'http - FLDR: ' + WHT + filename);
            // redirect the user to the index.html in the requested folder
            filename += '/index.html';
        }

        // Assuming the file exists, read it
        fs.readFile(filename, 'binary', function (err, file) {
            // Output a green line to console explaining the file that will be loaded in the browser
            console.log(GRN + 'http - FILE: ' + WHT + filename);
            // If there was an error trying to read the file
            if (err) {
                // Put the error in the browser
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.write(err + '\n');
                response.end();
                return;
            }

            // Otherwise, declare a headers object and a var for the MIME-Type
            var headers = {};
            var contentType = contentTypesByExtension[path.extname(filename)];
            // If the requested file has a matching MIME-Type
            if (contentType) {
                // Set it in the headers
                headers['Content-Type'] = contentType;
            }

            // Output the read file to the browser for it to load
            response.writeHead(200, headers);
            response.write(file, 'binary');
            response.end();
        });

    });

});

module.exports = server;