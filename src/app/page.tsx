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
                viewBox="0 0 512 512"
              >
                <rect width="512" height="512" rx="92" fill="#061807" />
                <circle cx="176" cy="88" r="120" fill="#0d3a12" opacity="0.55" />
                <circle cx="356" cy="404" r="150" fill="#0f3f13" opacity="0.48" />
                <path
                  d="M276 156 458 51c22-13 50 3 50 29v76c0 17-9 33-24 41L329 287 228 229c-24-14-24-49 0-63l48-28Z"
                  fill="#16ff00"
                />
                <path
                  d="M74 229c-28-16-63 16-47 44l301 174c24 14 54-3 54-31v-78L170 216c-30-17-67-12-96 13Z"
                  fill="#16ff00"
                />
                <path
                  d="M328 219 454 146c24-14 54 3 54 31v157c0 28-30 45-54 31l-126-73c-28-16-28-57 0-73Z"
                  fill="#16ff00"
                />
              </svg>
              <span>
                Backed by <strong>Founders Inc.</strong>
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
