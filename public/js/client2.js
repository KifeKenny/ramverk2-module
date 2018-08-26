/**
 * To setup a websocket connection, and nothing more.
 */
(function () {
    "use strict";

    var mesToSend, setUsername, protocol, url, allData, res, clients;
    let websocket;

    let connect     = document.getElementById("joinLobby");
    let sendMessage = document.getElementById("sendMessage");
    let message     = document.getElementById("message");
    let close       = document.getElementById("close");
    let output      = document.getElementById("chatt");
    let username    = document.getElementById("username");
    let clearLog    = document.getElementById("clearLog");
    let lobbyAmount = document.getElementById("lobbyAmount");
    let lobby       = document.getElementById("lobby");
    let gameLobby   = document.getElementById("gameLobby");

    protocol = 'json';
    url = 'ws://localhost:1337/chatt';

    updateClientSize();

    /**
     * Log output to web browser.
     *
     * @param  {string} message to output in the browser window.
     *
     * @return {void}
     */
    function outputLog(message) {
        let now = new Date();
        let timestamp = now.toLocaleTimeString();

        output.innerHTML += `${timestamp} ${message}<br>`;
        output.scrollTop = output.scrollHeight;
    }

    /**
     * Log output to web browser in case of error.
     *
     * @param  {string} message to output in the browser window only to self.
     *
     * @return {void}
     */
    function outputError(message) {
        output.innerHTML += `<strong style="color: red"> Error: <em> ${message} <em> </strong><br>`;
        output.scrollTop = output.scrollHeight;
    }




    /**
     * Select what subprotocol to use for websocekt connection.
     *
     * @return {string} with name of subprotocol.
     */
    // function setSubProtocol() {
    //     return "json";
    // }



    /**
     * What to do when user clicks Connect
     */
    connect.addEventListener("click", function(/*event*/) {
        if (!username.value) {
            outputError("Username not set");
            console.log("Username not set");
            return;
        }
        setUsername = username.value;
        console.log("Username set to: " + setUsername);

        websocket = new WebSocket(url, protocol);

        console.log("Connecting to: " + url);

        websocket.onopen = function() {
            updateClientSize();

            console.log(websocket);
            outputLog("The websocket is now open using '" + websocket.protocol + "'.");

            gameMap();
        };

        websocket.onmessage = function(event) {
            updateClientSize();
            allData = JSON.parse(event.data);

            console.log("--------------------------------------------");
            console.log(allData);
            outputLog(`<strong>${allData.name}:</strong> ${allData.data}`);

            if (allData.game != null) {
                gameLobby.innerHTML = allData.game;
            } else {
                gameLobby.innerHTML = "<h4>Waiting for one more player</h4>";
            }
        };

        websocket.onclose = function() {
            updateClientSize();
            lobby.style.display = "";
            gameLobby.innerHTML = "";
            console.log("The websocket is now closed.");
            outputLog("Websocket is now closed.");
        };
    }, false);

    /**
     * What to do when user clicks to send a message.
     */
    sendMessage.addEventListener("click", function(/*event*/) {
        let messageText = message.value;

        if (!websocket || websocket.readyState === 3) {
            console.log("The websocket is not connected to a server.");
            outputError("The websocket is not connected to a server.");
        } else {
            mesToSend = {
                type: 'message',
                message: messageText,
                name: setUsername
            };
            console.log(mesToSend);

            websocket.send(JSON.stringify(mesToSend));
            outputLog(`<strong>${mesToSend.name}:</strong> ${messageText}`);
        }
    });



    /**
     * What to do when user clicks Close connection.
     */
    close.addEventListener("click", function() {
        console.log("Closing websocket.");
        mesToSend = {
            type: 'message',
            message: "Client closing connection by intention.",
            name: setUsername
        };
        websocket.send(JSON.stringify(mesToSend));
        websocket.close();
        // console.log(websocket);
        outputLog("<strong>Server:</strong> Prepare to close websocket.");
    });


    clearLog.addEventListener("click", function() {
        output.innerHTML = "";
        output.scrollTop = output.scrollHeight;
    });

    /**
     * Log output to web browser.
     *
     * @param  {string} url url you want to fetch api from
     *
     * @return {string} returns fetched json string
     */
    function sendXMLHttpRequest(url) {
        var oReq = new XMLHttpRequest();

        oReq.open('GET', url);
        oReq.send();

        return oReq;
    }

    function updateClientSize() {
        clients = sendXMLHttpRequest('/lobby/size');
        clients.addEventListener("load", function() {
            res = JSON.parse(this.responseText);
            lobbyAmount.innerHTML = `<strong>Lobby:</strong> ${res.clients} / 2`;
        });
    }

    function gameMap() {
        clients = sendXMLHttpRequest('/lobby/gameboard');
        clients.addEventListener("load", function() {
            res = JSON.parse(this.responseText);
            if (res.gameboard == null) {
                lobby.style.display = "none";
                gameLobby.innerHTML = "<h4>Waiting for one more player</h4>";
                outputLog("<strong>Server:</strong> Waiting for one more player");
            } else {
                lobby.style.display = "none";
                gameLobby.innerHTML = res.gameboard;
            }
        });
    }
})();
