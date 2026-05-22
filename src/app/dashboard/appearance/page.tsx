import { auth } from "@/auth";
import { prisma } from "@/lib/db"
import { updateTheme } from "./actions";

export default async function Appearance() {
  const session = await auth()
  if (!session?.user?.id) return <div>Not logged in</div>

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { theme: true },
  })

  const themes = ["default", "dark", "minimal", "colorful"]

  return (
    <div>
      <h3>Choose Theme</h3>
      <form action={updateTheme} defaultValue={user?.theme}>
        <select name="theme" defaultValue={user?.theme}>
          {themes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </form>
    </div>
  )
}