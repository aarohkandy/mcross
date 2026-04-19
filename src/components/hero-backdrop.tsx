import { HeroLife } from "@/components/hero-life";

export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="hero-backdrop">
      <div className="hero-backdrop__far-roof" />
      <div className="hero-backdrop__traces">
        <span className="hero-backdrop__trace hero-backdrop__trace--one" />
        <span className="hero-backdrop__trace hero-backdrop__trace--two" />
        <span className="hero-backdrop__trace hero-backdrop__trace--three" />
      </div>
      <div className="hero-backdrop__roof">
        <div className="hero-backdrop__grid" />
        <div className="hero-backdrop__moss hero-backdrop__moss--one" />
        <div className="hero-backdrop__moss hero-backdrop__moss--two" />
        <div className="hero-backdrop__moss hero-backdrop__moss--three" />
        <div className="hero-backdrop__wash" />
      </div>
      <div className="hero-backdrop__life">
        <HeroLife />
      </div>
      <div className="hero-backdrop__pulse hero-backdrop__pulse--one" />
      <div className="hero-backdrop__pulse hero-backdrop__pulse--two" />
      <div className="hero-backdrop__shadow" />
    </div>
  );
}
