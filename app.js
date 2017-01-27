const express = require('express');
const request = require('sync-request');
const rp = require('request-promise');

const girl = {};
const group = 'belleeee';
const token = 'token';

const shittyGroups = require('./modules/blackgroups');
const shittySurname = require('./modules/surname');
const getCountMembers = require('./modules/getCountMembers')(request);
const parserGroup = require('./modules/parserGroup')(rp, girl, token, shittyGroups, shittySurname);
const server = require('./modules/server')(express, parserGroup, getCountMembers);

const count = getCountMembers(group, 5000);

server(girl, group, 5000, count);