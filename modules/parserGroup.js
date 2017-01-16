module.exports = (rp, girl, token) => {
  var module = {};

  module.start = (group, offset) => {
    var options = {
      uri: `https://api.vk.com/method/groups.getMembers?group_id=${group}&offset=${offset}&sort=id_desc&fields=sex,can_write_private_message,photo_max_orig,online,relation,city&v=5.60`,
      json: true
    };

    rp(options)
      .then(body => {
        var profiles = body.response.items;

        profiles.forEach(profile => {
          var firstName = profile.first_name;
          var lastName = profile.last_name;
          var fullName = `${firstName} ${lastName}`;

          var id = profile.id;
          var sex = profile.sex;

          try {
            var city = profile.city.id;
            var relation = profile.relation;
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

            girl[fullName] = {};
            girl[fullName]['name'] = fullName;
            girl[fullName]['id'] = id;
            girl[fullName]['photo'] = photo;
            girl[fullName]['relation'] = relation;
            girl[fullName]['online'] = online;
            girl[fullName]['sendMessageURL'] = sendMessageURL;
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return module;
};