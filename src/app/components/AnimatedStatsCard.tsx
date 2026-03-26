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
      whileHover={{ scale: 1.015, y: -2 }}
      className="cursor-pointer rounded-2xl border border-slate-200/90 bg-white/95 p-6 text-slate-900 transition duration-200 dark:border-slate-700 dark:bg-slate-900/75 dark:text-gray-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-gray-400">{title}</p>
          <motion.p 
            className="mt-2 text-3xl font-bold text-slate-900 dark:text-white"
            key={count}
          >
            {isNumeric ? count.toLocaleString() : value}
          </motion.p>
        </div>
        <div className={`rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 ${color}`}>
          <Icon className="size-6" />
        </div>
      </div>
    </motion.div>
  );
}
