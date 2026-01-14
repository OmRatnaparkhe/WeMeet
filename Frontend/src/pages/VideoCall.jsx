import { useState } from "react";
import { Menu, MenuItem } from "../components/ui/navbar-menu.tsx";
import { useLocation } from "react-router-dom";
import { ChatPanel } from "./ChatPanel.jsx";
import { useUser } from "@clerk/clerk-react";
import { useWebRTC } from "../WebRTCClient.jsx"

export function WeMeet() {
  const { user } = useUser();
  const userId = user?.id;
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();

  const { name, roomId, micOn, camOn } = location.state || {};

  const { sendChatMessage, leaveCall, joinChannel, toggleCam, toggleMic, startScreenShare } = useWebRTC({
    userId,
    channelName: roomId,
    onChatReceived: (msg) => {
      setMessages((prev) => [...prev, msg]);
    },
  });

  const handleSendChat = (text) => {
    setMessages((prev) => [...prev, { from: "me", text }]);
    sendChatMessage(text);
  };


  return (
    <div className="min-w-screen min-h-screen bg-neutral-950 text-white flex flex-col">
      <header className="h-14 flex items-center justify-between px-6 border-b border-white/10">
        <h1 className="font-semibold tracking-wide">
          {name || "Meeting"}: {roomId}{" "}
        </h1>
        <span className="text-sm text-white/60">
          Mic: {micOn ? "On" : "Off"} | Cam: {camOn ? "On" : "Off"}
        </span>
      </header>

      <main className="flex-1 flex gap-4 p-6">
        <div className="flex-1 bg-black rounded-xl border border-white/10 flex items-center justify-center">
          <video
            id="peerPlayer"
            muted
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <div className="w-[260px] flex flex-col gap-4">
          <div className="bg-black rounded-xl border border-white/10 h-[160px]">
            <video
              id="localPlayer"
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="bg-white/5 rounded-xl border border-white/10 flex-1 flex items-center justify-center text-sm text-white/50">
            Waiting for others…
          </div>

        </div>
      </main>

      
      <footer className="h-24 flex items-center justify-center">
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Audio">
            <div
              onClick={toggleMic}
              className="px-4 py-2 rounded-lg text-sm cursor-pointer text-white/80 bg-white/5"
            >
              Toggle Mic
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Video">
            <div
              onClick={toggleCam}
              className="px-4 py-2 rounded-lg text-sm cursor-pointer text-white/80 bg-white/5"
            >
              Toggle Camera
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Screen">
            <div
              onClick={startScreenShare}
              className="px-4 py-2 rounded-lg text-sm cursor-pointer text-white/80 bg-white/5"
            >
              Share Screen
            </div>
          </MenuItem>

          <button onClick={() => setChatOpen(!chatOpen)}>Chat</button>
          <MenuItem setActive={setActive} active={active} item="Hangup">
            <div
              onClick={leaveCall}
              className="px-4 py-2 rounded-lg text-sm text-red-400 bg-red-500/10 cursor-pointer"
            >
              Leave meeting
            </div>
          </MenuItem>
        </Menu>


      </footer>
      <ChatPanel
        open={chatOpen}
        onSend={handleSendChat}
        messages={messages}
      />
    </div>
  );
}

function ControlHint({ label, danger = false }) {
  return (
    <div
      className={`px-4 py-2 rounded-lg text-sm ${danger ? "text-red-400 bg-red-500/10" : "text-white/80 bg-white/5"
        }`}
    >
      {label}
    </div>
  );
}