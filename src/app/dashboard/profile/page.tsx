import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { addEducation, deleteEducation, updateBio, updateSkills } from "./actions"
import { SkillsForm } from "./skills-form"

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
        <form action={updateBio}>
          <textarea name="bio" defaultValue={user.bio ?? ""} rows={3}></textarea>
          <button type="submit">Save</button>
        </form>
      </section>

      <section>
        <h3>Skills</h3>
        <SkillsForm initialSkills={user.skills} />
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
        <ul>
          {user.education.map((edu) => (
            <li key={edu.id}>
              {edu.school} ({edu.dateOfStart} - {edu.dateOfEnd})
              <form action={deleteEducation}>
                <input type="hidden" name="id" value={edu.id} />
                <button type="submit">Delete</button>
              </form>
            </li>
          ))}
        </ul>
          <form action={addEducation}>
            <input name="school" placeholder="Establishment name" required />
            <input name="dateOfStart" type="number" placeholder="Start year" required/>
            <input name="dateOfEnd" type="number" placeholder="End Year" required/>
            <input name="description" placeholder="Description (optional)" />
            <button type="submit">Add Education</button>
          </form>
      </section>
    </div>
  )
};
