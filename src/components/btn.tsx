export function Btn({ children, type = "button", onClick, variant = "primary", size = "md", className = "" }: {
  children: React.ReactNode; type?: "button" | "submit"; onClick?: () => void
  variant?: "primary" | "ghost" | "danger"; size?: "sm" | "md"; className?: string
}) {
  const base = "inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
  const sizes = { sm: "text-xs px-3 py-1.5", md: "text-sm px-4 py-2.5" }
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/10",
    ghost: "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700",
    danger: "bg-zinc-800 hover:bg-red-500/10 hover:border-red-500/30 text-zinc-500 hover:text-red-400 border border-zinc-700",
  }
  return (
    <button type={type} onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}