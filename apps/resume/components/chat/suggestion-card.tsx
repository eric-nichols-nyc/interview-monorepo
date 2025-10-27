import { Card } from "@repo/design-system/components/ui/card";
import { cn } from "@repo/design-system/lib/utils";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

type Suggestion = {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
};

type SuggestionCardProps = {
  suggestion: Suggestion;
};

const priorityConfig = {
  high: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50",
    iconClassName: "text-red-600",
    badgeClassName: "bg-red-100 text-red-700",
  },
  medium: {
    icon: Info,
    className: "border-yellow-200 bg-yellow-50",
    iconClassName: "text-yellow-600",
    badgeClassName: "bg-yellow-100 text-yellow-700",
  },
  low: {
    icon: CheckCircle,
    className: "border-blue-200 bg-blue-50",
    iconClassName: "text-blue-600",
    badgeClassName: "bg-blue-100 text-blue-700",
  },
};

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const config = priorityConfig[suggestion.priority];
  const Icon = config.icon;

  return (
    <Card className={cn("p-4", config.className)}>
      <div className="flex gap-3">
        <Icon className={cn("mt-0.5 size-5 shrink-0", config.iconClassName)} />
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm">{suggestion.title}</h4>
            <div className="flex shrink-0 gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-medium text-xs capitalize",
                  config.badgeClassName
                )}
              >
                {suggestion.priority}
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700 text-xs">
                {suggestion.category}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            {suggestion.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
