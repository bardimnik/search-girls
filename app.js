var express = require("express");
var rp = require("request-promise");
var cheerio = require("cheerio");
var request = require("sync-request");

var app = express();

var girl = new Object();

var group = "pravda.show";
var token;

function quantityMembers() {
  var res = request("GET", "https://api.vk.com/method/groups.getMembers?group_id=" + group + "&v=5.60");
  var body = JSON.parse(res.getBody());

  return body.response.count;
}

function makeGirls(offset) {
  var url = "https://api.vk.com/method/groups.getMembers?group_id=" + group + "&offset=" + offset + "&sort=id_desc&fields=sex,can_write_private_message,photo_max_orig,online,relation,city&v=5.60";

  rp(url)
    .then(function(body) {
      var json = JSON.parse(body);

      var items = json.response.items;
      var count = json.response.count;

      items.forEach(function(profile) {
        var id = profile.id;
        var firstName = profile.first_name;
        var lastName = profile.last_name;
        var fullName = firstName + " " + lastName;

        try {
          var city = profile.city.id;
          var sex = profile.sex;
          var photo = profile.photo_max_orig;
          var online = profile.online;
          var relation = profile.relation;
          var message = profile.can_write_private_message;

          if (sex == 1 && city == 2 & message) {
            // Message
            var msg = encodeURIComponent("Привет, " + firstName + ".");
            var sendMessageURL = "https://api.vk.com/method/messages.send?user_id=" + id + "&message=" + msg + "&access_token=" + token + "&v=5.60";

            // Subscriptions
            var groupsShit = "";
            var groupsCount;

            rp("https://api.vk.com/method/users.getSubscriptions?&user_id=" + id + "&extended=1&count=200&v=5.60")
              .then(function(body) {
                var json = JSON.parse(body);

                var groupsAll = json.response.items;
                    groupsCount = json.response.count;

                groupsAll.forEach(function(group) {
                  if (/Щебестан/i.test(group.name)
                      || /MDK/i.test(group.name)
                      || /FURGOS/i.test(group.name)
                      || /CUNBERS/i.test(group.name)
                      || /2ch/i.test(group.name)
                      || /Деградач/i.test(group.name)
                      || /Изолятор/i.test(group.name)
                      || /Паблик Долбоеба/i.test(group.name)
                      || /Овсянка, сэр/i.test(group.name)
                      || /FTP/i.test(group.name)
                      || /Ilita/i.test(group.name)
                      || /SLVK/i.test(group.name)
                      || /Amoral/i.test(group.name)
                      || /Webm/i.test(group.name)
                      || /мем/i.test(group.name)
                      || /mem/i.test(group.name)
                      || /chan/i.test(group.name)
                      || /4ch/i.test(group.name)) {
                    groupsShit += group.name + " ";
                  }
                });
              })
              .catch(function(err) {
                // Error
              });

            // Wall
            var posts = new Array();

            rp("https://api.vk.com/method/wall.get?&owner_id=" + id + "&count=2&v=5.60")
              .then(function(body) {
                var json = JSON.parse(body);

                var items = json.response.items;

                items.forEach(function(wall) {
                  var postLink = "https://vk.com/wall" + id + "_" + wall.id;

                  posts.push(postLink);
                });
              })
              .catch(function(err) {
                // Error
              });


            setTimeout(function() {
              girl[fullName] = new Object();
              girl[fullName]["name"] = fullName;
              girl[fullName]["id"] = id;
              girl[fullName]["photo"] = photo;
              girl[fullName]["relation"] = relation;
              girl[fullName]["online"] = online;
              girl[fullName]["groupsCount"] = groupsCount;
              girl[fullName]["groupsShit"] = groupsShit;
              girl[fullName]["posts"] = posts;
              girl[fullName]["sendMessageURL"] = sendMessageURL;
            }, 500);
          }
        } catch (e) {
          // console.log("Информации недостаточно.");
        }
      });
    })
    .catch(function(err) {
      // Error
    });
}

console.time("Полный парсинг участников");

// var count = quantityMembers();
var count = 2000;

for (var i = 0; i < count; i+= 1000) {
  console.time("Тысяча участников");

  makeGirls(i);

  console.timeEnd("Тысяча участников");
}

console.timeEnd("Полный парсинг участников");

setTimeout(function() {
  app.use(express.static(__dirname + "/static"));
  app.set("view engine", "ejs");
  app.get('/', function(req, res) {
    res.render("pages/index", {
      data: girl
    });
  });

  app.listen(8080);

  console.log("http://localhost:8080");
}, 500);