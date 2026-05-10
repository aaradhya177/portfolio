export function BiosScreen({ lines }) {
  return (
    <section className="bios-screen" aria-label="BIOS boot screen">
      <div className="bios-text">
        {lines.map((line, index) => (
          <p
            key={`${index}-${line || 'blank'}`}
            className="bios-line bios-line-visible"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            {line || '\u00A0'}
          </p>
        ))}
      </div>
    </section>
  );
}
