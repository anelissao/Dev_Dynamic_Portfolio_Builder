import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    return <div>you have to be logged in</div>
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { education: true, experience: true }
  })

  if (!user) return <div>User Not Found</div>

  return (
    <div>
      <section>
        <h3>Bio</h3>
        <p>{user.bio || "No bio yet"}</p>
      </section>

      <section>
        <h3>Skills</h3>
        <ul>{user.skills.map((skill, i) => (<li key={i}>{skill}</li>))}</ul>
      </section>

      <section>
        <h3>Experience</h3>
        {user.experience.map((exp) => (
          <div key={exp.id}>
            <p>{exp.company}</p>
          </div>
        ))}
      </section>

      <section>
        <h3>Education</h3>
        {user.education.map((edu) => (
          <div key={edu.id}>
            <p>{edu.school}</p>
          </div>
        ))}
      </section>
    </div>
  )
};
