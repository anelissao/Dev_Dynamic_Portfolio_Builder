import { auth } from "@/auth";
import {prisma} from "@/lib/db"
import { togglePublish } from "./actions";

export default async function PublishPage() {
  const session = await auth()
  if(!session?.user?.id) return <div>Not logged in</div>

  const user = await prisma.user.findUnique({
    where: {id: session.user.id},
    select: {published: true, username: true}
  })

  if(!user?.username) return <div>No Github username found</div>

  const portfolioUrl = `${process.env.NEXT_PUBLIC_URL || "http://localhost:300"}/portfolio/${user.username}`

  return (
    <div>
      <h3>Your Portfolio</h3>
      {user.published ? (
        <a href={portfolioUrl} target="_blank">{portfolioUrl}</a>
      ) : (
        <p>Not published</p>
      )}
      <form action={togglePublish}>
        <button type="submit">
          {user.published ? "Unpublish" : "Publish"}
        </button>
      </form>
    </div>
  )
}