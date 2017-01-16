module.exports = (rp, girl, token) => {
  var module = {};

  module.start = (group, offset) => {
    var options = {
      uri: `https://api.vk.com/method/groups.getMembers?group_id=${group}&offset=${offset}&sort=id_desc&fields=sex,can_write_private_message,photo_max_orig,online,connections,relation,city&v=5.60`,
      json: true
    };

    rp(options)
      .then(body => {
        var profiles = body.response.items;

        profiles.forEach(profile => {
          var name = `${profile.first_name} ${profile.last_name}`;

          var id = profile.id;
          var sex = profile.sex;

          try {
            var city = profile.city.id;
            var relation = profile.relation;
            var instagram = profile.instagram;
            var twitter = profile.twitter;
            var skype = profile.skype;
          } catch (e) {
            // console.log('Город или семейное положение не найдено.');
          }

          var photo = profile.photo_max_orig;
          var online = profile.online;
          var relation = profile.relation;
          var message = profile.can_write_private_message;

          if (sex == 1 && city == 2 && message) {
            var msg = 'Привет.';
            var sendMessageURL = `https://api.vk.com/method/messages.send?user_id=${id}&message=${encodeURIComponent(msg)}&access_token=${token}&v=5.60`;

            girl[name] = {};
            girl[name]['name'] = name;
            girl[name]['id'] = id;
            girl[name]['photo'] = photo;
            girl[name]['relation'] = relation;
            girl[name]['online'] = online;
            girl[name]['sendMessageURL'] = sendMessageURL;
            girl[name]['social'] = {};
            girl[name]['social']['instagram'] = instagram;
            girl[name]['social']['twitter'] = twitter;
            girl[name]['social']['skype'] = skype;
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return module;
};