import { useState } from "react";

export function ChatPanel({ open, onSend, messages }) {
  const [input, setInput] = useState("");

  if (!open) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    onSend(input);    
    setInput("");
  };

  return (
    <div className="fixed top-0 right-0 h-full w-[360px] bg-neutral-900 border-l border-white/10 flex flex-col">
      
      <div className="p-4 border-b border-white/10">
        <h2 className="font-semibold text-white">Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] p-2 rounded-lg text-sm ${
              msg.from === "me"
                ? "bg-blue-500/20 text-white ml-auto"
                : "bg-white/10 text-white"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 flex gap-2">
        <input
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none text-white"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />

        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
