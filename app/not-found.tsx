import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-4xl font-black">Scene missing</h1>
      <p className="mt-3 text-muted">We couldn&apos;t find that page.</p>
      <Link href="/" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-bold text-accent-ink">Back to showtimes</Link>
    </div>
  );
}
