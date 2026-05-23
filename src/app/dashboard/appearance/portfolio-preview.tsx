"use client"

import { Eye, User, Briefcase, Mail, Github, Linkedin } from "lucide-react"

interface PortfolioPreviewProps {
    theme: string
}

// Theme configurations
const themeStyles = {
    default: {
        bg: "bg-gradient-to-br from-blue-50 to-purple-50",
        card: "bg-white border-blue-200",
        text: "text-gray-900",
        accent: "text-blue-600",
        button: "bg-blue-600 text-white",
        badge: "bg-blue-100 text-blue-700"
    },
    dark: {
        bg: "bg-gradient-to-br from-zinc-900 to-zinc-950",
        card: "bg-zinc-800 border-zinc-700",
        text: "text-zinc-100",
        accent: "text-blue-400",
        button: "bg-blue-500 text-white",
        badge: "bg-zinc-700 text-zinc-300"
    },
    minimal: {
        bg: "bg-white",
        card: "bg-gray-50 border-gray-200",
        text: "text-gray-900",
        accent: "text-gray-700",
        button: "bg-gray-900 text-white",
        badge: "bg-gray-200 text-gray-700"
    },
    colorful: {
        bg: "bg-gradient-to-br from-amber-50 via-green-50 to-indigo-50",
        card: "bg-white border-indigo-200",
        text: "text-gray-900",
        accent: "text-indigo-600",
        button: "bg-gradient-to-r from-amber-500 to-indigo-600 text-white",
        badge: "bg-gradient-to-r from-amber-100 to-indigo-100 text-indigo-700"
    }
}

export default function PortfolioPreview({ theme }: PortfolioPreviewProps) {
    const styles = themeStyles[theme as keyof typeof themeStyles] || themeStyles.default

    return (
        <div className="space-y-4">
            {/* Header with Eye Icon */}
            <div className="flex items-center gap-2 mb-4">
                <Eye className="text-zinc-400" size={20} />
                <h2 className="text-lg font-semibold text-white">
                    Live Preview
                </h2>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-md">
                    Updates in real-time
                </span>
            </div>

            {/* Preview Container */}
            <div className="relative rounded-2xl border-2 border-zinc-800 overflow-hidden bg-zinc-900">
                {/* Browser Chrome */}
                <div className="bg-zinc-800 border-b border-zinc-700 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 mx-4 bg-zinc-900 rounded-md px-3 py-1.5 text-xs text-zinc-500 flex items-center gap-2">
                        <div className="w-3 h-3 text-zinc-600">🔒</div>
                        portfolio.dev/yourname
                    </div>
                </div>

                {/* Portfolio Preview Content */}
                <div className={`${styles.bg} p-8 min-h-[400px] transition-all duration-500`}>
                    {/* Hero Section */}
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Avatar & Name */}
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <User className="text-white" size={32} />
                            </div>
                            <div>
                                <h1 className={`text-2xl font-bold ${styles.text} transition-colors duration-300`}>
                                    John Developer
                                </h1>
                                <p className={`${styles.accent} transition-colors duration-300`}>
                                    Full Stack Developer
                                </p>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className={`${styles.card} border rounded-xl p-4 transition-all duration-300`}>
                            <p className={`text-sm ${styles.text} opacity-80`}>
                                Passionate developer building amazing web experiences.
                                Specialized in React, Node.js, and modern web technologies.
                            </p>
                        </div>

                        {/* Skills */}
                        <div className="space-y-3">
                            <h3 className={`text-sm font-semibold ${styles.text} transition-colors duration-300`}>
                                Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {["React", "TypeScript", "Node.js", "Tailwind"].map((skill) => (
                                    <span
                                        key={skill}
                                        className={`${styles.badge} px-3 py-1 rounded-full text-xs font-medium transition-all duration-300`}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Project Card */}
                        <div className={`${styles.card} border rounded-xl p-4 space-y-3 transition-all duration-300`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <Briefcase className={styles.accent} size={18} />
                                    <h3 className={`font-semibold ${styles.text} transition-colors duration-300`}>
                                        Featured Project
                                    </h3>
                                </div>
                            </div>
                            <p className={`text-xs ${styles.text} opacity-70`}>
                                A modern web application built with cutting-edge technologies
                            </p>
                            <div className="flex gap-2">
                                <span className={`${styles.badge} px-2 py-1 rounded text-xs transition-all duration-300`}>
                                    React
                                </span>
                                <span className={`${styles.badge} px-2 py-1 rounded text-xs transition-all duration-300`}>
                                    Next.js
                                </span>
                            </div>
                        </div>

                        {/* Contact Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button className={`${styles.button} px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300`}>
                                <Mail size={16} />
                                Contact
                            </button>
                            <button className={`${styles.card} border px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300`}>
                                <Github size={16} className="inline" />
                            </button>
                            <button className={`${styles.card} border px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300`}>
                                <Linkedin size={16} className="inline" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Label Overlay */}
                <div className="absolute top-20 right-4 bg-zinc-900/90 backdrop-blur border border-zinc-700 px-3 py-1.5 rounded-lg">
                    <p className="text-xs text-zinc-400">
                        Theme: <span className="text-white font-medium capitalize">{theme}</span>
                    </p>
                </div>
            </div>

            {/* Info Text */}
            <p className="text-xs text-zinc-500 text-center">
                This is how your portfolio will appear to visitors
            </p>
        </div>
    )
}
