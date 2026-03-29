import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock3, Newspaper, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { NewsItem, newsItems } from "../data/newsData";

interface DisplayNewsItem extends NewsItem {
  imageSrc: string;
  imageSrcs: string[];
  category: string;
  readTimeMinutes: number;
}

const categoryKeywords: Array<{ label: string; keywords: string[] }> = [
  { label: "Practice", keywords: ["practice", "fp1", "fp2", "fp3"] },
  { label: "Teams", keywords: ["team", "livery", "mercedes", "haas", "aston"] },
  { label: "Drivers", keywords: ["driver", "replacing", "session", "lineup", "take part"] },
];

function toPublicImagePath(fileName: string) {
  return `/News/${encodeURIComponent(fileName)}`;
}

function getCategory(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const match = categoryKeywords.find((entry) =>
    entry.keywords.some((keyword) => text.includes(keyword))
  );
  return match?.label ?? "Weekend";
}

function getReadTime(description: string) {
  const words = description.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export function NewsSection() {
  const [selectedItem, setSelectedItem] = useState<DisplayNewsItem | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");

  const openStory = (item: DisplayNewsItem) => {
    setSelectedItem(item);
    setImageIndex(0);
  };

  const goToPreviousImage = () => {
    if (!selectedItem) return;
    setImageIndex((prev) => (prev - 1 + selectedItem.imageSrcs.length) % selectedItem.imageSrcs.length);
  };

  const goToNextImage = () => {
    if (!selectedItem) return;
    setImageIndex((prev) => (prev + 1) % selectedItem.imageSrcs.length);
  };

  useEffect(() => {
    if (!selectedItem) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNextImage();
      } else if (e.key === "ArrowLeft") {
        goToPreviousImage();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedItem]);

  const displayNewsItems: DisplayNewsItem[] = useMemo(
    () =>
      newsItems.map((item) => {
        const imageSrcs = item.fileNames
          ? item.fileNames.map(toPublicImagePath)
          : [toPublicImagePath(item.fileName)];
        return {
          ...item,
          imageSrc: imageSrcs[0],
          imageSrcs,
          category: getCategory(item.title, item.description),
          readTimeMinutes: getReadTime(item.description),
        };
      }),
    []
  );

  const categories = useMemo(() => {
    const unique = Array.from(new Set(displayNewsItems.map((item) => item.category)));
    return ["All", ...unique];
  }, [displayNewsItems]);

  const organizedItems = useMemo(() => {
    if (activeCategory === "All") return displayNewsItems;
    return displayNewsItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, displayNewsItems]);

  const featuredStory = organizedItems[0] ?? displayNewsItems[0];
  const sideStories = organizedItems.slice(1, 5);
  const moreStories = organizedItems.slice(5);

  return (
    <section className="space-y-7">
      <div className="relative overflow-hidden rounded-[18px] border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-6 shadow-sm dark:border-slate-700/70 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-400/20 blur-2xl dark:bg-sky-500/15" />
        <div className="absolute -bottom-8 left-1/3 h-28 w-28 rounded-full bg-red-300/20 blur-2xl dark:bg-red-500/15" />

        <div className="relative flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 dark:bg-slate-800/70">
            <Newspaper size={13} />
            News Desk
          </span>
          <span>{displayNewsItems.length} stories</span>
          <span>{categories.length - 1} beats</span>
        </div>

        <h2 className="relative mt-3 text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100 md:text-4xl">
          F1 Weekend Briefing
        </h2>
      </div>

      <div className="rounded-[18px] border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                activeCategory === category
                  ? "border-sky-500 bg-sky-500 text-white"
                  : "border-slate-300 text-slate-700 hover:border-sky-400 hover:text-sky-700 dark:border-slate-600 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:text-sky-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
        {featuredStory && (
          <article className="overflow-hidden rounded-[18px] border border-slate-200/70 bg-white shadow-sm dark:border-slate-700/70 dark:bg-slate-900">
            <button type="button" className="group block w-full text-left" onClick={() => openStory(featuredStory)}>
              <div className="relative overflow-hidden">
                <img
                  src={featuredStory.imageSrc}
                  alt={featuredStory.title}
                  className="h-[24rem] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
                    <span className="rounded-full bg-red-500/90 px-2.5 py-1">Lead Story</span>
                    <span className="rounded-full bg-white/20 px-2.5 py-1">{featuredStory.category}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1">
                      <Clock3 size={12} />
                      {featuredStory.readTimeMinutes} min
                    </span>
                  </div>
                  <p className="text-2xl font-bold leading-tight md:text-3xl">{featuredStory.title}</p>
                  <p className="mt-2 line-clamp-3 max-w-3xl text-sm text-slate-100/90">
                    {featuredStory.description || "No description added yet."}
                  </p>
                </div>
              </div>
            </button>
          </article>
        )}

        <aside className="rounded-[18px] border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-700/70 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Headlines</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              <TrendingUp size={12} />
              Live
            </span>
          </div>
          <div className="space-y-3">
            {sideStories.length > 0 ? (
              sideStories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openStory(item)}
                  className="group flex w-full items-start gap-3 rounded-xl border border-slate-200/80 p-2.5 text-left transition hover:border-sky-300 hover:bg-sky-50/70 dark:border-slate-700/70 dark:hover:border-sky-500/50 dark:hover:bg-slate-800"
                >
                  <img src={item.imageSrc} alt={item.title} className="h-16 w-20 flex-none rounded-md object-cover" />
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-300">
                      {item.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.08em]">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.category}
                      </span>
                      <span className="rounded-full bg-sky-100 px-2 py-1 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                        {item.readTimeMinutes} min
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                No extra headlines in this category yet.
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="rounded-[18px] border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-700/70 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">More Stories</h3>
          <p className="text-xs uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
            {organizedItems.length} total
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {moreStories.length > 0 ? (
            moreStories.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900"
              >
                <button type="button" className="block w-full text-left" onClick={() => openStory(item)}>
                  <img src={item.imageSrc} alt={item.title} className="h-44 w-full object-cover" />
                  <div className="space-y-3 p-4">
                    <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.1em]">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.category}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                        {item.readTimeMinutes} min
                      </span>
                    </div>
                    <p className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
                      {item.title}
                    </p>
                    <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {item.description || "No description added yet."}
                    </p>
                  </div>
                </button>
              </article>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
              No more stories under this filter.
            </div>
          )}
        </div>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                <span>Story Preview</span>
                <span>
                  Image {imageIndex + 1} of {selectedItem.imageSrcs.length}
                </span>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
                <img
                  src={selectedItem.imageSrcs[imageIndex]}
                  alt={selectedItem.title}
                  className="max-h-[68vh] w-full object-contain"
                />

                {selectedItem.imageSrcs.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goToPreviousImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/65"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      type="button"
                      onClick={goToNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/65"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 rounded-full bg-black/45 px-3 py-1">
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

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-300"
                  style={{ width: `${((imageIndex + 1) / selectedItem.imageSrcs.length) * 100}%` }}
                />
              </div>

              {selectedItem.imageSrcs.length > 1 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                      Quick Thumbnails
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Use arrow keys to switch</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {selectedItem.imageSrcs.map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImageIndex(i)}
                        className={`overflow-hidden rounded-lg border-2 transition ${
                          i === imageIndex
                            ? "border-sky-500 ring-2 ring-sky-500/20"
                            : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                        aria-label={`Preview image ${i + 1}`}
                      >
                        <img
                          src={src}
                          alt={`${selectedItem.title} thumbnail ${i + 1}`}
                          className="h-14 w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}