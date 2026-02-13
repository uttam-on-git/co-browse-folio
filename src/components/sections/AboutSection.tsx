import { Award, Brain, CalendarClock, Sparkles } from "lucide-react";

type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  summary: string;
};

const skills = [
  "React",
  "Next.js",
  "Tailwind CSS",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "REST APIs",
  "Git",
  "Docker",
  "Linux",
  "CesiumJS",
];

const experience: ExperienceItem[] = [
  {
    role: "Builder (Self-driven Projects)",
    company: "Independent",
    period: "2025 - Present",
    summary:
      "Shipping end-to-end products across frontend and backend while iterating quickly on UX, reliability, and developer experience.",
  },
  {
    role: "Open Source and Public Builds",
    company: "GitHub",
    period: "2024 - Present",
    summary:
      "Maintaining public repositories and experiments, with focus on practical tooling, web products, and polished implementations.",
  },
  {
    role: "Learning by Shipping",
    company: "Hands-on Practice",
    period: "Ongoing",
    summary:
      "Building real applications from scratch to strengthen system design instincts and production-ready execution habits.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      data-section="about"
      data-testid="about-section"
      className="border-b border-zinc-200 bg-zinc-50"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:px-12">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-zinc-500 uppercase">
            <Brain className="h-4 w-4" />
            About
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Skills and Experience
          </h2>
          <p className="mt-4 max-w-xl text-zinc-600">
            I focus on practical, shippable software. My learning style is
            simple: build real products, test assumptions quickly, and improve
            based on feedback.
          </p>

          <div className="mt-8">
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <Sparkles className="h-4 w-4" />
              Core Skills
            </p>
            <ul className="flex flex-wrap gap-2" data-testid="about-skills">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <p className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <CalendarClock className="h-4 w-4" />
            Experience Timeline
          </p>
          <ol className="space-y-4" data-testid="about-experience">
            {experience.map((item) => (
              <li
                key={`${item.company}-${item.role}`}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-zinc-900">
                    {item.role}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                    <Award className="h-3.5 w-3.5" />
                    {item.period}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-zinc-700">
                  {item.company}
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {item.summary}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
