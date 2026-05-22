import { auth } from "@/auth";
import { prisma } from "@/lib/db"
import { importRepos } from "./actions";
import { toggleDisplay } from "./actions";

export default async function ProjectsPage() {
  const session = await auth()

  if (!session?.user?.id) return <div>Not Logged in</div>

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
  })

  return (
    <div>
      <h3>Your Github Projects</h3>
      <form action={importRepos}>
        <button type="submit">Import Repos</button>
      </form>

      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <form action={toggleDisplay}>
              <input type="hidden" name="id" value={p.id} />
              <input type="checkbox" defaultChecked={p.displayed} onChange={(e) => e.currentTarget.form?.requestSubmit()} />
            </form>
            <span>{p.name}</span>
            <span>{p.technologies}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}