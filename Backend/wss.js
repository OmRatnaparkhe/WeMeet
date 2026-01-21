import createDebug from "debug";
import { WebSocketServer } from "ws";

const debug = createDebug(`${process.env.APPNAME}:wss`);
let channels = {};
function init(server) {
    debug("ws init invoked");
    
    const wss = new WebSocketServer({ server });

    wss.on("connection", (socket) => {
        debug("A client has connected");
        socket.on('error', console.error); 
        socket.on('message', (message) => onMessage(wss, socket, message));
        socket.on('close', (message) => onClose(wss, socket, message));
    });
}

function send(wsClient, type, body) {
    debug('ws send', body);
    if (wsClient.readyState === 1) { 
        wsClient.send(JSON.stringify({ type, body }));
    }
}

function clearClient(wss, socket) {
    Object.keys(channels).forEach((cname) => {
        Object.keys(channels[cname]).forEach((uid) => {
            if (channels[cname][uid] === socket) {
                delete channels[cname][uid];
            }
        });
        if (Object.keys(channels[cname]).length === 0) {
            delete channels[cname];
        }
    });
}

function onMessage(wss, socket, message) {
    try {
        const parsedMessage = JSON.parse(message);
        const body = parsedMessage.body || {};
        const type = parsedMessage.type;
        const channelName = body.channelName;
        const userId = body.userId;

        if (!channelName) return; 

        switch (type) {
            case 'join': {
                if (!channels[channelName]) {
                    channels[channelName] = {};
                }
                channels[channelName][userId] = socket;

                const userIds = Object.keys(channels[channelName]);
                userIds.forEach(id => {
                    const clientSocket = channels[channelName][id];
                    send(clientSocket, "joined", userIds);
                });
                break;
            }

            case "quit": {
                if (channels[channelName]) {
                    delete channels[channelName][userId];
                    const userIds = Object.keys(channels[channelName]);
                    userIds.forEach(id => {
                        const clientSocket = channels[channelName][id];
                        send(clientSocket, "user_left", userId); 
                    });
                    if (userIds.length === 0) {
                        delete channels[channelName];
                    }
                }
                break;
            }

            case "send_offer": {
                const sdp = body.sdp;
                Object.keys(channels[channelName] || {}).forEach(id => {
                    if (userId.toString() !== id.toString()) {
                        send(channels[channelName][id], "offer_sdp_received", sdp);
                    }
                });
                break;
            }

            case "send_answer": {
                const sdp = body.sdp;
                Object.keys(channels[channelName] || {}).forEach(id => {
                    if (userId.toString() !== id.toString()) {
                        send(channels[channelName][id], "answer_sdp_received", sdp);
                    }
                });
                break;
            }

            case "send_ice_candidate": {
                const candidate = body.candidate;
                Object.keys(channels[channelName] || {}).forEach(id => {
                    if (userId.toString() !== id.toString()) {
                        send(channels[channelName][id], "ice_candidate_received", candidate);
                    }
                });
                break;
            }

            default:
                break;
        }
    } catch (err) {
        debug("Error processing message:", err);
    }
}

function onClose(wss, socket, message) {
    debug("onClose", message);
    clearClient(wss, socket);
}

export default { init };