import { auth, signOut, signIn } from "@/auth";
import Image from 'next/image'

export default async function Home () {
  const session = await auth()

  console.log(session)

  if(!session) {
    return (
      <form action={async () => {
        "use server"
        await signIn("github")
      }}>
        <button type="submit">Sign In with Github</button>
      </form>
    )
  }

  return (
    <div>
      <h1>welcome . {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
      {session.user?.image ? (
        <Image src={session.user.image} alt="user profile image" width={64} height={64} />
      ) : (
        <div>No profile image available</div>
      )}
      <form action={async () => {
        "use server"
        await signOut()
      }}>
        <button type="submit">Sign Out</button>
      </form>
    </div>
  )
}