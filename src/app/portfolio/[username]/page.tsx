import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { Briefcase, GraduationCap, ExternalLink, MapPin, Phone, Linkedin, Twitter } from "lucide-react"
import { themeStyles } from "@/lib/themes"
import Image from "next/image"

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params
    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            projects: {
                where: { displayed: true }
            },
            education: true,
            experience: true,
        },
    })

    if (!user || !user.published) notFound()

    const styles = themeStyles[user.theme as keyof typeof themeStyles] || themeStyles.default

    return (
        <div className={`min-h-screen ${styles.bg}`}>
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
                    backgroundSize: "64px 64px"
                }}
            />

            <div className="relative max-w-4xl mx-auto px-6 py-16">
                {/* Hero */}
                <div className="mb-16">
                    <div className="flex items-center gap-6 mb-6">
                        <div className=" rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20 overflow-hidden">
                            {user.avatarUrl ?? user.image ? (
                                <Image
                                    src={user.avatarUrl ?? user.image}
                                    alt={user.name ?? user.username ?? ""}
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-white">
                                    {(user.name ?? user.username ?? "?").charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white tracking-tight">
                                {user.name ?? user.username}
                            </h1>
                            {user.title && (
                                <p className={`text-lg ${styles.accent} mt-1`}>
                                    {user.title}
                                </p>
                            )}
                            {user.location && (
                                <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1.5">
                                    <MapPin size={14} className="text-zinc-600" />
                                    {user.location}
                                </p>
                            )}
                            {user.phone && (
                                <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                                    <Phone size={14} className="text-zinc-600" />
                                    {user.phone}
                                </p>
                            )}
                        </div>
                    </div>
                    {user.bio && (
                        <div className="max-w-2xl">
                            <p className={`${styles.text} opacity-70 leading-relaxed whitespace-pre-wrap`}>
                                {user.bio}
                            </p>
                        </div>
                    )}
                </div>

                {/* Skills */}
                {user.skills.length > 0 && (
                    <section className="mb-16">
                        <h2 className={`text-xs font-semibold tracking-widest ${styles.accent} uppercase mb-4`}>
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className={`px-3 py-1.5 rounded-lg border text-sm ${styles.badge} font-medium`}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {user.projects.length > 0 && (
                    <section className="mb-16">
                        <h2 className={`text-xs font-semibold tracking-widest ${styles.accent} uppercase mb-4`}>
                            Projects ({user.projects.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.projects.map((project) => (
                                <a
                                    key={project.id}
                                    href={project.url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group block p-5 rounded-2xl ${styles.card} hover:border-indigo-500/50 transition-all duration-300`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className={`font-semibold ${styles.text} transition-colors`}>
                                            {project.name}
                                        </h3>
                                        <ExternalLink size={14} className={`${styles.accent} opacity-50 mt-1 flex-shrink-0 transition-colors`} />
                                    </div>
                                    {project.description && (
                                        <p className={`text-sm ${styles.text} opacity-70 line-clamp-2 mb-3`}>
                                            {project.description}
                                        </p>
                                    )}
                                    {project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.technologies.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className={`px-2 py-0.5 rounded-md text-xs ${styles.badge}`}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {user.experience.length > 0 && (
                    <section className="mb-16">
                        <h2 className={`text-xs font-semibold tracking-widest ${styles.accent} uppercase mb-4`}>
                            Experience
                        </h2>
                        <div className="space-y-0">
                            {user.experience
                                .sort((a, b) => b.dateOfStart - a.dateOfStart)
                                .map((exp) => (
                                    <div key={exp.id} className="relative pl-8 pb-8 last:pb-0">
                                        <div className="absolute left-[11px] top-3 bottom-0 w-px bg-zinc-800 last:hidden" />
                                        <div className="absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full bg-zinc-900 border-2 border-indigo-500/50 flex items-center justify-center">
                                            <Briefcase size={12} className={styles.accent} />
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${styles.text}`}>{exp.company}</h3>
                                            {exp.role && (
                                                <p className={`text-sm ${styles.accent}`}>{exp.role}</p>
                                            )}
                                            <p className="text-xs text-zinc-600 mt-1">
                                                {exp.dateOfStart} — {exp.dateOfEnd}
                                            </p>
                                            {exp.description && (
                                                <p className={`text-sm ${styles.text} opacity-70 mt-2 leading-relaxed`}>{exp.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {user.education.length > 0 && (
                    <section className="mb-16">
                        <h2 className={`text-xs font-semibold tracking-widest ${styles.accent} uppercase mb-4`}>
                            Education
                        </h2>
                        <div className="space-y-0">
                            {user.education
                                .sort((a, b) => b.dateOfStart - a.dateOfStart)
                                .map((edu) => (
                                    <div key={edu.id} className="relative pl-8 pb-8 last:pb-0">
                                        <div className="absolute left-[11px] top-3 bottom-0 w-px bg-zinc-800 last:hidden" />
                                        <div className="absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full bg-zinc-900 border-2 border-violet-500/50 flex items-center justify-center">
                                            <GraduationCap size={12} className="text-violet-400" />
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${styles.text}`}>{edu.school}</h3>
                                            <p className="text-xs text-zinc-600 mt-1">
                                                {edu.dateOfStart} — {edu.dateOfEnd}
                                            </p>
                                            {edu.description && (
                                                <p className={`text-sm ${styles.text} opacity-70 mt-2 leading-relaxed`}>{edu.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <div className="pt-8 border-t border-zinc-800">
                    <p className="text-sm text-zinc-600 text-center">
                        Built with Portfolio Builder
                    </p>
                </div>
            </div>
        </div>
    )
}
