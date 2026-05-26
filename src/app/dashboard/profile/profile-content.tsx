"use client"

import { useState } from "react"
import { updateBio, addExperience, deleteExperience, addEducation, deleteEducation } from "./actions"
import { FloatInput } from "@/components/float-input"
import { FloatTextarea } from "@/components/float-text-area"
import { Card } from "@/components/card"
import { SectionHeader } from "@/components/section-header"
import { Btn } from "@/components/btn"
import { TimelineEntry } from "@/components/timeline-entry"
import { AddFormToggle } from "@/components/add-form-toggle"
import { SkillsSection } from "@/components/skills-section"
import { UploadButton } from "@uploadthing/react"
import { OurFileRouter } from "@/app/api/uploadthing/core"
import { updateAvatar } from "./actions"
import Image from "next/image"
import { updatePersonalInfo } from "./actions"

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
  avatarUrl: string | null
  image: string | null
  name: string | null
  username: string | null
  title: string | null
  phone: string | null
  location: string | null
  linkedin: string | null
  twitter: string | null
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

  const handleAddExp = async (fd: FormData) => {
    const created = await addExperience(fd)
    setExperiences(prev => [...prev, created])
  }

  const handleAddEdu = async (fd: FormData) => {
    const created = await addEducation(fd)
    setEducations(prev => [...prev, created])
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

  const avatarSrc = user.avatarUrl ?? user.image

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

        {/* ── Row 1: Avatar | Bio | Personal Info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Avatar */}
          <Card>
            <SectionHeader icon="●" title="Avatar" />
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center overflow-hidden ring-1 ring-white/10">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {(user.name ?? user.username ?? "?").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">{user.name ?? user.username ?? "—"}</p>
                {user.username && <p className="text-xs text-zinc-500 mt-0.5">@{user.username}</p>}
              </div>
              <UploadButton<OurFileRouter, "avatarUploader">
                endpoint="avatarUploader"
                onClientUploadComplete={async (res) => {
                  const fd = new FormData()
                  fd.append("avatarUrl", res[0].ufsUrl)
                  await updateAvatar(fd)
                  window.location.reload()
                }}
                onUploadError={(e) => console.error(e)}
              />
            </div>
          </Card>

          {/* Bio */}
          <Card className="lg:col-span-2">
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
        </div>

        {/* ── Row 2: Personal Info | Skills ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <SectionHeader icon="◎" title="Personal Info" />
            <form action={updatePersonalInfo} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatInput name="title" label="Title" defaultValue={user.title ?? ""} />
                <FloatInput name="phone" label="Phone" defaultValue={user.phone ?? ""} />
                <FloatInput name="location" label="Location" defaultValue={user.location ?? ""} />
                <FloatInput name="linkedin" label="LinkedIn URL" defaultValue={user.linkedin ?? ""} />
                <FloatInput name="twitter" label="Twitter URL" defaultValue={user.twitter ?? ""} />
              </div>
              <Btn type="submit" variant="primary">Save</Btn>
            </form>
          </Card>

          <SkillsSection initialSkills={user.skills} />
        </div>

        {/* ── Row 3: Experience | Education ── */}
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
              <form action={handleAddExp} className="space-y-3">
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
              <form action={handleAddEdu} className="space-y-3">
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