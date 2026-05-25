"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

interface MobileSidebarProps {
    children: React.ReactNode
}

export function MobileSidebar({ children }: MobileSidebarProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>

            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>


            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}


            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 border-r border-zinc-800 bg-zinc-900/95 backdrop-blur
          transform transition-transform duration-300 ease-in-out
          lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >

                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                    aria-label="Close menu"
                >
                    <X size={20} />
                </button>

                {children}
            </aside>
        </>
    )
}
