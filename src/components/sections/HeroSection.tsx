import { ArrowRight, Briefcase, FileText, Github, Linkedin, MapPin, Twitter } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      data-section="hero"
      data-testid="hero-section"
      className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-white to-zinc-50"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-20 sm:px-10 lg:px-12">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 shadow-sm">
          <MapPin className="h-4 w-4 text-zinc-500" />
          Open to remote opportunities
        </div>
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-zinc-500 uppercase">
            <Briefcase className="h-4 w-4" />
            Actively seeking first full-time role
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Romendra
          </h1>
          <h2 className="max-w-3xl text-xl font-medium text-zinc-700 sm:text-2xl">
            Full-stack developer shipping projects while hunting for my first
            break
          </h2>
          <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
            I enjoy being heads-down building things. I work end-to-end,
            frontend to backend, and learn best by shipping real products.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-sm">
            <a
              href="https://github.com/uttam-on-git"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/uttam-in/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href="https://x.com/forgeweb2"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <Twitter className="h-4 w-4" />
              X
            </a>
            <a
              href="https://www.dropbox.com/scl/fi/i75h447di27cqbcb4six1/romendra-uttam-v1.pdf?rlkey=ga13n5d4my1tsqixhoutbl6zr&e=1&st=slc7xyru&dl=0"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <FileText className="h-4 w-4" />
              Resume
            </a>
          </div>

          <div>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            View Projects
            <ArrowRight className="h-4 w-4" />
          </a>
          </div>
        </div>
      </div>
    </section>
  );
}
