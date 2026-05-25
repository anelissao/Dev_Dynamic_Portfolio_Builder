"use client"

import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    User,
    FolderGit2,
    Palette,
    Rocket,
} from "lucide-react"

const navItems = [
    {
        href: "/dashboard/overview",
        label: "Overview",
        icon: LayoutDashboard,
    },
    {
        href: "/dashboard/profile",
        label: "Profile",
        icon: User,
    },
    {
        href: "/dashboard/projects",
        label: "Projects",
        icon: FolderGit2,
    },
    {
        href: "/dashboard/appearance",
        label: "Appearance",
        icon: Palette,
    },
    {
        href: "/dashboard/publish",
        label: "Publish",
        icon: Rocket,
    },
]

export function DashboardNav() {
    const pathname = usePathname()

    return (
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
            {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                    <a
                        key={item.href}
                        href={item.href}
                        className={`
              flex items-center gap-3 rounded-xl px-4 py-3 transition-all
              ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                            }
            `}
                    >
                        <Icon size={18} />
                        <span>{item.label}</span>
                    </a>
                )
            })}
        </nav>
    )
}
