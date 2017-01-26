var parserGroup = (rp, girl, token, listOfShitGroups) => {
  return (group, offset) => {
    var isEmpty = obj => {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false;
        }
      }

      return true;
    };

    var options = {
      uri: `https://api.vk.com/method/groups.getMembers?group_id=${group}&offset=${offset}&sort=id_desc&fields=status,sex,can_write_private_message,photo_max_orig,online,connections,relation,city&v=5.60`,
      json: true
    };

    rp(options)
      .then(body => {
        var profiles = body.response.items;

        profiles.forEach(profile => {
          var name = `${profile.first_name} ${profile.last_name}`;

          var id = profile.id;
          var status = profile.status;
          var sex = profile.sex;

          try {
            var city = profile.city.id;
            var relation = profile.relation;
            var instagram = profile.instagram;
            var twitter = profile.twitter;
            var skype = profile.skype;
          } catch (e) {
            // console.log('Некоторые данные отсутствуют.');
          }

          var photo = profile.photo_max_orig;
          var online = profile.online;
          var relation = profile.relation;
          var message = profile.can_write_private_message;

          var social = {};
          social.instagram = instagram;
          social.twitter = twitter;
          social.skype = skype;

          if (sex == 1 && city == 2 && message) {
            var options = {
              uri: `https://api.vk.com/method/users.getSubscriptions?&user_id=${id}&extended=1&count=200&v=5.60`,
              json: true
            };

            rp(options)
              .then(body => {
                var items = body.response.items;
                var groups = {};
                    groups.list = [];
                    groups.shit = [];

                items.forEach(group => {
                  if (group.type == 'page') {
                    // groups.list.push(group.name);

                    for (var shit in listOfShitGroups) {
                      if (group.name.match(listOfShitGroups[shit])) {
                        groups.shit.push(group.name);
                      }
                    }

                    groups.shitCount = groups.shit.length;
                  }
                });          

                var msg = `Здравствуй, май ${profile.first_name}!`;
                var sendMessageURL = `https://api.vk.com/method/messages.send?user_id=${id}&message=${encodeURIComponent(msg)}&access_token=${token}&v=5.60`;

                girl[name] = {};
                girl[name]['name'] = name;
                girl[name]['id'] = id;
                girl[name]['status'] = status;
                girl[name]['photo'] = photo;
                girl[name]['relation'] = relation;
                girl[name]['online'] = online;
                girl[name]['groups'] = groups;
                girl[name]['sendMessageURL'] = sendMessageURL;

                if (!isEmpty(social)) {
                  girl[name]['social'] = social;
                }
              })
              .catch(e => {
                console.log(e);
              });
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
};

module.exports = parserGroup;
