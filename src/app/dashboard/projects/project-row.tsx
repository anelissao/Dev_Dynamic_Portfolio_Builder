"use client"

import { useState } from "react"
import { Edit, ExternalLink } from "lucide-react"
import { ProjectEditModal } from "./project-edit-modal"
import Image from "next/image"

interface Project {
  id: string
  name: string
  description: string | null
  url: string | null
  liveDemoUrl: string | null
  imageUrl: string | null
  technologies: string[]
  displayed: boolean
}

interface ProjectRowProps {
  project: Project
  onToggle: (id: string, current: boolean) => void
}

export function ProjectRow({ project, onToggle }: ProjectRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-4 px-5 py-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors">
        {/* Project Image Thumbnail */}
        {project.imageUrl && (
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-zinc-800 flex-shrink-0">
            <Image
              src={project.imageUrl}
              alt={project.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Project Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-white truncate">{project.name}</h3>
            
          </div>
          {project.description && (
            <p className="text-sm text-zinc-500 line-clamp-1">{project.description}</p>
          )}
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-1"
            >
              <ExternalLink size={12} />
              Live Demo
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditOpen(true)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <Edit size={16} />
          </button>
          
          <button
            onClick={() => onToggle(project.id, project.displayed)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              project.displayed
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
            }`}
          >
            {project.displayed ? 'Visible' : 'Hidden'}
          </button>
        </div>
      </div>

      <ProjectEditModal
        project={project}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdate={() => window.location.reload()}
      />
    </>
  )
}
