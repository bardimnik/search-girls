var express = require("express");
var request = require("sync-request");
var listOfShitGroups = require("./modules/blackgroups");

var app = express();

var girl = new Object();
var token;
var group = "naitivihod";

function countMembers(offset, max) {
  var res = request("GET", "https://api.vk.com/method/groups.getMembers?group_id=" + group + "&offset=" + offset + "&v=5.60");
  var body = JSON.parse(res.getBody());

  if (body.response.count > max) 
    return max;

  return body.response.count;
}

function makeThousandGirls(offset) {
  var res = request("GET", "https://api.vk.com/method/groups.getMembers?group_id="
    + group + "&offset=" + offset
    + "&sort=id_desc&fields=sex,can_write_private_message,photo_max_orig,online,relation,city&v=5.60");
  var body = JSON.parse(res.getBody());

  try {
    var profiles = body.response.items;

    profiles.forEach(function(profile) {
      var name = profile.first_name + " " + profile.last_name;

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

      if (sex == 1 && city == 2 & message) {
        var res = request("GET", "https://api.vk.com/method/users.getSubscriptions?&user_id=" + id + "&extended=1&count=200&v=5.60");

        var body = JSON.parse(res.getBody());
        var groupsCount = body.response.count;
        var groupsAll = body.response.items;
        var groupsShitList = "";
        var groupsShitCount = 0;

        groupsAll.forEach(function(group) {
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

        var msg = encodeURIComponent("Привет, " + firstName + ". Не против познакомиться?");
        var sendMessageURL = "https://api.vk.com/method/messages.send?user_id=" + id + "&message=" + msg + "&access_token=" + token + "&v=5.60";

        girl[name] = new Object();
        girl[name]["name"] = name;
        girl[name]["id"] = id;
        girl[name]["photo"] = photo;
        girl[name]["relation"] = relation;
        girl[name]["online"] = online;
        girl[name]["sendMessageURL"] = sendMessageURL;
        girl[name]["groupsCount"] = groupsCount;
        girl[name]["groupsShitCount"] = groupsShitCount;
        girl[name]["groupsShitList"] = groupsShitList;
      }
    });
  } catch (e) {
    console.log(e);
  }
};

app.use(express.static(__dirname + "/static"));
app.set("view engine", "ejs");
app.get('/', function(req, res) {
  res.render("pages/index", {
    data: girl
  });  
});

console.time("Полный парсинг участников");

for (var i = 0, count = countMembers(0, 50000); i < count; i += 1000) {
  console.time("1000 загрузили.");

  makeThousandGirls(i);

  console.timeEnd("1000 загрузили.");
}

console.timeEnd("Полный парсинг участников");

app.listen(1337);

console.log("http://localhost:1337");