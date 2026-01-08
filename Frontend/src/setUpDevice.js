let localStream;

const constraints = {
    video:{
        width : { ideal : 1280 },
        height : { ideal : 720 },
        framerate : { ideal : 30 }
    }
}

const setUpDevice = async()=>{
    console.log("Setup invoked");
    try{
        const stream = await navigator.mediaDevices.getUserMedia({
            audio : true,
            video : true,
            constraints
        });
        const localPlayer = document.getElementById('localPlayer');
        localPlayer.muted = true;
        localPlayer.srcObject = stream;
        localStream = stream;
        return localStream;
    }
    catch(e){
        console.error("Error accessing media devices : ",e);
    }
}

export default setUpDevice;