import { PageLayout } from "../components/layout/PageLayout";
import { EmptyState } from "../components/dashboard/EmptyState";
import { CreateMeetingModal } from "../components/CreateMeetingModal";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

export function Meetings() {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const { user } = useUser();
    const userId = user?.id;
    const BE_URL = import.meta.env.VITE_BE_API_PROD || "http://localhost:4000/api";

    const fetchMeetings = useCallback(() => {
        if (!userId) return;
        axios.get(`${BE_URL}/meetings/upcoming?clerkId=${userId}`)
            .then(res => {
                if (Array.isArray(res.data)) setMeetings(res.data);
                else setMeetings([]);
            })
            .catch(err => console.error("Error fetching meetings:", err));
    }, [userId, BE_URL]);

    useEffect(() => {
        fetchMeetings();
    }, [fetchMeetings]);

    const handleDelete = async (meetingId) => {
        if (!window.confirm("Are you sure you want to delete this studio? This cannot be undone.")) return;
        
        try {
            await axios.delete(`${BE_URL}/meetings/${meetingId}`, {
                headers: { "x-clerk-id": userId }
            });
            fetchMeetings(); 
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Could not delete meeting");
        }
    };

    const handleEndSession = async (meetingId) => {
        if (!window.confirm("End this session for everyone?")) return;

        try {
            await axios.patch(`${BE_URL}/meetings/${meetingId}/end`, {}, {
                headers: { "x-clerk-id": userId }
            });
            fetchMeetings(); 
        } catch (error) {
            console.error("Failed to end session", error);
        }
    };

    const liveMeetings = meetings.filter(m => m.startedAt && !m.endedAt);
    const upcomingMeetings = meetings.filter(m => !m.startedAt);

    const copyInviteLink = (roomId) => {
        const link = `${window.location.origin}/call/${roomId}`;
        navigator.clipboard.writeText(link);
        alert("Invite link copied!"); 
    };

    return (
        <PageLayout>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Studios</h1>
                    <p className="text-white/60 mt-1">Manage your recording sessions</p>
                </div>
                <button
                    onClick={() => setOpenModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-blue-500/20"
                >
                    + New Studio
                </button>
            </div>

            <Section title="Live Studios">
                {liveMeetings.length === 0 ? (
                    <EmptyState title="No live sessions" description="Start a studio to see it here" />
                ) : (
                    <div className="grid gap-4">
                        {liveMeetings.map(m => (
                            <MeetingCard 
                                key={m.id} 
                                meeting={m} 
                                isLive={true} 
                                onJoin={() => navigate(`/call/${m.roomId}`, { state: { roomId: m.roomId, name: m.title, micOn: m.micOn, camOn: m.camOn } })} 
                                onCopy={() => copyInviteLink(m.roomId)}
                                onEnd={() => handleEndSession(m.id)}
                            />
                        ))}
                    </div>
                )}
            </Section>

            <Section title="Upcoming Sessions">
                {upcomingMeetings.length === 0 ? (
                    <EmptyState
                        title="No scheduled sessions"
                        description="Schedule a recording for later"
                        actionLabel="Schedule Studio"
                        onAction={() => setOpenModal(true)}
                    />
                ) : (
                    <div className="grid gap-4">
                        {upcomingMeetings.map(m => (
                            <MeetingCard 
                                key={m.id} 
                                meeting={m} 
                                isLive={false}
                                onJoin={() => navigate(`/call/${m.roomId}`, { state: { roomId: m.roomId, name: m.title, micOn: m.micOn, camOn: m.camOn } })} 
                                onCopy={() => copyInviteLink(m.roomId)}
                                onDelete={() => handleDelete(m.id)}
                            />
                        ))}
                    </div>
                )}
            </Section>

            <CreateMeetingModal open={openModal} onClose={() => setOpenModal(false)} onCreate={fetchMeetings} />
        </PageLayout>
    );
}

function Section({ title, children }) {
    return (
        <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4 text-white/90">{title}</h2>
            {children}
        </section>
    );
}

function MeetingCard({ meeting, onJoin, onCopy, onDelete, onEnd, isLive }) {
    return (
        <div className="bg-neutral-900 border border-white/10 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition group">
            
            <div className="flex gap-4 items-start md:items-center">
                <div className={`w-10 h-10 md:w-12 md:h-12 flex-none rounded-full flex items-center justify-center text-xl border ${isLive ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-blue-500/10 border-blue-500/50 text-blue-500'}`}>
                    {isLive ? "●" : "📅"}
                </div>
                
                <div className="min-w-0"> 
                    <h3 className="font-semibold text-white text-base md:text-lg tracking-tight truncate">{meeting.title || "Untitled Studio"}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-white/50 mt-0.5">
                         <span>{isLive ? "Live Now" : new Date(meeting.scheduledAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                         <span className="hidden md:inline">•</span>
                         <span className="text-white/30 font-mono text-xs truncate max-w-[100px] md:max-w-none">ID: {meeting.roomId.slice(0, 8)}...</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                <button 
                    onClick={onCopy}
                    className="flex-1 md:flex-none py-2.5 md:py-2 px-4 rounded-lg text-xs md:text-sm font-medium text-white/60 bg-white/5 md:bg-transparent hover:text-white hover:bg-white/10 transition border border-transparent md:border-white/10"
                >
                    Copy Link
                </button>

                {isLive ? (
                    <>
                         <button 
                            onClick={onEnd}
                            className="flex-1 md:flex-none px-4 py-2.5 md:py-2 rounded-lg text-xs md:text-sm font-medium text-red-400 bg-red-500/10 md:bg-transparent hover:text-red-300 hover:bg-red-500/20 transition text-center"
                        >
                            End
                        </button>
                        <button 
                            onClick={onJoin}
                            className="flex-1 md:flex-none bg-red-600 active:bg-red-500 text-white px-5 py-2.5 md:py-2 rounded-lg text-xs md:text-sm font-bold transition shadow-lg shadow-red-500/20 text-center"
                        >
                            Join
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={onDelete}
                            className="flex-1 md:flex-none px-4 py-2.5 md:py-2 rounded-lg text-xs md:text-sm font-medium text-white/40 bg-white/5 md:bg-transparent hover:text-red-400 hover:bg-red-500/10 transition text-center"
                        >
                            Delete
                        </button>
                        <button 
                            onClick={onJoin}
                            className="flex-1 md:flex-none bg-white text-black px-5 py-2.5 md:py-2 rounded-lg text-xs md:text-sm font-bold active:bg-gray-200 transition text-center"
                        >
                            Enter
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}