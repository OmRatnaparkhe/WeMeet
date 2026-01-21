import { useNavigate, useLocation } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { 
  LayoutDashboard, 
  Video, 
  CassetteTape, 
  Settings, 
  LogOut, 
  Video as VideoIcon 
} from "lucide-react";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();

  const items = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Studios", path: "/meetings", icon: <Video className="w-5 h-5" /> },
    { label: "Recordings", path: "/recordings", icon: <CassetteTape className="w-5 h-5" /> },
    { label: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      <aside className="hidden md:flex w-64 border-r border-white/10 bg-neutral-950 flex-col h-full sticky top-0">
        
        <div 
          onClick={() => navigate("/dashboard")}
          className="h-16 flex items-center gap-3 px-6 border-b border-white/5 cursor-pointer hover:bg-white/5 transition"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <VideoIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">WeMeet</span>
        </div>

        <nav className="flex-1 flex flex-col gap-1 p-4">
          {items.map((item) => (
            <DesktopNavItem
              key={item.path}
              label={item.label}
              icon={item.icon}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>


      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900/90 backdrop-blur-lg border-t border-white/10 z-50 pb-safe-area">
        <nav className="flex justify-around items-center h-16 px-2">
          {items.map((item) => (
            <MobileNavItem
              key={item.path}
              label={item.label}
              icon={item.icon}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
          
          <button
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
            className="flex flex-col items-center justify-center w-16 h-full text-red-400/70 hover:text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Exit</span>
          </button>
        </nav>
      </div>
    </>
  );
}


function DesktopNavItem({ label, icon, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition text-sm font-medium ${
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
          : "text-white/60 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className={active ? "text-white" : "text-white/50 group-hover:text-white"}>
        {icon}
      </span>
      {label}
    </div>
  );
}

function MobileNavItem({ label, icon, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 h-full cursor-pointer transition ${
        active
          ? "text-blue-500"
          : "text-white/40 hover:text-white/70"
      }`}
    >
      <div className={active ? "text-blue-500" : "text-inherit"}>
        {icon}
      </div>
      <span className="text-[10px] mt-1 font-medium truncate w-full text-center">
        {label}
      </span>
    </div>
  );
}