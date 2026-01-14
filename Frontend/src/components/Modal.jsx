export function Modal({ open, onClose, children }) {
    if (!open) return null;
    return <div className="fixed inset-0 z-50 flex justify-center items-center">
        <div
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
        />

        <div className="relative bg-neutral-900 border border-white/10 rounded-xl p-6 w-[420px] shadow-xl">
            {children}
        </div>
    </div>
}