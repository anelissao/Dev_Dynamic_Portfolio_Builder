import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { Briefcase, GraduationCap, MapPin, Phone, ArrowUpRight, ExternalLink } from "lucide-react"
import { GithubIcon } from "@/components/icons/lucide-github"
import { themeStyles } from "@/lib/themes"
import Image from "next/image"
import { LinkedinIcon } from "@/components/icons/il-linkedin"
import { XLogoIcon } from "@/components/icons/ph-x-logo"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ContactForm } from "./contact-form"

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

            {/* ── Global styles ── */}
            <style>{`
                /* Scroll-reveal base: elements start hidden */
                .sr-hidden { opacity: 0; }

                /* Variants — define the "from" state */
                .sr-fadeUp      { transform: translateY(28px); }
                .sr-fadeIn      { }
                .sr-scaleIn     { transform: scale(0.93); }
                .sr-slideInLeft { transform: translateX(-18px); }

                /* When visible: animate to natural position */
                .sr-visible {
                    animation-fill-mode: both;
                    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
                    animation-duration: 0.65s;
                }
                .sr-fadeUp.sr-visible      { animation-name: srFadeUp; }
                .sr-fadeIn.sr-visible      { animation-name: srFadeIn; }
                .sr-scaleIn.sr-visible     { animation-name: srScaleIn; }
                .sr-slideInLeft.sr-visible { animation-name: srSlideInLeft; }

                @keyframes srFadeUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes srFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes srScaleIn {
                    from { opacity: 0; transform: scale(0.93); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes srSlideInLeft {
                    from { opacity: 0; transform: translateX(-18px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                /* Timeline dot bounce */
                @keyframes srDotPop {
                    0%   { opacity: 0; transform: scale(0) rotate(-30deg); }
                    60%  { transform: scale(1.2) rotate(4deg); }
                    100% { opacity: 1; transform: scale(1) rotate(0deg); }
                }
                .sr-dotPop.sr-visible {
                    animation-name: srDotPop;
                    animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
                    animation-duration: 0.5s;
                    animation-fill-mode: both;
                }

                /* Timeline spine draw-down */
                @keyframes srSpineGrow {
                    from { opacity: 0; transform: scaleY(0); }
                    to   { opacity: 1; transform: scaleY(1); }
                }
                .sr-spineGrow.sr-visible {
                    animation-name: srSpineGrow;
                    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
                    animation-duration: 0.45s;
                    animation-fill-mode: both;
                }

                /* Section rule slide */
                @keyframes srSlideRight {
                    from { transform: scaleX(0); }
                    to   { transform: scaleX(1); }
                }
                .sr-slideRight.sr-visible {
                    animation-name: srSlideRight;
                    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
                    animation-duration: 0.6s;
                    animation-fill-mode: both;
                }

                /* Skill badge scale */
                @keyframes srSkill {
                    from { opacity: 0; transform: scale(0.8); }
                    to   { opacity: 1; transform: scale(1); }
                }
                .sr-skill.sr-visible {
                    animation-name: srSkill;
                    animation-timing-function: cubic-bezier(0.34, 1.4, 0.64, 1);
                    animation-duration: 0.4s;
                    animation-fill-mode: both;
                }

                /* ── Hero fires on load (above fold, always visible) ── */
                .hero-avatar  { animation: srScaleIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
                .hero-name    { animation: srFadeUp  0.7s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
                .hero-bio     { animation: srFadeUp  0.7s cubic-bezier(0.22,1,0.36,1) 0.22s both; }
                .hero-socials { animation: srFadeUp  0.6s cubic-bezier(0.22,1,0.36,1) 0.32s both; }

                /* Persistent micro-interactions */
                .dot-pulse { animation: dotPulse 2.4s ease-in-out infinite; }
                @keyframes dotPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%      { opacity: 0.55; transform: scale(0.82); }
                }

                .project-card { transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease, border-color 0.2s ease; }
                .project-card:hover { transform: translateY(-5px); }

                .social-btn { transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease; }
                .social-btn:hover { transform: translateY(-2px); }

                .arrow-icon { transition: transform 0.2s cubic-bezier(0.22,1,0.36,1), color 0.15s ease; }
                .project-card:hover .arrow-icon { transform: translate(3px,-3px); }

                .timeline-dot-icon { transition: transform 0.2s ease; }
                .timeline-item:hover .timeline-dot-icon { transform: scale(1.15) rotate(-6deg); }
            `}</style>

            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-1/4 -left-[10%] w-[55%] h-[55%] rounded-full bg-indigo-600/5 blur-[130px]" />
                <div className="absolute top-1/2 -right-[10%] w-[45%] h-[45%] rounded-full bg-violet-600/5 blur-[130px]" />
                <div
                    className="absolute inset-0 opacity-[0.018]"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(99,102,241,0.7) 1px, transparent 1px)`,
                        backgroundSize: "36px 36px",
                    }}
                />
            </div>

            <div className="relative max-w-3xl mx-auto px-6 sm:px-8 py-24">

                {/* ── Hero (load-time, always above fold) ── */}
                <header className="mb-24">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-8 mb-8">

                        {/* Avatar */}
                        <div className="hero-avatar relative flex-shrink-0">
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

                        {/* Name + title */}
                        <div className="hero-name flex-1 min-w-0">
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

                    {user.bio && (
                        <p className={`hero-bio text-lg ${styles.text} opacity-60 leading-relaxed max-w-2xl whitespace-pre-wrap`}>
                            {user.bio}
                        </p>
                    )}

                    {(user.linkedin || user.twitter) && (
                        <div className="hero-socials flex flex-wrap gap-3 mt-6">
                            {user.linkedin && (
                                <a
                                    href={user.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 text-sm text-zinc-400 hover:text-indigo-300"
                                >
                                    <LinkedinIcon size={15} /> LinkedIn
                                </a>
                            )}
                            {user.twitter && (
                                <a
                                    href={user.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 text-sm text-zinc-400 hover:text-indigo-300"
                                >
                                    <XLogoIcon size={15} /> Twitter
                                </a>
                            )}
                        </div>
                    )}
                </header>

                {/* ── Skills ── */}
                {user.skills.length > 0 && (
                    <section className="mb-20">
                        <SectionLabel delay={0}>Skills</SectionLabel>

                        <div className="flex flex-wrap gap-2.5">
                            {user.skills.map((skill, i) => (
                                <ScrollReveal
                                    key={i}
                                    as="span"
                                    variant="scaleIn"
                                    delay={i * 45}
                                    threshold={0.1}
                                    className={`sr-skill px-4 py-1.5 rounded-full border text-sm font-medium tracking-wide ${styles.badge} hover:border-indigo-500/50 transition-colors duration-200`}
                                >
                                    {skill}
                                </ScrollReveal>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Projects ── */}
                {user.projects.length > 0 && (
                    <section className="mb-20">
                        <SectionLabel delay={0}>
                            Projects <span className="ml-2 text-zinc-600 font-normal">{user.projects.length}</span>
                        </SectionLabel>

                        {/* Regular Projects Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {user.projects.map((project, idx) => (
                                <ScrollReveal key={project.id} variant="fadeUp" delay={idx * 80} threshold={0.1}>
                                    <div className={`project-card group relative flex flex-col h-full p-6 rounded-2xl ${styles.card} border hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/[0.08]`}>
                                        {/* Project Image */}
                                        {project.imageUrl && (
                                            <div className="mb-4 rounded-xl overflow-hidden border border-zinc-800/50 -mx-6 -mt-6">
                                                <Image
                                                    src={project.imageUrl}
                                                    alt={project.name}
                                                    width={400}
                                                    height={225}
                                                    loading="eager"
                                                    className="w-full h-48 object-cover"
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <h3 className={`font-semibold text-base ${styles.text} leading-snug`}>
                                                {project.name}
                                            </h3>
                                            {project.liveDemoUrl && (
                                                <ArrowUpRight size={16} className="arrow-icon flex-shrink-0 mt-0.5 text-zinc-600 group-hover:text-indigo-400" />
                                            )}
                                        </div>

                                        {project.description && (
                                            <p className={`text-sm ${styles.text} opacity-50 line-clamp-2 mb-4 leading-relaxed flex-1`}>
                                                {project.description}
                                            </p>
                                        )}

                                        {project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {project.technologies.map((tech) => (
                                                    <span key={tech} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${styles.badge}`}>
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        {(project.liveDemoUrl || project.url) && (
                                            <div className="flex gap-2 mt-auto">
                                                {project.liveDemoUrl && (
                                                    <a
                                                        href={project.liveDemoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${styles.button} text-sm font-medium transition-all hover:scale-105`}
                                                    >
                                                        <ExternalLink size={14} />
                                                        Live Demo
                                                    </a>
                                                )}
                                                {project.url && (
                                                    <a
                                                        href={project.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${styles.card} border hover:border-indigo-500/50 text-sm font-medium transition-all hover:scale-105`}
                                                    >
                                                        <GithubIcon size={14} />
                                                        Code
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Experience ── */}
                {user.experience.length > 0 && (
                    <section className="mb-20">
                        <SectionLabel delay={0}>Experience</SectionLabel>
                        <ol className="mt-5 space-y-0">
                            {user.experience
                                .sort((a, b) => b.dateOfStart - a.dateOfStart)
                                .map((exp, idx, arr) => (
                                    <li key={exp.id} className="timeline-item relative flex gap-6">

                                        {/* Dot + spine */}
                                        <div className="relative flex flex-col items-center">
                                            <ScrollReveal
                                                variant="scaleIn"
                                                delay={idx * 120}
                                                threshold={0.2}
                                                className="sr-dotPop w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 hover:border-indigo-500/60 flex items-center justify-center flex-shrink-0 z-10 transition-colors duration-200"
                                            >
                                                <Briefcase size={15} className={`timeline-dot-icon ${styles.accent}`} />
                                            </ScrollReveal>
                                            {idx < arr.length - 1 && (
                                                <ScrollReveal
                                                    variant="fadeIn"
                                                    delay={idx * 120 + 180}
                                                    threshold={0.2}
                                                    className="sr-spineGrow flex-1 w-px bg-zinc-800/60 mt-2 min-h-[2.5rem] origin-top"
                                                >
                                                    <span />
                                                </ScrollReveal>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <ScrollReveal
                                            variant="slideInLeft"
                                            delay={idx * 120 + 60}
                                            threshold={0.2}
                                            className={`pb-10 ${idx === arr.length - 1 ? "pb-0" : ""} flex-1 min-w-0 pt-1`}
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
                                        </ScrollReveal>
                                    </li>
                                ))}
                        </ol>
                    </section>
                )}

                {/* ── Education ── */}
                {user.education.length > 0 && (
                    <section className="mb-20">
                        <SectionLabel delay={0}>Education</SectionLabel>
                        <ol className="mt-5 space-y-0">
                            {user.education
                                .sort((a, b) => b.dateOfStart - a.dateOfStart)
                                .map((edu, idx, arr) => (
                                    <li key={edu.id} className="timeline-item relative flex gap-6">

                                        <div className="relative flex flex-col items-center">
                                            <ScrollReveal
                                                variant="scaleIn"
                                                delay={idx * 120}
                                                threshold={0.2}
                                                className="sr-dotPop w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 hover:border-violet-500/60 flex items-center justify-center flex-shrink-0 z-10 transition-colors duration-200"
                                            >
                                                <GraduationCap size={15} className="timeline-dot-icon text-violet-400" />
                                            </ScrollReveal>
                                            {idx < arr.length - 1 && (
                                                <ScrollReveal
                                                    variant="fadeIn"
                                                    delay={idx * 120 + 180}
                                                    threshold={0.2}
                                                    className="sr-spineGrow flex-1 w-px bg-zinc-800/60 mt-2 min-h-[2.5rem] origin-top"
                                                >
                                                    <span />
                                                </ScrollReveal>
                                            )}
                                        </div>

                                        <ScrollReveal
                                            variant="slideInLeft"
                                            delay={idx * 120 + 60}
                                            threshold={0.2}
                                            className={`pb-10 ${idx === arr.length - 1 ? "pb-0" : ""} flex-1 min-w-0 pt-1`}
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
                                        </ScrollReveal>
                                    </li>
                                ))}
                        </ol>
                    </section>
                )}

                {/* ── Contact Form ── */}
                <section className="mb-20">
                    <SectionLabel delay={0}>Get in Touch</SectionLabel>
                    <ScrollReveal variant="scaleIn" threshold={0.3}>
                        <ContactForm username={username} styles={styles} />
                    </ScrollReveal>
                </section>


                {/* ── Footer ── */}
                <ScrollReveal variant="fadeIn" threshold={0.5}>
                    <footer className="pt-10 border-t border-zinc-800/50 flex items-center justify-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                        <p className="text-sm text-zinc-700 tracking-wide">Built with Portfolio Builder</p>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                    </footer>
                </ScrollReveal>

            </div>
        </div>
    )
}

/* ── Section label with scroll-revealed rule ── */
function SectionLabel({ children, delay = 0 }: { children?: React.ReactNode; rule?: boolean; delay?: number }) {
    return (
        <div className="flex items-center gap-4 mb-5">
            <ScrollReveal as="h2" variant="fadeIn" delay={delay} threshold={0.2}
                className="text-xs font-semibold tracking-[0.14em] uppercase text-zinc-500 whitespace-nowrap">
                {children}
            </ScrollReveal>
            <ScrollReveal variant="fadeIn" delay={delay + 100} threshold={0.2}
                className="sr-slideRight flex-1 h-px bg-zinc-800/80 origin-left">
                <span />
            </ScrollReveal>
        </div>
    )
}