'use client';

interface BlueprintSectionProps {
  icon: string;
  title: string;
  content: string;
  variant?: 'default' | 'highlight' | 'warning' | 'success';
  size?: 'normal' | 'large';
}

export default function BlueprintSection({
  icon,
  title,
  content,
  variant = 'default',
  size = 'normal',
}: BlueprintSectionProps) {
  const variantStyles = {
    default: 'border-white/20',
    highlight: 'border-pink-500/50 glow-pink',
    warning: 'border-yellow-500/50',
    success: 'border-green-500/50',
  };

  const titleStyles = {
    default: 'text-gray-300',
    highlight: 'gradient-text',
    warning: 'text-yellow-400',
    success: 'text-green-400',
  };

  return (
    <div className={`glass-strong rounded-2xl p-6 border ${variantStyles[variant]} ${
      size === 'large' ? 'col-span-2' : ''
    }`}>
      <div className="flex items-start gap-4">
        <span className="text-3xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold mb-2 ${titleStyles[variant]}`}>
            {title}
          </h3>
          <p className="text-gray-100 leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
