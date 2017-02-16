const girl = [];
const group = 'belleeee';
const token = 'token';

const getCountMembers = require('./modules/getCountMembers');
const parserGroup = require('./modules/parserGroup')(girl, token);
const server = require('./modules/server')(parserGroup, getCountMembers);

server(girl, group, 0, getCountMembers(group, 1000));
