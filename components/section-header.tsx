import { Badge } from "./ui/badge";
import { Sparkles } from "lucide-react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  aiTagged = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  aiTagged?: boolean;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <Badge variant="brand" className="mb-3">
          {aiTagged && <Sparkles size={10} />}
          {eyebrow}
        </Badge>
      )}
      <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-fg">{title}</h2>
      {description && (
        <p className="mt-2 text-sm text-fg/60 max-w-2xl">{description}</p>
      )}
    </div>
  );
}
