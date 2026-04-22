import { IntroSplash } from "@/components/intro-splash";
import { ContactForm } from "@/components/contact-form";
import { HeroBackdrop } from "@/components/hero-backdrop";

const business = {
  ccEmails: ["aarohkandy@gmail.com", "hongyiren2009@outlook.com"],
  phoneDisplay: "425-623-0392",
  phoneHref: "tel:+14256230392",
  email: "akandy@stanford.edu",
};

const heroLines = ["Roof Cleaning,", "Faster, Cheaper,", "Better."] as const;

export default function Home() {
  return (
    <>
      <IntroSplash />
      <main className="site-shell relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
        <section className="relative min-h-screen overflow-hidden px-[clamp(1.2rem,3vw,3.25rem)] py-5 sm:py-7">
          <div aria-hidden="true" className="hero-atmosphere pointer-events-none absolute inset-0">
            <HeroBackdrop />
          </div>

          <header className="relative z-10 flex items-start justify-between gap-6">
            <div>
              <p className="font-heading text-[clamp(2.8rem,4vw,4.4rem)] leading-none tracking-[0.18em] text-white">
                MCROSS
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.42em] text-white/42 sm:text-sm">
                Roof Cleaning
              </p>
            </div>

            <div className="founders-badge" aria-label="Backed by Founders Inc.">
              <svg
                aria-hidden="true"
                className="founders-badge__mark"
                viewBox="0 0 100 100"
              >
                <rect width="100" height="100" rx="18" fill="#071507" />
                <path
                  d="M64 14 24 37c-4 2-4 8 0 11l14 8 46-27c2-1 3-3 3-6V18c0-4-5-6-8-4Z"
                  fill="#16ff00"
                />
                <path
                  d="M16 49c-5-3-11 4-7 9l54 31c4 2 9-1 9-6V67L27 42 16 49Z"
                  fill="#16ff00"
                />
                <path
                  d="M61 44 86 30c4-2 9 1 9 6v28c0 5-5 8-9 6L61 56c-5-3-5-9 0-12Z"
                  fill="#16ff00"
                />
              </svg>
              <span className="founders-badge__copy">
                <span>Backed by</span>
                <strong>Founders Inc.</strong>
              </span>
            </div>
          </header>

          <div className="hero-layout relative z-10">
            <div className="hero-copy">
              <div className="hero-copy__inner relative z-10">
                <h1 className="hero-lockup font-heading text-white">
                  {heroLines.map((line) => (
                    <span className="hero-lockup__line" key={line}>
                      {line}
                    </span>
                  ))}
                </h1>
              </div>
            </div>

            <div className="hero-form-shell relative">
              <div aria-hidden="true" className="form-aura pointer-events-none absolute inset-[-12%]" />
              <div className="relative z-10 w-full">
                <ContactForm
                  ccEmails={business.ccEmails}
                  email={business.email}
                  phoneDisplay={business.phoneDisplay}
                  phoneHref={business.phoneHref}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
