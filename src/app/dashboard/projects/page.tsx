import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import ProjectsPage from "./projects-content"
export default async function Page() {
  const session = await auth()
  if (!session?.user?.id) return <div>Not logged in</div>
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true, description: true, url: true, technologies: true, displayed: true },
  })
  return <ProjectsPage initialProjects={projects.map(p => ({
    ...p,
    description: p.description,
    url: p.url,
  }))} />
}