/**
* Test for class Car, parameterized version of testsuite.
 */
"use strict";

/* global describe it */

var assert = require("assert");
const Gameb = require("../../src/gameboard/gameboard");

/*
* Check board construct for length and width
*/
function checkGameboard(options, expected) {
    let option = {x: options.x, y: options.y};
    let game = new Gameb(option);
    let size = game.getBoard().length;

    assert.equal(size, expected);
}


/*
* check if we can get correct piece
*/
function checkPiece(options, expected, yyy) {
    let option = {x: options.board.x, y: options.board.y};
    let game = new Gameb(option);
    let piece = game.getPiece(options.x, options.y);

    if (yyy == "y") {
        assert.equal(piece.y, expected);
    } else {
        assert.equal(piece.x, expected);
    }
}

/*
* check if we can get correct piece
*/
function characterPlace(options, expected) {
    let game = new Gameb();
    let result = game.placeCharacter(options.x, options.y, 0);

    if (expected == "true") {
        assert.ok(result);
    } else if (expected == "false") {
        assert.equal(result, false);
    }
}

/**
 * Testsuite
 */
describe("test GameBoard", function() {
    var tests = [
        {x: 15,  y: 15, result: 15 * 15},
        {x: 20, y: 20, result: 20 * 20},
        {x: 1,  y: 40, result: 10 * 40},
        {x: 9, y: 8, result: 10 * 10},
        {x: 20, y: 8, result: 20 * 10}
    ];

    var testPiece = [
        {board: tests[0], x: 10, y: 5},
        {board: tests[0], x: 15, y: 15},
        {board: tests[0], x: 1, y: 1},
        {board: tests[0], x: 6, y: 13},
        {board: tests[0], x: 7, y: 9}
    ];

    var testPlace = [
        {x: 1, y: 1, res: "true"},
        {x: 10, y: 10, res: "true"},
        {x: 6, y: 9, res: "true"},
        {x: 8, y: 7, res: "true"},
        {x: 11, y: 10, res: "false"},
        {x: 6, y: 0, res: "false"},
        {x: 12, y: 15, res: "false"}
    ];

    tests.forEach(function(test) {
        describe("board size of " + test.result, function() {
            it("should be card" + test.result, function () {
                checkGameboard(test, test.result);
            });
        });
    });

    testPiece.forEach(function(test) {
        describe("checking getting value for x, and y", function() {
            it("the value of x should be " + test.x, function () {
                checkPiece(test, test.x, null);
            });
            it("the value of y should be " + test.y, function () {
                checkPiece(test, test.y, "y");
            });
        });
    });

    testPlace.forEach(function(test) {
        describe("checking place funcktion", function() {
            it("The value should be " + test.res, function () {
                characterPlace(test, test.res);
            });
        });
    });
});
