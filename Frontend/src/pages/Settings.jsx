import { PageLayout } from "../components/layout/PageLayout";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useEffect, useState, useRef } from "react";
import { Camera, Mic, LogOut, Moon, Bell, Shield } from "lucide-react";

export function Settings() {
  const { user } = useUser();
  const { signOut } = useClerk();
  
  const [defaults, setDefaults] = useState({
    micOff: localStorage.getItem("defaultMicOff") === "true",
    camOff: localStorage.getItem("defaultCamOff") === "true",
  });

  const handleToggle = (key) => {
    const newVal = !defaults[key];
    setDefaults(prev => ({ ...prev, [key]: newVal }));
    localStorage.setItem(key === "micOff" ? "defaultMicOff" : "defaultCamOff", newVal);
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-0 pb-20">
        <h1 className="text-2xl font-semibold mb-2 text-white">Settings</h1>
        <p className="text-white/60 mb-8">Manage your profile and meeting preferences</p>

        <div className="flex flex-col gap-8">
          
          <Section>
             <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <img 
                        src={user?.imageUrl} 
                        alt="Profile" 
                        className="w-20 h-20 md:w-16 md:h-16 rounded-full border-2 border-white/10"
                    />
                    <div className="text-center md:text-left">
                        <h2 className="text-xl font-bold text-white">{user?.fullName}</h2>
                        <p className="text-white/50 text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
                        <div className="mt-2 flex justify-center md:justify-start gap-2">
                             <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded font-medium">Free Plan</span>
                             <span className="bg-white/5 text-white/40 text-xs px-2 py-1 rounded font-medium">Verified</span>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={() => signOut()}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-2.5 rounded-lg text-sm font-medium transition"
                >
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
             </div>
          </Section>

          <Section title="Audio & Video Testing">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <div className="flex flex-col space-y-4">
                    <p className="text-sm text-white/50">
                        Check your look before joining.
                    </p>
                    <div className="w-full aspect-video bg-black rounded-xl border border-white/10 overflow-hidden relative shadow-inner">
                        <CameraPreview />
                    </div>
                </div>
                
                <div className="flex flex-col space-y-4 justify-center">
                     <div>
                        <h3 className="font-medium text-white">Meeting Defaults</h3>
                        <p className="text-xs text-white/50 mt-1">Set how you want to join meetings by default.</p>
                     </div>

                     <ToggleOption 
                        label="Join with Mic Muted"
                        active={defaults.micOff}
                        onClick={() => handleToggle("micOff")}
                        icon={<Mic className="w-4 h-4" />}
                     />
                     
                     <ToggleOption 
                        label="Join with Camera Off"
                        active={defaults.camOff}
                        onClick={() => handleToggle("camOff")}
                        icon={<Camera className="w-4 h-4" />}
                     />
                </div>
             </div>
          </Section>

          <Section title="General">
             <div className="space-y-1">
                 <SettingRow icon={<Moon className="w-4 h-4" />} label="Appearance" value="Dark Mode" />
                 <SettingRow icon={<Bell className="w-4 h-4" />} label="Notifications" value="Enabled" />
                 <SettingRow icon={<Shield className="w-4 h-4" />} label="Privacy" value="Active" />
             </div>
          </Section>

        </div>
      </div>
    </PageLayout>
  );
}


function Section({ title, children }) {
    return (
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full">
            {title && <h3 className="text-lg font-semibold text-white mb-6 border-b border-white/5 pb-4">{title}</h3>}
            {children}
        </div>
    );
}
function ToggleOption({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-4 p-4 rounded-xl border transition ${
        active
          ? "bg-blue-600/10 border-blue-500/50"
          : "bg-white/5 border-white/5 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div
          className={`p-2 rounded-lg flex-shrink-0 ${
            active
              ? "bg-blue-500 text-white"
              : "bg-neutral-800 text-white/50"
          }`}
        >
          {icon}
        </div>

        <span
          className={`text-sm font-medium leading-snug ${
            active ? "text-blue-200" : "text-white/80"
          }`}
        >
          {label}
        </span>
      </div>

      <div
        className={`w-11 h-6 flex-shrink-0 rounded-full relative transition ${
          active ? "bg-blue-500" : "bg-neutral-700"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
            active ? "left-6" : "left-1"
          }`}
        />
      </div>
    </button>
  );
}


function SettingRow({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition cursor-pointer group">
            <div className="flex items-center gap-3 text-white/70">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs text-white/40 group-hover:text-white/60">{value}</span>
                <span className="text-white/20 text-xs">▶</span>
            </div>
        </div>
    )
}

function CameraPreview() {
    const videoRef = useRef(null);

    useEffect(() => {
        let stream = null;
        async function enableStream() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if(videoRef.current) videoRef.current.srcObject = stream;
            } catch(err) {
                console.error("Access denied", err);
            }
        }
        enableStream();
        return () => {
            if(stream) stream.getTracks().forEach(track => track.stop());
        }
    }, []);

    return <video ref={videoRef} autoPlay muted className="w-full h-full object-cover transform -scale-x-100" />
}