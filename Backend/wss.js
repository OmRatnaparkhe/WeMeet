import createDebug from "debug"
import { WebSocketServer } from "ws";
const debug = createDebug(`${process.env.APPNAME}:wss`);
let channels = {};

function init(port) {
    debug("ws init invoked : ", port);
    const wss = new WebSocketServer({ port })
    wss.on("connection", (socket) => {
        debug("A client has connected");
        socket.on('error', debug);
        socket.on('message', (message) => onMessage(wss, socket, message));
        socket.on('close', message => onClose(wss, socket, message));
    });

};

export default {
    init
}
function send(wsClient, type, body) {
    debug('ws send', body);
    wsClient.send(JSON.stringify({
        type,
        body
    }))
};

function clearClient(wss, socket) {
    Object.keys(channels).forEach((cname) => {
        Object.keys(channels[cname]).forEach((uid) => {
            if (channels[cname][uid] === socket) {
                delete channels[cname][uid];
            }
        })
    })
}

function onMessage(wss, socket, message) {
    const parsedMessage = JSON.parse(message);
    const body = parsedMessage.body;
    const type = parsedMessage.type;
    const channelName = body.channelName;
    const userId = body.userId;

    switch (type) {
        case 'join': {
            if (channels[channelName]) {
                channels[channelName][userId] = socket;
            }
            else {
                channels[channelName] = {};
                channels[channelName][userId] = socket;
            }

            const userIds = Object.keys(channels[channelName]);
            userIds.forEach(id => {
                const clientSocket = channels[channelName][id];
                if(clientSocket.readyState === 1){
                    send(clientSocket, "joined",userIds);
                }
            })
            break;
        }

        case "quit": {
            if (channels[channelName]) {
                delete channels[channelName][userId]
                const userIds = Object.keys(channels[channelName]);
                if (userIds.length === 0) {
                    delete channels[channelName]
                }
            }
            break;
        }

        case "send_offer": {
            const sdp = body.sdp;
            let userIds = Object.keys(channels[channelName]);
            userIds.forEach(id => {
                if (userId.toString() !== id.toString()) {
                    const wsClient = channels[channelName][id];
                    send(wsClient, "offer_sdp_received", sdp);
                }
            });
            break;
        }

        case "send_answer": {
            const sdp = body.sdp
            let userIds = Object.keys(channels[channelName]);
            userIds.forEach(id => {
                if (userId.toString() !== id.toString()) {
                    const wsClient = channels[channelName][id];
                    send(wsClient, "answer_sdp_received", sdp);
                }
            });
            break;
        }

        case "send_ice_candidate": {
            const candidate = body.candidate;
            let userIds = Object.keys(channels[channelName]);
            userIds.forEach(id => {
                if (userId.toString() !== id.toString()) {
                    const wsClient = channels[channelName][id];
                    send(wsClient, "ice_candidate_received", candidate);
                }
            });
            break;
        }
        
        default:
            break;
    }
}

function onClose(wss, socket, message) {
    debug("onClose", message);
    clearClient(wss, socket);
}

