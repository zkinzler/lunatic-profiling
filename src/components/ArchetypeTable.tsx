interface Archetype {
  name: string;
  percentage: number;
}

interface ArchetypeTableProps {
  archetypes: Archetype[];
}

export default function ArchetypeTable({ archetypes }: ArchetypeTableProps) {
  const getBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-gradient-to-r from-red-500 to-pink-500';
    if (percentage >= 60) return 'bg-gradient-to-r from-orange-500 to-yellow-500';
    if (percentage >= 40) return 'bg-gradient-to-r from-blue-500 to-purple-500';
    return 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-4">
      {archetypes.map((archetype, index) => (
        <div key={archetype.name} className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-white capitalize">
              {archetype.name.replace(/_/g, ' ')}
            </h3>
            <span className="text-lg font-bold text-white">
              {archetype.percentage}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ease-out ${getBarColor(
                archetype.percentage
              )}`}
              style={{
                width: `${archetype.percentage}%`,
                animationDelay: `${index * 200}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}