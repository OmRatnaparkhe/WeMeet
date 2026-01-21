export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="border border-white/10 rounded-xl p-6 text-center">
      <p className="text-white font-medium">{title}</p>
      <p className="text-white/60 text-sm mt-1">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="mt-4 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
