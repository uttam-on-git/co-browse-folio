import { Mail, MessageSquare, Send, UserRound } from "lucide-react";

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
            Let&apos;s Work Together
          </h2>
          <p className="max-w-2xl text-zinc-600">
            Have a project in mind? Share a few details and I&apos;ll get back
            to you soon.
          </p>
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
              placeholder="you@company.com"
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
