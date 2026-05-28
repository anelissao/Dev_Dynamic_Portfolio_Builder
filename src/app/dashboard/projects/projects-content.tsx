"use client"

import { useState, useTransition } from "react"
import { importRepos, toggleDisplay } from "./actions"
import { ImportButton } from "@/components/import-button"
import { EmptyState } from "@/components/empty-state"
import { FilterTabs } from "@/components/filter-tabs"
import { ProjectRow } from "./project-row"

interface Project {
  id: string
  name: string
  description: string | null
  url: string | null
  technologies: string[]
  displayed: boolean
  liveDemoUrl: string | null
  imageUrl: string | null
}

type Filter = "all" | "visible" | "hidden"

export default function ProjectsPage({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [filter, setFilter] = useState<Filter>("all")
  const [isPending, startTransition] = useTransition()
  const [importError, setImportError] = useState<string | null>(null)
  const [importDone, setImportDone] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 10

  const handleImport = () => {
    setImportError(null)
    setImportDone(false)
    startTransition(async () => {
      try {
        const result = await importRepos()
        if (result?.projects) {
          setProjects(prev => [...prev, ...result.projects])
        }
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

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

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
              <FilterTabs active={filter} onChange={(f) => { setFilter(f); setPage(1) }} counts={counts} />
            </div>

            <div>
              {filtered.length > 0 ? (
                paginated.map((p) => (
                  <ProjectRow key={p.id} project={p} onToggle={handleToggle} />
                ))
              ) : (
                <div className="py-12 text-center text-sm text-zinc-600">
                  No {filter} repositories
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 px-5 py-4 border-t border-zinc-800">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>
                <span className="text-xs text-zinc-500">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}

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