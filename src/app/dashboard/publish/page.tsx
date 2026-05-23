import { auth } from "@/auth";
import { prisma } from "@/lib/db"
import { togglePublish } from "./actions";
import { Globe, CheckCircle2, XCircle, ExternalLink } from "lucide-react"

export default async function PublishPage() {
    const session = await auth()
    if (!session?.user?.id) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-zinc-400 text-lg">Not logged in</p>
                </div>
            </div>
        )
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { published: true, username: true }
    })

    if (!user?.username) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-zinc-400 text-lg">No GitHub username found</p>
                    <p className="text-zinc-500 text-sm mt-2">
                        Connect GitHub in settings to publish your portfolio
                    </p>
                </div>
            </div>
        )
    }

    const portfolioUrl = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/portfolio/${user.username}`

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
                    backgroundSize: "48px 48px",
                }}
            />

            <div className="relative max-w-3xl mx-auto px-6 py-12">
                <div className="mb-10">
                    <p className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-1">
                        Dashboard
                    </p>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Publish</h1>
                    <p className="text-zinc-400 mt-2 text-sm">
                        Make your portfolio live for the world to see.
                    </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className={`p-3 rounded-xl ${user.published ? 'bg-emerald-500/10' : 'bg-zinc-800'}`}>
                            <Globe className={user.published ? 'text-emerald-400' : 'text-zinc-500'} size={28} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-white">
                                {user.published ? "Portfolio is Live" : "Portfolio is Private"}
                            </h2>
                            <p className="text-sm text-zinc-400 mt-0.5">
                                {user.published
                                    ? "Your portfolio is publicly accessible to anyone with the link"
                                    : "Only you can see your portfolio right now"}
                            </p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium flex-shrink-0 ${user.published
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-400'
                            }`}>
                            {user.published ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                            {user.published ? "Published" : "Unpublished"}
                        </div>
                    </div>

                    {user.published && (
                        <a
                            href={portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors mb-8"
                        >
                            {portfolioUrl}
                            <ExternalLink size={14} />
                        </a>
                    )}

                    <form action={togglePublish}>
                        <button
                            type="submit"
                            className={`px-8 py-3 rounded-xl font-medium transition-all cursor-pointer ${user.published
                                ? 'bg-red-600 hover:bg-red-500 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                                }`}
                        >
                            {user.published ? "Unpublish Portfolio" : "Publish Portfolio"}
                        </button>
                    </form>
                </div>

                <div className="mt-6 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                    <h3 className="text-sm font-semibold text-white mb-3">
                        Checklist
                    </h3>
                    <ul className="space-y-2">
                        {[
                            "Add a bio and skills",
                            "Import and select projects to display",
                            "Choose your preferred theme",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-zinc-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
