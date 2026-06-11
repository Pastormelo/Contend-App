import { Badge } from "@/components/ui/badge";

export function ScenarioCard({
  name,
  difficulty,
  scenario,
}: {
  name: string;
  difficulty: string;
  scenario: string;
}) {
  return (
    <div className="rounded-card border border-line-soft bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-semibold">{name}</p>
        <Badge variant="accent" className="capitalize">
          {difficulty}
        </Badge>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-fg">{scenario}</p>
    </div>
  );
}
