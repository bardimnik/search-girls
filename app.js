var express = require("express");
var request = require("sync-request");
var rp = require("request-promise");

var listOfShitGroups = require("./modules/blackgroups");
var getCountMembers = require("./modules/getCountMembers")(request);

var app = express();

var girl = new Object();
var token = "token";
var group = "pravda.show";

var makeThousandGirls = (group, offset) => {
  var options = {
    uri: "https://api.vk.com/method/groups.getMembers?group_id="
    + group + "&offset=" + offset
    + "&sort=id_desc&fields=sex,can_write_private_message,photo_max_orig,online,relation,city&v=5.60",
    json: true
  };

  rp(options)
    .then((body) => {
      var profiles = body.response.items;

      profiles.forEach((profile) => {
        var firstName = profile.first_name;
        var lastName = profile.last_name;
        var fullName = firstName + " " + lastName;

        var id = profile.id;
        var sex = profile.sex;

        try {
          var city = profile.city.id;
          var relation = profile.relation;
        } catch (e) {
          // console.log("City or relation not found...");
        }

        var photo = profile.photo_max_orig;
        var online = profile.online;
        var relation = profile.relation;
        var message = profile.can_write_private_message;

        if (sex == 1 && city == 2 && message) {
          /*

          *******

          Делая запросы к подпискам пользователя, парсинг очень сильно замедляется,
          поэтому не рекомендую это делать.

          *******

          var res = request("GET", "https://api.vk.com/method/users.getSubscriptions?&user_id=" + id + "&extended=1&count=200&v=5.60");

          var body = JSON.parse(res.getBody());
          var groupsCount = body.response.count;
          var groupsAll = body.response.items;
          var groupsShitList = "";
          var groupsShitCount = 0;

          groupsAll.forEach((group) => {
            if (group.type == "page") {
              for (blackGroup in listOfShitGroups) {
                if (group.name.match(listOfShitGroups[blackGroup])) {
                  ++groupsShitCount;
                  groupsShitList += group.name + " ";
                }
              }
            } else {
              console.log("Пользователь подписан на страницу другого пользователя.");
            }
          });

          */

          var msg = encodeURIComponent(`Привет, ${firstName}.`);
          var sendMessageURL = "https://api.vk.com/method/messages.send?user_id=" + id + "&message=" + msg + "&access_token=" + token + "&v=5.60";

          girl[fullName] = new Object();
          girl[fullName]["name"] = fullName;
          girl[fullName]["id"] = id;
          girl[fullName]["photo"] = photo;
          girl[fullName]["relation"] = relation;
          girl[fullName]["online"] = online;
          girl[fullName]["sendMessageURL"] = sendMessageURL;

          /*

          girl[fullName]["groupsCount"] = groupsCount;
          girl[fullName]["groupsShitCount"] = groupsShitCount;
          girl[fullName]["groupsShitList"] = groupsShitList;

          */
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

var server = new Promise((resolve, reject) => {
  var count = getCountMembers.find(group, 0, 150000);

  for (var i = 0; i <= count; i += 1000) {
    makeThousandGirls(group, i);

    if (i == count) {
      resolve(i);

      return;
    }
  }
    
  reject("Error");
});

server
  .then((result) => {
    app.use(express.static(__dirname + "/static"));
    app.set("view engine", "ejs");
    app.get('/', (req, res) => {
      res.render("pages/index", {
        data: girl
      });  
    });

    app.listen(1488);

    console.log("http://localhost:1488");
  })
  .catch((error) => {
      onsole.log(error);
  });