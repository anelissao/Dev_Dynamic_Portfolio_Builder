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
    const projects = await getRepos(user.username)
    revalidatePath("/dashboard/projects")
    return { projects }
}

async function getRepos(username: string) {
    const session = await auth()

    if (!session?.user?.id) throw new Error("Not authenticated")

    const repos = await fetchRepos(username)
    const created: {
        id: string
        name: string
        description: string | null
        url: string
        technologies: string[]
        displayed: boolean
    }[] = []

    for (const repo of repos) {
        const project = await prisma.project.create({
            data: {
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
                user: { connect: { id: session.user.id } },
            },
        })
        created.push({
            id: project.id,
            name: project.name,
            description: project.description,
            url: project.url,
            technologies: project.technologies,
            displayed: project.displayed,
        })
    }

    return created
}

export async function toggleDisplay(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Not authenticated")

    const projectId = formData.get("id") as string

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { displayed: true, userId: true },
    })

    if (!project || project.userId !== session.user.id) throw new Error("Not found")

    await prisma.project.update({
        where: { id: projectId },
        data: { displayed: !project.displayed }
    })

    revalidatePath("/dashboard/projects")
}

export async function updateProject(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const projectId = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const url = formData.get("url") as string
  const liveDemoUrl = formData.get("liveDemoUrl") as string
  const imageUrl = formData.get("imageUrl") as string
  const technologies = formData.get("technologies") as string


  await prisma.project.update({
    where: { id: projectId, userId: session.user.id },
    data: {
      name,
      description: description || null,
      url: url,
      liveDemoUrl: liveDemoUrl || null,
      imageUrl: imageUrl || null,
      technologies: technologies ? technologies.split(",").map(t => t.trim()) : [],
    },
  })

  revalidatePath("/dashboard/projects")
  return { success: true }
}

export async function deleteProjectImage(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  await prisma.project.update({
    where: { id: projectId, userId: session.user.id },
    data: { imageUrl: null },
  })

  revalidatePath("/dashboard/projects")
  return { success: true }
}