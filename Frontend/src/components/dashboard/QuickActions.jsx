import { Video, Calendar, Link2, Clock } from "lucide-react";

export function QuickActions({ onInstant, onSchedule, onJoin, onViewRecordings }) {
  const actions = [
    {
      label: "New Meeting",
      icon: <Video className="w-6 h-6 text-white" />,
      color: "bg-blue-600 hover:bg-blue-500",
      onClick: onInstant,
      desc: "Start an instant call"
    },
    {
      label: "Schedule",
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: "bg-purple-600 hover:bg-purple-500",
      onClick: onSchedule,
      desc: "Plan for later"
    },
    {
      label: "Join Room",
      icon: <Link2 className="w-6 h-6 text-white" />,
      color: "bg-orange-600 hover:bg-orange-500",
      onClick: onJoin,
      desc: "Via invitation link"
    },
    {
      label: "Recordings",
      icon: <Clock className="w-6 h-6 text-white" />,
      color: "bg-neutral-800 hover:bg-neutral-700",
      onClick: onViewRecordings,
      desc: "Watch past sessions"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={action.onClick}
          className={`${action.color} p-4 rounded-2xl flex flex-col justify-between h-28 md:h-32 transition shadow-lg text-left group active:scale-95`}
        >
          <div className="bg-white/20 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition">
            {action.icon}
          </div>
          <div>
            <h3 className="font-bold text-base md:text-lg leading-tight">{action.label}</h3>
            <p className="text-xs text-white/60 hidden md:block">{action.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
}