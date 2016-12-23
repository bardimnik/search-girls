var express = require("express");
var rp = require("request-promise");
var request = require("sync-request");

var app = express();

var girl = new Object();
var token = "a8358a12a364be017df1551cfb1cc467dd6c179834f82b70a72e01942c7e08c6da1accb0d9dad37b2f043";
var group = "twittonator";

var countMembers = function(offset, max) {
  var res = request("GET", "https://api.vk.com/method/groups.getMembers?group_id=" + group + "&offset=" + offset + "&sort=id_desc&fields=sex,can_write_private_message,photo_400_orig,online,relation,city&v=5.60");
  var body = JSON.parse(res.getBody());

  if (body.response.count > max)
    return max;

  return body.response.count;
}

var makeThousandGirls = function(offset) {
  var options = {
    uri: "https://api.vk.com/method/groups.getMembers?group_id=" + group + "&offset=" + offset + "&sort=id_desc&fields=sex,can_write_private_message,photo_400_orig,online,relation,city&v=5.60",
    json: true
  };

  rp(options)
    .then(function(body) {
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

        var photo = profile.photo_400_orig;
        var online = profile.online;
        var relation = profile.relation;
        var message = profile.can_write_private_message;

        if (sex == 1 && city == 2 & message) {
          var res = request("GET", "https://api.vk.com/method/users.getSubscriptions?&user_id=" + id + "&extended=1&count=200&v=5.60");

          var body = JSON.parse(res.getBody());
          var groupsCount = body.response.count;
          var groupsAll = body.response.items;
          var groupsAllList = new Array();
          var groupsShitCount = 0;

          groupsAll.forEach(function(group) {
            if (/Щебестан/i.test(group.name) || /MDK/i.test(group.name) || /FURGOS/i.test(group.name) || /CUNBERS/i.test(group.name) || /2ch/i.test(group.name) || /Деградач/i.test(group.name) || /Изолятор/i.test(group.name) || /Паблик Долбоеба/i.test(group.name) || /Овсянка, сэр/i.test(group.name) || /FTP/i.test(group.name) || /Ilita/i.test(group.name) || /SLVK/i.test(group.name) || /Amoral/i.test(group.name) || /Webm/i.test(group.name) || /мем/i.test(group.name) || /mem/i.test(group.name) || /chan/i.test(group.name) || /4ch/i.test(group.name)) {
              ++groupsShitCount;
            }
          });

          var msg = encodeURIComponent("Привет, " + firstName + ".");
          var sendMessageURL = "https://api.vk.com/method/messages.send?user_id=" + id + "&message=" + msg + "&access_token=" + token + "&v=5.60";

          girl[fullName] = new Object();
          girl[fullName]["name"] = fullName;
          girl[fullName]["id"] = id;
          girl[fullName]["photo"] = photo;
          girl[fullName]["relation"] = relation;
          girl[fullName]["online"] = online;
          girl[fullName]["groupsCount"] = groupsCount;
          girl[fullName]["groupsShitCount"] = groupsShitCount;
          // girl[fullName]["groupsAllList"] = groupsAllList;
          girl[fullName]["sendMessageURL"] = sendMessageURL;
        }
      });
    })
    .catch(function(err) {
      console.log("err");
    });
};

app.use(express.static(__dirname + "/static"));
app.set("view engine", "ejs");
app.get("/", function(req, res) {
  res.render("pages/index", {
    data: girl
  });
});

for (var i = 0; i < countMembers(0, 15000); i += 1000) {
  console.time("Time to generate thousand girls...");

  makeThousandGirls(i);

  console.timeEnd("Time to generate thousand girls...");
}

app.listen(8080);

console.log("http://localhost:8080");