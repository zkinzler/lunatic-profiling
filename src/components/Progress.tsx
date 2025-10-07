interface ProgressProps {
  current: number;
  total: number;
}

export default function Progress({ current, total }: ProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-200">Progress</span>
        <span className="text-sm font-medium text-gray-200">
          {current} / {total}
        </span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-300">
          {Math.round(percentage)}% Complete
        </span>
      </div>
    </div>
  );
}