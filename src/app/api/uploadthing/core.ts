import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/auth"
import { metadata } from "@/app/layout"

const f = createUploadthing()

export const ourFileRouter = {
    avatarUploader: f({
        image: { maxFileSize: "4MB", maxFileCount: 1 },
    })
        .middleware(async () => {
            const session = await auth()
            if (!session?.user?.id) throw new Error("Not Authenticated")
            return { userId: session.user.id }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for", metadata.userId, file.ufsUrl)
        }),
    projectImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => {
            const session = await auth();
            if (!session?.user?.id) throw new Error("Unauthorized");
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("File URL:", file.ufsUrl);
            return { uploadedBy: metadata.userId, url: file.ufsUrl };
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter