import { parts } from "@/data/slides";
import clsx from "clsx";

type TimelineNavigatorProps = {
  activePart: string | null;
  onSelectPart: (partId: string | null) => void;
};

export function TimelineNavigator({
  activePart,
  onSelectPart
}: TimelineNavigatorProps) {
  return (
    <nav className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/30 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Parcours pédagogique
          </p>
          <h1 className="mt-1 text-xl font-semibold text-white">
            Architecture VLAN & Commutation
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onSelectPart(null)}
          className={clsx(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            activePart === null
              ? "bg-emerald-500/20 text-emerald-200"
              : "text-slate-300 hover:text-white"
          )}
        >
          Voir tout le cours
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {parts.map((part) => {
          const isActive = part.id === activePart;
          return (
            <button
              type="button"
              key={part.id}
              onClick={() => onSelectPart(isActive ? null : part.id)}
              className={clsx(
                "group flex h-full flex-col rounded-2xl border p-4 text-left transition",
                isActive
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                  : "border-slate-800/70 bg-slate-950/50 text-slate-200 hover:border-slate-700 hover:bg-slate-900"
              )}
            >
              <span className="text-xs uppercase tracking-widest text-slate-400 group-hover:text-slate-200">
                Partie {parts.indexOf(part) + 1}
              </span>
              <span className="mt-2 text-base font-semibold">{part.title}</span>
              <span className="mt-3 inline-flex w-min whitespace-nowrap rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300">
                {part.duration} min
              </span>
              <p className="mt-3 text-xs leading-relaxed text-slate-400 group-hover:text-slate-300">
                {part.summary}
              </p>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
