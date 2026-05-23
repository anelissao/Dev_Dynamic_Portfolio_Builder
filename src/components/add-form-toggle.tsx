import { useState } from "react";

export function AddFormToggle({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`
          group w-full flex items-center justify-center gap-2
          border border-dashed rounded-xl py-3 text-sm font-medium
          transition-all duration-200 cursor-pointer
          ${open
            ? "border-indigo-500/30 text-indigo-400 bg-indigo-500/5"
            : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400 hover:bg-zinc-800/50"}
        `}
      >
        <span className={`text-base transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
        {open ? "Cancel" : label}
      </button>

      <div className={`
        overflow-hidden transition-all duration-300
        ${open ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"}
      `}>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
          {children}
        </div>
      </div>
    </div>
  )
}