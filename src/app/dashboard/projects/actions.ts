"use server"
import { auth } from "@/auth";
import { prisma } from "@/lib/db"
import { fetchRepos } from "@/lib/github";
import { revalidatePath } from "next/cache";

export async function importRepos() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Not authenticated")
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { username: true },
    })
    if (!user?.username) throw new Error("No GitHub username found")
    await getRepos(user.username)
    revalidatePath("/dashboard/projects")
}

async function getRepos(username: string) {
    const session = await auth()

    if (!session?.user?.id) throw new Error("Not authenticated")

    const repos = await fetchRepos(username)

    for (const repo of repos) {
        await prisma.project.create({
            data: {
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
                user: { connect: { id: session.user.id } },
            },
        })
    }

    revalidatePath("/dashboard/projects")
}