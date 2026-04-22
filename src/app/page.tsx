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
                <path
                  d="M62.7 12.8 22.8 36c-4.4 2.6-4.3 8.9.2 11.4l14 7.7 45.5-26.4c2.2-1.3 3.5-3.6 3.5-6.1V17c0-3.8-4.2-6.2-7.6-4.2H62.7Z"
                  fill="currentColor"
                />
                <path
                  d="M14.8 47.6c-5.2-3-10.6 3-7.3 8.1l55.2 31.8c4.1 2.4 9.3-.6 9.3-5.3V67.4L27.1 42.1l-12.3 5.5Z"
                  fill="currentColor"
                />
                <path
                  d="M60.7 43.8 85.4 29.5c4.1-2.4 9.3.6 9.3 5.3v28.4c0 4.7-5.2 7.7-9.3 5.3L60.7 54.2c-4.1-2.3-4.1-8.1 0-10.4Z"
                  fill="currentColor"
                />
              </svg>
              <span>Backed by Founders Inc.</span>
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
