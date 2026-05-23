import { ToggleSwitch } from "./toggle-switch"
import { TechChip } from "./tech-chip"
import { FolderGit2, ExternalLink } from "lucide-react"

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
                 <FolderGit2 size={14} className="text-zinc-500" />
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
                             <ExternalLink size={12} className="text-zinc-500" />
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