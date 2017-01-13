const express = require("express");
const request = require("sync-request");
const rp = require("request-promise");

const girl = new Object();
const group = "wh_red";
const token = "TOKEN";

const listOfShitGroups = require("./modules/blackgroups");
const getCountMembers = require("./modules/getCountMembers")(request);
const parserGroup = require("./modules/parserGroup")(rp, girl, token);
const server = require("./modules/server")(express, parserGroup, getCountMembers);

const count = getCountMembers.find(group, 0);

server.start(girl, group, 0, count);