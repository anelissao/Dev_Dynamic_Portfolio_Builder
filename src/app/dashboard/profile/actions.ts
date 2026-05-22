"use server"
import { auth } from "@/auth";
import {prisma} from "@/lib/db"
import { revalidatePath } from "next/cache";

export async function updateBio(formData: FormData) {
    const session = await auth()

    if (!session?.user?.id) throw new Error("Not authenticated")

    const bio = formData.get("bio") as string


    await prisma.user.update({
        where: {id: session.user.id},
        data: {bio}
    })

    revalidatePath("/dashboard/profile")
}

export async function updateSkills(formData:FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Not authenticated")
    
    const skills = JSON.parse(formData.get("skills") as string) as string[]

    await prisma.user.update({where: {id: session.user.id}, data: {skills}})

    revalidatePath("/dashboard/profile")
}