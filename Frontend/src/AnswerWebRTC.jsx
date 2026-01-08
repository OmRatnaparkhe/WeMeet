const onAnswer = (offer)=>{
    console.log("onAnswer invoked");
    setCallButtonDisabled(true);
    setHangupButtonDisabled(false);

    if(localStream.getVideoTracks().length > 0){
        console.log(`Using video device ,${localStream.getVideoTracks()[0].label}`)
    }

    if(localStream.getAudioTracks().length > 0){
        console.log(`Using audio device ,${localStream.getAudioTracks()[0].label}`)
    }

    localPeerConnection = new RTCPeerConnection(servers);
    localPeerConnection.onicecandidate = gotLocalIceCandidateAnswer;
    localPeerConnection.onaddstream = gotRemoteStream;
    localPeerConnection.addStream(localStream);
    localPeerConnection.setRemoteDescription(offer);
    localPeerConnection.createAnswer().then(gotAnswerDescription);
}

const gotRemoteStream = (event)=>{
    console.log("gotRemoteStream invoked");
    const remotePlayer = document.getElementById('peerPlayer');
    remotePlayer.srcObject = event.stream;
}

const gotAnswerDescription = (answer)=>{
    console.log("gotAnswerDescription invoked ",answer);
    localPeerConnection.setLocalDescription(answer);
}

const gotLocalIceCandidateAnswer = (event)=>{
    console.log("gotLocalIceCandidateAnswer invoked ",event.candidate, localPeerConnection.localDescription);
    if(!event.candidate){
        const answer = localPeerConnection.localDescription;
        sendWsMessage('send_answer',{
            channelName,
            userId,
            sdp:answer
        })
    }
}