import { useEffect, useState, useRef } from "react";
import { Menu } from "../components/ui/navbar-menu.tsx";
import { useLocation, useParams } from "react-router-dom";
import { ChatPanel } from "./ChatPanel.jsx";
import { useUser } from "@clerk/clerk-react";
import { useWebRTC } from "../WebRTCClient.jsx";
import axios from "axios";
import {  Copy } from "lucide-react"; 

export function WeMeet() {
  const { user } = useUser();
  const userId = user?.id;
  const { roomId: paramRoomId } = useParams();
  const location = useLocation();
  const state = location.state || {};
  const roomId = state.roomId || paramRoomId;
  const name = state.name || "Live Studio";
  
  const BE_URL = import.meta.env.VITE_BE_API_PROD || "http://localhost:4000/api";
  
  const [recordingId, setRecordingId] = useState("");
  const [recordingStartedAt, setRecordingStartedAt] = useState(null);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const screenPlayerRef = useRef(null);

  const { 
    sendChatMessage, leaveCall, toggleCam, toggleMic, 
    startScreenShare, startRecording, stopRecording, 
    activeScreenStream 
  } = useWebRTC({
    userId,
    channelName: roomId,
    onChatReceived: (msg) => setMessages((prev) => [...prev, msg]),
  });

  const handleSendChat = (text) => {
    setMessages((prev) => [...prev, { from: "me", text }]);
    sendChatMessage(text);
  };

  useEffect(() => {
    if (activeScreenStream && screenPlayerRef.current) {
        screenPlayerRef.current.srcObject = activeScreenStream;
    }
  }, [activeScreenStream]);

  
  useEffect(() => {
    if (!userId || !roomId) return;
    axios.post(`${BE_URL}/meetings/${roomId}/join`, 
      { name: user?.fullName || "Guest", email: user?.primaryEmailAddress?.emailAddress || "guest@example.com" },
      { headers: { "x-clerk-id": userId } }
    ).catch(console.error);
  }, [roomId, userId, user]);

  const leaveMeeting = async () => {
    try {
        await axios.post(`${BE_URL}/meetings/${roomId}/leave`, {}, { headers: { "x-clerk-id": userId } });
        leaveCall();
        window.location.href = "/dashboard";
    } catch (err) { console.error(err); }
  };

  const startrecording = async() => {
    try {
        const res = await axios.post(`${BE_URL}/recordings/start`, { roomId, clerkId:userId, type:"LOCAL" });
        startRecording();
        setRecordingId(res.data.id);
        setRecordingStartedAt(Date.now());
    } catch(err) { console.error(err); }
  };

  const stoprecording = async() => {
    const durationSec = Math.floor((Date.now() - recordingStartedAt)/1000);
    await axios.post(`${BE_URL}/recordings/stop`, { recordingId, durationSec, fileKey:"local-only" });
    stopRecording();
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Copied!");
  }

  return (
    <div className="fixed inset-0 bg-neutral-950 text-white flex flex-col overflow-hidden">
      
      <header className="h-14 md:h-16 flex-none flex items-center justify-between px-4 md:px-6 border-b border-white/10 bg-neutral-900/50 backdrop-blur-md z-50">
        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
          <div className="bg-red-600 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full animate-pulse flex-none"></div>
          <div className="flex flex-col">
              <h1 className="font-semibold text-sm md:text-lg tracking-wide truncate max-w-[120px] md:max-w-none">{name}</h1>
              <span className="text-[10px] text-white/40 font-mono hidden sm:block">{roomId.slice(0,8)}...</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button onClick={copyInvite} className="md:bg-white/10 md:hover:bg-white/20 p-2 md:px-3 md:py-1.5 rounded-lg transition flex items-center gap-2">
                <Copy className="w-4 h-4" />
                <span className="hidden md:inline text-sm">Invite</span>
            </button>
        </div>
      </header>

      <main className="flex-1 flex gap-4 p-2 md:p-4 relative min-h-0">
        
        <div className="relative w-full h-full bg-black rounded-xl md:rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group touch-none">
            
            {activeScreenStream && (
                <video
                    ref={screenPlayerRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-contain bg-neutral-900 z-20" 
                />
            )}

            <video
                id="peerPlayer"
                autoPlay
                playsInline
                className={`transition-all duration-300 ${
                    activeScreenStream 
                    ? "absolute bottom-4 right-4 w-32 h-24 md:w-52 md:h-36 rounded-lg md:rounded-xl border border-white/20 shadow-2xl z-40 object-cover" 
                    : "w-full h-full object-cover z-10"
                }`} 
            />
            
            <div className="absolute top-4 right-4 w-28 h-36 md:w-58 md:h-40 bg-neutral-900 rounded-lg md:rounded-xl border border-white/20 overflow-hidden shadow-2xl z-50 hover:scale-105 transition-transform">
                <video
                    id="localPlayer"
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover transform -scale-x-100" 
                />
                <div className="absolute bottom-1.5 left-1.5 md:bottom-2 md:left-2 bg-black/60 px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-medium backdrop-blur-sm">
                    You
                </div>
            </div>

            {!activeScreenStream && (
                <div className="absolute bottom-6 left-6 bg-black/40 border border-white/5 px-4 py-1.5 rounded-full text-sm backdrop-blur-md z-30 pointer-events-none text-white/60 hidden md:block">
                    Main Stage
                </div>
            )}
        </div>
      </main>

      <footer className="h-20 md:h-24 flex-none flex items-center justify-center pb-safe-area">
        <Menu setActive={setActive}>
            <div className="flex items-center gap-1 md:gap-2 bg-neutral-900/90 border border-white/10 p-2 md:p-3 rounded-2xl shadow-xl overflow-x-auto max-w-[95vw] no-scrollbar">
                
                <TooltipButton onClick={toggleMic} icon="🎤" label="Mic" />
                <TooltipButton onClick={toggleCam} icon="📷" label="Cam" />
                <TooltipButton onClick={startScreenShare} icon="🖥️" label="Share" />
                <TooltipButton onClick={() => setChatOpen(true)} icon="💬" label="Chat" />
                
                <div className="w-[1px] h-6 md:h-8 bg-white/10 mx-1 md:mx-2 flex-none"></div>
                
                {!recordingStartedAt ? (
                    <button onClick={startrecording} className="bg-red-600 active:bg-red-700 text-white px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap">
                        <div className="w-2 h-2 bg-white rounded-full"></div> <span className="hidden sm:inline">Record</span>
                    </button>
                ) : (
                    <button onClick={stoprecording} className="bg-neutral-800 text-red-500 border border-red-500/30 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition animate-pulse whitespace-nowrap">
                        Stop
                    </button>
                )}

                <button onClick={leaveMeeting} className="ml-1 md:ml-2 bg-red-500/10 active:bg-red-500/20 text-red-500 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition whitespace-nowrap">
                    Leave
                </button>
            </div>
        </Menu>
      </footer>
      
      <ChatPanel 
        open={chatOpen} 
        onClose={() => setChatOpen(false)}
        onSend={handleSendChat} 
        messages={messages} 
      />
    </div>
  );
}

function TooltipButton({ onClick, icon, label }) {
    return (
        <button 
            onClick={onClick} 
            className="w-10 h-10 md:w-12 md:h-12 flex-none flex items-center justify-center rounded-xl active:bg-white/10 hover:bg-white/5 transition text-lg md:text-xl" 
            title={label}
        >
            {icon}
        </button>
    )
}