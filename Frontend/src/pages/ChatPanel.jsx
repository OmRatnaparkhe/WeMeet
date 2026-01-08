export function ChatPanel({ open }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-[360px] bg-neutral-900 border-l border-white/10 transform transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <header className="p-4 border-b border-white/10">
        <h2 className="font-semibold">Chat</h2>
      </header>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        <ChatBubble sender="You" />
        <ChatBubble sender="Friend" />
      </div>

      <footer className="p-4 border-t border-white/10">
        <input
          placeholder="Type a message…"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
        />
      </footer>
    </div>
  );
}

function ChatBubble({ sender }) {
  return (
    <div className="text-sm">
      <span className="text-white/50">{sender}</span>
      <div className="bg-white/10 rounded-lg p-2 mt-1">
        Hello 👋
      </div>
    </div>
  );
}
