import { cn } from "@/lib/utils";
import { LevelInsignia } from "@/components/progress/level-insignia";

export type LadderLevel = {
  number: number;
  title: string;
  equipped: string;
  state: "done" | "active" | "locked";
};

export function LevelLadder({
  levels,
  progressLabel,
}: {
  levels: LadderLevel[];
  progressLabel?: string;
}) {
  return (
    <ol className="relative flex flex-col">
      {levels.map((level, i) => (
        <li key={level.number} className="relative flex gap-4 pb-8 last:pb-0">
          {i < levels.length - 1 && (
            <span
              aria-hidden
              className="absolute left-[17px] top-10 h-[calc(100%-2.5rem)] w-px bg-line-soft"
            />
          )}
          <LevelInsignia
            level={level.number}
            earned={level.state === "active"}
            done={level.state === "done"}
          />
          <div className={cn(level.state === "locked" && "opacity-55")}>
            <p className="font-display text-base font-semibold leading-9">
              {level.title}
              {level.state === "locked" && (
                <span className="ml-2 align-middle text-xs font-sans font-medium uppercase tracking-wide text-muted-fg">
                  Gate coming
                </span>
              )}
            </p>
            <p className="text-sm leading-relaxed text-muted-fg">
              {level.equipped}
            </p>
            {level.state === "active" && progressLabel && (
              <p className="mt-1 text-xs font-medium text-accent">
                {progressLabel}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
