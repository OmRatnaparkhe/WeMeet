import { logout } from "./auth/useAuth"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateMeetingModal} from "../components/CreateMeetingModal.jsx"
import { useClerk } from "@clerk/clerk-react";
export function Dashboard() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const {signOut} = useClerk();
  const createmeeting = ({ micOn, camOn, roomId, name }) => {
    navigate(`/call/${roomId}`, {
      state: { 
        micOn, 
        camOn, 
        name,
        roomId
     }
    });

  }

  const handlelogout = async () => {
    await signOut();
    navigate("/signin");
  }

  

  return (
    <div className="w-screen h-screen bg-neutral-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col gap-6">
        <h1 className="text-xl font-semibold">WeMeet</h1>

        <nav className="flex flex-col gap-3 text-sm text-white/70">
          <SidebarItem label="Dashboard" active />
          <SidebarItem label="Meetings" />
          <SidebarItem label="Recordings" />
          <SidebarItem label="Settings" />
        </nav>

        <button
          onClick={handlelogout}
          className="text-sm text-red-400 hover:text-red-300 transition">
          Logout
        </button>
      </aside>



      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Header onNewMeeting={()=>setOpenModal(true)} />

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <MeetingCard onJoin={() => navigate("/call/demo-room")} />
          <MeetingCard onJoin={() => navigate("/call/demo-room-2")} />
          <NewMeetingCard onCreate={()=>setOpenModal(true)} />
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Recent recordings</h2>
          <RecordingRow />
          <RecordingRow />
        </section>
      </main>

      <CreateMeetingModal
      open={openModal}
      onClose={()=>setOpenModal(false)}
      onCreate={createmeeting}/>
    </div>
  );
}

function SidebarItem({ label, active }) {
  return (
    <div
      className={`px-3 py-2 rounded-lg cursor-pointer ${active
          ? "bg-white/10 text-white"
          : "hover:bg-white/5"
        }`}
    >
      {label}
    </div>
  );
}

function Header({ onNewMeeting }) {
  return (
    <div className="flex items-center justify-between">
      <input
        placeholder="Search meetings..."
        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none"
      />

      <button onClick={onNewMeeting} className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 rounded-lg text-sm">
        New meeting
      </button>
    </div>
  );
}

function MeetingCard({ onJoin }) {
  return (
    <div
      onClick={onJoin}
      className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="font-medium">Team Sync</h3>
      <p className="text-sm text-white/60 mt-1">Click to join</p>
    </div>
  );
}

function NewMeetingCard({ onCreate }) {
  return (
    <div
      onClick={onCreate}
      className="border border-dashed border-white/20 rounded-xl p-4 flex items-center justify-center text-white/50">
      + Create meeting
    </div>
  );
}

function RecordingRow() {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/10 text-sm">
      <span>Product Demo</span>
      <span className="text-white/50">12 min</span>
    </div>
  );
}
