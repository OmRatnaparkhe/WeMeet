import { EmptyState } from "./EmptyState";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function RecentRecordings({ recordings }) {
  const navigate = useNavigate();
  const displayRecordings = recordings.slice(0, 4);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recent Recordings</h2>
        {recordings.length > 0 && (
            <button onClick={() => navigate("/recordings")} className="text-blue-400 text-sm hover:underline">
                View library
            </button>
        )}
      </div>

      {displayRecordings.length === 0 ? (
        <EmptyState
          title="No recordings yet"
          description="Your captured sessions will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayRecordings.map((rec) => (
            <div 
                key={rec.id} 
                onClick={() => navigate("/recordings")}
                className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:ring-2 ring-blue-500 transition group"
            >
              <div className="h-32 bg-neutral-800 relative flex items-center justify-center">
                 
                 <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <Play className="w-5 h-5 fill-white" />
                 </div>
                 <span className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono">
                    {rec.durationSec ? `${Math.floor(rec.durationSec/60)}:${(rec.durationSec%60).toString().padStart(2,'0')}` : "--:--"}
                 </span>
              </div>
              <div className="p-3">
                 <h4 className="font-medium truncate text-sm">{rec.meeting?.title || "Untitled Recording"}</h4>
                 <p className="text-xs text-white/50 mt-1">{new Date(rec.startedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}