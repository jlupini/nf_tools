
/* npm Modules */
var app, bodyParser, express, fs, http, httpServer, path, request, run;

express = require('express');

app = express();

request = require('request');

http = require('http');

path = require('path');

bodyParser = require('body-parser');

fs = require('fs');

httpServer = http.Server(app);

run = function() {
  var hostname, port;
  console.log('Run ran');
  port = 3200;
  hostname = 'localhost';

  /*Start the server */
  httpServer.listen(port);

  /*Middlewares */
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  }));
  app.use(express["static"](path.join(__dirname, '../client')));

  /*/import route that can be hit from the client side */
  app.get('/import', function(req, res, next) {
    var path;
    var saveImage, uri;
    alert('trying to import');

    /* Get the directory path from the header and name the file */
    path = req.headers['directory'] + '/placeholder.png';

    /* This is an example URL */
    uri = 'http://via.placeholder.com/350x150';

    /* write a helper function to download the image and save it */
    saveImage = function(uri, filepath, callback) {
      request.head(uri, function(err, res, body) {
        request(uri).pipe(fs.createWriteStream(filepath)).on('close', callback);
      });
    };
    saveImage(uri, path, function() {

      /* Send the path back to the client side */
      res.status(200).send(path);
    });
  });
};

module.exports = run;

console.log('is this working');
