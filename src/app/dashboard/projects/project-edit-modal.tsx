"use client"

import { useState, useTransition } from "react"
import { X, Upload, ExternalLink, Trash2 } from "lucide-react"
import { updateProject, deleteProjectImage } from "@/app/dashboard/projects/actions"
import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import Image from "next/image"

interface Project {
    id: string
    name: string
    description: string | null
    url: string | null
    liveDemoUrl: string | null
    imageUrl: string | null
    technologies: string[]
}

interface ProjectEditModalProps {
    project: Project
    isOpen: boolean
    onClose: () => void
    onUpdate: () => void
}

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function ProjectEditModal({ project, isOpen, onClose, onUpdate }: ProjectEditModalProps) {
    const [isPending, startTransition] = useTransition()
    const [imageUrl, setImageUrl] = useState(project.imageUrl)
    const [isUploading, setIsUploading] = useState(false)

    const { startUpload } = useUploadThing("projectImage", {
        onClientUploadComplete: (res) => {
            if (res?.[0]?.ufsUrl) {
                setImageUrl(res[0].ufsUrl)
            }
            setIsUploading(false)
        },
        onUploadError: (error) => {
            console.error("Upload error:", error)
            setIsUploading(false)
            alert("Upload failed. Please try again.")
        },
    })

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        await startUpload([file])
    }

    const handleDeleteImage = async () => {
        if (!confirm("Remove this image?")) return

        startTransition(async () => {
            await deleteProjectImage(project.id)
            setImageUrl(null)
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append("id", project.id)
        if (imageUrl) formData.append("imageUrl", imageUrl)

        startTransition(async () => {
            await updateProject(formData)
            onUpdate()
            onClose()
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
                    <h2 className="text-xl font-bold text-white">Edit Project</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Project Image */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-3">
                            Project Image
                        </label>

                        {imageUrl ? (
                            <div className="relative group">
                                <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800">
                                    <Image
                                        src={imageUrl}
                                        alt={project.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleDeleteImage}
                                    disabled={isPending}
                                    className="absolute top-3 right-3 p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="relative block aspect-video rounded-xl border-2 border-dashed border-zinc-800 hover:border-indigo-500/50 transition-all cursor-pointer group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                    className="sr-only"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                    {isUploading ? (
                                        <>
                                            <div className="w-10 h-10 border-4 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
                                            <p className="text-sm text-zinc-500">Uploading...</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-3 rounded-xl bg-zinc-800 group-hover:bg-indigo-500/10 border border-zinc-700 group-hover:border-indigo-500/50 transition-all">
                                                <Upload className="text-zinc-400 group-hover:text-indigo-400" size={24} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-white">Click to upload image</p>
                                                <p className="text-xs text-zinc-500 mt-1">PNG, JPG up to 4MB</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </label>
                        )}
                    </div>

                    {/* Project Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                            Project Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={project.name}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-white transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={project.description || ""}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-white resize-none transition-all"
                        />
                    </div>

                    {/* GitHub URL */}
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-white mb-2">
                            GitHub URL
                        </label>
                        <input
                            type="url"
                            id="url"
                            name="url"
                            defaultValue={project.url || ""}
                            placeholder="https://github.com/username/repo"
                            className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-white transition-all"
                        />
                    </div>

                    {/* Live Demo URL */}
                    <div>
                        <label htmlFor="liveDemoUrl" className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                            <ExternalLink size={16} />
                            Live Demo URL
                        </label>
                        <input
                            type="url"
                            id="liveDemoUrl"
                            name="liveDemoUrl"
                            defaultValue={project.liveDemoUrl || ""}
                            placeholder="https://your-project.com"
                            className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-white transition-all"
                        />
                    </div>

                    {/* Technologies */}
                    <div>
                        <label htmlFor="technologies" className="block text-sm font-medium text-white mb-2">
                            Technologies (comma-separated)
                        </label>
                        <input
                            type="text"
                            id="technologies"
                            name="technologies"
                            defaultValue={project.technologies.join(", ")}
                            placeholder="React, TypeScript, Node.js"
                            className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-white transition-all"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="flex-1 px-6 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || isUploading}
                            className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
