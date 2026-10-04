export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#inicio" className={`brand ${compact ? "is-compact" : ""}`} aria-label="Cómplice Lab, inicio">
      <img
        className="brand-logo"
        src="/brand/complice-lab-logo.svg"
        alt="Cómplice Lab"
        width="900"
        height="244"
      />
    </a>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <header className={`section-heading reveal ${align === "center" ? "is-centered" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </header>
  );
}
