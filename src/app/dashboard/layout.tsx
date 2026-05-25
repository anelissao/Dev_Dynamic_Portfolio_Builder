import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
    LayoutDashboard,
    User,
    FolderGit2,
    Palette,
    Rocket,
} from "lucide-react";
import Image from 'next/image'
import { MobileSidebar } from "./mobile-sidebar";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) redirect("/");

    return (
        <div className="h-screen bg-zinc-950 flex text-zinc-100 overflow-hidden">
            {/* Responsive Sidebar with Mobile Menu */}
            <MobileSidebar>
                {/* Sidebar Content */}
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-zinc-800 flex-shrink-0">
                        <h1 className="text-xl font-bold tracking-tight">
                            Portfolio Builder
                        </h1>
                        <p className="text-sm text-zinc-400 mt-1">
                            Build your developer identity
                        </p>
                    </div>

                    {/* Navigation - Scrollable if needed */}
                    <DashboardNav />

                    {/* Bottom User Section - Fixed at bottom */}
                    <div className="border-t border-zinc-800 p-4 flex-shrink-0">
                        <div className="flex items-center gap-3 rounded-xl bg-zinc-800 p-3">
                            <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0">
                                {session.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user?.name || "User avatar"}
                                        className="h-full w-full object-cover"
                                        width={40}
                                        height={40}
                                    />
                                ) : null}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">
                                    {session.user?.name || "Developer"}
                                </p>
                                <p className="text-xs text-zinc-400 truncate">
                                    {session.user?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </MobileSidebar>

            {/* Main Content - Scrollable */}
            <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 lg:p-8">
                {/* Add padding-top on mobile to account for hamburger button */}
                <div className="lg:pt-0 pt-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
