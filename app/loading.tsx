export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8" aria-busy>
      <div className="skeleton h-64 w-full rounded-2xl" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton aspect-[2/3] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
