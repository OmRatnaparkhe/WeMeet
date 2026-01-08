import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useRef } from "react";
import setUpDevice from "./setUpDevice"

const URL_WEB_SOCKET = 'ws://localhost:8090';

export const WebRTC = forwardRef(function WebRTC({userId,channelName}, ref)  {
    const ws = useRef(null);
    let localPeerConnection;
    let localStream;

    const servers = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    }

    useImperativeHandle(ref,()=>({
            joinChannel,
        }));


    useEffect(() => {
        const wsClient = new WebSocket(URL_WEB_SOCKET);
        wsClient.onopen = async () => {
            
            console.log("wsClient opened!");
            ws.current = wsClient;
            
        };

        

        

        const onAnswer = (offer) => {
            console.log("onAnswer invoked");
            setCallButtonDisabled(true);
            setHangupButtonDisabled(false);

            if (localStream.getVideoTracks().length > 0) {
                console.log(`Using video device ,${localStream.getVideoTracks()[0].label}`)
            }

            if (localStream.getAudioTracks().length > 0) {
                console.log(`Using audio device ,${localStream.getAudioTracks()[0].label}`)
            }

            localPeerConnection = new RTCPeerConnection(servers);
            localPeerConnection.onicecandidate = gotLocalIceCandidateAnswer;
            localPeerConnection.onaddstream = gotRemoteStream;
            localPeerConnection.addStream(localStream);
            localPeerConnection.setRemoteDescription(offer);
            localPeerConnection.createAnswer().then(gotAnswerDescription);
        }

        const gotRemoteStream = (event) => {
            console.log("gotRemoteStream invoked");
            const remotePlayer = document.getElementById("peerPlayer");
            remotePlayer.srcObject = event.stream;
        };

        const gotLocalIceCandidateAnswer = (event) => {
            if (!event.candidate) {
                sendWsMessage("send_answer", {
                    channelName,
                    userId,
                    sdp: localPeerConnection.localDescription,
                });
            }
        };
        wsClient.onclose = () => console.log("ws closed");

        wsClient.onmessage = (message) => {
            console.log("ws message received ", message.data);
            const parsedMessage = JSON.parse(message.data);

            switch (parsedMessage.type) {
                case "joined": {
                    const body = parsedMessage.body;
                    console.log("user joined the room");
                    break;
                }
                case "quit": {
                    break;
                }
                case "offer_sdp_received": {
                    const offer = parsedMessage.body;
                    onAnswer(offer)
                    break;
                }

                case "answer_sdp_received": {
                    gotRemoteDescription(parsedMessage.body);
                    break;
                }

                default:
                    break;
            }
        }
        return () => {
            wsClient.close();
        }
    }, []);

    const joinChannel = async()=>{
            if(!userId || !channelName){
                console.warn("userId or channelName is missing!!");
                return;
            }
            await setUpDevice();

            sendWsMessage("join",{
                channelName,
                userId
            })
        }

    const sendWsMessage = (type, body) => {
        console.log('sendWsMessage invoked ', type, body);
        ws.current.send(JSON.stringify({
            type,
            body
        }))
    }
    return null;
})