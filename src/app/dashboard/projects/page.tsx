import { auth } from "@/auth";
import { prisma } from "@/lib/db"

export default async function ProjectsPage() {
  const session = auth()

  if (!session?.user?.id) return <div>Not Logged in</div>

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
  })

  return (
    <div>
      <h3>Your Github Projects</h3>
      <form action={}>
        <input name="username" placeholder="Enter Github Username" required/>
        <button type="submit">Import Repos</button>
      </form>

      <ul>
        {projects.map((p)=> (
          <li key={p.id}>
            <span>{p.name}</span>
            <span>{p.technologies}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}