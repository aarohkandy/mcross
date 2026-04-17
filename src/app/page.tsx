import { IntroSplash } from "@/components/intro-splash";
import { SoftFloat } from "@/components/soft-float";

const business = {
  phoneDisplay: "(555) 555-0199",
  phoneHref: "tel:+15555550199",
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
      "We look over the roof, check the buildup, and map the safest clean before anything gets sprayed.",
  },
  {
    title: "Wash",
    description:
      "Low-pressure treatment breaks down moss, algae, and staining without hammering the roof surface.",
  },
  {
    title: "Finish",
    description:
      "We leave the roof sharp, the edges cleaned up, and the property looking fresh again.",
  },
];

export default function Home() {
  return (
    <>
      <IntroSplash />
      <main
        id="top"
        className="relative min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]"
      >
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="moss-side moss-side--left" />
          <div className="moss-side moss-side--right" />
          <div className="hero-haze" />
        </div>

        <section className="relative z-10 min-h-screen px-[clamp(1.2rem,3vw,3rem)] pt-5 pb-12 sm:pt-7">
          <header className="flex items-start justify-between gap-6">
            <div>
              <p className="font-heading text-[clamp(2.8rem,4vw,4.4rem)] leading-none tracking-[0.18em] text-white">
                MCROSS
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.42em] text-white/42 sm:text-sm">
                Roof Cleaning
              </p>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <a
                href={business.phoneHref}
                className="rounded-full bg-white/[0.05] px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-white/12"
              >
                Call
              </a>
              <a
                href={`mailto:${business.email}`}
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-white"
              >
                Email
              </a>
            </div>
          </header>

          <div className="grid min-h-[calc(100svh-6.8rem)] gap-10 pt-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(26rem,0.8fr)] lg:items-center lg:gap-14 xl:gap-20">
            <div className="max-w-[78rem]">
              <p className="text-sm uppercase tracking-[0.48em] text-[var(--accent)] sm:text-base">
                Clean Roof. Clean Finish.
              </p>

              <h1 className="mt-5 font-heading text-[clamp(4rem,7.5vw,8.2rem)] leading-[0.9] tracking-[0.035em] text-white">
                <span className="block whitespace-nowrap">Roof Cleaning</span>
                <span className="block whitespace-nowrap text-white/92">
                  That Looks Sharp
                </span>
                <span className="block whitespace-nowrap">And Stays Simple.</span>
              </h1>

              <p className="mt-7 max-w-[48rem] text-[clamp(1.05rem,1.45vw,1.36rem)] leading-[1.75] text-white/72">
                We remove moss, algae, grime, and black streaks with a soft
                wash approach that keeps the roof safe and the house looking
                clean, expensive, and looked-after again.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-white"
                >
                  Sign Up
                </a>
                <a
                  href={business.phoneHref}
                  className="inline-flex items-center justify-center rounded-full bg-white/[0.06] px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-white/[0.12]"
                >
                  Call
                </a>
                <a
                  href={`mailto:${business.email}`}
                  className="inline-flex items-center justify-center rounded-full bg-white/[0.06] px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-white/[0.12]"
                >
                  Email
                </a>
              </div>

              <div className="mt-10 grid max-w-[62rem] gap-3 md:grid-cols-3">
                {trustPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-[1.6rem] bg-white/[0.045] px-4 py-4 text-sm uppercase tracking-[0.2em] text-white/76 shadow-[0_22px_70px_rgba(0,0,0,0.18)]"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:justify-self-end">
              <div className="rounded-[2.3rem] bg-[linear-gradient(180deg,rgba(150,180,120,0.2),rgba(255,255,255,0.05))] p-7 shadow-[0_28px_100px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8">
                <p className="text-xs uppercase tracking-[0.38em] text-[var(--accent)]">
                  Fast Quote
                </p>
                <h2 className="mt-4 font-heading text-[clamp(2.6rem,4.4vw,5rem)] leading-[0.9] tracking-[0.08em] text-white">
                  Book the roof wash without the runaround.
                </h2>
                <p className="mt-4 max-w-[30rem] text-base leading-7 text-white/68">
                  Keep it simple: send a photo, make the call, or email the
                  address below and get the ball rolling fast.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-black/26 px-5 py-5">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/36">
                      Service Area
                    </p>
                    <p className="mt-2 text-2xl text-white">
                      {business.serviceArea}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-black/26 px-5 py-5">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/36">
                      Best For
                    </p>
                    <p className="mt-2 text-base leading-7 text-white/72">
                      Mossy shingles, algae stains, curb appeal cleanups, and
                      pre-sale refreshes.
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  <a
                    href="#contact"
                    className="block rounded-[1.4rem] bg-[var(--accent)] px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-white"
                  >
                    Sign Up
                  </a>
                  <a
                    href={business.phoneHref}
                    className="block rounded-[1.4rem] bg-white/[0.07] px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-white/[0.12]"
                  >
                    {business.phoneDisplay}
                  </a>
                  <a
                    href={`mailto:${business.email}`}
                    className="block rounded-[1.4rem] bg-white/[0.07] px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/[0.12]"
                  >
                    {business.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 px-[clamp(1.2rem,3vw,3rem)] pb-6">
          <div className="grid gap-4 xl:grid-cols-3">
            {serviceSteps.map((step, index) => (
              <SoftFloat key={step.title} delayMs={index * 85}>
                <article className="h-full rounded-[2rem] bg-white/[0.045] p-7 shadow-[0_26px_90px_rgba(0,0,0,0.22)]">
                  <p className="text-xs uppercase tracking-[0.42em] text-[var(--accent)]">
                    0{index + 1}
                  </p>
                  <h2 className="mt-4 font-heading text-[clamp(2.8rem,3vw,4.2rem)] leading-[0.92] tracking-[0.08em] text-white">
                    {step.title}
                  </h2>
                  <p className="mt-4 max-w-[28rem] text-base leading-8 text-white/70">
                    {step.description}
                  </p>
                </article>
              </SoftFloat>
            ))}
          </div>
        </section>

        <SoftFloat className="relative z-10 px-[clamp(1.2rem,3vw,3rem)] pb-20" delayMs={60}>
          <section
            id="contact"
            className="rounded-[2.5rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(150,180,120,0.12))] p-8 shadow-[0_30px_110px_rgba(0,0,0,0.32)] sm:p-10 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(23rem,0.85fr)] lg:gap-10"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-[var(--accent)]">
                Ready When You Are
              </p>
              <h2 className="mt-4 font-heading text-[clamp(3.2rem,5vw,6rem)] leading-[0.9] tracking-[0.08em] text-white">
                Need the roof cleaned? Reach out and lock it in.
              </h2>
              <p className="mt-5 max-w-[42rem] text-base leading-8 text-white/70 sm:text-lg">
                No clutter, no extra pitch, no maze. Just a clean roof-cleaning
                site with a clear next step and a calmer scroll.
              </p>
            </div>

            <div className="mt-8 space-y-3 lg:mt-0">
              <a
                href="#top"
                className="block rounded-[1.45rem] bg-[var(--accent)] px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-white"
              >
                Sign Up
              </a>
              <a
                href={business.phoneHref}
                className="block rounded-[1.45rem] bg-black/28 px-5 py-4 text-center text-base text-white transition hover:bg-black/40"
              >
                {business.phoneDisplay}
              </a>
              <a
                href={`mailto:${business.email}`}
                className="block rounded-[1.45rem] bg-black/28 px-5 py-4 text-center text-base text-white transition hover:bg-black/40"
              >
                {business.email}
              </a>
              <p className="rounded-[1.45rem] bg-black/22 px-5 py-4 text-base text-white/72">
                Serving {business.serviceArea}
              </p>
            </div>
          </section>
        </SoftFloat>
      </main>
    </>
  );
}
