export default function Loader({ size = 'md', text = 'Loading...' }) {
  const sizeMap = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div
        className={`${sizeMap[size]} rounded-full border-surface-border border-t-brand-500 animate-spin`}
      />
      {text && <p className="text-sm text-gray-500 animate-pulse">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-surface flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-brand-lg animate-float">
          <span className="text-white font-display font-bold text-2xl">D</span>
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-surface-border border-t-brand-500 animate-spin" />
        <p className="text-sm text-gray-500">Loading Devi Collections...</p>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[3/4]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-5 w-24 rounded" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
