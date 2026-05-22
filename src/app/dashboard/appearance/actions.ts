"use server"
import { auth } from "@/auth"
import {prisma} from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateTheme(formData:FormData) {
    const session = await auth()

    if(!session?.user?.id) throw new Error("Not authenticated")

    await prisma.user.update({
        where: {id: session.user.id},
        data: {theme: formData.get("theme") as string},
    })

    revalidatePath("/dashboard/appearance")
}