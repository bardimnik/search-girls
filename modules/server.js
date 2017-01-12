module.exports = (express, parserGroup, getCountMembers) => {
  var module = {};

  module.start = (girl, group, offset, count) => {
    var app = express();

    var server = new Promise((resolve, reject) => {
      for (var i = 0, c = getCountMembers.find(group, offset, count); i <= c; i += 1000) {
        parserGroup.start(group, i);

        if (i == c) {
          resolve(i);

          return;
        }
      }

      reject("Error");
    });

    server
      .then(result => {
        app.use(express.static("./static"));
        app.set("view engine", "ejs");
        app.get('/', (req, res) => {
          res.render("pages/index", {
            data: girl
          });
        });

        app.listen(1488);

        console.log("http://localhost:1488");
      })
      .catch(err => {
        console.log(err);
      });
  };

  return module;
};