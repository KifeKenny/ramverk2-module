/**
 * A module for a standard playing card.
 *
 * @module
 */
"use strict";

class GameBoard {
    /**
     * @constructor
     *
     * @param {object} options - Configure by sending options.
     */
    constructor(options = {}) {
        var width, height;

        this.enemys = [
            {
                name: "Ranger",
                health: 100,
                damage: 50,
                range: 4,
                walk: 1,
                team: null
            },
            {
                name: "Meleer",
                health: 100,
                damage: 100,
                range: 1,
                walk: 3,
                team: null
            }
        ];
        if (!options.x || options.x < 10) {
            width = 10;
        } else {
            width = options.x;
        }

        if (!options.y || options.y < 10) {
            height = 10;
        } else {
            height = options.y;
        }
        this.board = [];
        for (var y = 1; y <= height; y++) {
            for (var x = 1; x <= width; x++) {
                this.board.push({"y": y, "x": x, o: null});
            }
        }
    }

    getBoard() {
        return this.board;
    }

    /*
    * Get a board block from the gameboard from x and y value
    */
    getPiece(x, y) {
        for (var i = 0; i < this.board.length; i++) {
            if (this.board[i].y == y && this.board[i].x == x) {
                return this.board[i];
            }
        }
        return false;
    }

    /*
    * Place an character on given block
    */
    placeCharacter(x, y, characterToPlace) {
        var place;

        place = this.getPiece(x, y);
        if (!place || place.o) {
            console.log("block doesnt exist");
            return false;
        }

        place.o = this.enemys[characterToPlace];
        console.log(this.enemys[characterToPlace].name + "Placed on x " + x + "y " + y);
        return true;
    }
}

// Export module
module.exports = GameBoard;
