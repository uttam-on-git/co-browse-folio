import { Award, Brain, CalendarClock, Sparkles } from "lucide-react";

type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  summary: string;
};

const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "System Design",
  "Cloud Architecture",
  "Product Strategy",
];

const experience: ExperienceItem[] = [
  {
    role: "Senior Full-Stack Engineer",
    company: "Northstar Labs",
    period: "2023 - Present",
    summary:
      "Leading architecture decisions and mentoring engineers while building internal platforms used by product and operations teams.",
  },
  {
    role: "Full-Stack Engineer",
    company: "Atlas Systems",
    period: "2020 - 2023",
    summary:
      "Shipped customer-facing web apps end-to-end, including frontend architecture, API design, and observability tooling.",
  },
  {
    role: "Software Engineer",
    company: "Driftline",
    period: "2017 - 2020",
    summary:
      "Built data-heavy interfaces and backend services for reporting, workflow automation, and customer success operations.",
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
            I work at the intersection of product, engineering, and user
            experience to deliver software that is maintainable and measurable.
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
