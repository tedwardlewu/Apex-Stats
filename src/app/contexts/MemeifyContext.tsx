import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const MEMEIFY_STORAGE_KEY = "apex-stats-memeify";

interface MemeifyContextValue {
  memeify: boolean;
  toggleMemeify: () => void;
}

const MemeifyContext = createContext<MemeifyContextValue | undefined>(undefined);

export function MemeifyProvider({ children }: { children: ReactNode }) {
  const [memeify, setMemeify] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(MEMEIFY_STORAGE_KEY) === "true";
  });

  useEffect(() => {
    window.localStorage.setItem(MEMEIFY_STORAGE_KEY, String(memeify));
  }, [memeify]);

  return (
    <MemeifyContext.Provider
      value={{
        memeify,
        toggleMemeify: () => setMemeify((current) => !current),
      }}
    >
      {children}
    </MemeifyContext.Provider>
  );
}

export function useMemeify() {
  const context = useContext(MemeifyContext);

  if (!context) {
    throw new Error("useMemeify must be used within a MemeifyProvider");
  }

  return context;
}