import { ExternalLink, FolderKanban, Github, Layers } from "lucide-react";

type Project = {
  title: string;
  description: string;
  techStack: string[];
  demoUrl: string;
  repoUrl: string;
};

const projects: Project[] = [
  {
    title: "Cesium Resource Explorer",
    description:
      "A deep dive into 3D geospatial visuals, exploring the world from the comfort of a browser.",
    techStack: ["React", "TypeScript", "CesiumJS"],
    demoUrl: "https://cesium-resource-explorer.vercel.app/",
    repoUrl: "https://github.com/uttam-on-git/cesium-resource-explorer",
  },
  {
    title: "Acta",
    description:
      "Finance should be private. Acta keeps your ledger local, safe, and beautiful.",
    techStack: ["Next.js", "Prisma", "PostgreSQL"],
    demoUrl: "https://acta-beta.vercel.app/",
    repoUrl: "https://github.com/uttam-on-git/acta",
  },
  {
    title: "MindfulBrowse",
    description:
      "A Chrome extension to help reclaim attention with gentle nudges that keep browsing focused.",
    techStack: ["JavaScript", "Chrome APIs"],
    demoUrl: "https://github.com/uttam-on-git/MindfulBrowse",
    repoUrl: "https://github.com/uttam-on-git/MindfulBrowse",
  },
];

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      data-section="projects"
      data-testid="projects-section"
      className="border-b border-zinc-200 bg-white"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 lg:px-12">
        <div className="mb-12 space-y-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-zinc-500 uppercase">
            <FolderKanban className="h-4 w-4" />
            Projects
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Selected Work
          </h2>
          <p className="max-w-2xl text-zinc-600">
            A few projects I built to sharpen product thinking, engineering
            depth, and real-world shipping discipline.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              data-testid={`project-card-${project.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-xl font-semibold text-zinc-900">
                {project.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600">
                {project.description}
              </p>

              <div className="mt-5">
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
                  <Layers className="h-3.5 w-3.5" />
                  Tech Stack
                </p>
                <ul className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex items-center gap-4 text-sm">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-zinc-800 hover:text-zinc-600"
                >
                  Live Demo
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-zinc-800 hover:text-zinc-600"
                >
                  Source
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
