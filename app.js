const rp = require('request-promise');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const girl = [];
const token = 'token';

const parserGroup = require('./modules/parserGroup')(girl, token);

var port = process.env.PORT || 1488;

app.use(bodyParser());
app.use(express.static('./static'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/girl', (req, res) => {
  res.render('pages/girl', {
    data: girl
  });
});

app.post('/', (req, res) => {
  var public = req.body.girl.public.trim();
  var count = req.body.girl.count.trim();

  if (public.search('vk.com/') != -1) {
    var options = {
      uri: `https://api.vk.com/method/groups.getById?group_id=${public.split('vk.com/')[1].split('?')[0]}&v=5.62`,
      json: true
    };

    rp(options)
      .then(body => {
        if (!body.error) {
          for (let i = 0; i <= count; i += 1000) {
            parserGroup(public.split('vk.com/')[1].split('?')[0], 0);
          }

          app.get('/girl', (req, res) => {
            res.render('pages/girl', {
              data: girl
            });
          });

          res.redirect('/girl');
        } else {
          res.send('Test', 200); 
        }
      })
      .catch(e => {
        console.log(e);
      });
  } else {
    console.log('wrong');
  }
});

app.listen(port);

console.log(`Listening on http://localhost:${port}`);
