import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { Briefcase, GraduationCap, ExternalLink, MapPin, Phone, ArrowUpRight } from "lucide-react"
import { themeStyles } from "@/lib/themes"
import Image from "next/image"
import { LinkedinIcon } from "@/components/icons/il-linkedin"
import { XLogoIcon } from "@/components/icons/ph-x-logo"

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params
    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            projects: { where: { displayed: true } },
            education: true,
            experience: true,
        },
    })

    if (!user || !user.published) notFound()

    const styles = themeStyles[user.theme as keyof typeof themeStyles] || themeStyles.default
    const avatarSrc = user.avatarUrl ?? user.image

    return (
        <div className={`min-h-screen ${styles.bg} font-sans antialiased`}>

            {/* ── Animations ── */}
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.92); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%      { opacity: 0.6; transform: scale(0.85); }
                }
                @keyframes slideRight {
                    from { transform: scaleX(0); }
                    to   { transform: scaleX(1); }
                }

                .anim-hero        { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
                .anim-avatar      { animation: scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
                .anim-name        { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
                .anim-bio         { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
                .anim-socials     { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
                .anim-section     { animation: fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
                .anim-rule        { transform-origin: left; animation: slideRight 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s both; }

                .anim-card-1      { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
                .anim-card-2      { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
                .anim-card-3      { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
                .anim-card-4      { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.4s both; }
                .anim-card-5      { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.5s both; }
                .anim-card-6      { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.6s both; }

                .anim-skill       { animation: scaleIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }

                .dot-pulse        { animation: pulse-dot 2.4s ease-in-out infinite; }

                .project-card     { transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease, border-color 0.2s ease; }
                .project-card:hover { transform: translateY(-4px); }

                .social-btn       { transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease; }
                .social-btn:hover { transform: translateY(-1px); }

                .arrow-icon       { transition: transform 0.2s cubic-bezier(0.22,1,0.36,1), color 0.15s ease; }
                .project-card:hover .arrow-icon { transform: translate(2px,-2px); }

                @keyframes dotPop {
                    0%   { opacity: 0; transform: scale(0) rotate(-30deg); }
                    60%  { transform: scale(1.2) rotate(4deg); }
                    100% { opacity: 1; transform: scale(1) rotate(0deg); }
                }
                @keyframes spineGrow {
                    from { transform: scaleY(0); opacity: 0; }
                    to   { transform: scaleY(1); opacity: 1; }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-14px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                .timeline-dot  { animation: dotPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
                .timeline-spine { transform-origin: top; animation: spineGrow 0.4s cubic-bezier(0.22,1,0.36,1) both; }
                .timeline-content { animation: slideInLeft 0.5s cubic-bezier(0.22,1,0.36,1) both; }

                .timeline-item-dot:hover .timeline-dot-icon {
                    transform: scale(1.15) rotate(-6deg);
                    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
                }
                .timeline-dot-icon { transition: transform 0.2s ease; }
            `}</style>

            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-1/4 -left-[10%] w-[55%] h-[55%] rounded-full bg-indigo-600/5 blur-[130px]" />
                <div className="absolute top-1/2 -right-[10%] w-[45%] h-[45%] rounded-full bg-violet-600/5 blur-[130px]" />
                <div
                    className="absolute inset-0 opacity-[0.018]"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(99,102,241,0.7) 1px, transparent 1px)`,
                        backgroundSize: "36px 36px"
                    }}
                />
            </div>

            <div className="relative max-w-3xl mx-auto px-6 sm:px-8 py-24">

                {/* ── Hero ── */}
                <header className="mb-24 anim-hero">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-8 mb-8">

                        {/* Avatar */}
                        <div className="relative flex-shrink-0 anim-avatar">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-indigo-500/15">
                                {avatarSrc ? (
                                    <Image
                                        src={avatarSrc}
                                        alt={user.name ?? user.username ?? ""}
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-white">
                                            {(user.name ?? user.username ?? "?").charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <span className="dot-pulse absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-400 ring-[3px] ring-zinc-950 shadow-lg shadow-emerald-400/50" />
                        </div>

                        {/* Name + title + meta */}
                        <div className="flex-1 min-w-0 anim-name">
                            <h1 className={`text-4xl sm:text-5xl font-bold ${styles.text} tracking-tight leading-[1.1] mb-3`}>
                                {user.name ?? user.username}
                            </h1>
                            {user.title && (
                                <p className={`text-xl ${styles.accent} font-medium mb-3`}>
                                    {user.title}
                                </p>
                            )}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-1">
                                {user.location && (
                                    <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
                                        <MapPin size={14} className="text-zinc-600 flex-shrink-0" />
                                        {user.location}
                                    </span>
                                )}
                                {user.phone && (
                                    <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
                                        <Phone size={14} className="text-zinc-600 flex-shrink-0" />
                                        {user.phone}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    {user.bio && (
                        <p className={`text-lg ${styles.text} opacity-60 leading-relaxed max-w-2xl whitespace-pre-wrap anim-bio`}>
                            {user.bio}
                        </p>
                    )}

                    {/* Social links */}
                    {(user.linkedin || user.twitter) && (
                        <div className="flex flex-wrap gap-3 mt-6 anim-socials">
                            {user.linkedin && (
                                <a
                                    href={user.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 text-sm text-zinc-400 hover:text-indigo-300"
                                >
                                    <LinkedinIcon size={15} />
                                    LinkedIn
                                </a>
                            )}
                            {user.twitter && (
                                <a
                                    href={user.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 text-sm text-zinc-400 hover:text-indigo-300"
                                >
                                    <XLogoIcon size={15} />
                                    Twitter
                                </a>
                            )}
                        </div>
                    )}
                </header>

                {/* ── Skills ── */}
                {user.skills.length > 0 && (
                    <section className="mb-20 anim-section">
                        <SectionLabel>Skills</SectionLabel>
                        <div className="flex flex-wrap gap-2.5 mt-5">
                            {user.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className={`anim-skill px-4 py-1.5 rounded-full border text-sm font-medium tracking-wide ${styles.badge} hover:border-indigo-500/50 transition-colors duration-200`}
                                    style={{ animationDelay: `${i * 40}ms` }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Projects ── */}
                {user.projects.length > 0 && (
                    <section className="mb-20 anim-section">
                        <SectionLabel>
                            Projects
                            <span className="ml-2 text-zinc-600 font-normal">{user.projects.length}</span>
                        </SectionLabel>
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {user.projects.map((project, idx) => (
                                <a
                                    key={project.id}
                                    href={project.url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`project-card group relative flex flex-col p-6 rounded-2xl ${styles.card} border hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/8 anim-card-${Math.min(idx + 1, 6)}`}
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <h3 className={`font-semibold text-base ${styles.text} leading-snug`}>
                                            {project.name}
                                        </h3>
                                        <ArrowUpRight
                                            size={16}
                                            className="arrow-icon flex-shrink-0 mt-0.5 text-zinc-600 group-hover:text-indigo-400"
                                        />
                                    </div>
                                    {project.description && (
                                        <p className={`text-sm ${styles.text} opacity-50 line-clamp-2 mb-4 leading-relaxed flex-1`}>
                                            {project.description}
                                        </p>
                                    )}
                                    {project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-auto">
                                            {project.technologies.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium ${styles.badge}`}
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

                {/* ── Experience ── */}
                {user.experience.length > 0 && (
                    <section className="mb-20 anim-section">
                        <SectionLabel>Experience</SectionLabel>
                        <ol className="mt-5 space-y-0">
                            {user.experience
                                .sort((a, b) => b.dateOfStart - a.dateOfStart)
                                .map((exp, idx, arr) => {
                                    const delay = `${0.1 + idx * 0.12}s`
                                    const spineDelay = `${0.3 + idx * 0.12}s`
                                    return (
                                        <li
                                            key={exp.id}
                                            className="timeline-item-dot relative flex gap-6"
                                        >
                                            <div className="relative flex flex-col items-center">
                                                <div
                                                    className="timeline-dot w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 hover:border-indigo-500/60 flex items-center justify-center flex-shrink-0 z-10 transition-colors duration-200"
                                                    style={{ animationDelay: delay }}
                                                >
                                                    <Briefcase size={15} className={`timeline-dot-icon ${styles.accent}`} />
                                                </div>
                                                {idx < arr.length - 1 && (
                                                    <div
                                                        className="timeline-spine flex-1 w-px bg-zinc-800/60 mt-2 min-h-[2.5rem]"
                                                        style={{ animationDelay: spineDelay }}
                                                    />
                                                )}
                                            </div>
                                            <div
                                                className={`timeline-content pb-10 ${idx === arr.length - 1 ? "pb-0" : ""} flex-1 min-w-0 pt-1`}
                                                style={{ animationDelay: delay }}
                                            >
                                                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 mb-1">
                                                    <h3 className={`font-semibold text-base ${styles.text}`}>{exp.company}</h3>
                                                    {exp.role && (
                                                        <span className={`text-sm ${styles.accent} font-medium`}>{exp.role}</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-zinc-600 tabular-nums mb-2">
                                                    {exp.dateOfStart} — {exp.dateOfEnd}
                                                </p>
                                                {exp.description && (
                                                    <p className={`text-sm ${styles.text} opacity-55 leading-relaxed`}>
                                                        {exp.description}
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    )
                                })}
                        </ol>
                    </section>
                )}

                {/* ── Education ── */}
                {user.education.length > 0 && (
                    <section className="mb-20 anim-section">
                        <SectionLabel>Education</SectionLabel>
                        <ol className="mt-5 space-y-0">
                            {user.education
                                .sort((a, b) => b.dateOfStart - a.dateOfStart)
                                .map((edu, idx, arr) => {
                                    const delay = `${0.1 + idx * 0.12}s`
                                    const spineDelay = `${0.3 + idx * 0.12}s`
                                    return (
                                        <li
                                            key={edu.id}
                                            className="timeline-item-dot relative flex gap-6"
                                        >
                                            <div className="relative flex flex-col items-center">
                                                <div
                                                    className="timeline-dot w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 hover:border-violet-500/60 flex items-center justify-center flex-shrink-0 z-10 transition-colors duration-200"
                                                    style={{ animationDelay: delay }}
                                                >
                                                    <GraduationCap size={15} className="timeline-dot-icon text-violet-400" />
                                                </div>
                                                {idx < arr.length - 1 && (
                                                    <div
                                                        className="timeline-spine flex-1 w-px bg-zinc-800/60 mt-2 min-h-[2.5rem]"
                                                        style={{ animationDelay: spineDelay }}
                                                    />
                                                )}
                                            </div>
                                            <div
                                                className={`timeline-content pb-10 ${idx === arr.length - 1 ? "pb-0" : ""} flex-1 min-w-0 pt-1`}
                                                style={{ animationDelay: delay }}
                                            >
                                                <h3 className={`font-semibold text-base ${styles.text} mb-1`}>{edu.school}</h3>
                                                <p className="text-xs text-zinc-600 tabular-nums mb-2">
                                                    {edu.dateOfStart} — {edu.dateOfEnd}
                                                </p>
                                                {edu.description && (
                                                    <p className={`text-sm ${styles.text} opacity-55 leading-relaxed`}>
                                                        {edu.description}
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    )
                                })}
                        </ol>
                    </section>
                )}

                {/* ── Footer ── */}
                <footer className="pt-10 border-t border-zinc-800/50 flex items-center justify-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                    <p className="text-sm text-zinc-700 tracking-wide">Built with Portfolio Builder</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                </footer>

            </div>
        </div>
    )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4">
            <h2 className="text-xs font-semibold tracking-[0.14em] uppercase text-zinc-500 whitespace-nowrap">
                {children}
            </h2>
            <div className="anim-rule flex-1 h-px bg-zinc-800/80 origin-left" />
        </div>
    )
}