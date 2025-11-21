interface ProgressProps {
  current: number;
  total: number;
}

export default function Progress({ current, total }: ProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full glass-strong rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold gradient-text">Your Journey</span>
        <span className="text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 rounded-full">
          {current} / {total}
        </span>
      </div>

      <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full transition-all duration-500 ease-out glow-pink"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-gray-300">
          {Math.round(percentage)}% Complete
        </span>
        {percentage < 100 ? (
          <span className="text-xs text-gray-400">
            {total - current} question{total - current !== 1 ? 's' : ''} remaining
          </span>
        ) : (
          <span className="text-xs gradient-text font-semibold">
            ✨ Journey Complete!
          </span>
        )}
      </div>
    </div>
  );
}