module.exports = (express, parserGroup, getCountMembers) => {
  var module = {};

  module.start = (girl, group, offset, max) => {
    var app = express();
    var max;

    if (max < 1000) {
      max = 1000;
    } else if (!max) {
      max = 999999; 
    }

    var server = new Promise((resolve, reject) => {
      for (var i = 0, c = getCountMembers.find(group, offset, max); i <= c; i += 1000) {
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

        app.listen(1337);

        console.log("http://localhost:1337");
      })
      .catch(err => {
        console.log(err);
      });
  };

  return module;
};