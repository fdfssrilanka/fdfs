export default function PageIntro({ h1, children }: { h1: string; children: React.ReactNode }) {
  return (
    <header className="mb-6 max-w-3xl">
      <h1 className="font-display text-4xl uppercase sm:text-5xl">{h1}</h1>
      <p className="mt-2 leading-relaxed text-ink/80">{children}</p>
    </header>
  );
}
