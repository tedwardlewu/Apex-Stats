import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { NewsItem, newsItems } from "../data/newsData";

interface DisplayNewsItem extends NewsItem {
  imageSrc: string;
}

function toPublicImagePath(fileName: string) {
  return `/News/${encodeURIComponent(fileName)}`;
}

export function NewsSection() {
  const [selectedItem, setSelectedItem] = useState<DisplayNewsItem | null>(null);

  const displayNewsItems: DisplayNewsItem[] = newsItems.map((item) => ({
    ...item,
    imageSrc: toPublicImagePath(item.fileName),
  }));

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">News</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">F1 News Wall</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Up-to-date Formula 1 News and Highlights from the 2026 season, curated for F1 fans. Click on any news item to view details and images.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {displayNewsItems.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-sm">
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
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/75 to-transparent p-4 text-white">
                  <p className="text-base font-semibold">{item.title}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Click to expand</p>
                </div>
              </div>
            </button>

            <div className="space-y-2 p-5">
              <p className="text-sm leading-relaxed text-slate-700">
                {item.description || "No description added yet."}
              </p>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={selectedItem !== null} onOpenChange={(open) => !open && setSelectedItem(null)}>
        {selectedItem && (
          <DialogContent className="max-w-5xl bg-white p-5 sm:p-7">
            <DialogHeader>
              <DialogTitle className="text-xl text-slate-900">{selectedItem.title}</DialogTitle>
              <DialogDescription className="text-slate-600">
                {selectedItem.description || "No description added yet."}
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <img
                src={selectedItem.imageSrc}
                alt={selectedItem.title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}