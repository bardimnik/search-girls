var express = require('express');
var app = express();

var getCountMembers = require('./modules/getCountMembers');
var parserGroup = require('./modules/parserGroup');

var group = 'belleeee';
var token = 'token';

getCountMembers(group, 10000).then(response => {
  var count = Math.round(response / 1000) * 1000;
  var port = process.env.PORT || 1488;

  parserGroup(group, count, token).then(data => {
    app.use(express.static('./static'));
    app.set('view engine', 'ejs');
    app.get('/', (req, res) => {
      res.render('pages/index', {
        data: data
      });
    });

    app.listen(port);

    console.log(`Listening on http://localhost:${port}`);
  });
});
