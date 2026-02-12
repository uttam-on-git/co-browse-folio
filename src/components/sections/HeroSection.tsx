import { ArrowRight, Briefcase, MapPin } from "lucide-react";

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
          San Francisco, CA
        </div>
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-zinc-500 uppercase">
            <Briefcase className="h-4 w-4" />
            Available for new opportunities
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Alex Carter
          </h1>
          <h2 className="max-w-3xl text-xl font-medium text-zinc-700 sm:text-2xl">
            Senior Full-Stack Engineer
          </h2>
          <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
            I build reliable web platforms that turn complex workflows into
            simple experiences. My focus is scalable architecture, thoughtful
            UX, and shipping products that solve real business problems.
          </p>
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
    </section>
  );
}
