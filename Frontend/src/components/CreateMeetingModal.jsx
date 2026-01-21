import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function CreateMeetingModal({ open, onClose, onCreate }) {
  const [mode, setMode] = useState("INSTANT");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const { user } = useUser();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [record, setRecord] = useState(false);
  const [loading, setLoading] = useState(false);

  const BE_URL = import.meta.env.VITE_BE_API_BASE || "http://localhost:4000/api";

  if (!open) return null;

  const handleScheduleCreate = async () => {
    try {
      setLoading(true);
      const roomId = uuid();

      let scheduledDate;
      if (mode === "SCHEDULE") {
        scheduledDate = new Date(`${date}T${time}`);
      } else {
        scheduledDate = new Date();
      }

      const meetingType = mode === "SCHEDULE" ? "SCHEDULED" : "INSTANT";

      await axios.post(
        `${BE_URL}/meetings/schedule`,
        {
          roomId,
          title: title || "Untitled Meeting",
          type: meetingType,
          scheduledAt: scheduledDate.toISOString(),
          micOn,
          camOn,
          record,
          name: user?.fullName || "Host",
          email: user?.primaryEmailAddress?.emailAddress || "host@example.com"
        },
        {
          headers: {
            "x-clerk-id": user?.id,
          },
        }
      );

      if (mode === "INSTANT") {
        navigate(`/call/${roomId}`, {
          state: {
            roomId,
            micOn,
            camOn,
            name: title || "Live Studio",
            isHost: true,
          },
        });
      } else {
        onClose();
        if (onCreate) {
          onCreate(); 
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Failed to create meeting:", error.response?.data || error.message);
      alert("Failed to create meeting. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  const canSchedule = date && time;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 w-[420px] rounded-xl p-6 border border-white/10 shadow-2xl">
        <h2 className="text-lg font-semibold mb-4 text-white">Create Studio</h2>

        <MeetingTypeTabs mode={mode} setMode={setMode} />

        <input
          placeholder="Studio Name (e.g. Podcast Ep 1)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        />

        {mode === "SCHEDULE" && (
          <div className="flex gap-2">
            <DatePicker value={date} onChange={setDate} />
            <TimePicker value={time} onChange={setTime} />
          </div>
        )}

        <Options
          micOn={micOn}
          camOn={camOn}
          record={record}
          setMicOn={setMicOn}
          setCamOn={setCamOn}
          setRecord={setRecord}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose} 
            className="text-sm text-white/60 hover:text-white"
          >
            Cancel
          </button>

          {mode === "INSTANT" ? (
            <button
              disabled={loading}
              onClick={handleScheduleCreate}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              {loading ? "Creating..." : "Start Now"}
            </button>
          ) : (
            <button
              disabled={!canSchedule || loading}
              onClick={handleScheduleCreate}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                canSchedule
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              }`}
            >
              {loading ? "Scheduling..." : "Schedule Meeting"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MeetingTypeTabs({ mode, setMode }) {
  return (
    <div className="flex gap-1 p-1 bg-black/20 rounded-lg mb-4 border border-white/5">
      {["INSTANT", "SCHEDULE"].map((t) => (
        <button
          key={t}
          onClick={() => setMode(t)}
          className={`flex-1 py-1.5 rounded-md text-sm font-medium transition ${
            mode === t ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          }`}
        >
          {t === "INSTANT" ? "Enter Now" : "Schedule for Later"}
        </button>
      ))}
    </div>
  );
}

function DatePicker({ value, onChange }) {
  return (
    <div className="mb-3 flex-1">
      <label className="text-xs text-white/40 mb-1 block">Date</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
      />
    </div>
  );
}

function TimePicker({ value, onChange }) {
  return (
    <div className="mb-4 flex-1">
      <label className="text-xs text-white/40 mb-1 block">Time</label>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
      />
    </div>
  );
}

function Options({ micOn, camOn, record, setMicOn, setCamOn, setRecord }) {
  return (
    <div className="space-y-3 pt-2 border-t border-white/5">
      <Toggle label="Start with mic on" checked={micOn} onChange={setMicOn} />
      <Toggle label="Start with camera on" checked={camOn} onChange={setCamOn} />
      <Toggle label="Record automatically" checked={record} onChange={setRecord} />
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm text-white/60 group-hover:text-white/80 transition">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(!checked)}
        className="accent-blue-500 w-4 h-4"
      />
    </label>
  );
}