import { auth } from "@/auth";

export default async function Home () {
  const session = await auth()

  console.log(session)

  if(!session) {
    return <div>Not logged in</div>
  }

  return (
    <div>
      <h1>welcome . {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
      <img src={session.user?.image} alt="user profile image" width={64} height={64} />
    </div>
  )
}