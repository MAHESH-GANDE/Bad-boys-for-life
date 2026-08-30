export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-16">
      <div className="h-[50vh] bg-neutral-900" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square bg-neutral-900" />
        ))}
      </div>
    </div>
  );
}
