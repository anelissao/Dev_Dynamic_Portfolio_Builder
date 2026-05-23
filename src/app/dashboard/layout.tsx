import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children, }: { children: React.ReactNode }) {
    const session = await auth()

    if (!session) redirect("/")

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <nav className="w-64 bg-slate-900 text-white min-h-screen p-6">
                <h2 className="font-bold text-lg mb-8">Portfolio Builder</h2>
                <ul className="space-y-2">
                    <li><a className="block px-4 py-2 rounded-lg hover:bg-slate-800 text-gray-300 hover:text-white transition-colors"  href="/dashboard/overview">Overview</a></li>
                    <li><a className="block px-4 py-2 rounded-lg hover:bg-slate-800 text-gray-300 hover:text-white transition-colors" href="/dashboard/profile">Profile</a></li>
                    <li><a className="block px-4 py-2 rounded-lg hover:bg-slate-800 text-gray-300 hover:text-white transition-colors" href="/dashboard/projects">Projects</a></li>
                    <li><a className="block px-4 py-2 rounded-lg hover:bg-slate-800 text-gray-300 hover:text-white transition-colors" href="/dashboard/appearance">Appearance</a></li>
                    <li><a className="block px-4 py-2 rounded-lg hover:bg-slate-800 text-gray-300 hover:text-white transition-colors" href="/dashboard/publish">Publish</a></li>
                </ul>
            </nav>
            <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
    )
}