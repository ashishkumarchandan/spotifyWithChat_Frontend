const SectionGridSkeleton = () => {
  return (
    <div className="mb-8">
      {/* 🦴 FAKE HEADER */}
      <div className="h-8 w-48 bg-zinc-800 rounded mb-4 animate-pulse" />
      {/* 🦴 FAKE GRID ITEMS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-zinc-800/40 p-4 rounded-md animate-pulse">
            {/* 🦴 FAKE COVER */}
            <div className="aspect-square rounded-md bg-zinc-700 mb-4" />
            {/* 🦴 FAKE TEXT LINES */}
            <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2" />
            <div className="h-4 bg-zinc-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default SectionGridSkeleton;
