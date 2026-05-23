import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/components/ui/card";

export default async function OverviewPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <div>Not logged in</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      projects: {
        where: { displayed: true },
      },
      education: true,
      experience: true,
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const steps = [
    {
      label: "GitHub connected",
      pending: "GitHub not connected",
      done: !!user.username,
    },
    {
      label: "Bio added",
      pending: "Bio missing",
      done: !!user.bio?.trim(),
    },
    {
      label: "Skills added",
      pending: "No skills added",
      done: user.skills.length > 0,
    },
    {
      label: "Projects selected",
      pending: "No projects selected",
      done: user.projects.length > 0,
    },
    {
      label: "Education added",
      pending: "Education missing",
      done: user.education.length > 0,
    },
    {
      label: "Experience added",
      pending: "Experience missing",
      done: user.experience.length > 0,
    },
    {
      label: "Published",
      pending: "Portfolio not published",
      done: user.published,
    },
  ];

  const completed = steps.filter((step) => step.done).length;
  const total = steps.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
          Dashboard Overview
        </h1>

        <p className="mt-2 text-zinc-400">
          Track your portfolio setup progress and complete your profile.
        </p>
      </div>

      {/* Progress Card */}
      <Card className="border border-zinc-800 bg-zinc-900 text-zinc-100 shadow-xl">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center justify-between">
            <span>Setup Progress</span>

            <span className="text-sm font-medium text-indigo-400">
              {percent}%
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-zinc-400">
              {completed} of {total} steps completed
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.label}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${step.done
                    ? "border-emerald-500/20 bg-emerald-500/10"
                    : "border-zinc-800 bg-zinc-950/50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${step.done
                        ? "bg-emerald-500 text-black"
                        : "bg-zinc-800 text-zinc-400"
                      }`}
                  >
                    {step.done ? "✓" : "•"}
                  </div>

                  <span
                    className={
                      step.done ? "text-zinc-100" : "text-zinc-400"
                    }
                  >
                    {step.done ? step.label : step.pending}
                  </span>
                </div>

                <span
                  className={`text-xs font-medium ${step.done
                      ? "text-emerald-400"
                      : "text-zinc-500"
                    }`}
                >
                  {step.done ? "Completed" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}