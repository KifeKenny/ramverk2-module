#!/usr/bin/env node
"use strict";

// Create the app objekt
// var gameB = require("./src/gameboard/gameboard");
// const game = new gameB();
// var yo = game.placeCharacter(1, 1, 0);

var express = require("express");
var app = express();
const path = require("path");


// Use app as template engine
app.set('view engine', 'pug');

if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

// Serve static files
var staticFiles = path.join(__dirname, "public");

app.use(express.static(staticFiles));


// Add a route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    console.log(req.params);
    next();
});

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

// Note the error handler takes four arguments
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    err.status = err.status || 500;
    res.status(err.status);
    res.render("error", {
        error: err
    });
});


// Start up server
console.log("Express is ready.");
console.log("Listening to 1337");
app.listen(1337);
