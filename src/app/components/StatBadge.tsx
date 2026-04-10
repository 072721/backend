import { motion } from 'motion/react';

interface StatBadgeProps {
  value: number;
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export function StatBadge({ value, label, variant = 'default' }: StatBadgeProps) {
  const colors = {
    default: 'bg-gray-100 text-gray-900',
    primary: 'bg-blue-100 text-blue-900',
    success: 'bg-green-100 text-green-900',
    warning: 'bg-orange-100 text-orange-900',
  };

  return (
    <motion.div
      key={value}
      initial={{ scale: 1.2, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`rounded-lg p-3 ${colors[variant]}`}
    >
      <p className="text-xs uppercase tracking-wide mb-1 opacity-70">{label}</p>
      <motion.p
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl font-bold"
      >
        {value}
      </motion.p>
    </motion.div>
  );
}
