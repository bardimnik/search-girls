var server = (express, parserGroup, getCountMembers) => {
  return (girl, group, offset, count) => {
    var app = express();
    var port = process.env.PORT || 1488;
    var count = Math.round(count / 1000) * 1000;

    var server = new Promise((resolve, reject) => {
      for (var i = 0; i <= count; i += 1000) {
        parserGroup(group, i);

        if (i == count) {
          resolve(i);

          return;
        }
      }

      reject('Ошибка при выполнении парсинга.');
    });

    server
      .then(result => {
        app.use(express.static('./static'));
        app.set('view engine', 'ejs');
        app.get('/', (req, res) => {
          res.render('pages/index', {
            data: girl
          });
        });

        app.listen(port);

        console.log(`Сервер запущен --> http://localhost:${port}`);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

module.exports = server;
