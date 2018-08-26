/**
 * A module webbsocket for a chatt
 *
 * @module
 */
"use strict";

const WebSocket = require("ws");
const gameBoard = require("./../gameboard/gameboard");

class WatelChatt {
    /**
     * @constructor Creates a webbsocket that takes json requests
     *
     * @param {object} server - server object ex express
     * @param {boolean} clientT - if to keep track on connected clients
     * @param {string} path - what path socket shoulf be on ex: /test
     */
    constructor(server, clientT, path) {
        this.wss = new WebSocket.Server({
            server: server,
            clientTracking: clientT,
            handleProtocols: this.handleProtocols,
            path: path
        });

        this.clients = [];
        this.gameBoard = null;

        var mesConnect;

        // Setup for websocket requests. Handle socket after connection
        // what to do on message, error, close
        this.wss.on("connection", (ws/*, req*/) => {
            ws.id = this.idGenerator();
            this.clients.push(ws.id);

            this.maxSize(ws, 2);
            console.log("clients: " + this.clients.length);


            if (this.clients.length == 2) {
                this.gameBoard = new gameBoard().getBoard();
            }

            mesConnect = `New client connected (${this.wss.clients.size}) using '${ws.protocol}'.`;
            console.log(mesConnect);
            this.broadcastExcept(ws, {message: mesConnect, name: "server"});

            ws.on("message", (message) => {
                console.log("Received: %s", message, " From id: ", ws.id);

                if (JSON.parse(message).type == "message") {
                    this.broadcastExcept(ws, JSON.parse(message));
                }
            });

            ws.on("error", (error) => {
                console.log(`Server error: ${error}`);
            });

            ws.on("close", (code, reason) => {
                this.clients = this.arrRemove(this.clients, ws.id);
                this.gameBoard = null;

                console.log(`Closing connection: ${code} ${reason}`);
                mesConnect = {
                    message: `Client disconnected (${this.wss.clients.size}).`,
                    name: "server"
                };
                this.broadcastExcept(ws, mesConnect);
            });
        });
    }

    /**
     * @param {array} protocols - what kind of protocoll ex: json, text
     * choses first it find in array
     * @return {boolean or string} - If find valid protocol return that as
     * {string} if not return boolean false
     */
    handleProtocols(protocols /*, request */) {
        console.log(`Incoming protocol requests '${protocols}'.`);
        for (var i=0; i < protocols.length; i++) {
            if (protocols[i] === "text") {
                return "text";
            } else if (protocols[i] === "json") {
                return "json";
            }
        }
        return false;
    }

    /**
     * sends message data to client as json string
     * @param {object} ws - webbsocket object
     * @param {object} data - contains message for chat and name which
     * none current use.
     */
    broadcastExcept(ws, data) {
        let clients = 0;

        this.wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                clients++;
                if (ws.protocol === "json") {
                    console.log(data);
                    console.log("---------------");
                    let msg = {
                        timestamp: Date(),
                        data: data.message,
                        name: data.name,
                        game: this.gameBoard
                    };

                    client.send(JSON.stringify(msg));
                } else {
                    client.send(data); //sending data
                }
            }
        });
        console.log(`Broadcasted data to ${clients} (${this.wss.clients.size}) clients.`);
    }

    maxSize(ws, max) {
        if (this.clients.length > max) {
            console.log("serverFull");
            this.broadcastExcept(ws, {
                message: 'Can not connect, server full max 2',
                name: "server"
            });
            ws.close();
            return;
        }
    }

    idGenerator() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    arrRemove(arr, number) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] === number) {
                arr.splice(i, 1);
            }
        }

        return arr;
    }
}

module.exports = WatelChatt;
