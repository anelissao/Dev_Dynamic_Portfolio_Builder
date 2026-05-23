"use client"

import { useState, useTransition, useOptimistic } from "react"
import { importRepos, toggleDisplay } from "./actions"
import { TechChip } from "@/components/tech-chip"
import { ToggleSwitch } from "@/components/toggle-switch"

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

function EmptyState({ onImport, importing }: { onImport: () => void; importing: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-5">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" fill="currentColor" className="text-zinc-500" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-white mb-1">No repositories yet</h3>
      <p className="text-sm text-zinc-500 mb-6 max-w-xs">
        Import your GitHub repos to start showcasing your work on your profile.
      </p>
      <ImportButton onImport={onImport} importing={importing} />
    </div>
  )
}

function ImportButton({ onImport, importing }: { onImport: () => void; importing: boolean }) {
  return (
    <button
      type="button"
      onClick={onImport}
      disabled={importing}
      className={`
        inline-flex items-center gap-2.5 text-sm font-semibold
        px-4 py-2.5 rounded-lg transition-all duration-200
        disabled:cursor-not-allowed active:scale-95
        ${importing
          ? "bg-indigo-600/50 text-indigo-300 border border-indigo-500/30"
          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/10 border border-indigo-500"}
      `}
    >
      {importing ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-indigo-300/30 border-t-indigo-300 rounded-full animate-spin" />
          Importing from GitHub…
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" fill="currentColor" />
          </svg>
          Import from GitHub
        </>
      )}
    </button>
  )
}

type Filter = "all" | "visible" | "hidden"

function FilterTabs({ active, onChange, counts }: {
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