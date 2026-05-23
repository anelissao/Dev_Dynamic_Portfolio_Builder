import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"

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
      <Card>
        <CardHeader>
          <CardTitle>Setup Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">{completed} of {total} steps done ({percent}%)</p>
          </div>
          <ul className="mt-6 space-y-3">
            {steps.map((step) => (
              <li key={step.label} className={step.done ? "text-green-600" : "text-gray-500"}>
                {step.done ? "✓" : "○"} {step.label}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}