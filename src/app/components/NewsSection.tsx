import { FormEvent, useState } from "react";

interface NewsPost {
  id: number;
  title: string;
  image: string;
  createdAt: string;
}

export function NewsSection() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!imageUrl.trim()) {
      setError("Add an image URL or upload an image file before posting.");
      return;
    }

    const newPost: NewsPost = {
      id: Date.now(),
      title: title.trim() || "Untitled F1 update",
      image: imageUrl,
      createdAt: new Date().toLocaleString(),
    };

    setPosts((prev) => [newPost, ...prev]);
    setTitle("");
    setImageUrl("");
    setError("");
  };

  const handleFileUpload = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
        setError("");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">News</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">F1 News Wall</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Start posting race-week updates and breaking paddock moments. This is a local-only draft feed for now.
        </p>
      </div>

      <article className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Post a news image</h3>
        <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Headline (optional)"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none ring-red-500 transition focus:ring"
          />
          <input
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://image-url.com/f1-news.jpg"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none ring-red-500 transition focus:ring"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleFileUpload(event.target.files?.[0])}
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
          />
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-fit rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            Post update
          </button>
        </form>
      </article>

      {posts.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
          No news posts yet. Add your first F1 news image above.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-sm">
              <img src={post.image} alt={post.title} className="h-64 w-full object-cover" />
              <div className="space-y-2 p-5">
                <h4 className="text-lg font-semibold text-slate-900">{post.title}</h4>
                <p className="text-xs uppercase tracking-wide text-slate-500">{post.createdAt}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}