import { useState } from "react";
import { X, Send } from "lucide-react"; 

export function ChatPanel({ open, onClose, onSend, messages }) {
  const [input, setInput] = useState("");

  if (!open) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);    
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-[60] md:inset-auto md:top-0 md:right-0 md:h-full md:w-[360px] bg-neutral-900 border-l border-white/10 flex flex-col shadow-2xl">
      
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-neutral-900">
        <h2 className="font-semibold text-white">In-Call Messages</h2>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
            <X className="w-5 h-5 text-white/70" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950/50">
        {messages.length === 0 && (
            <div className="text-center text-white/20 text-sm mt-10">
                No messages yet. Say hello! 👋
            </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
              msg.from === "me"
                ? "bg-blue-600 text-white ml-auto rounded-tr-sm"
                : "bg-neutral-800 text-white rounded-tl-sm"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 bg-neutral-900 pb-safe-area">
        <div className="flex gap-2">
            <input
            className="flex-1 bg-neutral-800 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-white/30"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
            }}
            />
            <button
            onClick={handleSend}
            className="bg-blue-600 active:bg-blue-700 px-4 rounded-xl text-white flex items-center justify-center transition"
            >
            <Send className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
}