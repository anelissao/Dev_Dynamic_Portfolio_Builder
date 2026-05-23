import { useState, useRef } from "react"
import { saveSkills } from "@/app/dashboard/profile/actions"
import { Card } from "@/components/card"
import { SectionHeader } from "@/components/section-header"
import { Btn } from "@/components/btn"

export function SkillsSection({ initialSkills }: { initialSkills: string[] }) {
    const [skills, setSkills] = useState<string[]>(initialSkills ?? [])
    const [input, setInput] = useState("")
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const addSkill = () => {
        const trimmed = input.trim()
        if (!trimmed || skills.includes(trimmed)) return
        setSkills(prev => [...prev, trimmed])
        setInput("")
        setSaved(false)
        inputRef.current?.focus()
    }

    const removeSkill = (s: string) => {
        setSkills(prev => prev.filter(x => x !== s))
        setSaved(false)
    }

    const save = async () => {
        setSaving(true)
        await saveSkills(skills)
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    return (
        <Card>
            <SectionHeader icon="⚡" title="Skills" count={skills.length} />
            <div className="flex flex-wrap gap-2 mb-5 min-h-[2.5rem]">
                {skills.map(skill => (
                    <span
                        key={skill}
                        className="
              group inline-flex items-center gap-1.5 text-xs font-medium
              bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg
              pl-3 pr-2 py-1.5 transition-all duration-150
              hover:border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-500/5
            "
                    >
                        {skill}
                        <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="
                w-4 h-4 rounded-md flex items-center justify-center
                text-zinc-600 hover:text-red-400 hover:bg-red-500/10
                transition-all duration-150 text-xs cursor-pointer
              "
                            aria-label={`Remove ${skill}`}
                        >
                            ✕
                        </button>
                    </span>
                ))}
                {skills.length === 0 && (
                    <p className="text-sm text-zinc-600 italic">No skills added yet</p>
                )}
            </div>

            <div className="flex gap-3">
                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
                        placeholder="Add a skill — press Enter"
                        className="
              w-full bg-zinc-900 border border-zinc-800 rounded-lg
              px-4 py-2.5 text-sm text-white outline-none
              focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
              hover:border-zinc-700 transition-all duration-200
              placeholder:text-zinc-600
            "
                    />
                </div>
                <Btn onClick={addSkill} variant="ghost">Add</Btn>
                <Btn onClick={save} variant="primary">
                    {saving ? (
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving
                        </span>
                    ) : saved ? "✓ Saved" : "Save Skills"}
                </Btn>
            </div>
        </Card>
    )
}
