"use client"

import { useState, useTransition, useOptimistic } from "react"
import { importRepos, toggleDisplay } from "./actions"
import { TechChip } from "@/components/tech-chip"
import { ToggleSwitch } from "@/components/toggle-switch"
import { ImportButton } from "@/components/import-button"
import { EmptyState } from "@/components/empty-state"
import { FilterTabs } from "@/components/filter-tabs"

interface Project {
  id: string
  name: string
  description: string | null
  url: string | null
  technologies: string[]
  displayed: boolean
}

function ProjectRow({
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

type Filter = "all" | "visible" | "hidden"

export default function ProjectsPage({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [filter, setFilter] = useState<Filter>("all")
  const [isPending, startTransition] = useTransition()
  const [importError, setImportError] = useState<string | null>(null)
  const [importDone, setImportDone] = useState(false)

  const handleImport = () => {
    setImportError(null)
    setImportDone(false)
    startTransition(async () => {
      try {
        await importRepos()
        setImportDone(true)
        setTimeout(() => setImportDone(false), 3000)
      } catch (e) {
        setImportError(e instanceof Error ? e.message : "Import failed")
      }
    })
  }

  const handleToggle = (id: string, current: boolean) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, displayed: !current } : p))
    )
    startTransition(async () => {
      const fd = new FormData()
      fd.append("id", id)
      try {
        await toggleDisplay(fd)
      } catch {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, displayed: current } : p))
        )
      }
    })
  }

  const filtered = projects.filter((p) => {
    if (filter === "visible") return p.displayed
    if (filter === "hidden") return !p.displayed
    return true
  })

  const counts = {
    all: projects.length,
    visible: projects.filter((p) => p.displayed).length,
    hidden: projects.filter((p) => !p.displayed).length,
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-12 space-y-6">

        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-1">
              Dashboard
            </p>
            <h1 className="text-4xl font-bold text-white tracking-tight">Projects</h1>
            <p className="text-zinc-400 mt-2 text-sm">
              Manage which GitHub repos appear on your public profile.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-1">
            {importDone && (
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Imported successfully
              </span>
            )}
            <ImportButton onImport={handleImport} importing={isPending} />
          </div>
        </div>

        {importError && (
          <div className="flex items-center gap-3 text-sm text-red-400 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
            <span className="flex-shrink-0">⚠</span>
            {importError}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl">
            <EmptyState onImport={handleImport} importing={isPending} />
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-white">Repositories</h2>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-800 border border-zinc-700 rounded-full px-2 py-0.5">
                  {projects.length}
                </span>
              </div>
              <FilterTabs active={filter} onChange={setFilter} counts={counts} />
            </div>

            <div>
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <ProjectRow key={p.id} project={p} onToggle={handleToggle} />
                ))
              ) : (
                <div className="py-12 text-center text-sm text-zinc-600">
                  No {filter} repositories
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/40">
              <p className="text-xs text-zinc-600">
                {counts.visible} of {counts.all} repos visible on your profile
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}