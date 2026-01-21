import { PageLayout } from "../components/layout/PageLayout";
import { EmptyState } from "../components/dashboard/EmptyState";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Trash2, Play } from "lucide-react";

export function Recordings() {
  const { user } = useUser();
  const [recordings, setRecordings] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null); 
  const BE_URL = import.meta.env.VITE_BE_API_BASE || "http://localhost:4000/api";

  const fetchRecordings = () => {
    if (!user) return;
    axios.get(`${BE_URL}/recordings?clerkId=${user.id}`)
      .then(res => setRecordings(res.data || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchRecordings();
  }, [user, BE_URL]);

  const handleDelete = async (recordingId) => {
    if (!window.confirm("Are you sure you want to delete this recording metadata? Note: The local file on your computer will not be deleted.")) return;

    try {
        await axios.delete(`${BE_URL}/recordings/${recordingId}`, {
            headers: { "x-clerk-id": user.id }
        });
        
        setRecordings(prev => prev.filter(r => r.id !== recordingId));
        if (selectedVideo?.id === recordingId) {
            setSelectedVideo(null);
        }
    } catch (err) {
        console.error("Failed to delete recording:", err);
        alert("Failed to delete recording");
    }
  };

  return (
    <PageLayout>
      <div className="mb-6 md:mb-8 px-4 md:px-0">
        <h1 className="text-2xl font-semibold text-white">Recordings</h1>
        <p className="text-white/60 mt-1">
          History of your local recording sessions.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0 pb-20">
        
        <div className="lg:col-span-2 space-y-4">
          {recordings.length === 0 ? (
            <EmptyState 
              title="No recordings yet" 
              description="Start a meeting and hit record!" 
            />
          ) : (
            recordings.map((rec) => (
              <RecordingCard 
                key={rec.id} 
                recording={rec} 
                isActive={selectedVideo?.id === rec.id}
                onPlay={() => setSelectedVideo(rec)}
                onDelete={() => handleDelete(rec.id)}
              />
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <LocalVideoPlayer activeRecording={selectedVideo} />
        </div>

      </div>
    </PageLayout>
  );
}

function RecordingCard({ recording, onPlay, onDelete, isActive }) {
  const date = new Date(recording.startedAt).toLocaleDateString();
  const time = new Date(recording.startedAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });
  const duration = recording.durationSec ? `${Math.floor(recording.durationSec / 60)}m ${recording.durationSec % 60}s` : "Unknown";

  return (
    <div className={`bg-neutral-900 border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition group ${isActive ? "border-blue-500/50 bg-blue-500/5" : "border-white/10 hover:border-white/20"}`}>
      
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex-none flex items-center justify-center text-xl sm:text-2xl transition ${isActive ? "bg-blue-500 text-white" : "bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white"}`}>
          {isActive ? <Play className="w-6 h-6 fill-current" /> : "🎥"}
        </div>
        
        <div className="min-w-0">
          <h3 className={`font-semibold text-base sm:text-lg truncate ${isActive ? "text-blue-400" : "text-white"}`}>
            {recording.meeting?.title || "Untitled Session"}
          </h3>
          <p className="text-xs sm:text-sm text-white/50 mt-1 truncate">
            {date} at {time} • {duration}
          </p>
          <div className="flex gap-2 mt-1.5">
             <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40 uppercase tracking-wider">
                {recording.type}
             </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
         <button 
            onClick={onDelete}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium text-white/40 bg-white/5 hover:text-red-400 hover:bg-red-500/10 transition border border-transparent"
            title="Delete Recording Metadata"
         >
            <Trash2 className="w-4 h-4" />
            <span className="sm:hidden">Delete</span>
         </button>

         <button 
            onClick={onPlay}
            className={`flex-1 sm:flex-none px-6 py-2.5 sm:py-2 rounded-lg text-sm font-bold transition shadow-lg ${isActive ? "bg-blue-600 text-white shadow-blue-500/20" : "bg-white text-black hover:bg-gray-200"}`}
         >
            {isActive ? "Playing" : "Watch"}
         </button>
      </div>
    </div>
  );
}

function LocalVideoPlayer({ activeRecording }) {
  const videoRef = useRef(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
     setFileUrl(null);
     if(videoRef.current) videoRef.current.load();
  }, [activeRecording]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    }
  };

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 sm:p-6 lg:sticky lg:top-6">
      <h2 className="font-semibold mb-4 text-lg hidden lg:block">Local Player</h2>
      
      <div className="aspect-video bg-black rounded-lg overflow-hidden border border-white/10 flex items-center justify-center relative group">
        {fileUrl ? (
          <video 
            ref={videoRef} 
            src={fileUrl} 
            controls 
            className="w-full h-full" 
            autoPlay 
          />
        ) : (
          <div className="text-center p-6">
             <div className="text-4xl opacity-20 mb-2 group-hover:scale-110 transition duration-300">
                {activeRecording ? "📂" : "📺"}
             </div>
             <p className="text-white/40 text-sm font-medium">
                {activeRecording 
                    ? "Locate file to play" 
                    : "Select a clip to watch"}
             </p>
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-6">
        {activeRecording ? (
          <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/5">
            <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Target Metadata</p>
            <h3 className="font-medium text-white truncate">{activeRecording.meeting?.title}</h3>
            <p className="text-xs text-white/40 mt-0.5">ID: {activeRecording.id.slice(0,8)}...</p>
          </div>
        ) : (
          <p className="text-sm text-white/40 mb-4 italic text-center py-2">
            Select a session from the list to start.
          </p>
        )}

        <label className={`block w-full cursor-pointer group ${!activeRecording ? "opacity-50 pointer-events-none" : ""}`}>
          <input 
            type="file" 
            accept="video/*" 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <div className="w-full bg-blue-600 group-hover:bg-blue-500 text-white text-center py-3 rounded-xl font-bold transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
            <span>Open Video File</span>
          </div>
        </label>
        
        {activeRecording && (
            <p className="text-[10px] text-white/30 text-center mt-3 px-4">
            Security: Browsers cannot auto-load local files. Use the button above to select the matching file.
            </p>
        )}
      </div>
    </div>
  );
}