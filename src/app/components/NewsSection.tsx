import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { NewsItem, newsItems } from "../data/newsData";

interface DisplayNewsItem extends NewsItem {
  imageSrc: string;
  imageSrcs: string[];
}

function toPublicImagePath(fileName: string) {
  return `/News/${encodeURIComponent(fileName)}`;
}

export function NewsSection() {
  const [selectedItem, setSelectedItem] = useState<DisplayNewsItem | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!selectedItem) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setImageIndex((prev) => (prev + 1) % selectedItem.imageSrcs.length);
      } else if (e.key === "ArrowLeft") {
        setImageIndex(
          (prev) => (prev - 1 + selectedItem.imageSrcs.length) % selectedItem.imageSrcs.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedItem]);

  const displayNewsItems: DisplayNewsItem[] = newsItems.map((item) => {
    const imageSrcs = item.fileNames
      ? item.fileNames.map(toPublicImagePath)
      : [toPublicImagePath(item.fileName)];
    return {
      ...item,
      imageSrc: imageSrcs[0],
      imageSrcs,
    };
  });

  return (
    <section className="space-y-6">
      <div className="rounded-[16px] border border-slate-200/70 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">News</p>
        <h2 className="mt-2 text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100">F1 News Wall</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Up-to-date Formula 1 News and Highlights from the 2026 season, curated for F1 fans. Click on any news item to view details and images.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {displayNewsItems.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-[16px] border border-slate-200/70 bg-white shadow-sm transition-colors dark:border-slate-700/70 dark:bg-slate-900"
          >
            <button
              type="button"
              className="group block w-full text-left"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent p-4 text-white">
                  <p className="text-lg font-semibold leading-snug md:text-xl">{item.title}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-200">Click to expand</p>
                </div>
              </div>
            </button>

            <div className="space-y-2 p-5">
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {item.description || "No description added yet."}
              </p>
            </div>
          </article>
        ))}
      </div>

      <Dialog
        open={selectedItem !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null);
            setImageIndex(0);
          }
        }}
      >
        {selectedItem && (
          <DialogContent className="max-w-5xl border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-700 dark:bg-slate-900">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold leading-snug text-slate-900 dark:text-slate-100">
                {selectedItem.title}
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-300">
                {selectedItem.description || "No description added yet."}
              </DialogDescription>
            </DialogHeader>
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
              <img
                src={selectedItem.imageSrcs[imageIndex]}
                alt={selectedItem.title}
                className="max-h-[70vh] w-full object-contain"
              />
              {selectedItem.imageSrcs.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setImageIndex(
                        (prev) =>
                          (prev - 1 + selectedItem.imageSrcs.length) % selectedItem.imageSrcs.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setImageIndex((prev) => (prev + 1) % selectedItem.imageSrcs.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 rounded-full bg-black/40 px-3 py-1">
                    {selectedItem.imageSrcs.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImageIndex(i)}
                        className={`h-2 w-2 rounded-full transition ${
                          i === imageIndex ? "bg-white" : "bg-white/50"
                        }`}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}