import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import ProfilePage from "./profile-content"


export default async function Page() {
  const session = await auth()
  if (!session?.user?.id) return <div>Not logged in</div>
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { education: true, experience: true },
  })
  if (!user) return <div>User not found</div>
  return (
    <ProfilePage
      user={{
        bio: user.bio,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
      }}
    />
  )
}