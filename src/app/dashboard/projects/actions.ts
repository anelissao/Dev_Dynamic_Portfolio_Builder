"use server"
import { auth } from "@/auth";
import { prisma } from "@/lib/db"
import { fetchRepos } from "@/lib/github";
import { revalidatePath } from "next/cache";

export async function getUsername(formData: FormData) {
    const session = await auth()

    if(!session?.user?.id) throw new Error("Not authenticated")

    const username = formData.get("username") as string

    await prisma.user.update({
        where: {id: session.user.id},
        data: {username},
    })

    await getRepos(username)

    revalidatePath("/dashboard/projects")
}

export async function getRepos(username:string) {
    const session = await auth()

    if(!session?.user?.id) throw new Error("Not authenticated")

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
        console.log(repo)
    }

    revalidatePath("/dashboard/projects")
}