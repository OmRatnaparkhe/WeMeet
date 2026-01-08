import { useState } from "react";
import {Menu, MenuItem} from "../components/ui/navbar-menu.tsx"
import { useParams } from "react-router-dom";
export function WeMeet() {
    const [active,setActive] = useState(null);
    const {roomId} = useParams();
    return <div className="w-screen h-screen bg-neutral-950 text-white flex flex-col">

        {/*Header*/}
        <header className="h-14 flex items-center justify-between px-6 border-b border-white/10">
        <h1 className="font-semibold traking-wide">WeMeet • Room: {roomId} </h1>
        <span className="text-sm text-white/60">● Live</span>
        </header>

        {/* Video Area */}
        <main className="flex-1 flex gap-4 p-6">

        {/* Main video */}
            <div className="flex-1 bg-black rounded-xl border border-white/10 flex items-center justify-center">
          <video
            id="peerPlayer"
            autoPlay
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Side thumbnails */}
        <div className="w-[260px] flex flex-col gap-4">
          <div className="bg-black rounded-xl border border-white/10 h-[160px]">
            <video
              id="localPlayer"
              autoPlay
              muted
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Future: participants */}
          <div className="bg-white/5 rounded-xl border border-white/10 flex-1 flex items-center justify-center text-sm text-white/50">
            Waiting for others…
          </div>
        </div>
           </main>

           {/* Control Bar */}
      <footer className="h-24 flex items-center justify-center">
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Audio">
            <ControlHint label="Mute / Unmute microphone" />
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Video">
            <ControlHint label="Toggle camera" />
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Screen">
            <ControlHint label="Share screen" />
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Chat">
            <ControlHint label="Open chat panel" />
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Hangup">
            <ControlHint label="Leave meeting" danger />
          </MenuItem>
        </Menu>
      </footer>
       
    </div>
}

function ControlHint({ label, danger = false }) {
  return (
    <div
      className={`px-4 py-2 rounded-lg text-sm ${
        danger
          ? "text-red-400 bg-red-500/10"
          : "text-white/80 bg-white/5"
      }`}
    >
      {label}
    </div>
  );
}