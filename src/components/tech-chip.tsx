const colorMap: Record<string, string> = {
    typescript: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    javascript: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    react: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    "next.js": "text-white bg-zinc-700/60 border-zinc-600",
    nextjs: "text-white bg-zinc-700/60 border-zinc-600",
    python: "text-green-400 bg-green-500/10 border-green-500/20",
    rust: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    go: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    css: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    html: "text-red-400 bg-red-500/10 border-red-500/20",
    tailwind: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    prisma: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
}
export function TechChip({ label }: { label: string }) {
    const key = label.toLowerCase()
    const cls = colorMap[key] ?? "text-zinc-400 bg-zinc-800 border-zinc-700"
    return (
        <span className={`inline-flex text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-md border ${cls}`}>
            {label}
        </span>
    )
}