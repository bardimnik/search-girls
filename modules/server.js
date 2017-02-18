const rp = require('request-promise');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var server = (parserGroup, getCountMembers) => {
  return (girl, group, offset, count) => {
    var port = process.env.PORT || 1488;
    var count = Math.round(count / 1000) * 1000;

    var server = new Promise((resolve, reject) => {
      for (var i = 0; i <= count; i += 1000) {
        parserGroup(group, (offset + i));

        if (i == count) {
          resolve(i);

          return;
        }
      }

      reject('Ошибка при выполнении парсинга.');
    });

    server
      .then(result => {
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

          if (public.search('vk.com/') != -1) {
            var options = {
              uri: `https://api.vk.com/method/groups.getById?group_id=${public.split('vk.com/')[1].split('?')[0]}&v=5.62`,
              json: true
            };

            rp(options)
              .then(body => {
                if (!body.error) {
                  console.log('okay');
                } else {
                  console.log('group not find');
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
      })
      .catch(err => {
        console.log(err);
      });
  }
};

module.exports = server;
