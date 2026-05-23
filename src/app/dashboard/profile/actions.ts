"use server"
import { auth } from "@/auth";
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache";

export async function updateBio(formData: FormData) {
    const session = await auth()

    if (!session?.user?.id) throw new Error("Not authenticated")

    const bio = formData.get("bio") as string


    await prisma.user.update({
        where: { id: session.user.id },
        data: { bio }
    })

    revalidatePath("/dashboard/profile")
}

export async function updateSkills(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Not authenticated")

    const skills = JSON.parse(formData.get("skills") as string) as string[]

    await prisma.user.update({ where: { id: session.user.id }, data: { skills } })

    revalidatePath("/dashboard/profile")
}

export async function saveSkills(skills: string[]) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Not authenticated")

    await prisma.user.update({
        where: { id: session.user.id },
        data: { skills },
    })

    revalidatePath("/dashboard/profile")
}

export async function addEducation(formData: FormData) {
    const session = await auth()

    if (!session?.user?.id) throw new Error("Not authenticated")

    await prisma.education.create({
        data: {
            school: formData.get("school") as string,
            dateOfStart: Number(formData.get("dateOfStart")),
            dateOfEnd: Number(formData.get("dateOfEnd")),
            description: formData.get("description") as string,
            userId: session.user.id,
        },
    })
    revalidatePath("/dashboard/profile")
}

export async function deleteEducation(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Not authenticated")

    await prisma.education.deleteMany({
        where: {
            id: formData.get("id") as string,
            userId: session.user.id,
        },
    })

    revalidatePath("/dashboard/profile")
}

export async function addExperience(formData: FormData) {
    const session = await auth()

    if (!session?.user?.id) throw new Error("Not authenticated")

    await prisma.experience.create({
        data: {
            company: formData.get("company") as string,
            role: formData.get("role") as string,
            dateOfStart: Number(formData.get("dateOfStart")),
            dateOfEnd: Number(formData.get("dateOfEnd")),
            description: formData.get("description") as string,
            userId: session.user.id,
        },
    })

    revalidatePath("/dashboard/profile")
}

export async function deleteExperience(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Not authenticated")

    await prisma.experience.deleteMany({
        where: {
            id: formData.get("id") as string,
            userId: session.user.id,
        },
    })

    revalidatePath("/dashboard/profile")
}