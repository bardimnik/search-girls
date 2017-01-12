var express = require("express");
var request = require("sync-request");
var rp = require("request-promise");

var girl = new Object();

var listOfShitGroups = require("./modules/blackgroups");
var getCountMembers = require("./modules/getCountMembers")(request);
var parserGroup = require("./modules/parserGroup")(rp, girl);
var server = require("./modules/server")(express, parserGroup, getCountMembers);

var token = "token";
var group = "pravda.show";

parserGroup.start(group, 1000, token);

server.start(group, girl);