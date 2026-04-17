import { IntroSplash } from "@/components/intro-splash";

const business = {
  phoneDisplay: "(555) 555-0199",
  phoneHref: "tel:+15555550199",
  textHref: "sms:+15555550199",
  email: "quote@mcrossroofcleaning.com",
  serviceArea: "your area",
};

const trustPoints = [
  "Soft wash safe for shingles",
  "Moss, algae, and black streak removal",
  "Fast quotes with zero upsell noise",
];

const serviceSteps = [
  {
    title: "Inspect",
    description:
      "We check the roof, note buildup, and map out the safest way to clean it.",
  },
  {
    title: "Wash",
    description:
      "Low-pressure treatment clears moss, algae, and stains without beating up the surface.",
  },
  {
    title: "Finish",
    description:
      "Edges are cleaned up, runoff is handled carefully, and the property looks sharp again.",
  },
];

export default function Home() {
  return (
    <>
      <IntroSplash />
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(138,255,102,0.18),_transparent_35%),linear-gradient(180deg,_rgba(255,255,255,0.04),_transparent_20%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 sm:px-10 lg:px-16">
            <header className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="font-heading text-3xl tracking-[0.22em] text-white">
                  MCROSS
                </p>
                <p className="text-xs uppercase tracking-[0.4em] text-white/45">
                  Roof Cleaning
                </p>
              </div>
              <a
                href={business.phoneHref}
                className="rounded-full border border-white/15 px-4 py-2 text-sm uppercase tracking-[0.24em] text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Call Now
              </a>
            </header>

            <div className="flex flex-1 flex-col justify-center gap-14 py-14 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
              <div className="max-w-3xl">
                <p className="mb-4 text-sm uppercase tracking-[0.45em] text-[var(--accent)]">
                  Clean Roof. Clean Finish.
                </p>
                <h1 className="max-w-4xl font-heading text-[clamp(4.5rem,12vw,9rem)] leading-[0.86] tracking-[0.04em] text-white">
                  Roof cleaning that looks sharp and stays simple.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/70 sm:text-xl">
                  We remove moss, algae, grime, and black streaks with a soft
                  wash approach that keeps the roof safe and the house looking
                  expensive again.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={business.phoneHref}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-white"
                  >
                    Call for a Quote
                  </a>
                  <a
                    href={business.textHref}
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:border-white hover:bg-white/6"
                  >
                    Text Roof Photos
                  </a>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {trustPoints.map((point) => (
                    <p
                      key={point}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm uppercase tracking-[0.18em] text-white/75"
                    >
                      {point}
                    </p>
                  ))}
                </div>
              </div>

              <aside className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.38em] text-white/45">
                  Quick Read
                </p>
                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                      Service Area
                    </p>
                    <p className="mt-2 text-2xl text-white">
                      {business.serviceArea}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                      Best For
                    </p>
                    <p className="mt-2 text-base leading-7 text-white/70">
                      Asphalt shingles, mossy roofs, dark algae streaks, and
                      curb appeal cleanups before listing or repainting.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                      Response
                    </p>
                    <p className="mt-2 text-base leading-7 text-white/70">
                      Call or text photos. Keep it fast, direct, and easy to
                      quote.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-black/80">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 sm:px-10 lg:grid-cols-3 lg:px-16">
            {serviceSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent)]">
                  0{index + 1}
                </p>
                <h2 className="mt-4 font-heading text-4xl tracking-[0.08em] text-white">
                  {step.title}
                </h2>
                <p className="mt-4 text-base leading-7 text-white/70">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16 lg:py-20"
        >
          <div className="rounded-[2.2rem] border border-[var(--accent)]/35 bg-[linear-gradient(180deg,rgba(138,255,102,0.12),rgba(255,255,255,0.03))] p-8 sm:p-10 lg:flex lg:items-end lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.45em] text-[var(--accent)]">
                Ready When You Are
              </p>
              <h2 className="mt-4 font-heading text-[clamp(3rem,8vw,5rem)] leading-[0.9] tracking-[0.08em] text-white">
                Need the roof cleaned? Reach out and book it.
              </h2>
              <p className="mt-4 text-base leading-7 text-white/70 sm:text-lg">
                This site is intentionally stripped down: one clear service,
                one clean message, and one easy next step.
              </p>
            </div>

            <div className="mt-8 space-y-3 lg:mt-0 lg:min-w-[18rem]">
              <a
                href={business.phoneHref}
                className="block rounded-2xl border border-white/12 bg-black/45 px-5 py-4 text-base text-white transition hover:border-white/30"
              >
                {business.phoneDisplay}
              </a>
              <a
                href={`mailto:${business.email}`}
                className="block rounded-2xl border border-white/12 bg-black/45 px-5 py-4 text-base text-white transition hover:border-white/30"
              >
                {business.email}
              </a>
              <p className="rounded-2xl border border-white/12 bg-black/45 px-5 py-4 text-base text-white/70">
                Serving {business.serviceArea}
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
