"use client"

import { useState, useRef, useEffect } from "react"
import { updateBio, addExperience, deleteExperience, addEducation, deleteEducation, saveSkills } from "./actions"

interface Experience {
  id: string
  company: string
  role: string | null
  dateOfStart: number
  dateOfEnd: number | null
  description: string | null
}
interface Education {
  id: string
  school: string
  dateOfStart: number
  dateOfEnd: number | null
  description: string | null
}
interface User {
  bio: string | null
  skills: string[]
  experience: Experience[]
  education: Education[]
}
function FloatInput({
  name, label, type = "text", required, defaultValue, placeholder, className = ""
}: {
  name: string; label: string; type?: string; required?: boolean
  defaultValue?: string; placeholder?: string; className?: string
}) {
  const [focused, setFocused] = useState(false)
  const [hasVal, setHasVal] = useState(!!defaultValue)
  return (
    <div className={`relative group ${className}`}>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={focused ? (placeholder ?? "") : ""}
        onFocus={() => setFocused(true)}
        onBlur={e => { setFocused(false); setHasVal(!!e.target.value) }}
        onChange={e => setHasVal(!!e.target.value)}
        className="
          peer w-full bg-zinc-900 border border-zinc-800 rounded-lg
          px-4 pt-6 pb-2 text-sm text-white outline-none
          transition-all duration-200
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
          hover:border-zinc-700
          placeholder:text-zinc-600
        "
      />
      <label className={`
        pointer-events-none absolute left-4 transition-all duration-200 font-medium
        ${(focused || hasVal)
          ? "top-2 text-[10px] text-indigo-400 tracking-wider uppercase"
          : "top-1/2 -translate-y-1/2 text-sm text-zinc-500"}
      `}>
        {label}
      </label>
      <div className={`
        absolute bottom-0 left-0 h-px bg-indigo-500 transition-all duration-300
        ${focused ? "w-full" : "w-0"}
      `} />
    </div>
  )
}

function FloatTextarea({ name, label, defaultValue, rows = 3 }: {
  name: string; label: string; defaultValue?: string; rows?: number
}) {
  const [focused, setFocused] = useState(false)
  const [hasVal, setHasVal] = useState(!!defaultValue)
  return (
    <div className="relative group">
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        onFocus={() => setFocused(true)}
        onBlur={e => { setFocused(false); setHasVal(!!e.target.value) }}
        onChange={e => setHasVal(!!e.target.value)}
        className="
          peer w-full bg-zinc-900 border border-zinc-800 rounded-lg
          px-4 pt-8 pb-3 text-sm text-white outline-none resize-none
          transition-all duration-200
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
          hover:border-zinc-700
        "
      />
      <label className={`
        pointer-events-none absolute left-4 transition-all duration-200 font-medium
        ${(focused || hasVal)
          ? "top-2.5 text-[10px] text-indigo-400 tracking-wider uppercase"
          : "top-4 text-sm text-zinc-500"}
      `}>
        {label}
      </label>
      <div className={`
        absolute bottom-0 left-0 h-px bg-indigo-500 transition-all duration-300
        ${focused ? "w-full" : "w-0"}
      `} />
    </div>
  )
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`
      bg-zinc-900 border border-zinc-800 rounded-2xl p-8
      transition-all duration-300 hover:border-zinc-700
      ${className}
    `}>
      {children}
    </div>
  )
}

function SectionHeader({ icon, title, count }: { icon: string; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-base">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {count !== undefined && (
        <span className="ml-auto text-xs font-medium text-zinc-500 bg-zinc-800 border border-zinc-700 rounded-full px-2.5 py-0.5">
          {count}
        </span>
      )}
    </div>
  )
}

function Btn({ children, type = "button", onClick, variant = "primary", size = "md", className = "" }: {
  children: React.ReactNode; type?: "button" | "submit"; onClick?: () => void
  variant?: "primary" | "ghost" | "danger"; size?: "sm" | "md"; className?: string
}) {
  const base = "inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
  const sizes = { sm: "text-xs px-3 py-1.5", md: "text-sm px-4 py-2.5" }
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/10",
    ghost: "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700",
    danger: "bg-zinc-800 hover:bg-red-500/10 hover:border-red-500/30 text-zinc-500 hover:text-red-400 border border-zinc-700",
  }
  return (
    <button type={type} onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

function SkillsSection({ initialSkills }: { initialSkills: string[] }) {
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

function TimelineEntry({
  title, subtitle, start, end, description, onDelete, accent = "indigo"
}: {
  title: string; subtitle?: string | null; start: number; end?: number | null
  description?: string | null; onDelete: () => void; accent?: "indigo" | "violet"
}) {
  const [confirming, setConfirming] = useState(false)

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); setTimeout(() => setConfirming(false), 3000); return }
    await onDelete()
  }

  const accentClasses = {
    indigo: "bg-indigo-500 shadow-indigo-500/50",
    violet: "bg-violet-500 shadow-violet-500/50",
  }

  return (
    <div className="group relative flex gap-4 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-col items-center pt-1">
        <div className={`w-2.5 h-2.5 rounded-full shadow-md flex-shrink-0 mt-0.5 ${accentClasses[accent]}`} />
        <div className="w-px flex-1 bg-zinc-800 mt-1.5 group-last:hidden" />
      </div>

      <div className="flex-1 min-w-0 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white leading-tight">{title}</h3>
            {subtitle && <p className="text-xs text-indigo-400 mt-0.5 font-medium">{subtitle}</p>}
            <p className="text-xs text-zinc-500 mt-1">
              {start} – {end ?? "Present"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className={`
              flex-shrink-0 text-xs px-2.5 py-1.5 rounded-lg font-medium
              border transition-all duration-200 cursor-pointer
              opacity-0 group-hover:opacity-100
              ${confirming
                ? "border-red-500/40 text-red-400 bg-red-500/10"
                : "border-zinc-700 text-zinc-600 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5"}
            `}
          >
            {confirming ? "Confirm?" : "Remove"}
          </button>
        </div>
        {description && (
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  )
}

function AddFormToggle({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`
          group w-full flex items-center justify-center gap-2
          border border-dashed rounded-xl py-3 text-sm font-medium
          transition-all duration-200 cursor-pointer
          ${open
            ? "border-indigo-500/30 text-indigo-400 bg-indigo-500/5"
            : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400 hover:bg-zinc-800/50"}
        `}
      >
        <span className={`text-base transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
        {open ? "Cancel" : label}
      </button>

      <div className={`
        overflow-hidden transition-all duration-300
        ${open ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"}
      `}>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage({ user }: { user: User }) {
  const [bioSaving, setBioSaving] = useState(false)
  const [bioSaved, setBioSaved] = useState(false)
  const [experiences, setExperiences] = useState(user.experience)
  const [educations, setEducations] = useState(user.education)

  const handleBioSave = async (formData: FormData) => {
    setBioSaving(true)
    await updateBio(formData)
    setBioSaving(false)
    setBioSaved(true)
    setTimeout(() => setBioSaved(false), 2500)
  }

  const handleDeleteExp = async (id: string) => {
    const fd = new FormData()
    fd.append("id", id)
    await deleteExperience(fd)
    setExperiences(prev => prev.filter(e => e.id !== id))
  }

  const handleDeleteEdu = async (id: string) => {
    const fd = new FormData()
    fd.append("id", id)
    await deleteEducation(fd)
    setEducations(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
          backgroundSize: "64px 64px"
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-12 space-y-6">

        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-1">
            Account
          </p>
          <h1 className="text-4xl font-bold text-white tracking-tight">Your Profile</h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Keep your profile updated — it shapes how others discover you.
          </p>
        </div>

        <Card>
          <SectionHeader icon="✦" title="Bio" />
          <form action={handleBioSave} className="space-y-4">
            <FloatTextarea
              name="bio"
              label="Tell us about yourself"
              defaultValue={user.bio ?? ""}
              rows={4}
            />
            <div className="flex items-center gap-3">
              <Btn type="submit" variant="primary">
                {bioSaving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving
                  </span>
                ) : bioSaved ? "✓ Saved" : "Save Bio"}
              </Btn>
              <p className="text-xs text-zinc-600">
                Markdown supported
              </p>
            </div>
          </form>
        </Card>

        <SkillsSection initialSkills={user.skills} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <Card className="h-fit">
            <SectionHeader icon="◈" title="Experience" count={experiences.length} />

            {experiences.length > 0 ? (
              <div className="divide-y divide-zinc-800/60">
                {experiences.map(exp => (
                  <TimelineEntry
                    key={exp.id}
                    title={exp.company}
                    subtitle={exp.role}
                    start={exp.dateOfStart}
                    end={exp.dateOfEnd}
                    description={exp.description}
                    onDelete={() => handleDeleteExp(exp.id)}
                    accent="indigo"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-600 italic py-4">No experience entries yet</p>
            )}

            <AddFormToggle label="Add Experience">
              <form
                action={async (fd) => {
                  await addExperience(fd)
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <FloatInput name="company" label="Company" required className="col-span-2" />
                  <FloatInput name="role" label="Role / Title" required className="col-span-2" />
                  <FloatInput name="dateOfStart" label="Start Year" type="number" required />
                  <FloatInput name="dateOfEnd" label="End Year" type="number" />
                </div>
                <FloatTextarea name="description" label="Description (optional)" rows={2} />
                <Btn type="submit" variant="primary">Add Entry</Btn>
              </form>
            </AddFormToggle>
          </Card>

          <Card className="h-fit">
            <SectionHeader icon="◇" title="Education" count={educations.length} />

            {educations.length > 0 ? (
              <div className="divide-y divide-zinc-800/60">
                {educations.map(edu => (
                  <TimelineEntry
                    key={edu.id}
                    title={edu.school}
                    start={edu.dateOfStart}
                    end={edu.dateOfEnd}
                    description={edu.description}
                    onDelete={() => handleDeleteEdu(edu.id)}
                    accent="violet"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-600 italic py-4">No education entries yet</p>
            )}

            <AddFormToggle label="Add Education">
              <form
                action={async (fd) => {
                  await addEducation(fd)
                }}
                className="space-y-3"
              >
                <FloatInput name="school" label="School / Institution" required />
                <div className="grid grid-cols-2 gap-3">
                  <FloatInput name="dateOfStart" label="Start Year" type="number" required />
                  <FloatInput name="dateOfEnd" label="End Year" type="number" />
                </div>
                <FloatTextarea name="description" label="Degree / Notes (optional)" rows={2} />
                <Btn type="submit" variant="primary">Add Entry</Btn>
              </form>
            </AddFormToggle>
          </Card>
        </div>

      </div>
    </div>
  )
}