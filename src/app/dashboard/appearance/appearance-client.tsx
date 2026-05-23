"use client"

import { useState, useTransition } from "react"
import { Palette, Sparkles, RotateCcw } from "lucide-react"
import ThemeCard from "./theme-card"
import { updateTheme } from "./actions"
import PortfolioPreview from "./portfolio-preview"


interface AppearanceClientProps {
    currentTheme: string | null
}

const themes = [
    {
        name: "Default",
        value: "default",
        description: "Clean and professional",
        colors: ["#3b82f6", "#8b5cf6", "#ec4899"],
        preview: "bg-gradient-to-br from-blue-500 to-purple-600"
    },
    {
        name: "Dark",
        value: "dark",
        description: "Sleek and modern",
        colors: ["#18181b", "#27272a", "#3f3f46"],
        preview: "bg-gradient-to-br from-zinc-800 to-zinc-950"
    },
    {
        name: "Minimal",
        value: "minimal",
        description: "Simple and elegant",
        colors: ["#f4f4f5", "#e4e4e7", "#d4d4d8"],
        preview: "bg-gradient-to-br from-zinc-100 to-zinc-300"
    },
    {
        name: "Colorful",
        value: "colorful",
        description: "Bold and vibrant",
        colors: ["#f59e0b", "#10b981", "#6366f1"],
        preview: "bg-gradient-to-br from-amber-500 via-green-500 to-indigo-600"
    }
]

export default function AppearanceClient({ currentTheme }: AppearanceClientProps) {
    const [selectedTheme, setSelectedTheme] = useState(currentTheme || "default")
    const [isPending, startTransition] = useTransition()
    const [showSuccess, setShowSuccess] = useState(false)

    const hasChanges = selectedTheme !== currentTheme

    const handleThemeSelect = (themeValue: string) => {
        setSelectedTheme(themeValue)
    }

    const handleSave = () => {
        startTransition(async () => {
            const formData = new FormData()
            formData.append("theme", selectedTheme)
            await updateTheme(formData)

            // Show success message
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        })
    }

    const handleReset = () => {
        setSelectedTheme(currentTheme || "default")
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <Palette className="text-blue-500" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Appearance
                        </h1>
                        <p className="text-zinc-400 text-sm mt-0.5">
                            Customize how your portfolio looks to visitors
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 animate-in slide-in-from-top duration-300">
                    <Sparkles className="text-green-500" size={20} />
                    <p className="text-green-500 font-medium">
                        Theme saved successfully!
                    </p>
                </div>
            )}

            {/* Main Content Grid - Theme Selection + Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Left Column - Theme Selection */}
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        Choose Your Theme
                        <span className="text-xs font-normal text-zinc-500 bg-zinc-800 px-2 py-1 rounded-md">
                            {themes.length} options
                        </span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {themes.map((theme) => (
                            <ThemeCard
                                key={theme.value}
                                theme={theme}
                                isSelected={selectedTheme === theme.value}
                                onSelect={handleThemeSelect}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Column - Live Preview */}
                <div className="lg:sticky lg:top-8 lg:self-start">
                    <PortfolioPreview theme={selectedTheme} />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                <button
                    onClick={handleReset}
                    disabled={!hasChanges || isPending}
                    className="
          px-6 py-3 rounded-xl border border-zinc-800 
          text-zinc-400 hover:text-white hover:border-zinc-700 
          transition-all disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center gap-2
        "
                >
                    <RotateCcw size={16} />
                    Reset Changes
                </button>

                <button
                    onClick={handleSave}
                    disabled={!hasChanges || isPending}
                    className="
          px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 
          text-white font-medium shadow-lg shadow-blue-600/30 
          transition-all hover:shadow-blue-500/40
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center gap-2
        "
                >
                    {isPending ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Sparkles size={16} />
                            Save Theme
                        </>
                    )}
                </button>
            </div>

            {/* Info Card */}
            <div className="mt-8 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <h3 className="text-sm font-semibold text-white mb-2">
                    💡 Pro Tip
                </h3>
                <p className="text-sm text-zinc-400">
                    Your theme choice affects how your portfolio appears to visitors.
                    Choose one that matches your personal brand and makes your work stand out.
                </p>
            </div>
        </div>
    )

}
