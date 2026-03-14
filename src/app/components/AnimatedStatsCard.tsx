import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface AnimatedStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  delay?: number;
}

export function AnimatedStatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color = "text-blue-600",
  delay = 0 
}: AnimatedStatsCardProps) {
  const [count, setCount] = useState(0);
  const numericValue = typeof value === 'number' ? value : 0;
  const isNumeric = typeof value === 'number';

  useEffect(() => {
    if (!isNumeric) return;

    const duration = 1500;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numericValue, isNumeric]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="cursor-pointer rounded-lg border border-slate-200 bg-white p-6 text-slate-900 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 dark:text-gray-400">{title}</p>
          <motion.p 
            className="mt-2 text-3xl font-bold text-slate-900 dark:text-white"
            key={count}
          >
            {isNumeric ? count.toLocaleString() : value}
          </motion.p>
        </div>
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className={`rounded-lg bg-slate-100 p-3 dark:bg-gray-700 ${color}`}
        >
          <Icon className="size-6" />
        </motion.div>
      </div>
    </motion.div>
  );
}
