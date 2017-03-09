var async = require('async');
var request = require('request');
var shittyGroups = require('./blackgroups');
var shittySurname = require('./surname');
var translit = require('./translit');

module.exports = (group, offset, token) => {
  return new Promise((resolve, reject) => {
    var girl = [];
    var isEmpty = obj => {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false;
        }
      }

      return true;
    };

    request({
      url: `https://api.vk.com/method/groups.getMembers?group_id=${group}&offset=${offset}&sort=id_desc&fields=status,sex,can_write_private_message,photo_max_orig,online,connections,relation,city&v=5.60`,
      json: true
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        var profiles = body.response.items;
        var girl = [];

        async.eachSeries(profiles, (profile, callback) => {
          var name = profile.first_name;
          var surname = profile.last_name;
          var fullname = /[А-Яа-яЁё]/g.test(`${name} ${surname}`) ? `${name} ${surname}` : `${translit(`${name} ${surname}`, true)} [en]`;
          var id = profile.id;
          var status = profile.status;
          var sex = profile.sex;
          var city = profile.city && profile.city.id;
          var relation = profile.relation;
          var instagram = profile.instagram;
          var twitter = profile.twitter;
          var skype = profile.skype;
          var photo = profile.photo_max_orig;
          var online = profile.online;
          var relation = profile.relation;
          var message = profile.can_write_private_message;

          var className = online ? 'girls__item--online' : 'girls__item--offline';
          var isNormallyName;

          for (var lastname of shittySurname) {
            isNormallyName = surname == lastname ? false : true;
          }

          var social = {};

          social.instagram = instagram;
          social.twitter = twitter;
          social.skype = skype;

          if (sex == 1 && city == 2 && message && isNormallyName) {
            request({
              url: `https://api.vk.com/method/users.getSubscriptions?&user_id=${id}&extended=1&count=200&v=5.60`,
              json: true
            }, (error, response, body) => {
              if (!error && response.statusCode == 200) {
                var items = body.response.items;
                var groups = {};

                groups.list = [];
                groups.shit = [];

                items.forEach(group => {
                  if (group.type == 'page') {
                    groups.list.push(group.name);

                    for (var public of shittyGroups) {
                      if (group.name.match(public)) {
                        groups.shit.push(group.name);
                      }
                    }

                    groups.shitCount = groups.shit.length;
                    groups.allCount = groups.list.length;
                  }
                });

                if (groups.shitCount) {
                  className += ' girls__item--shit';
                }

                // Our message to girls
                var message = `Привет, ${profile.first_name}!`;
                var sendMessageURL = `https://api.vk.com/method/messages.send?user_id=${id}&message=${encodeURIComponent(message)}&access_token=${token}&v=5.60`;

                var baby = {};

                baby.name = fullname;
                baby.id = id;
                baby.status = status;
                baby.photo = photo;
                baby.relation = relation;
                baby.online = online;
                baby.groups = groups;
                baby.className = className;
                baby.sendMessageURL = sendMessageURL;

                if (!isEmpty(social)) {
                  baby.social = social;
                }

                girl.push(baby);
              }
            });
          }

          callback();
        }, error => {
          if (error) {
            throw err;
          }

          resolve(girl);
        });
      } else {
        reject(error);
      }
    });
  });
};
