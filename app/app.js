/*jslint node: true */

var express = require('express');
var bodyParser = require('body-parser');
var publish = require('publishtrello');
var path = require('path');
var qconf = require('qconf');
var shortid = require('shortid');

var app = express();
var config = qconf();

var PUBLIC = config.get('public');
var KEY =  config.get('key');
var TOKEN =  config.get('token');

var options;

function showInterface(request, response) {
  response.render('app.html');
}

function folderName() {
  return shortid.generate();
}

function generateOutput(request, response) {
  options = {
    url: 'https://trello.com/b/' + request.body.board,
    dir: __dirname + '/output/' + folderName(),
    output: {
      md: request.body.md || false,
      html: request.body.html || false,
      pdf: request.body.pdf || false,
      epub: request.body.epub || false
    },
    arch: true,
    key: KEY,
    token: TOKEN
  };
  publish.output(options).then(function() {
    response.end();
  });
}

function download(request, response) {
  response.download(options.dir + '/' + 'trelloBoard.zip');
}

function error404(request, response) {
  response.status(400);
  response.render('404.html', {title: '404'});
}

function error500(error, request, response, next) {
  response.status(500);
  response.render('500.html', {title:'500', error: error});
}

function init() {
  app.set('views', __dirname + PUBLIC);
  app.engine('.html', require('nunjucks').render);
  app.use(express.static(path.join(__dirname, PUBLIC)));
  app.use(bodyParser.json());
  app.get('/', showInterface);
  app.post('/generate', generateOutput);
  app.get('/download', download);
  app.use(error404);
  app.use(error500);
  app.listen(8000);
}

init();
