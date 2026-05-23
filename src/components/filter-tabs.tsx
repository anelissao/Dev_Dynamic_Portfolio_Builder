type Filter = "all" | "visible" | "hidden"

export function FilterTabs({ active, onChange, counts }: {
    active: Filter
    onChange: (f: Filter) => void
    counts: { all: number; visible: number; hidden: number }
}) {
    const tabs: { key: Filter; label: string }[] = [
        { key: "all", label: "All" },
        { key: "visible", label: "Visible" },
        { key: "hidden", label: "Hidden" },
    ]
    return (
        <div className="flex items-center gap-1 bg-zinc-800/60 rounded-lg p-1">
            {tabs.map((t) => (
                <button
                    key={t.key}
                    type="button"
                    onClick={() => onChange(t.key)}
                    className={`
            flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md
            transition-all duration-150 cursor-pointer
            ${active === t.key
                            ? "bg-zinc-700 text-white"
                            : "text-zinc-500 hover:text-zinc-300"}
          `}
                >
                    {t.label}
                    <span className={`
            text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center
            ${active === t.key ? "bg-zinc-600 text-zinc-200" : "bg-zinc-700/50 text-zinc-600"}
          `}>
                        {counts[t.key]}
                    </span>
                </button>
            ))}
        </div>
    )
}