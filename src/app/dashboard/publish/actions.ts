"use server"
import { auth } from "@/auth"
import {prisma} from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function togglePublish() {
    const session = await auth()
    if(!session?.user?.id) throw new Error("Not authenticated")

    const user = await prisma.user.findUnique({
        where: {id: session.user.id},
        select: {published: true, username: true}
    })

    if(!user?.username) throw new Error("Set your username")

    await prisma.user.update({
        where: {id: session.user.id},
        data: {published: !user.published},
    })

    revalidatePath("/dashboard/publish")
}