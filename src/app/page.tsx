import { IntroSplash } from "@/components/intro-splash";
import { ContactForm } from "@/components/contact-form";
import { HeroBackdrop } from "@/components/hero-backdrop";

const business = {
  phoneDisplay: "425-623-0392",
  phoneHref: "tel:+14256230392",
  email: "akandy@stanford.edu",
};

export default function Home() {
  return (
    <>
      <IntroSplash />
      <main className="site-shell relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
        <section className="relative min-h-screen overflow-hidden px-[clamp(1.2rem,3vw,3.25rem)] py-5 sm:py-7">
          <div aria-hidden="true" className="hero-atmosphere pointer-events-none absolute inset-0">
            <div className="hero-orb hero-orb--left" />
            <div className="hero-orb hero-orb--right" />
            <div className="hero-orb hero-orb--floor" />
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
          </header>

          <div className="relative z-10 grid min-h-[calc(100svh-5.6rem)] items-center gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(31rem,38rem)] lg:gap-12">
            <div className="relative flex min-h-[52svh] items-end overflow-hidden rounded-[2.6rem] lg:min-h-[calc(100svh-10.75rem)]">
              <HeroBackdrop />

              <div className="relative z-10 max-w-[66rem] py-8 pr-[4vw] sm:py-14 lg:pl-2">
                <h1 className="font-heading text-[clamp(4.2rem,6.8vw,9.4rem)] leading-[0.88] tracking-[0.035em] text-white [text-shadow:0_0_22px_rgba(164,194,126,0.06)]">
                  <span className="block whitespace-nowrap">Roof Cleaning</span>
                  <span className="block whitespace-nowrap">That Looks Sharp</span>
                  <span className="block whitespace-nowrap">And Stays Simple.</span>
                </h1>
              </div>
            </div>

            <div className="relative flex items-center justify-end lg:pl-2">
              <div aria-hidden="true" className="form-aura pointer-events-none absolute inset-[-12%]" />
              <div className="relative z-10 w-full max-w-[38rem]">
                <ContactForm
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
