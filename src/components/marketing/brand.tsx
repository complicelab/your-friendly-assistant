export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#inicio" className="brand" aria-label="Cómplice Lab, inicio">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
      </span>
      {!compact && (
        <span className="brand-word">
          CÓMPLICE <b>LAB</b>
        </span>
      )}
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
