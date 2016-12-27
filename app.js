// var express = require("express");
// var rp = require("request-promise");
// var cheerio = require("cheerio");
// var request = require("sync-request");

// var app = express();

// var girl = new Object();
var express = require("express");
var request = require("sync-request");

var app = express();

var girl = new Object();
var token = "68c54403359b7bc2924e240ccb5c5417309613a307aff68970ce0e163a075cbb3ebdc8f790cc0a87f1100";
var group = "pewtextposts";

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
    var allID = body.response.items;

    allID.forEach(function(profile) {
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

      if (sex == 1 && city == 2 & message) {
        // var res = request("GET", "https://api.vk.com/method/users.getSubscriptions?&user_id=" + id + "&extended=1&count=200&v=5.60");

        // var body = JSON.parse(res.getBody());
        // var groupsCount = body.response.count;
        // var groupsAll = body.response.items;
        // var groupsAllList = new Array();
        // var groupsShitCount = 0;

        // groupsAll.forEach(function(group) {
        //   if (/Щебестан/i.test(group.name)
        //       || /MDK/i.test(group.name)
        //       || /FURGOS/i.test(group.name)
        //       || /CUNBERS/i.test(group.name)
        //       || /2ch/i.test(group.name)
        //       || /Деградач/i.test(group.name)
        //       || /Изолятор/i.test(group.name)
        //       || /Паблик Долбоеба/i.test(group.name)
        //       || /Овсянка, сэр/i.test(group.name)
        //       || /FTP/i.test(group.name)
        //       || /Ilita/i.test(group.name)
        //       || /SLVK/i.test(group.name)
        //       || /Amoral/i.test(group.name)
        //       || /Webm/i.test(group.name)
        //       || /мем/i.test(group.name)
        //       || /mem/i.test(group.name)
        //       || /chan/i.test(group.name)
        //       || /4ch/i.test(group.name)) {
        //     ++groupsShitCount;
        //   }
        // });

        var msg = encodeURIComponent("Привет, " + firstName + ".");
        var sendMessageURL = "https://api.vk.com/method/messages.send?user_id=" + id + "&message=" + msg + "&access_token=" + token + "&v=5.60";

        girl[fullName] = new Object();
        girl[fullName]["name"] = fullName;
        girl[fullName]["id"] = id;
        girl[fullName]["photo"] = photo;
        girl[fullName]["relation"] = relation;
        girl[fullName]["online"] = online;
        // girl[fullName]["groupsCount"] = groupsCount;
        // girl[fullName]["groupsShitCount"] = groupsShitCount;
        // girl[fullName]["groupsAllList"] = groupsAllList;
        girl[fullName]["sendMessageURL"] = sendMessageURL;
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

var count = countMembers(0, 50000);

console.time("Полный парсинг участников");

for (var i = 0; i < 2000; i += 1000) {
  console.time("1000 загрузили.");

  makeThousandGirls(i);

  console.timeEnd("1000 загрузили.");
}

console.timeEnd("Полный парсинг участников");

app.listen(1337);

console.log("http://localhost:1337");