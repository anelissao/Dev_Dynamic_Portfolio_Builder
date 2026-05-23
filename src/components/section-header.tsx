export function SectionHeader({ icon, title, count }: { icon: string; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-base">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {count !== undefined && (
        <span className="ml-auto text-xs font-medium text-zinc-500 bg-zinc-800 border border-zinc-700 rounded-full px-2.5 py-0.5">
          {count}
        </span>
      )}
    </div>
  )
}