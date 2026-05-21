import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children, }: { children: React.ReactNode }) {
    const session = await auth()

    if (!session) redirect("/")

    return (
        <div style={{ display: "flex" }}>
            <nav style={{ width: 250, borderRight: "1px solid #ccc", minHeight: "100vh" }}>
                <h2>Portfolio Builder</h2>
                <ul>
                    <li><a href="/dashboard/overview">Overview</a></li>
                    <li><a href="/dashboard/profile">Profile</a></li>
                    <li><a href="/dashboard/projects">Projects</a></li>
                    <li><a href="/dashboard/appearance">Appearance</a></li>
                    <li><a href="/dashboard/publish">Publish</a></li>
                </ul>
            </nav>
            <main style={{ flex: 1, padding: 24 }}>{children}</main>
        </div>
    )
}