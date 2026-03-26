import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface AnimatedStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  delay?: number;
  backgroundImage?: string;
  backgroundVariant?: "driver" | "team";
  backgroundAccentColor?: string;
}

export function AnimatedStatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color = "text-blue-600",
  delay = 0,
  backgroundImage,
  backgroundVariant,
  backgroundAccentColor,
}: AnimatedStatsCardProps) {
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const numericValue = typeof value === 'number' ? value : 0;
  const isNumeric = typeof value === 'number';
  const showImageBackdrop = Boolean(backgroundImage);
  const imageVariant = backgroundVariant ?? (title === "Leading Team" ? "team" : "driver");
  const encodedBackgroundImage = backgroundImage ? encodeURI(backgroundImage) : "";

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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-6 transition duration-200 ${
        showImageBackdrop
          ? "min-h-[172px] border-slate-700 bg-slate-800 text-white"
          : "border-slate-200/90 bg-white/95 text-slate-900 dark:border-slate-700 dark:bg-slate-900/75 dark:text-gray-200"
      }`}
    >
      {showImageBackdrop && imageVariant === "driver" ? (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(15,23,42,0.62) 0%, rgba(15,23,42,0.4) 46%, rgba(15,23,42,0.08) 100%), url("${encodedBackgroundImage}")`,
            backgroundPosition: "center 2%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "96% auto",
            backgroundColor: backgroundAccentColor ?? "#334155",
          }}
          initial={{ scale: 1.04, x: 0, y: 0 }}
          animate={isHovered ? { scale: 1.08, x: 6, y: -3 } : { scale: 1.04, x: 0, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      ) : null}

      {showImageBackdrop && imageVariant === "team" ? (
        <>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(110deg, ${backgroundAccentColor ?? "#334155"} 0%, rgba(30,41,59,0.88) 56%, rgba(15,23,42,0.96) 100%)`,
            }}
          />
          {encodedBackgroundImage ? (
            <motion.div
              className="pointer-events-none absolute inset-y-0 right-0 flex w-[58%] items-center justify-center"
              initial={{ x: 0 }}
              animate={isHovered ? { x: 8 } : { x: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <img
                src={encodedBackgroundImage}
                alt=""
                aria-hidden="true"
                className="max-h-[68%] w-auto object-contain opacity-95"
              />
            </motion.div>
          ) : null}
        </>
      ) : null}

      {showImageBackdrop ? <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-white/8" /> : null}

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${showImageBackdrop ? "text-slate-200" : "text-slate-600 dark:text-gray-400"}`}>
            {title}
          </p>
          <motion.p 
            className={`mt-2 text-3xl font-bold ${showImageBackdrop ? "text-white drop-shadow-[0_1px_2px_rgba(15,23,42,0.6)]" : "text-slate-900 dark:text-white"}`}
            key={count}
          >
            {isNumeric ? count.toLocaleString() : value}
          </motion.p>
        </div>
        <div className={`rounded-xl border p-3 ${showImageBackdrop ? "border-white/40 bg-white/20 backdrop-blur-[2px]" : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"} ${color}`}>
          <Icon className="size-6" />
        </div>
      </div>
    </motion.div>
  );
}
