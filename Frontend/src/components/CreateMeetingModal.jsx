import { useState } from "react";
import { Modal } from "./Modal";

export function CreateMeetingModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [roomId,setRoomId] = useState("");
  const handleStart = () => {
    onCreate({
      name: name || "Untitled meeting",
      micOn,
      camOn,
      roomId
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Create new meeting</h2>

      <input
        placeholder="Meeting name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-4 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
      />
      <input
        placeholder="Room Id"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="w-full mb-4 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
      />

      <div className="flex gap-4 mb-6">
        <Toggle
          label="Microphone"
          enabled={micOn}
          onToggle={() => setMicOn(!micOn)}
        />
        <Toggle
          label="Camera"
          enabled={camOn}
          onToggle={() => setCamOn(!camOn)}
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-white/60 hover:text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleStart}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition rounded-lg text-sm"
        >
          Start meeting
        </button>
      </div>
    </Modal>
  );
}

function Toggle({ label, enabled, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer flex-1 border rounded-lg p-3 text-sm text-center transition ${
        enabled
          ? "border-green-500/40 bg-green-500/10 text-green-400"
          : "border-white/10 bg-white/5 text-white/60"
      }`}
    >
      {label}: {enabled ? "On" : "Off"}
    </div>
  );
}
