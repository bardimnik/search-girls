const express = require("express");
const request = require("sync-request");
const rp = require("request-promise");

const girl = new Object();
const group = "pravda.show";
const token = "TOKEN";

const listOfShitGroups = require("./modules/blackgroups");
const getCountMembers = require("./modules/getCountMembers")(request);
const parserGroup = require("./modules/parserGroup")(rp, girl, token);
const server = require("./modules/server")(express, parserGroup, getCountMembers);

parserGroup.start(group, 1000);

server.start(girl, group, 10000, 50000);