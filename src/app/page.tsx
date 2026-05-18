import Image from "next/image";
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

const disclaimers = [
  "Estimates are not final until MCROSS reviews the property, confirms access, roof condition, safety, and scope. Service may be rescheduled or declined for weather, unsafe conditions, fragile materials, active leaks, or pre-existing damage.",
  "Cleaning results vary by roof age, material, staining, moss or algae depth, drainage, and prior maintenance. MCROSS does not guarantee complete stain removal, roof restoration, manufacturer warranty coverage, or correction of pre-existing issues.",
  "By submitting, you agree MCROSS may contact you about your request by phone, email, or text. Consent is not required to purchase. Message and data rates may apply. Reply STOP to opt out of texts.",
] as const;

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
              <Image
                alt=""
                aria-hidden="true"
                className="founders-badge__mark"
                height={42}
                src="/founders-inc-mark.svg"
                width={42}
              />
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

          <footer className="site-disclaimer relative z-10" aria-label="Service disclaimers">
            <p className="site-disclaimer__label">Important service notes</p>
            <div className="site-disclaimer__copy">
              {disclaimers.map((disclaimer) => (
                <p key={disclaimer}>{disclaimer}</p>
              ))}
            </div>
          </footer>
        </section>
      </main>
    </>
  );
}
