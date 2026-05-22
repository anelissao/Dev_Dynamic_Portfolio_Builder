import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"

export default async function PortfolioPage({ params, }: { params: Promise<{ username: string }> }) {
    const {username} = await params
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

    return (
        <div>
            <h1>{user.name || user.username}</h1>
            {user.bio && <p>{user.bio}</p>}

            <h3>Skills</h3>
            <ul>
                {user.skills.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
            <h3>Projects</h3>
            {user.projects.map((p) => (
                <div key={p.id}>
                    <a href={p.url} target="_blank">{p.name}</a>
                    <p>{p.description}</p>
                </div>
            ))}

            <h3>Education</h3>
            {user.education.map((e) => (
                <div key={e.id}>
                    <p>{e.school} ({e.dateOfStart} - {e.dateOfEnd})</p>
                    {e.description && <p>{e.description}</p>}
                </div>
            ))}
            <h3>Experience</h3>
            {user.experience.map((e) => (
                <div key={e.id}>
                    <p>{e.company} — {e.role} ({e.dateOfStart} - {e.dateOfEnd})</p>
                    <p>{e.description}</p>
                </div>
            ))}
        </div>
    )
}