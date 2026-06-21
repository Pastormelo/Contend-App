"use client";

import { useEffect, useState } from "react";

export type NavSection = { id: string; label: string };

/**
 * A sticky in-page section bar: tap a label to jump to that section, and the
 * current section highlights as you scroll. Sits just below the site header.
 */
export function SectionNav({
  sections,
  offset = "top-[6.5rem]",
}: {
  sections: NavSection[];
  offset?: string;
}) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div
      className={`sticky ${offset} z-30 border-y border-line-soft bg-background/90 backdrop-blur`}
    >
      <nav
        aria-label="On this page"
        className="mx-auto flex max-w-4xl gap-6 overflow-x-auto px-6 py-2.5 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={
              "shrink-0 whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition-colors " +
              (active === s.id
                ? "text-accent"
                : "text-muted-fg hover:text-foreground")
            }
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
