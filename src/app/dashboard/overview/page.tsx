import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export default async function OverviewPage() {
  const session = await auth()
  if (!session?.user?.id) return <div>Not logged in</div>
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      projects: { where: { displayed: true } },
      education: true,
      experience: true,
    },
  })
  if (!user) return <div>User not found</div>
  const steps = [
    { label: "GitHub connected", done: !!user.username },
    { label: "Bio added", done: !!user.bio },
    { label: "Skills added", done: user.skills.length > 0 },
    { label: "Projects selected", done: user.projects.length > 0 },
    { label: "Education added", done: user.education.length > 0 },
    { label: "Experience added", done: user.experience.length > 0 },
    { label: "Published", done: user.published },
  ]
  const completed = steps.filter((s) => s.done).length
  const total = steps.length
  const percent = Math.round((completed / total) * 100)
  return (
    <div>
      <h3>Setup Progress</h3>
      <div>
        <div style={{ width: `${percent}%`, height: 20, background: "green" }} />
        <p>{completed} of {total} steps done ({percent}%)</p>
      </div>
      <ul>
        {steps.map((step) => (
          <li key={step.label}>
            {step.done ? "✓" : "○"} {step.label}
          </li>
        ))}
      </ul>
    </div>
  )
}