export function ToggleSwitch({
  id,
  displayed,
  onToggle,
}: {
  id: string
  displayed: boolean
  onToggle: (id: string, current: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={displayed}
      onClick={() => onToggle(id, displayed)}
      className={`
        relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full
        border-2 transition-colors duration-200 ease-in-out outline-none
        focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
        focus-visible:ring-offset-zinc-900
        ${displayed
          ? "bg-indigo-600 border-indigo-600"
          : "bg-zinc-700 border-zinc-700"}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-4 w-4 rounded-full bg-white
          shadow-sm transition-transform duration-200 ease-in-out
          ${displayed ? "translate-x-4" : "translate-x-0"}
        `}
      />
    </button>
  )
}