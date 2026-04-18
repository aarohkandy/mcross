export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="hero-backdrop">
      <div className="hero-backdrop__roof">
        <div className="hero-backdrop__grid" />
        <div className="hero-backdrop__moss hero-backdrop__moss--one" />
        <div className="hero-backdrop__moss hero-backdrop__moss--two" />
        <div className="hero-backdrop__moss hero-backdrop__moss--three" />
        <div className="hero-backdrop__wash" />
      </div>
      <div className="hero-backdrop__shadow" />
    </div>
  );
}
