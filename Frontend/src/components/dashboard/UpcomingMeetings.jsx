import { EmptyState } from "./EmptyState";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UpcomingMeetings({ meetings, onSchedule }) {
  const navigate = useNavigate();

  const displayMeetings = meetings.slice(0, 3);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Upcoming Meetings</h2>
        {meetings.length > 3 && (
            <button onClick={() => navigate("/meetings")} className="text-blue-400 text-sm hover:underline">
                View all
            </button>
        )}
      </div>

      {displayMeetings.length === 0 ? (
        <EmptyState
          title="No upcoming meetings"
          description="You have a clear schedule today."
          actionLabel="Schedule Meeting"
          onAction={onSchedule}
        />
      ) : (
        <div className="space-y-3">
          {displayMeetings.map((meeting) => (
            <div 
                key={meeting.id} 
                className="bg-neutral-900 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-blue-500/50 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-neutral-800 p-3 rounded-lg text-center min-w-[60px]">
                    <span className="block text-xs text-white/60 uppercase font-bold">
                        {new Date(meeting.scheduledAt).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="block text-xl font-bold text-white">
                        {new Date(meeting.scheduledAt).getDate()}
                    </span>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">{meeting.title || "Untitled Session"}</h3>
                  <div className="flex items-center gap-4 text-sm text-white/50 mt-1">
                     <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(meeting.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                     <span className="text-white/20">|</span>
                     <span className="font-mono text-xs">ID: {meeting.roomId}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/call/${meeting.roomId}`)}
                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition translate-x-2 group-hover:translate-x-0"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}