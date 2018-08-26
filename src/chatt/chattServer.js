/**
 * chatt server
 *
 */
"use strict";

const port = process.env.DBWEBB_PORT || 1337;
const express = require("express");
const http = require("http");
const path = require("path");
const wChatt = require("./watelChatt");

const app = express();
const server = http.createServer(app);

var wss = new wChatt(server, true, "/chatt");

// Serve static files
var staticFiles = path.join(__dirname, "");

app.use(express.static(staticFiles));

server.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
