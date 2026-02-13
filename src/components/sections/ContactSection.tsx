import {
  FileText,
  Github,
  Linkedin,
  Mail,
  MessageSquare,
  Send,
  Twitter,
  UserRound,
} from "lucide-react";

export default function ContactSection() {
  return (
    <section
      id="contact"
      data-section="contact"
      data-testid="contact-section"
      className="bg-white"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 lg:px-12">
        <div className="mb-10 space-y-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-zinc-500 uppercase">
            <Mail className="h-4 w-4" />
            Contact
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Let&apos;s Connect
          </h2>
          <p className="max-w-2xl text-zinc-600">
            I&apos;m actively looking for my first full-time break. If you think
            I can help your team, send a message or reach me through the links
            below.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <a
              href="https://github.com/uttam-on-git"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/uttam-in/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href="https://x.com/forgeweb2"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <Twitter className="h-4 w-4" />
              X
            </a>
            <a
              href="https://www.dropbox.com/scl/fi/i75h447di27cqbcb4six1/romendra-uttam-v1.pdf?rlkey=ga13n5d4my1tsqixhoutbl6zr&e=1&st=slc7xyru&dl=0"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <FileText className="h-4 w-4" />
              Resume
            </a>
          </div>
        </div>

        <form
          data-testid="contact-form"
          className="grid gap-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-2">
            <label
              htmlFor="contact-name"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700"
            >
              <UserRound className="h-4 w-4" />
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Your full name"
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contact-email"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700"
            >
              <Mail className="h-4 w-4" />
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="you@company.com (or write to romendrauttam@gmail.com)"
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contact-message"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700"
            >
              <MessageSquare className="h-4 w-4" />
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              placeholder="Tell me about your project goals, timeline, and scope."
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              Send Message
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
