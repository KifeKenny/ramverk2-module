/**
 * REEEEEEEEEEEEEEEEEEEE
 *
 */
"use strict";

const port = process.env.DBWEBB_PORT || 1337;
const express = require("express");
const http = require("http");
const path = require("path");

// const gameB = require("./src/gameboard/gameboard");
// const WebSocket = require("ws");
const wChatt = require("./src/chatt/watelChatt");

const app = express();
const server = http.createServer(app);

var wss = new wChatt(server, true, "/chatt");


// enable views from pug
app.set('view engine', 'pug');

// Serve static files
var staticFiles = path.join(__dirname, "public");

app.use(express.static(staticFiles));

//routes
app.get("/", (req, res) => {
    res.render("home", {
        title: "Game | Home",
    });
});

app.get("/lobby/size", (req, res) => {
    res.send(JSON.stringify({clients: wss.clients.length}));
});

app.get("/lobby/gameboard", (req, res) => {
    res.send(JSON.stringify({gameboard: wss.gameBoard}));
});

// Startup server
server.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
