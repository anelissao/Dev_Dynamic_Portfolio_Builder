import { ToggleSwitch } from "./toggle-switch"
import { TechChip } from "./tech-chip"

interface Project {
    id: string
    name: string
    description: string | null
    url: string | null
    technologies: string[]
    displayed: boolean
}

export function ProjectRow({
    project,
    onToggle,
}: {
    project: Project
    onToggle: (id: string, current: boolean) => void
}) {
    return (
        <div
            className={`
        group flex items-center gap-4 px-5 py-4
        border-b border-zinc-800/60 last:border-b-0
        transition-all duration-150
        hover:bg-zinc-800/30
        ${!project.displayed ? "opacity-50 hover:opacity-80" : ""}
      `}
        >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" fill="currentColor" className="text-zinc-500" />
                </svg>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white truncate">{project.name}</span>
                    {project.url && (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Open on GitHub"
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <path d="M3.5 3a.5.5 0 000 1H7.3L2.15 9.15a.5.5 0 00.7.7L8 4.7V8.5a.5.5 0 001 0v-5a.5.5 0 00-.5-.5h-5z" fill="currentColor" className="text-zinc-500" />
                            </svg>
                        </a>
                    )}
                </div>
                {project.description && (
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">{project.description}</p>
                )}
                {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((t) => (
                            <TechChip key={t} label={t} />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-shrink-0 flex items-center gap-2.5">
                <span className={`text-xs font-medium transition-colors ${project.displayed ? "text-indigo-400" : "text-zinc-600"}`}>
                    {project.displayed ? "Visible" : "Hidden"}
                </span>
                <ToggleSwitch id={project.id} displayed={project.displayed} onToggle={onToggle} />
            </div>
        </div>
    )
}