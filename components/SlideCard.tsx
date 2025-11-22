import type { Slide } from "@/data/slides";

type SlideCardProps = {
  slide: Slide;
  showVisual: boolean;
  showSpeech: boolean;
};

export function SlideCard({ slide, showVisual, showSpeech }: SlideCardProps) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/30 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {slide.id.toUpperCase()}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {slide.title}
          </h2>
        </div>
        <span className="inline-flex h-9 items-center justify-center rounded-full border border-emerald-500/40 px-4 text-sm font-medium text-emerald-300">
          ≈ {slide.duration} min
        </span>
      </div>

      {slide.emphasis && (
        <p className="mt-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-sm text-indigo-100">
          {slide.emphasis}
        </p>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {showVisual && (
          <section className="rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900 to-slate-950 p-5">
            <header className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-300">
                🖥️
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Ce qui est affiché
              </h3>
            </header>
            <ul className="space-y-3 text-sm leading-relaxed text-slate-200">
              {slide.visual.map((item) => (
                <li key={item} className="rounded-xl bg-slate-800/60 p-3">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {showSpeech && (
          <section className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5">
            <header className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-sm font-semibold text-sky-300">
                🗣️
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Ce que tu dis
              </h3>
            </header>
            <p className="text-sm leading-relaxed text-slate-200">
              {slide.speech}
            </p>
          </section>
        )}
      </div>
    </article>
  );
}
