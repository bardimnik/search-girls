module.exports = (express, parserGroup, getCountMembers) => {
  var module = {};

  module.start = (group, girl) => {
    var app = express();

    var server = new Promise((resolve, reject) => {
      for (var i = 0, count = getCountMembers.find(group, 0, 5000); i <= count; i += 1000) {
        parserGroup.start(group, i);

        if (i == count) {
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