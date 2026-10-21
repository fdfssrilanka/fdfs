const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

/** Cast and crew as initials in circles (no portraits are published by the cinemas). */
export default function CastCircles({ director, cast }: { director: string; cast: string[] }) {
  const people = [...(director ? [{ name: director, role: "Director" }] : []), ...cast.map((name) => ({ name, role: "Cast" }))];
  if (!people.length) return <p className="text-sm text-muted">Cast not announced yet.</p>;
  return (
    <ul className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
      {people.map((p) => (
        <li key={p.role + p.name} className="w-24 shrink-0 text-center">
          <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-surface-2 text-xl font-black text-accent ring-1 ring-line">{initials(p.name)}</span>
          <span className="mt-2 block text-xs font-semibold leading-snug">{p.name}</span>
          <span className="block text-xs text-muted">{p.role}</span>
        </li>
      ))}
    </ul>
  );
}
