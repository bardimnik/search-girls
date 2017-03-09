var request = require('request');

module.exports = (group, max) => {
  return new Promise((resolve, reject) => {
    request({ url: `https://api.vk.com/method/groups.getMembers?group_id=${group}&offset=0&v=5.60`, json: true}, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        var result = body.response.count > max ? max : body.response.count;
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};
