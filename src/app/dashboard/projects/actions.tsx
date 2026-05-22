"use server"
import { auth } from "@/auth";
import { prisma } from "@/lib/db"
import { fetchRepos } from "@/lib/github";
import { revalidatePath } from "next/cache";
import { use } from "react";

export async function getUsername(formData: FormData) {
    const session = await auth()

    if(!session?.user?.id) return <div>Not Logged in</div>

    const username = formData.get("username") as string

    await prisma.user.update({
        where: {id: session.user.id},
        data: {username},
    })

    revalidatePath("/dashboard/projects")
}

