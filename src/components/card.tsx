export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`
      bg-zinc-900 border border-zinc-800 rounded-2xl p-8
      transition-all duration-300 hover:border-zinc-700
      ${className}
    `}>
      {children}
    </div>
  )
}