import { useState } from "react";

export function TimelineEntry({
  title, subtitle, start, end, description, onDelete, accent = "indigo"
}: {
  title: string; subtitle?: string | null; start: number; end?: number | null
  description?: string | null; onDelete: () => void; accent?: "indigo" | "violet"
}) {
  const [confirming, setConfirming] = useState(false)

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); setTimeout(() => setConfirming(false), 3000); return }
    await onDelete()
  }

  const accentClasses = {
    indigo: "bg-indigo-500 shadow-indigo-500/50",
    violet: "bg-violet-500 shadow-violet-500/50",
  }

  return (
    <div className="group relative flex gap-4 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-col items-center pt-1">
        <div className={`w-2.5 h-2.5 rounded-full shadow-md flex-shrink-0 mt-0.5 ${accentClasses[accent]}`} />
        <div className="w-px flex-1 bg-zinc-800 mt-1.5 group-last:hidden" />
      </div>

      <div className="flex-1 min-w-0 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white leading-tight">{title}</h3>
            {subtitle && <p className="text-xs text-indigo-400 mt-0.5 font-medium">{subtitle}</p>}
            <p className="text-xs text-zinc-500 mt-1">
              {start} – {end ?? "Present"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className={`
              flex-shrink-0 text-xs px-2.5 py-1.5 rounded-lg font-medium
              border transition-all duration-200 cursor-pointer
              opacity-0 group-hover:opacity-100
              ${confirming
                ? "border-red-500/40 text-red-400 bg-red-500/10"
                : "border-zinc-700 text-zinc-600 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5"}
            `}
          >
            {confirming ? "Confirm?" : "Remove"}
          </button>
        </div>
        {description && (
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  )
}