import { IntroSplash } from "@/components/intro-splash";
import { ContactForm } from "@/components/contact-form";

const business = {
  phoneDisplay: "425-623-0392",
  phoneHref: "tel:+14256230392",
  email: "akandy@stanford.edu",
};

export default function Home() {
  return (
    <>
      <IntroSplash />
      <main className="site-shell min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <section className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-[clamp(1.2rem,3vw,3rem)] py-5 sm:py-7">
          <header className="flex items-start justify-between gap-6">
            <div>
              <p className="font-heading text-[clamp(2.8rem,4vw,4.4rem)] leading-none tracking-[0.18em] text-white">
                MCROSS
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.42em] text-white/42 sm:text-sm">
                Roof Cleaning
              </p>
            </div>
          </header>

          <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,30rem)] lg:gap-16">
            <div className="max-w-[54rem]">
              <h1 className="font-heading text-[clamp(4rem,8vw,9.2rem)] leading-[0.88] tracking-[0.035em] text-white">
                <span className="block whitespace-nowrap">Roof Cleaning</span>
                <span className="block whitespace-nowrap">That Looks Sharp</span>
                <span className="block whitespace-nowrap">And Stays Simple.</span>
              </h1>
            </div>

            <div className="w-full lg:justify-self-end">
              <ContactForm
                email={business.email}
                phoneDisplay={business.phoneDisplay}
                phoneHref={business.phoneHref}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
