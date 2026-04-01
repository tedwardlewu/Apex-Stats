
import { LucideIcon, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";

function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-slate-300 dark:bg-slate-700 rounded ${className}`} />
  );
}

export default AnimatedStatsCard;

interface AnimatedStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  delay?: number;
  backgroundImage?: string;
  backgroundImages?: string[];
  
  backgroundImageLocations?: { circuit: string; country: string }[];
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
  backgroundImages,
  backgroundVariant,
  backgroundAccentColor,
  backgroundImageLocations = [],
}: AnimatedStatsCardProps & { backgroundImageLocations?: { circuit: string; country: string }[] }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const numericValue = typeof value === 'number' ? value : 0;
  const isNumeric = typeof value === 'number';
  const [bgIndex, setBgIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const fadeTimeout = useRef<number | null>(null);
  const showImageBackdrop = Boolean(backgroundImage) || (backgroundImages && backgroundImages.length > 0);
  const imageVariant = backgroundVariant ?? (title === "Leading Team" ? "team" : "driver");
  const currentLocation = backgroundImageLocations && backgroundImageLocations.length > 0 && backgroundImages && backgroundImages.length > 0
    ? backgroundImageLocations[bgIndex % backgroundImageLocations.length]
    : null;

  
  useEffect(() => {
    if (
      (backgroundImages && backgroundImages.length > 0) ||
      backgroundImage ||
      (value !== undefined && value !== null && value !== "")
    ) {
      setIsLoaded(true);
    }
  }, [backgroundImages, backgroundImage, value]);
  const currentBg = backgroundImages && backgroundImages.length > 0 ? backgroundImages[bgIndex % backgroundImages.length] : backgroundImage;
  const encodedBackgroundImage = currentBg ? encodeURI(currentBg) : "";

  useEffect(() => {
    if (!backgroundImages || backgroundImages.length === 0) return;
    
    let intervalId: NodeJS.Timeout;
    function startInterval() {
      const duration = 5000 + Math.floor(Math.random() * 2000); 
      intervalId = setTimeout(() => {
        setFade(false);
        fadeTimeout.current = setTimeout(() => {
          setBgIndex((i) => (i + 1) % backgroundImages.length);
          setFade(true);
          startInterval(); 
        }, 400);
      }, duration);
    }
    startInterval();
    return () => {
      clearTimeout(intervalId);
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, [backgroundImages]);

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
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80">
          <Skeleton className="w-2/3 h-6 mb-4" />
          <Skeleton className="w-1/2 h-10 mb-2" />
          <Skeleton className="w-10 h-10 rounded-xl" />
        </div>
      )}
      {showImageBackdrop && imageVariant === "driver" ? (
        <>
          <motion.div
            className={`pointer-events-none absolute inset-0 z-0`}
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(15,23,42,0.34) 0%, rgba(15,23,42,0.18) 46%, rgba(15,23,42,0.02) 100%), url("${encodedBackgroundImage}")`,
              backgroundPosition: (backgroundImages && backgroundImages.length > 0 && encodedBackgroundImage.includes('/Race%20Backgrounds/')) ? "center 100%" : "center 2%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "96% auto",
              backgroundColor: backgroundAccentColor ?? "#334155",
              opacity: fade ? 1 : 0,
              transition: 'opacity 400ms cubic-bezier(0.4,0,0.2,1)',
            }}
            initial={{ scale: 1.04, x: 0, y: 0 }}
            animate={isHovered ? { scale: 1.08, x: 6, y: -3 } : { scale: 1.04, x: 0, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </>
      ) : null}

      
      {showImageBackdrop && imageVariant === "driver" && currentLocation && (
        <div
          className="absolute left-0 right-0 flex items-center gap-1 bottom-0 bg-black/60 rounded-b-2xl px-4 py-1 z-40"
          style={{ pointerEvents: "none", minWidth: 0 }}
        >
          <MapPin size={16} className="text-gray-300 shrink-0" />
          <span className="text-xs text-white font-semibold truncate">
            {currentLocation.circuit} — {currentLocation.country}
          </span>
        </div>
      )}

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

      {showImageBackdrop ? (
        <div
          className={`pointer-events-none absolute inset-0 z-10 ${imageVariant === "driver" ? "bg-gradient-to-t from-black/12 via-transparent to-white/6" : "bg-gradient-to-t from-black/28 via-transparent to-white/8"}`}
        />
      ) : null}

      <div className="relative flex items-start justify-between">
        <div className={`relative flex-1 overflow-hidden ${showImageBackdrop && imageVariant === "driver" && isHovered ? "z-0" : "z-20"}`}>
          <p className={`text-sm ${showImageBackdrop ? "font-semibold text-white/95 drop-shadow-[0_1px_2px_rgba(15,23,42,0.7)]" : "font-medium text-slate-600 dark:text-gray-400"}`}>
            {isLoaded ? title : <Skeleton className="w-2/3 h-5" />}
          </p>
          <div className="relative mt-2 min-h-[2.35rem]">
            {isLoaded ? (
              <motion.p
                className={`text-3xl font-extrabold ${showImageBackdrop ? "text-white drop-shadow-[0_1px_2px_rgba(15,23,42,0.7)]" : "text-slate-900 dark:text-white"}`}
                key={count}
              >
                {isNumeric ? count.toLocaleString() : value}
              </motion.p>
            ) : (
              <Skeleton className="w-1/2 h-8" />
            )}
          </div>
        </div>
        <div className={`relative z-30 rounded-xl border p-3 ${showImageBackdrop ? "border-white/40 bg-white/20 backdrop-blur-[2px]" : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"} ${color}`}>
          {isLoaded ? <Icon className="size-6" /> : <Skeleton className="w-8 h-8 rounded-xl" />}
        </div>
      </div>
    </motion.div>
  );
}
