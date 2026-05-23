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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <div className="min-h-screen bg-zinc-950 flex text-zinc-100">
      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-800 bg-zinc-900/80 backdrop-blur">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-bold tracking-tight">
            Portfolio Builder
          </h1>

          <p className="text-sm text-zinc-400 mt-1">
            Build your developer identity
          </p>
        </div>

        <nav className="p-4 space-y-2">
          <a
            href="/dashboard/overview"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </a>

          <a
            href="/dashboard/profile"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
          >
            <User size={18} />
            <span>Profile</span>
          </a>

          <a
            href="/dashboard/projects"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
          >
            <FolderGit2 size={18} />
            <span>Projects</span>
          </a>

          <a
            href="/dashboard/appearance"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
          >
            <Palette size={18} />
            <span>Appearance</span>
          </a>

          <a
            href="/dashboard/publish"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
          >
            <Rocket size={18} />
            <span>Publish</span>
          </a>
        </nav>

        {/* Bottom User Section */}
        <div className="absolute bottom-0 w-72 border-t border-zinc-800 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-800 p-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
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

            <div>
              <p className="text-sm font-medium">
                {session.user?.name || "Developer"}
              </p>

              <p className="text-xs text-zinc-400">
                {session.user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-zinc-950 p-8">
        {children}
      </main>
    </div>
  );
}