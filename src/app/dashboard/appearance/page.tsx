import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import AppearanceClient from "./appearance-client"

export default async function Appearance() {
  const session = await auth()

  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-zinc-400 text-lg">Not logged in</p>
          <p className="text-zinc-500 text-sm mt-2">
            Please sign in to customize your appearance
          </p>2 
        </div>
      </div>
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { theme: true },
  })

  return <AppearanceClient currentTheme={user?.theme ?? null} />
}
