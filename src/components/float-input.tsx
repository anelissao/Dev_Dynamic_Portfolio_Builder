import { useState } from "react";

export function FloatInput({
  name, label, type = "text", required, defaultValue, placeholder, className = ""
}: {
  name: string; label: string; type?: string; required?: boolean
  defaultValue?: string; placeholder?: string; className?: string
}) {
  const [focused, setFocused] = useState(false)
  const [hasVal, setHasVal] = useState(!!defaultValue)
  return (
    <div className={`relative group ${className}`}>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={focused ? (placeholder ?? "") : ""}
        onFocus={() => setFocused(true)}
        onBlur={e => { setFocused(false); setHasVal(!!e.target.value) }}
        onChange={e => setHasVal(!!e.target.value)}
        className="
          peer w-full bg-zinc-900 border border-zinc-800 rounded-lg
          px-4 pt-6 pb-2 text-sm text-white outline-none
          transition-all duration-200
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
          hover:border-zinc-700
          placeholder:text-zinc-600
        "
      />
      <label className={`
        pointer-events-none absolute left-4 transition-all duration-200 font-medium
        ${(focused || hasVal)
          ? "top-2 text-[10px] text-indigo-400 tracking-wider uppercase"
          : "top-1/2 -translate-y-1/2 text-sm text-zinc-500"}
      `}>
        {label}
      </label>
      <div className={`
        absolute bottom-0 left-0 h-px bg-indigo-500 transition-all duration-300
        ${focused ? "w-full" : "w-0"}
      `} />
    </div>
  )
}