import { useEffect, useRef, useCallback } from "react";
import setUpDevice from "./setUpDevice";

const URL_WEB_SOCKET = "ws://localhost:8090";

export const useWebRTC = ({ userId, channelName, onChatReceived }) => {
    const ws = useRef(null);
    const streamReadyPromise = useRef(null);
    const datachannel = useRef(null);
    const videoSender = useRef(null);
    const micEnabled = useRef(true);
    const camEnabled = useRef(true);
    const localPeerConnection = useRef(null);
    const localStream = useRef(null);
    const isSocketReady = useRef(false);
    const servers = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    const toggleMic = useCallback(() => {
        if (!localStream.current) return;
        const audioTrack = localStream.current.getAudioTracks()[0];
        micEnabled.current = !micEnabled.current;
        audioTrack.enabled = micEnabled.current;

        console.log("Mic enabled : ", micEnabled.current)
    }, [])

    const toggleCam = useCallback(() => {
        if (!localStream.current) return;
        const camTrack = localStream.current.getVideoTracks()[0];
        camEnabled.current = !camEnabled.current;
        camTrack.enabled = camEnabled.current;
        console.log("Cam enabled : ", camEnabled.current);
    }, [])

    const sendWsMessage = useCallback((type, body) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type, body }));
        }
    }, []);

    const joinChannel = useCallback(async () => {
        if (!userId || !channelName) return;
        if (!localStream.current) {
            streamReadyPromise.current = setUpDevice().then(stream => {
                localStream.current = stream;
                return stream;
            });
        }
        sendWsMessage("join", { channelName, userId });
    }, [userId, channelName, sendWsMessage]);

    const sendChatMessage = useCallback((text) => {
        if (
            !datachannel.current ||
            datachannel.current.readyState !== "open"
        ) {
            console.warn("Chat not ready yet");
            return;
        }

        datachannel.current.send(
            JSON.stringify({ from: userId, text })
        );
    }, [userId]);



    const startCall = useCallback(async () => {
        if (localPeerConnection.current) return;

        if (!localStream.current) {
            console.log("Camera not ready yet, retrying...");
            await streamReadyPromise.current;
        }

        localPeerConnection.current = new RTCPeerConnection(servers);
        datachannel.current = localPeerConnection.current.createDataChannel("chat");
        datachannel.current.onopen = () => {
            console.log("Datachannel started...");
        }

        datachannel.current.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            onChatReceived?.(msg)
        }
        localStream.current.getTracks().forEach((track) => {
            if (track.kind === "video") {
                videoSender.current = localPeerConnection.current.addTrack(track, localStream.current);
            }
            else {
                localPeerConnection.current.addTrack(track, localStream.current);
            }
        });

        localPeerConnection.current.ontrack = (event) => {
            const videoEl = document.getElementById("peerPlayer");
            if (videoEl) videoEl.srcObject = event.streams[0];
        };

        localPeerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                sendWsMessage("send_ice_candidate", {
                    channelName,
                    userId,
                    candidate: event.candidate,
                });
            }
        };




        const offer = await localPeerConnection.current.createOffer();
        await localPeerConnection.current.setLocalDescription(offer);

        sendWsMessage("send_offer", { channelName, userId, sdp: offer });
    }, [channelName, userId, sendWsMessage, servers]);

    const leaveCall = useCallback(() => {
        console.log("Leaving call...");

        if (localStream.current) {
            localStream.current.getTracks().forEach(track => track.stop());
            localStream.current = null;
        }

        if (localPeerConnection.current) {
            localPeerConnection.current.ontrack = null;
            localPeerConnection.current.onicecandidate = null;
            localPeerConnection.current.close();
            localPeerConnection.current = null;
        }

        const remoteVideo = document.getElementById('peerPlayer');
        if (remoteVideo) {
            remoteVideo.srcObject = null;
        }

        sendWsMessage('quit', { channelName, userId });
    }, [channelName, userId, sendWsMessage])

    const startScreenShare = async () => {
        if (!videoSender.current) return;

        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false
        })

        const screenTrack = screenStream.getVideoTracks()[0];

        await videoSender.current.replaceTrack(screenTrack);

        screenTrack.onended = async () => {
            const camTrack = localStream.current.getVideoTracks()[0];
            videoSender.current.replaceTrack(camTrack);
        };
    };

    useEffect(() => {
        const wsClient = new WebSocket(URL_WEB_SOCKET);

        wsClient.onopen = () => {
            console.log("wsClient opened");
            ws.current = wsClient;
            isSocketReady.current = true;

            if (userId && channelName) {
                joinChannel();
            }
        };

        wsClient.onmessage = async (message) => {
            const parsedMessage = JSON.parse(message.data);

            switch (parsedMessage.type) {
                case "joined": {
                    const userIds = parsedMessage.body;
                    console.log("Users joined : ", userIds);

                    if (userIds.length === 2) {
                        const sorted = [...userIds].sort();
                        const callerId = sorted[0];
                        if (userId === callerId) {
                            console.log("I am caller — auto starting call")
                            setTimeout(() => startCall(), 0)
                        }
                    }

                    break;
                }

                case "quit": {
                    console.log("Remote user left");

                    if (localPeerConnection.current) {
                        localPeerConnection.current.close();
                        localPeerConnection.current = null;
                    }

                    const remoteVideo = document.getElementById('peerPlayer');
                    if (remoteVideo) remoteVideo.srcObject = null;
                    break;
                }

                case "chat_received": {
                    const { userId: fromUser, message } = parsedMessage.body;
                    if (onChatReceived) {
                        onChatReceived({ from: fromUser, text: message });
                    }
                    break;
                }

                case "offer_sdp_received": {
                    const offer = parsedMessage.body;

                    if (!localStream.current) {
                        localStream.current = await setUpDevice();
                    }
                    if (!localPeerConnection.current) {
                        localPeerConnection.current = new RTCPeerConnection(servers);

                        localStream.current.getTracks().forEach(track => {
                            if (track.kind === "video") {
                                videoSender.current = localPeerConnection.current.addTrack(track, localStream.current);
                            }
                            else {
                                localPeerConnection.current.addTrack(track, localStream.current);
                            }
                        });

                        localPeerConnection.current.ondatachannel = (event) => {
                            datachannel.current = event.channel;

                            datachannel.current.onmessage = (event) => {
                                const msg = JSON.parse(event.data);
                                onChatReceived?.(msg);
                            }
                        }

                        localPeerConnection.current.ontrack = (event) => {
                            const videoEl = document.getElementById("peerPlayer");
                            if (videoEl) videoEl.srcObject = event.streams[0];
                        };

                        localPeerConnection.current.onicecandidate = (event) => {
                            if (event.candidate) {
                                sendWsMessage("send_ice_candidate", {
                                    channelName,
                                    userId,
                                    candidate: event.candidate,
                                });
                            }
                        };
                    }

                    await localPeerConnection.current.setRemoteDescription(offer);

                    const answer = await localPeerConnection.current.createAnswer();
                    await localPeerConnection.current.setLocalDescription(answer);

                    sendWsMessage("send_answer", { channelName, userId, sdp: answer });
                    break;
                }

                case "answer_sdp_received": {
                    const answer = parsedMessage.body;
                    await localPeerConnection.current.setRemoteDescription(answer);
                    break;
                }

                case "ice_candidate_received": {
                    const candidate = parsedMessage.body;
                    if (localPeerConnection.current) {
                        await localPeerConnection.current.addIceCandidate(candidate);
                    }
                    break;
                }
                default:
                    break;
            }
        };

        return () => {
            wsClient.close();
        };
    }, []);

    return {
        joinChannel,
        sendChatMessage,
        startCall,
        leaveCall,
        toggleCam,
        toggleMic,
        startScreenShare
    };
};