const express = require("express");
const request = require("sync-request");
const rp = require("request-promise");

const girl = new Object();
const group = "wh_red";
const token = "e5f3149e9a124ebab5dc17bce16e5e888893760686f19b58821a28af5d7167ab4b2429caaaca26791af0d";

const listOfShitGroups = require("./modules/blackgroups");
const getCountMembers = require("./modules/getCountMembers")(request);
const parserGroup = require("./modules/parserGroup")(rp, girl, token);
const server = require("./modules/server")(express, parserGroup, getCountMembers);

server.start(girl, group, 0, 0);