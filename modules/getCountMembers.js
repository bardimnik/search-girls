module.exports = (request) => {
  var module = {};

  module.find = (group, offset, max) => {
    var res = request("GET", "https://api.vk.com/method/groups.getMembers?group_id=" + group + "&offset=" + offset + "&v=5.60");
    var body = JSON.parse(res.getBody());

    if (body.response.count > max) return max;

    return body.response.count
  };

  return module;
};