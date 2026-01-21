import { useEffect, useRef, useCallback, useState } from "react";
import setUpDevice from "./setUpDevice";

const URL_WEB_SOCKET = "wss://wemeet-onrq.onrender.com";

export const useWebRTC = ({ userId, channelName, onChatReceived }) => {
    const [activeScreenStream, setActiveScreenStream] = useState(null);
    const ws = useRef(null);
    const mediaRecorder = useRef(null);
    const recordedChunks = useRef([]);
    const streamReadyPromise = useRef(null);
    const datachannel = useRef(null);
    const screenSender = useRef(null); 
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
        console.log("Mic enabled : ", micEnabled.current);
    }, []);

    const toggleCam = useCallback(() => {
        if (!localStream.current) return;
        const camTrack = localStream.current.getVideoTracks()[0];
        camEnabled.current = !camEnabled.current;
        camTrack.enabled = camEnabled.current;
        console.log("Cam enabled : ", camEnabled.current);
    }, []);

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
        if (!datachannel.current || datachannel.current.readyState !== "open") {
            console.warn("Chat not ready yet");
            return;
        }
        datachannel.current.send(JSON.stringify({ from: userId, text }));
    }, [userId]);

    const renegotiate = async () => {
        try {
            const offer = await localPeerConnection.current.createOffer();
            await localPeerConnection.current.setLocalDescription(offer);
            sendWsMessage("send_offer", { channelName, userId, sdp: offer });
        } catch (err) {
            console.error("Renegotiation failed", err);
        }
    };

    const startCall = useCallback(async () => {
        if (localPeerConnection.current) return;
        if (!localStream.current) await streamReadyPromise.current;

        localPeerConnection.current = new RTCPeerConnection(servers);
        
        datachannel.current = localPeerConnection.current.createDataChannel("chat");
        datachannel.current.onmessage = (event) => onChatReceived?.(JSON.parse(event.data));

        localStream.current.getTracks().forEach((track) => {
            localPeerConnection.current.addTrack(track, localStream.current);
        });

        localPeerConnection.current.ontrack = (event) => {
            const stream = event.streams[0];
            const track = event.track;

            if (track.kind === "video") {
                const peerCam = document.getElementById("peerPlayer");
                if (!peerCam.srcObject || peerCam.srcObject.id === stream.id) {
                    peerCam.srcObject = stream;
                } else {
                    console.log("Remote Screen Share Detected");
                    setActiveScreenStream(stream); 
                }
            } else if (track.kind === "audio") {
                const peerCam = document.getElementById("peerPlayer");
                if(peerCam) peerCam.srcObject = stream;
            }

            track.onended = () => {
                if (activeScreenStream && activeScreenStream.id === stream.id) {
                    setActiveScreenStream(null);
                }
            };
        };

        localPeerConnection.current.onicecandidate = (e) => {
            if (e.candidate) sendWsMessage("send_ice_candidate", { channelName, userId, candidate: e.candidate });
        };

        const offer = await localPeerConnection.current.createOffer();
        await localPeerConnection.current.setLocalDescription(offer);
        sendWsMessage("send_offer", { channelName, userId, sdp: offer });
    }, [channelName, userId, sendWsMessage, servers]); 

    const leaveCall = useCallback(() => {
        if (localStream.current) {
            localStream.current.getTracks().forEach(track => track.stop());
            localStream.current = null;
        }
        if (localPeerConnection.current) {
            localPeerConnection.current.close();
            localPeerConnection.current = null;
        }
        sendWsMessage('quit', { channelName, userId });
        window.location.reload(); 
    }, [channelName, userId, sendWsMessage]);

   const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
            const screenTrack = screenStream.getVideoTracks()[0];

            setActiveScreenStream(screenStream); 

            if (localPeerConnection.current) {
                if(screenSender.current) {
                    await screenSender.current.replaceTrack(screenTrack);
                } else {
                    screenSender.current = localPeerConnection.current.addTrack(screenTrack, screenStream);
                    const offer = await localPeerConnection.current.createOffer();
                    await localPeerConnection.current.setLocalDescription(offer);
                    sendWsMessage("send_offer", { channelName, userId, sdp: offer });
                }
            }

            screenTrack.onended = async () => {
                setActiveScreenStream(null);

                if (localPeerConnection.current && screenSender.current) {
                    localPeerConnection.current.removeTrack(screenSender.current);
                    screenSender.current = null;
                    
                    const offer = await localPeerConnection.current.createOffer();
                    await localPeerConnection.current.setLocalDescription(offer);
                    sendWsMessage("send_offer", { channelName, userId, sdp: offer });
                }
            };

        } catch (err) {
            console.error("Screen share failed", err);
        }
    };

    const startRecording = async () => {
        if (!localStream.current) return;
        recordedChunks.current = [];
        mediaRecorder.current = new MediaRecorder(localStream.current, { mimeType: "video/webm; codecs=vp9, opus" });
        mediaRecorder.current.ondataavailable = (event) => {
            if (event.data.size > 0) recordedChunks.current.push(event.data);
        };
        mediaRecorder.current.start();
    };

    const stopRecording = async () => {
        if (!mediaRecorder.current) return;
        return new Promise(resolve => {
            mediaRecorder.current.onstop = () => {
                const blob = new Blob(recordedChunks.current, { type: "video/webm" });
                resolve(blob);
            };
            mediaRecorder.current.stop();
        });
    };

    useEffect(() => {
        const wsClient = new WebSocket(URL_WEB_SOCKET);

        wsClient.onopen = () => {
            ws.current = wsClient;
            isSocketReady.current = true;
            if (userId && channelName) joinChannel();
        };

        wsClient.onmessage = async (message) => {
            const parsedMessage = JSON.parse(message.data);

            switch (parsedMessage.type) {
                case "joined": {
                    const userIds = parsedMessage.body;
                    if (userIds.length === 2 && userId === userIds.sort()[0]) {
                        setTimeout(() => startCall(), 0);
                    }
                    break;
                }
                case "quit": {
                    if (localPeerConnection.current) {
                        localPeerConnection.current.close();
                        localPeerConnection.current = null;
                    }
                    
                    ["peerPlayer", "peerScreenPlayer"].forEach(id => {
                        const el = document.getElementById(id);
                        if(el) el.srcObject = null;
                    });
                    break;
                }
                case "chat_received": {
                    if (onChatReceived) onChatReceived({ from: parsedMessage.body.userId, text: parsedMessage.body.message });
                    break;
                }
                case "offer_sdp_received": {
                    if (!localPeerConnection.current) {
                        localPeerConnection.current = new RTCPeerConnection(servers);
                        localPeerConnection.current.ontrack = (event) => {
                            const stream = event.streams[0];
                            const track = event.track;
                            const peerCam = document.getElementById("peerPlayer");
                            const peerScreen = document.getElementById("peerScreenPlayer");
                            
                            if (track.kind === "video") {
                                if (!peerCam.srcObject || peerCam.srcObject.id === stream.id) {
                                    peerCam.srcObject = stream;
                                } else if (peerScreen) {
                                    peerScreen.srcObject = stream;
                                    peerScreen.style.display = "block";
                                }
                            }
                            track.onended = () => {
                                if (peerScreen && peerScreen.srcObject && peerScreen.srcObject.id === stream.id) {
                                    peerScreen.srcObject = null;
                                    peerScreen.style.display = "none";
                                }
                            };
                        };
                        localPeerConnection.current.onicecandidate = (e) => {
                            if (e.candidate) sendWsMessage("send_ice_candidate", { channelName, userId, candidate: e.candidate });
                        }
                    }

                    await localPeerConnection.current.setRemoteDescription(parsedMessage.body);
                    const answer = await localPeerConnection.current.createAnswer();
                    await localPeerConnection.current.setLocalDescription(answer);
                    sendWsMessage("send_answer", { channelName, userId, sdp: answer });
                    break;
                }
                case "answer_sdp_received": {
                    await localPeerConnection.current.setRemoteDescription(parsedMessage.body);
                    break;
                }
                case "ice_candidate_received": {
                    if (localPeerConnection.current) {
                        await localPeerConnection.current.addIceCandidate(parsedMessage.body);
                    }
                    break;
                }
            }
        };
        return () => wsClient.close();
    }, []);

    return { joinChannel, sendChatMessage, startCall, leaveCall, toggleCam, toggleMic, startScreenShare, startRecording, stopRecording, activeScreenStream};
};