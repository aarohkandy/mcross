export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="hero-backdrop">
      <div className="hero-backdrop__field hero-backdrop__field--base" />
      <div className="hero-backdrop__field hero-backdrop__field--glow" />
      <div className="hero-backdrop__drift hero-backdrop__drift--a" />
      <div className="hero-backdrop__drift hero-backdrop__drift--b" />
      <div className="hero-backdrop__mesh" />
      <div className="hero-backdrop__grain" />
      <div className="hero-backdrop__vignette" />
    </div>
  );
}
