/* eslint-disable react/jsx-key */
"use client";

import { SlideCard } from "@/components/SlideCard";
import { TimelineNavigator } from "@/components/TimelineNavigator";
import { parts, slides } from "@/data/slides";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const [partFilter, setPartFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showVisual, setShowVisual] = useState(true);
  const [showSpeech, setShowSpeech] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredSlides = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return slides.filter((slide) => {
      const matchesPart = partFilter ? slide.partId === partFilter : true;
      if (!term) {
        return matchesPart;
      }
      const haystack = [
        slide.title,
        slide.speech,
        slide.visual.join(" ")
      ].join(" ");
      return matchesPart && haystack.toLowerCase().includes(term);
    });
  }, [partFilter, searchTerm]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [partFilter, searchTerm]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setCurrentIndex((prev) =>
          prev >= filteredSlides.length - 1 ? prev : prev + 1
        );
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setCurrentIndex((prev) => (prev <= 0 ? 0 : prev - 1));
      }
      if (event.key === "v" || event.key === "V") {
        setShowVisual((prev) => !prev);
      }
      if (event.key === "s" || event.key === "S") {
        setShowSpeech((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [filteredSlides.length]);

  const activeSlide = filteredSlides[currentIndex] ?? null;
  const progress =
    filteredSlides.length > 0
      ? Math.round(((currentIndex + 1) / filteredSlides.length) * 100)
      : 0;

  const totalDuration = slides.reduce((acc, slide) => acc + slide.duration, 0);

  return (
    <div className="gradient-bg min-h-screen pb-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pt-10 md:px-10 lg:px-16">
        <TimelineNavigator
          activePart={partFilter}
          onSelectPart={setPartFilter}
        />

        <section className="grid gap-6 rounded-3xl border border-slate-800/70 bg-slate-950/60 p-6 shadow-inner shadow-black/40 backdrop-blur md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                  <span className="text-slate-400">🔍</span>
                  <input
                    aria-label="Rechercher"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Rechercher un mot-clé, un service ou une notion…"
                    className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <ToggleButton
                  label="Visuels"
                  active={showVisual}
                  onClick={() => setShowVisual((prev) => !prev)}
                />
                <ToggleButton
                  label="Paroles"
                  active={showSpeech}
                  onClick={() => setShowSpeech((prev) => !prev)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
                <span>
                  Progression {currentIndex + 1}/{filteredSlides.length || 0}
                </span>
                <span>Total ≈ {totalDuration} min</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {filteredSlides.length === 0 ? (
              <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 text-center text-slate-300">
                Aucun résultat. Ajustez la recherche ou réinitialisez les
                filtres.
              </div>
            ) : (
              activeSlide && (
              <SlideCard
                key={activeSlide.id}
                slide={activeSlide}
                showVisual={showVisual}
                showSpeech={showSpeech}
              />
              )
            )}

            {filteredSlides.length > 0 && (
              <div className="flex items-center justify-between gap-4">
                <NavigationButton
                  direction="prev"
                  disabled={currentIndex === 0}
                  onClick={() =>
                    setCurrentIndex((prev) => (prev <= 0 ? 0 : prev - 1))
                  }
                />
                <div className="text-xs text-slate-500">
                  Astuce: touches ← → pour naviguer, V pour visuels, S pour
                  script.
                </div>
                <NavigationButton
                  direction="next"
                  disabled={currentIndex >= filteredSlides.length - 1}
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev >= filteredSlides.length - 1 ? prev : prev + 1
                    )
                  }
                />
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-300">
              Toutes les diapositives
            </h2>
            <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto pr-1">
              {filteredSlides.map((slide, index) => {
                const isActive = index === currentIndex;
                const partTitle =
                  parts.find((part) => part.id === slide.partId)?.title ?? "";
                return (
                  <button
                    type="button"
                    key={slide.id}
                    onClick={() => setCurrentIndex(index)}
                    className={clsx(
                      "w-full rounded-xl border px-4 py-3 text-left text-sm transition",
                      isActive
                        ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-100"
                        : "border-slate-800/60 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    )}
                  >
                    <span className="text-[11px] uppercase tracking-[0.4em] text-slate-500">
                      {partTitle}
                    </span>
                    <div className="mt-1 font-semibold text-slate-200">
                      {slide.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      ≈ {slide.duration} min
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

type ToggleButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function ToggleButton({ label, active, onClick }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
        active
          ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-100"
          : "border-slate-800/70 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:text-white"
      )}
    >
      <span>{label}</span>
      <span
        className={clsx(
          "h-2.5 w-2.5 rounded-full",
          active ? "bg-emerald-400" : "bg-slate-600"
        )}
      />
    </button>
  );
}

type NavigationButtonProps = {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
};

function NavigationButton({
  direction,
  disabled,
  onClick
}: NavigationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition",
        disabled
          ? "cursor-not-allowed border-slate-800/80 text-slate-600"
          : "border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-500 hover:text-white"
      )}
    >
      {direction === "prev" ? "← Précédent" : "Suivant →"}
    </button>
  );
}
