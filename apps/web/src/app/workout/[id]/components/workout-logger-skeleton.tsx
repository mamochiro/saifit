export function WorkoutLoggerSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="px-4 pt-10 pb-4">
        <div className="h-7 w-48 bg-secondary rounded-lg mb-2" />
        <div className="h-4 w-32 bg-secondary rounded" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="px-4 mb-6">
          <div className="h-5 w-40 bg-secondary rounded mb-3" />
          {[0, 1, 2].map((j) => (
            <div key={j} className="h-14 bg-secondary rounded-xl mb-2" />
          ))}
        </div>
      ))}
    </div>
  );
}
