var parserGroup = (rp, girl, token, listOfShitGroups, shittySurname) => {
  return (group, offset) => {
    var isEmpty = obj => {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
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
          var name = profile.first_name;
          var surname = profile.last_name;
          var fullname = `${name} ${surname}`;
          var isNormallyName;

          // Делаем проверку фамилии
          for (var lastname in shittySurname) {
            if (surname == shittySurname[lastname]) {
              isNormallyName = false;
            } else {
              isNormallyName = true;
            }
          }

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
          var className = online ? 'girls__item--online' : 'girls__item--offline';

          var social = {};
              social.instagram = instagram;
              social.twitter = twitter;
              social.skype = skype;

          if (sex == 1 && city == 2 && message && isNormallyName) {
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
                    groups.list.push(group.name);

                    for (var public in listOfShitGroups) {
                      if (group.name.match(listOfShitGroups[public])) {
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

                var msg = `Привет ${profile.first_name}!`;
                var sendMessageURL = `https://api.vk.com/method/messages.send?user_id=${id}&message=${encodeURIComponent(msg)}&access_token=${token}&v=5.60`;

                girl[fullname] = {};
                girl[fullname]['name'] = fullname;
                girl[fullname]['id'] = id;
                girl[fullname]['status'] = status;
                girl[fullname]['photo'] = photo;
                girl[fullname]['relation'] = relation;
                girl[fullname]['online'] = online;
                girl[fullname]['groups'] = groups;
                girl[fullname]['className'] = className;
                girl[fullname]['sendMessageURL'] = sendMessageURL;

                if (!isEmpty(social)) {
                  girl[fullname]['social'] = social;
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
